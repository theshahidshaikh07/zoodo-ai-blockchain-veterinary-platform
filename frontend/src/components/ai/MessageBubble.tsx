'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Edit2, ChevronLeft, ChevronRight, MapPin, CornerUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    isNew?: boolean; // Trigger typing effect
    places_data?: any[];
    versions?: string[];
    currentVersionIndex?: number;
}

interface MessageBubbleProps {
    message: Message;
    onEdit?: (messageId: string, content: string) => void;
    onTypingComplete?: (id: string) => void;
    onVersionChange?: (messageId: string, versionIndex: number) => void;
}

export function MessageBubble({ message, onEdit, onTypingComplete, onVersionChange }: MessageBubbleProps) {
    const [displayedContent, setDisplayedContent] = useState(message.type === 'ai' && message.isNew ? '' : message.content);
    const [isCopied, setIsCopied] = useState(false);
    const [isTyping, setIsTyping] = useState(message.type === 'ai' && message.isNew);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(message.content);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Typing Effect State Ref
    const typingIndex = useRef(0);

    // Typing Effect
    useEffect(() => {
        if (message.type === 'user' || !message.isNew) {
            setDisplayedContent(message.content);
            return;
        }

        // Only start if we haven't finished typing (prevents restart glitch)
        if (typingIndex.current >= message.content.length) return;

        setIsTyping(true);
        const speed = 10; // ms per char (faster is smoother)

        const timer = setInterval(() => {
            if (typingIndex.current < message.content.length) {
                // Resume from where we left off (solves the scroll glitch)
                setDisplayedContent(message.content.substring(0, typingIndex.current + 1));
                typingIndex.current++;
            } else {
                clearInterval(timer);
                setIsTyping(false);
                if (onTypingComplete) onTypingComplete(message.id);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [message.content, message.isNew, message.type, message.id, onTypingComplete]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy keys', err);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedContent(message.content);
    };

    const handleEditCancel = () => {
        setIsEditing(false);
        setEditedContent(message.content);
    };

    const handleEditSubmit = () => {
        if (editedContent.trim() && onEdit) {
            onEdit(message.id, editedContent.trim());
            setIsEditing(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleEditSubmit();
        } else if (e.key === 'Escape') {
            handleEditCancel();
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    }, [editedContent, isEditing]);

    return (
        <div className={cn(
            "flex w-full mb-8",
            message.type === 'user' ? 'justify-end' : 'justify-start'
        )}>
            <div className={cn(
                "relative group",
                message.type === 'user'
                    ? isEditing
                        ? 'w-full max-w-[88%] md:max-w-[78%]'
                        : 'max-w-[78%] md:max-w-[65%]'
                    : 'w-full'
            )}>
                {/* Message Content */}
                <div className={cn(
                    message.type === 'user'
                        ? isEditing
                            ? 'bg-primary/10 dark:bg-primary/20 text-foreground rounded-2xl rounded-tr-sm p-3'
                            : 'inline-block px-5 py-3.5 rounded-2xl rounded-tr-sm text-[15px] leading-relaxed bg-primary/10 dark:bg-primary/20 text-foreground shadow-sm'
                        : 'w-full py-1 text-[15px] leading-relaxed text-foreground'
                )}>
                    {message.type === 'user' ? (
                        isEditing ? (
                            <div className="space-y-2.5">
                                <textarea
                                    ref={textareaRef}
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="w-full bg-primary/10 dark:bg-primary/20 text-foreground placeholder:text-foreground/40 border-0 rounded-lg px-3 py-2.5 pr-2 focus:outline-none focus:ring-0 resize-none overflow-y-auto transition-all duration-200 text-[15px] leading-relaxed"
                                    placeholder="Edit your message..."
                                    autoFocus
                                    style={{
                                        minHeight: '52px',
                                        maxHeight: '200px'
                                    }}
                                />
                                <div className="flex items-center gap-2 justify-end">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleEditCancel}
                                        className="h-8 px-3.5 text-[13px] font-medium text-foreground/60 hover:text-foreground hover:bg-black/5 rounded-md transition-all"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleEditSubmit}
                                        className="h-8 px-4 text-[13px] font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-md shadow-sm transition-all"
                                    >
                                        Send
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <p className="whitespace-pre-wrap">{message.content}</p>
                        )
                    ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none w-full">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    p: ({ node, children, ...props }: any) => {
                                        // Simple heuristic to check if paragraph text starts with an emoji
                                        let textContent = '';
                                        const extractText = (child: any) => {
                                            if (typeof child === 'string') textContent += child;
                                            else if (child?.props?.children) {
                                                if (Array.isArray(child.props.children)) child.props.children.forEach(extractText);
                                                else extractText(child.props.children);
                                            }
                                        };
                                        if (Array.isArray(children)) children.forEach(extractText);
                                        else extractText(children);

                                        // Check if it starts with a non-ASCII character (crude but effective emoji check)
                                        const startsWithEmoji = textContent.trim().length > 0 && textContent.trim().charCodeAt(0) > 255;

                                        return (
                                            <p
                                                className={cn("mb-4 last:mb-0 leading-7 text-foreground/90", startsWithEmoji && "pl-7")}
                                                style={startsWithEmoji ? { textIndent: '-1.75rem' } : {}}
                                                {...props}
                                            >
                                                {children}
                                            </p>
                                        );
                                    },
                                    ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-5 mb-4 space-y-2" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-5 mb-4 space-y-2" {...props} />,
                                    li: ({ node, ...props }) => <li className="leading-7 text-foreground/90 pl-1" {...props} />,
                                    strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
                                    em: ({ node, ...props }) => <em className="italic text-foreground/70" {...props} />,
                                    h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-3 mt-6 first:mt-0 tracking-tight text-foreground" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-3 mt-6 first:mt-0 tracking-tight text-foreground" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="text-base font-semibold mb-2 mt-5 first:mt-0 text-foreground" {...props} />,
                                    hr: ({ node, ...props }) => <hr className="my-5 border-zinc-200 dark:border-zinc-700" {...props} />,
                                    blockquote: ({ node, ...props }) => (
                                        <blockquote
                                            className="border-l-4 border-primary/60 bg-primary/5 dark:bg-primary/10 pl-4 pr-3 py-3 my-4 rounded-r-lg italic text-foreground/80"
                                            {...props}
                                        />
                                    ),
                                    code: ({ node, className, children, ...props }: any) => {
                                        const isInline = !className;
                                        return isInline
                                            ? <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[0.84em] font-mono text-primary" {...props}>{children}</code>
                                            : <pre className="bg-zinc-900 text-zinc-100 rounded-xl p-4 overflow-x-auto text-sm my-4 font-mono"><code {...props}>{children}</code></pre>;
                                    },
                                    table: ({ node, ...props }: any) => {
                                        // A trick to copy just the table text context
                                        const childrenArr = Array.isArray(props.children) ? props.children : [props.children];
                                        return (
                                            <div className="my-5 w-full relative group/table">
                                                <div className="absolute right-2 top-2 z-20 opacity-0 group-hover/table:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="secondary"
                                                        size="icon"
                                                        className="h-7 w-7 bg-white/90 dark:bg-zinc-800/90 shadow-sm border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-muted-foreground"
                                                        onClick={(e) => {
                                                            const tableNode = e.currentTarget.parentElement?.nextElementSibling;
                                                            if (tableNode) {
                                                                navigator.clipboard.writeText(tableNode.textContent || '');
                                                            }
                                                        }}
                                                    >
                                                        <Copy className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                                <div className="w-full overflow-x-auto overflow-y-auto max-h-[420px] rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
                                                    <table
                                                        className="w-full min-w-[520px] border-collapse text-sm"
                                                        {...props}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    },
                                    thead: ({ node, ...props }) => (
                                        <thead
                                            className="bg-primary/10 dark:bg-primary/20 sticky top-0 z-10"
                                            {...props}
                                        />
                                    ),
                                    tbody: ({ node, ...props }) => (
                                        <tbody
                                            className="divide-y divide-zinc-200 dark:divide-zinc-700"
                                            {...props}
                                        />
                                    ),
                                    tr: ({ node, ...props }) => (
                                        <tr
                                            className="even:bg-zinc-50/50 dark:even:bg-zinc-800/30"
                                            {...props}
                                        />
                                    ),
                                    th: ({ node, ...props }) => (
                                        <th
                                            className="text-left px-4 py-3 font-semibold text-foreground border-b-2 border-zinc-200 dark:border-zinc-700 whitespace-nowrap"
                                            {...props}
                                        />
                                    ),
                                    td: ({ node, ...props }) => (
                                        <td
                                            className="px-4 py-3 text-foreground/85 border-b border-zinc-100 dark:border-zinc-800 align-top first:whitespace-nowrap sm:first:whitespace-normal sm:first:min-w-[140px]"
                                            {...props}
                                        />
                                    ),
                                }}
                            >
                                {displayedContent}
                            </ReactMarkdown>

                        </div>
                    )}

                    {/* Places Data Display */}
                    {message.places_data && message.places_data.length > 0 && (
                        <div className="mt-5 space-y-3">
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                                <span>Nearby Locations</span>
                            </div>
                            <div className="flex gap-3 overflow-x-auto pb-4 snap-x custom-scrollbar">
                                {message.places_data.map((place: any, index: number) => (
                                    <div key={index} className="min-w-[280px] max-w-[280px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 shadow-sm snap-center flex flex-col h-full hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-foreground line-clamp-1 text-sm" title={place.name}>{place.name}</h3>
                                            {place.rating && place.rating !== "N/A" && (
                                                <div className="flex items-center text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-1.5 py-0.5 rounded ml-2 flex-shrink-0">
                                                    ★ {place.rating} ({place.user_ratings_total})
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{place.address}</p>

                                        <div className="mt-auto pt-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
                                            <div className="flex items-center gap-2">
                                                {place.open_now !== null && (
                                                    <span className={cn("text-[10px] uppercase font-bold px-1.5 py-0.5 rounded", place.open_now ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400")}>
                                                        {place.open_now ? "Open" : "Closed"}
                                                    </span>
                                                )}
                                                {place.distance && (
                                                    <span className="text-xs text-muted-foreground">{place.distance}</span>
                                                )}
                                            </div>

                                            <button
                                                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.address)}`, '_blank')}
                                            >
                                                <CornerUpRight className="h-3.5 w-3.5" />
                                                Directions
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* OSM Disclaimer + Support Note */}
                            <div className="mt-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-start gap-2.5">
                                <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-zinc-400 dark:bg-zinc-500 text-white text-[10px] font-black flex items-center justify-center leading-none">!</span>
                                <div className="text-[11.5px] text-foreground/70 leading-relaxed">
                                    <span><strong className="text-foreground/90 font-semibold">Limited coverage:</strong> Results are sourced from <strong className="text-foreground/80 font-medium">OpenStreetMap</strong>, which may not have complete veterinary data in your region.</span>
                                    <br />
                                    <a
                                        href="https://rzp.io/rzp/zoodo-support"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary font-semibold hover:underline"
                                    >
                                        Support Zoodo
                                    </a>
                                    {" "}to help us upgrade to Google Maps for full nationwide coverage.
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Version Navigation - Show when message has multiple versions */}
                {message.type === 'user' && message.versions && message.versions.length > 1 && !isEditing && (
                    <div className="flex items-center justify-center gap-1.5 mt-3 text-xs">
                        <button
                            onClick={() => {
                                const currentIdx = message.currentVersionIndex ?? message.versions!.length - 1;
                                if (currentIdx > 0 && onVersionChange) {
                                    onVersionChange(message.id, currentIdx - 1);
                                }
                            }}
                            disabled={(message.currentVersionIndex ?? message.versions.length - 1) === 0}
                            className="p-0.5 hover:bg-white/20 dark:hover:bg-white/20 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all text-black/70 dark:text-white"
                            aria-label="Previous version"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="font-medium px-1 text-[11px] text-black/70 dark:text-white">
                            {(message.currentVersionIndex ?? message.versions.length - 1) + 1}/{message.versions.length}
                        </span>
                        <button
                            onClick={() => {
                                const currentIdx = message.currentVersionIndex ?? message.versions!.length - 1;
                                if (currentIdx < message.versions!.length - 1 && onVersionChange) {
                                    onVersionChange(message.id, currentIdx + 1);
                                }
                            }}
                            disabled={(message.currentVersionIndex ?? message.versions.length - 1) === message.versions.length - 1}
                            className="p-0.5 hover:bg-white/20 dark:hover:bg-white/20 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all text-black/70 dark:text-white"
                            aria-label="Next version"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* Action Buttons (Copy / Edit) - Visible on Hover */}
                <div className={cn(
                    "absolute -bottom-8 flex items-center space-x-2",
                    message.type === 'user'
                        ? "right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        : "left-0"
                )}>
                    {/* Copy Button (For both AI and User) */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                onClick={handleCopy}
                            >
                                {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            <p>{isCopied ? 'Copied!' : 'Copy text'}</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* Edit Button (Only for User) */}
                    {message.type === 'user' && onEdit && !isEditing && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                    onClick={handleEditClick}
                                >
                                    <Edit2 className="h-3 w-3" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>Edit prompt</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
            </div>
        </div>
    );
}
