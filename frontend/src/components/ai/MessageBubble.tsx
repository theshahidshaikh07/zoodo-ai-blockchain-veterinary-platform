'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Edit2, User, Bot, ChevronLeft, ChevronRight } from 'lucide-react';
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

    // Typing Effect
    useEffect(() => {
        if (message.type === 'user' || !message.isNew) {
            setDisplayedContent(message.content);
            return;
        }

        setIsTyping(true);
        let i = 0;
        const speed = 10; // ms per char (faster is smoother)

        const timer = setInterval(() => {
            if (i < message.content.length) {
                setDisplayedContent(message.content.substring(0, i + 1));
                i++;
            } else {
                clearInterval(timer);
                setIsTyping(false);
                if (onTypingComplete) onTypingComplete(message.id);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [message.content, message.isNew, message.type, onTypingComplete, message.id]);

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
            "flex w-full mb-6",
            message.type === 'user' ? 'justify-end' : 'justify-start'
        )}>
            <div className={cn(
                "relative group",
                message.type === 'user'
                    ? isEditing
                        ? 'w-full max-w-[98%] md:max-w-[95%] items-end'
                        : 'max-w-[85%] md:max-w-[75%] items-end'
                    : 'max-w-[85%] md:max-w-[75%] items-start'
            )}>
                {/* Message Content */}
                <div className={cn(
                    message.type === 'user'
                        ? isEditing
                            ? 'bg-primary text-primary-foreground rounded-3xl rounded-tr-sm shadow-md p-3'
                            : 'px-6 py-4 rounded-3xl shadow-sm text-base leading-relaxed bg-primary text-primary-foreground rounded-tr-sm shadow-md background-blur-none'
                        : 'px-6 py-4 rounded-3xl text-base leading-relaxed bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 rounded-tl-sm'
                )}>
                    {message.type === 'user' ? (
                        isEditing ? (
                            <div className="space-y-2.5">
                                <textarea
                                    ref={textareaRef}
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="w-full bg-black/20 text-primary-foreground placeholder:text-primary-foreground/50 border-0 rounded-lg px-3 py-2.5 pr-2 focus:outline-none focus:ring-0 resize-none overflow-y-auto transition-all duration-200 text-[15px] leading-relaxed"
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
                                        className="h-8 px-3.5 text-[13px] font-medium text-primary-foreground/80 hover:text-primary-foreground hover:bg-black/10 rounded-md transition-all"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleEditSubmit}
                                        className="h-8 px-4 text-[13px] font-semibold bg-white hover:bg-white/90 text-black rounded-md shadow-sm transition-all"
                                    >
                                        Send
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <p className="whitespace-pre-wrap">{message.content}</p>
                        )
                    ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-3" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-3" {...props} />,
                                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                    strong: ({ node, ...props }) => <strong className="font-semibold text-primary" {...props} />,
                                    h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2" {...props} />,
                                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-primary pl-4 italic my-2" {...props} />
                                }}
                            >
                                {displayedContent}
                            </ReactMarkdown>

                        </div>
                    )}

                    {/* Places Data Display */}
                    {message.places_data && message.places_data.length > 0 && (
                        <div className="mt-4 space-y-3">
                            <p className="text-sm font-semibold text-muted-foreground mb-2">Nearby Locations:</p>
                            <div className="flex gap-3 overflow-x-auto pb-4 snap-x custom-scrollbar">
                                {message.places_data.map((place: any, index: number) => (
                                    <div key={index} className="min-w-[280px] max-w-[280px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 shadow-sm snap-center flex flex-col h-full hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-foreground line-clamp-1" title={place.name}>{place.name}</h3>
                                            {place.rating && place.rating !== "N/A" && (
                                                <div className="flex items-center text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-1.5 py-0.5 rounded">
                                                    ★ {place.rating} ({place.user_ratings_total})
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2 h-8">{place.address}</p>

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

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-xs hover:bg-primary/10 hover:text-primary p-0 px-2"
                                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.address)}`, '_blank')}
                                            >
                                                Directions
                                            </Button>
                                        </div>
                                    </div>
                                ))}
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
