// Force Refresh
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Plus,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Video,
  MapPin,
  AlertTriangle,
  X,
  Mic,
  MicOff,
  Stethoscope,
  Utensils,
  Activity,
  Brain,
  ArrowRight,
  Search,
  Cat,
  GraduationCap,
  Timer,
  Dog
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import Header from '@/components/Header';
import { apiService, AIChatRequest } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageBubble } from '@/components/ai/MessageBubble';
import ConsultationPopup from '@/components/ConsultationPopup';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isNew?: boolean; // For typing effect
  versions?: string[]; // All versions of this message
  currentVersionIndex?: number; // Current version being displayed
  aiResponseVersions?: Map<number, Message>; // Map of version index to AI response
  historyVersions?: Map<number, Message[]>; // Map of version index to the entire subsequent conversation history
}

export default function AIAssistantPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId] = useState(() => 'frontend_session_' + Date.now()); // Generate session ID once
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isPlaceholderTyping, setIsPlaceholderTyping] = useState(false);
  const [isChatScrolled, setIsChatScrolled] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false); // New state for scroll button
  const [isConsultationPopupOpen, setIsConsultationPopupOpen] = useState(false);
  const [isHeroScrolled, setIsHeroScrolled] = useState(false);
  const [debugLog, setDebugLog] = useState(""); // Debug state
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const placeholderMessages = [
    "Why is my dog scratching so much?",
    "Recommend a good vet nearby.",
    "What's the best diet for a Persian cat?",
    "Find pet training academies near me."
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        id: '1',
        type: 'ai',
        content: "Hello! I'm Dr. Salus AI. I'm here to help with your pet's health. How can I assist you today?",
        timestamp: new Date(),
      }
    ]);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [messages]);

  // Start placeholder animation when component mounts and restart when conditions change
  useEffect(() => {
    if (inputMessage.trim() || isTyping || messages.length > 1) {
      setIsPlaceholderTyping(false);
      return;
    }

    // Start the animation
    setIsPlaceholderTyping(true);
  }, [inputMessage, isTyping, messages.length]);

  // Track hero section scroll for header background
  useEffect(() => {
    const heroContainer = heroContainerRef.current;
    if (!heroContainer || messages.length > 1) return;

    const handleHeroScroll = () => {
      setIsHeroScrolled(heroContainer.scrollTop > 20);
    };

    heroContainer.addEventListener('scroll', handleHeroScroll);
    return () => heroContainer.removeEventListener('scroll', handleHeroScroll);
  }, [messages.length]);


  // Handle chat container scroll for header styling
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer || messages.length <= 1) return;

    const handleChatScroll = () => {
      if (!chatContainer) return;

      // Header styling logic
      const scrolled = chatContainer.scrollTop > 20;
      setIsChatScrolled(scrolled);

      // Scroll to bottom button logic
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

      // Update debug info
      setDebugLog(`ST:${Math.round(scrollTop)} SH:${scrollHeight} CH:${clientHeight} NB:${isNearBottom}`);

      setShowScrollButton(!isNearBottom);
    };

    // Set initial state
    chatContainer.addEventListener('scroll', handleChatScroll);
    handleChatScroll(); // Call immediately to check initial state
    return () => chatContainer.removeEventListener('scroll', handleChatScroll);
  }, [messages.length]);

  // Auto-resize textarea logic
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (contentOverride?: string) => {
    const finalContent = typeof contentOverride === 'string' ? contentOverride : inputMessage;
    if (!finalContent.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: finalContent,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = finalContent;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call the real AI service
      const request: AIChatRequest = {
        message: currentMessage,
        session_id: sessionId // Use consistent session ID for conversation context
      };

      const response = await apiService.chatWithAI(request);
      console.log('Frontend received response:', response); // Debug log

      if (response.success && response.data) {
        console.log('Response data:', response.data); // Debug log
        console.log('Response field:', response.data.response); // Debug log

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: response.data.response,
          timestamp: new Date(),
          isNew: true // Trigger typing effect
        };
        console.log('Creating AI message:', aiResponse); // Debug log
        // Check for emergency keywords in the response
        if (response.data.response.includes("EMERGENCY") || response.data.response.includes("emergency")) {
          setIsEmergency(true);
        }

        setMessages(prev => [...prev, aiResponse]);
      } else {
        // Fallback to error message
        const errorResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later or contact support.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorResponse]);
      }
    } catch (error) {
      console.error('Error calling AI service:', error);
      // Fallback to error message
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later or contact support.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateAIResponse = (): string => {
    const responses = [
      "Based on the symptoms you've described, I recommend monitoring your pet closely and scheduling a veterinary consultation. The symptoms could indicate several conditions, and a professional examination would be best for accurate diagnosis.",
      "I understand your concern. Let me analyze the information you've provided. For proper diagnosis, I'd recommend consulting with a veterinarian who can perform a physical examination and any necessary tests.",
      "Thank you for sharing those details. While I can provide general guidance, it's important to consult with a qualified veterinarian for proper diagnosis and treatment. Would you like me to help you find a vet in your area?",
      "I've analyzed the symptoms you mentioned. Here are some general recommendations, but please consult with a veterinarian for proper medical advice: [detailed recommendations based on symptoms]"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleEditMessage = async (messageId: string, editedContent: string) => {
    // Find the message being edited by ID
    const editedMessageIndex = messages.findIndex(msg => msg.id === messageId);

    if (editedMessageIndex === -1) return;

    const originalMessage = messages[editedMessageIndex];
    const currentAIResponse = messages[editedMessageIndex + 1]; // Get the current AI response

    // Initialize or update versions array
    const versions = originalMessage.versions || [originalMessage.content];
    const currentVersionIndex = originalMessage.currentVersionIndex ?? 0;

    // Initialize AI response versions map and history versions map
    const aiResponseVersions = originalMessage.aiResponseVersions || new Map<number, Message>();
    const historyVersions = originalMessage.historyVersions || new Map<number, Message[]>();

    // Save current AI response for the current version (if it exists and is an AI message)
    if (currentAIResponse && currentAIResponse.type === 'ai') {
      aiResponseVersions.set(currentVersionIndex, currentAIResponse);
    }

    // Save the ENTIRE subsequent conversation history for the current version
    const subsequentMessages = messages.slice(editedMessageIndex + 2); // +2 to exclude user message and its direct AI response
    if (subsequentMessages.length > 0) {
      historyVersions.set(currentVersionIndex, subsequentMessages);
    }

    if (!versions.includes(editedContent)) {
      versions.push(editedContent);
    }

    // Update the message content and remove all messages after it
    const updatedMessages = messages.slice(0, editedMessageIndex + 1).map((msg, idx) =>
      idx === editedMessageIndex
        ? {
          ...msg,
          content: editedContent,
          versions,
          currentVersionIndex: versions.length - 1,
          aiResponseVersions,
          historyVersions
        }
        : msg
    );

    setMessages(updatedMessages);
    setIsTyping(true);

    // Regenerate AI response using the same service as initial messages
    try {
      // Prepare history: all messages BEFORE the edited message
      // Exclude the welcome message (index 0) if it's not part of the 'chat' proper, 
      // but usually we include all valid previous context.
      // Assuming index 0 is welcome message AI, index 1 is first User message.
      // We want history up to editedMessageIndex - 1.
      const historyMessages = updatedMessages.slice(1, editedMessageIndex);
      const conversationHistory = historyMessages.map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

      const request: AIChatRequest = {
        message: editedContent,
        session_id: sessionId,
        conversation_history: conversationHistory
      };

      const response = await apiService.chatWithAI(request);

      if (response.success && response.data) {
        const aiResponse: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: response.data.response,
          timestamp: new Date(),
          isNew: true
        };

        // Save this AI response for the new version
        setMessages(prev => {
          const userMsg = prev[editedMessageIndex];
          if (userMsg.aiResponseVersions) {
            userMsg.aiResponseVersions.set(versions.length - 1, aiResponse);
          }
          return [...prev, aiResponse];
        });
      } else {
        const errorResponse: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorResponse]);
      }
    } catch (error) {
      console.error('Error regenerating AI response:', error);
      const errorResponse: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleTypingComplete = (id: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === id ? { ...msg, isNew: false } : msg
    ));
  };


  const handleVersionChange = async (messageId: string, versionIndex: number) => {
    // Find the message being changed
    const messageIndex = messages.findIndex(msg => msg.id === messageId);

    if (messageIndex === -1) return;

    const message = messages[messageIndex];
    if (!message.versions) return;

    // Save the current history for the current version before switching
    const currentSubsequentMessages = messages.slice(messageIndex + 2);
    if (currentSubsequentMessages.length > 0 && message.historyVersions) {
      message.historyVersions.set(message.currentVersionIndex || 0, currentSubsequentMessages);
    }
    // Also ensure the immediate AI response is saved to aiResponseVersions (redundant but safe)
    const currentImmediateAI = messages[messageIndex + 1];
    if (currentImmediateAI && currentImmediateAI.type === 'ai' && message.aiResponseVersions) {
      message.aiResponseVersions.set(message.currentVersionIndex || 0, currentImmediateAI);
    }

    // Check if we have cached data for the target version
    const cachedAIResponse = message.aiResponseVersions?.get(versionIndex);
    const cachedHistory = message.historyVersions?.get(versionIndex);

    // Update the message content
    const newContent = message.versions[versionIndex];
    const baseUpdatedMessages = messages.slice(0, messageIndex + 1).map((msg, idx) =>
      idx === messageIndex
        ? {
          ...msg,
          content: newContent,
          currentVersionIndex: versionIndex
        }
        : msg
    );

    // If we have a cached AI response, use it
    if (cachedAIResponse) {
      let finalMessages = [...baseUpdatedMessages, { ...cachedAIResponse, isNew: false }];

      // If we ALSO have further history, append it
      if (cachedHistory && cachedHistory.length > 0) {
        finalMessages = [...finalMessages, ...cachedHistory];
      }

      setMessages(finalMessages);
      return;
    }

    setMessages(baseUpdatedMessages);


    // Otherwise, generate a new AI response for the new version
    setIsTyping(true);

    try {
      // Prepare history: all messages BEFORE the switched message
      const historyMessages = baseUpdatedMessages.slice(1, messageIndex);
      const conversationHistory = historyMessages.map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

      const request: AIChatRequest = {
        message: newContent,
        session_id: sessionId,
        conversation_history: conversationHistory
      };

      const response = await apiService.chatWithAI(request);

      if (response.success && response.data) {
        const aiResponse: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: response.data.response,
          timestamp: new Date(),
          isNew: true
        };

        // Save this AI response for this version
        setMessages(prev => {
          const userMsg = prev[messageIndex];
          if (userMsg.aiResponseVersions) {
            userMsg.aiResponseVersions.set(versionIndex, aiResponse);
          }
          return [...prev, aiResponse];
        });
      } else {
        const errorResponse: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorResponse]);
      }
    } catch (error) {
      console.error('Error regenerating AI response:', error);
      const errorResponse: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    // If already recording, stop it
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    // Check browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    // Initialize recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false; // Set to true if you want real-time preview, but requires complex handling
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      // Get the last result
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript;

      // Append to current input
      setInputMessage((prev) => {
        const spacer = prev && !prev.endsWith(' ') ? ' ' : '';
        return prev + spacer + transcript;
      });
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error code:', event.error);
      setIsRecording(false);
      if (event.error === 'network') {
        alert("Network error: Please check your internet connection for voice input.");
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    // Save ref and start
    recognitionRef.current = recognition;
    recognition.start();
  };


  // Animated placeholder component
  const AnimatedPlaceholder = () => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
      if (!isPlaceholderTyping) {
        setDisplayText('');
        setCurrentIndex(0);
        setIsDeleting(false);
        return;
      }

      const currentMessage = placeholderMessages[currentPlaceholderIndex];

      // Typing phase
      if (!isDeleting && currentIndex < currentMessage.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentMessage.substring(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, 50);
        return () => clearTimeout(timeout);
      }

      // Pause after completing sentence
      if (!isDeleting && currentIndex === currentMessage.length) {
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 1000); // 1 second pause
        return () => clearTimeout(timeout);
      }

      // Deleting phase
      if (isDeleting && currentIndex > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(currentMessage.substring(0, currentIndex - 1));
          setCurrentIndex(currentIndex - 1);
        }, 30);
        return () => clearTimeout(timeout);
      }

      // Move to next message after deleting completely
      if (isDeleting && currentIndex === 0) {
        setIsDeleting(false);
        setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholderMessages.length);
      }
    }, [currentPlaceholderIndex, isPlaceholderTyping, currentIndex, isDeleting]);

    return (
      <span className="text-muted-foreground">
        <span className="sm:hidden">Ask Dr. Salus AI</span>
        <span className="hidden sm:inline">
          {messages.length > 1 ? "Ask Dr. Salus AI" : `Ask Dr. Salus AI : ${displayText}`}
          {messages.length <= 1 && <span className="animate-pulse">|</span>}
        </span>
      </span>
    );
  };

  if (!mounted) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="fixed inset-0 bg-background flex flex-col overflow-hidden">
      <style jsx global>{`
          html, body {
            height: 100%;
            width: 100%;
            overflow: hidden;
            position: fixed; /* Lock body scroll */
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(156, 163, 175, 0.5);
            border-radius: 20px;
          }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.2);
          }
        `}</style>
      {/* Header - Different for landing vs chat */}
      {messages.length <= 1 ? (
        <Header isScrolled={isHeroScrolled} />
      ) : (
        /* Chat Header */
        /* Chat Header - Static in flex container */
        <header className="shrink-0 z-50 bg-white/50 dark:bg-black/50 backdrop-blur-xl border-b border-white/20 dark:border-white/10 shadow-sm">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between h-20 py-4">
              {/* Left side - Back button + Dr. Salus AI */}
              <div className="flex items-center space-x-4">

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Heart className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="font-semibold text-foreground">Dr. Salus AI</h1>
                    <p className="text-xs text-muted-foreground">AI Powered Veterinary Assistant</p>
                  </div>
                </div>
              </div>

              {/* Right side - New Chat button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="hover:bg-primary/10 hover:text-primary hover:scale-105 transition-all duration-300"
              >
                New Chat
              </Button>
            </div>
          </div>
        </header>
      )}

      {/* Refined Background - "Ghost Light" Parametric Mesh - Unified with landing page */}
      <div className="fixed inset-0 bg-[image:var(--bg-subtle-mesh)] pointer-events-none opacity-90 z-0" />
      <div className="fixed inset-0 bg-[image:var(--bg-dot-pattern)] bg-[length:24px_24px] pointer-events-none opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] z-0" />
      <div className="fixed inset-0 bg-slate-50/40 dark:bg-transparent pointer-events-none z-0" />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0 overflow-hidden">
        {messages.length <= 1 ? (
          /* Hero Section - Only show when not chatting */
          <div ref={heroContainerRef} key="hero-section" className="flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-12 overflow-y-auto custom-scrollbar">


            {/* Banner */}
            <div className="mb-8">
              <Badge variant="outline" className="px-4 py-2 text-sm border-primary/30 text-primary bg-primary/5">
                Introducing Dr. Salus AI
                <ArrowUp className="h-3 w-3 ml-1" />
              </Badge>
            </div>

            {/* Main Headline */}
            <div className="text-center mb-8 max-w-4xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                <span className="block sm:inline">Your Pet's Personal</span>{' '}
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Health Guide
                </span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground">
                Get instant pet health advice, personalized diet plans, and recommendations for the best vets, trainers, hospitals, and clinics nearby.
              </p>
            </div>

            {/* Quick Suggestions */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 px-2 max-w-4xl mx-auto">
              {[
                { icon: <Stethoscope className="w-4 h-4" />, text: "Find a nearby vet clinic" },
                { icon: <Utensils className="w-4 h-4" />, text: "Diet plan for a puppy" },
                { icon: <Cat className="w-4 h-4" />, text: "Why is my cat sneezing?" },
                { icon: <Dog className="w-4 h-4" />, text: "Dog vaccination guide" },
                { icon: <Timer className="w-4 h-4" />, text: "Dog training tips" },
              ].map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full sm:w-auto justify-between sm:justify-center h-auto py-3 px-5 rounded-xl sm:rounded-full bg-white/50 dark:bg-zinc-800/40 border border-black/10 dark:border-white/10 hover:bg-white dark:hover:bg-zinc-800/60 backdrop-blur-md transition-all duration-200 text-sm font-medium text-foreground/90 hover:text-foreground shadow-sm hover:shadow-md hover:border-black/20 dark:hover:border-white/20 active:scale-[0.98] ${index === 3 || index === 4 ? 'hidden sm:flex' : ''}`}
                  onClick={() => handleSendMessage(suggestion.text)}
                >
                  <span className="flex items-center gap-2">
                    <span className="opacity-70 p-1 bg-primary/10 rounded-full text-primary">{suggestion.icon}</span>
                    <span>{suggestion.text}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 opacity-50 ml-2 sm:hidden" />
                </Button>
              ))}
            </div>

            {/* Large AI Chat Input Area - Centered when not chatting */
            }
            <div className="w-full max-w-4xl mx-auto sm:px-4 mt-8">
              <div className="relative">
                <div className="relative bg-white/60 dark:bg-zinc-800/40 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/40 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5 p-2 flex items-end gap-2 transition-all duration-300 hover:bg-white/70 dark:hover:bg-zinc-800/60 focus-within:ring-2 focus-within:ring-primary/20 dark:focus-within:ring-primary/40 sm:max-w-2xl sm:mx-auto">
                  {/* Voice Input Button - Left */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleVoiceInput}
                    className={`rounded-full h-12 w-12 shrink-0 transition-all duration-300 ${isRecording ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 animate-pulse' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}
                    title="Voice Input"
                  >
                    {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>

                  {/* Input Field - Middle */}
                  <div className="flex-1 relative flex items-center min-h-[3rem]">
                    <textarea
                      ref={textareaRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      rows={1}
                      placeholder=""
                      className="w-full bg-transparent text-base focus:outline-none focus:ring-0 text-foreground px-2 resize-none max-h-[200px] self-center leading-relaxed custom-scrollbar"
                    />
                    {!inputMessage && (
                      <div className="absolute inset-0 flex items-center pointer-events-none px-3">
                        <AnimatedPlaceholder />
                      </div>
                    )}
                  </div>

                  {/* Send Button - Right */}
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || isTyping}
                    className="rounded-full h-12 w-12 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105 active:scale-95"
                    size="icon"
                  >
                    <ArrowUp className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </div>


          </div>

        ) : (
          /* Chat Interface - Full screen when chatting */
          <div key="chat-interface" className="flex-1 flex flex-col h-full relative overflow-hidden">

            {/* Chat Messages Area - Flexible scrollable area */
            }
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 pb-8 scroll-smooth custom-scrollbar">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.slice(1).map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onEdit={handleEditMessage}
                    onTypingComplete={handleTypingComplete}
                    onVersionChange={handleVersionChange}
                  />
                ))}

                {isTyping && (
                  <div className="flex justify-start mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 rounded-full px-6 py-4 shadow-sm">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-2 h-2 bg-primary/80 rounded-full animate-bounce" style={{ animationDuration: '1s' }}></div>
                        <div className="w-2 h-2 bg-primary/80 rounded-full animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '1s' }}></div>
                        <div className="w-2 h-2 bg-primary/80 rounded-full animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '1s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>
            {/* Scroll to Bottom Button */}



            {/* Input Area - Flex Item (Not Fixed) */}
            <div className="shrink-0 w-full z-50 bg-transparent pt-4">
              <div className="w-full max-w-4xl mx-auto px-4 pb-4 sm:pb-6 relative">

                {/* Scroll to Bottom Button - Anchored to ride on top of input */}
                {showScrollButton && (
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={scrollToBottom}
                    className="absolute left-1/2 -translate-x-1/2 -top-16 z-[60] rounded-full shadow-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-all animate-in fade-in zoom-in duration-300"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                )}

                {isEmergency && (
                  <div className="mb-4 animate-in slide-in-from-bottom-5 duration-500">
                    <div className="bg-red-500/20 backdrop-blur-2xl border border-red-500/30 rounded-2xl p-4 shadow-xl shadow-red-500/10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                          <AlertTriangle className="h-5 w-5 animate-pulse" />
                          <span className="font-semibold">Emergency Mode Active</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEmergency(false)}
                          className="text-muted-foreground hover:text-foreground h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button
                          className="w-full bg-red-600 hover:bg-red-700 text-white shadow-md group"
                          size="lg"
                          onClick={() => window.open('/services/find-hospitals?search=emergency&type=Emergency%20Hospital', '_blank')}
                        >
                          <MapPin className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                          Find Clinic Nearby
                        </Button>
                        <Button
                          className="w-full bg-background border-2 border-primary text-primary hover:bg-primary/5 shadow-sm group"
                          variant="outline"
                          size="lg"
                          onClick={() => setIsConsultationPopupOpen(true)}
                        >
                          <Video className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                          Connect Vet Online
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Input Box - Sleek Single Row Design */}
                <div className="relative bg-white/90 dark:bg-zinc-800/90 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/40 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5 p-2 flex items-end gap-2 transition-all duration-300 hover:bg-white/95 dark:hover:bg-zinc-800/95">

                  {/* Voice Input Button - Left */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleVoiceInput}
                    className={`rounded-full h-12 w-12 shrink-0 transition-all duration-300 ${isRecording ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 animate-pulse' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}
                    title="Voice Input"
                  >
                    {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>

                  {/* Input Field - Middle */}
                  <div className="flex-1 relative flex items-center min-h-[3rem] py-2">
                    <textarea
                      ref={textareaRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      rows={1}
                      className="w-full bg-transparent text-base focus:outline-none focus:ring-0 text-foreground px-2 resize-none max-h-[200px] self-center leading-relaxed custom-scrollbar"
                      style={{
                        minHeight: '24px'
                      }}
                    />
                    {!inputMessage && (
                      <div className="absolute inset-0 flex items-center pointer-events-none px-2">
                        <AnimatedPlaceholder />
                      </div>
                    )}
                  </div>

                  {/* Send Button - Right */}
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || isTyping}
                    className="rounded-full h-12 w-12 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105 active:scale-95"
                    size="icon"
                  >
                    <ArrowUp className="h-6 w-6" />
                  </Button>
                </div>

                {/* AI Disclaimer */}
                <p className="text-center text-xs text-muted-foreground mt-3 px-4">
                  Dr. Salus AI can make mistakes. Always verify important pet health information with a licensed veterinarian.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Consultation Popup */}
      <ConsultationPopup
        isOpen={isConsultationPopupOpen}
        onClose={() => setIsConsultationPopupOpen(false)}
      />
    </div >
  );
} 