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
  Dog,
  MessageSquare,
  Settings,
  LogOut,
  User,
  PanelLeft,
  HelpCircle,
  Paperclip,
  Globe,
  BookOpen,
  Image as ImageIcon,
  ChevronDown,
  Search as SearchIcon,
  SquarePen,
  LayoutGrid,
  Terminal,
  FolderPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import { apiService, AIChatRequest } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageBubble } from '@/components/ai/MessageBubble';
import { ProcessLoader } from '@/components/ai/ProcessLoader';
import ConsultationPopup from '@/components/ConsultationPopup';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';
import SalusLogo from '@/assets/Salus.png';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isNew?: boolean; // For typing effect
  places_data?: any[];
  versions?: string[]; // All versions of this message
  currentVersionIndex?: number; // Current version being displayed
  aiResponseVersions?: Map<number, Message>; // Map of version index to AI response
  historyVersions?: Map<number, Message[]>; // Map of version index to the entire subsequent conversation history
}

const TopBarLogo = () => {
  const { isMobile, state, openMobile } = useSidebar();

  // Hide top logo when sidebar is expanded on desktop OR when mobile drawer is open
  const isHidden = (isMobile && openMobile) || (!isMobile && state === "expanded");

  return (
    <Link
      href="/ai-assistant"
      className={`flex items-center transition-all duration-300 ${isHidden ? "w-0 opacity-0 overflow-hidden pointer-events-none" : "w-auto opacity-100"}`}
      title="Salus AI"
      onClick={(e) => {
        e.preventDefault();
        window.location.reload();
      }}
    >
      <Image src={SalusLogo} alt="Salus AI" className="h-6 w-auto" priority />
    </Link>
  );
};

const MobileMenuTrigger = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center text-foreground hover:bg-accent/50 rounded-lg focus:outline-none"
      onClick={toggleSidebar}
      aria-label="Open sidebar"
    >
      <div className="relative w-4 h-3.5">
        <span className="absolute top-0 left-0 w-full h-0.5 bg-current rounded-full" />
        <span className="absolute top-[6px] left-0 w-full h-0.5 bg-current rounded-full" />
        <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-current rounded-full" />
      </div>
    </Button>
  );
};

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
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isHeroScrolled, setIsHeroScrolled] = useState(false);
  const [debugLog, setDebugLog] = useState(""); // Debug state
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrolledUp = useRef<boolean>(false); // Track if user manually scrolled up
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const placeholderMessages = [
    "Why is my dog scratching so much?",
    "Recommend a good vet nearby.",
    "What's the best diet for a Persian cat?",
    "Find pet training academies near me."
  ];
  const heroSuggestions = [
    { icon: <Stethoscope className="w-4 h-4" />, text: "Find a nearby vet clinic" },
    { icon: <Utensils className="w-4 h-4" />, text: "Diet plan for a puppy" },
    { icon: <Cat className="w-4 h-4" />, text: "Why is my cat sneezing?" },
    { icon: <Dog className="w-4 h-4" />, text: "Dog vaccination guide" },
    { icon: <Timer className="w-4 h-4" />, text: "Dog training tips" },
  ];
  const safetyNoteText = "Salus AI can make mistakes. Always verify important pet health information with a licensed veterinarian.";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        id: '1',
        type: 'ai',
        content: "Hello! I'm Salus AI. I'm here to help with your pet's health. How can I assist you today?",
        timestamp: new Date(),
      }
    ]);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom ONLY if user hasn't manually scrolled up
    // This prevents the glitch where scrolling during typing jumps back to bottom
    if (!isUserScrolledUp.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
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


  // Handle chat container scroll — track if user scrolled up manually
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer || messages.length <= 1) return;

    const handleChatScroll = () => {
      if (!chatContainer) return;

      // Header styling logic
      const scrolled = chatContainer.scrollTop > 20;
      setIsChatScrolled(scrolled);

      // Detect if user scrolled up manually vs. being at the bottom
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const isNearBottom = distanceFromBottom < 120;

      // If user is near bottom → they haven't scrolled up, allow auto-scroll
      // If user scrolled up → lock auto-scroll so typing doesn't jump them back
      isUserScrolledUp.current = !isNearBottom;

      setDebugLog(`ST:${Math.round(scrollTop)} SH:${scrollHeight} CH:${clientHeight} NB:${isNearBottom}`);
      setShowScrollButton(!isNearBottom);
    };

    chatContainer.addEventListener('scroll', handleChatScroll, { passive: true });
    handleChatScroll();
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
    isUserScrolledUp.current = false; // Reset scroll lock — always scroll to new AI response

    try {
      // Call the real AI service
      const request: AIChatRequest = {
        message: currentMessage,
        session_id: sessionId // Use consistent session ID for conversation context
      };

      const response = await apiService.chatWithAI(request);
      console.log('Frontend received response:', response); // Debug log

      if (response.success && response.data) {
        console.log('Response data:', response.data);

        // Handle Location Request
        if (response.data.action_required === 'request_location') {
          // Ask for location
          if ("geolocation" in navigator) {
            try {
              // Helper to get position with given options
              const getPos = (opts: PositionOptions): Promise<GeolocationPosition> =>
                new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, opts));

              let position: GeolocationPosition;
              try {
                // Attempt 1: High accuracy GPS (best for mobile outdoors)
                position = await getPos({ enableHighAccuracy: true, maximumAge: 0, timeout: 15000 });
              } catch {
                // Attempt 2: Fast network/IP-based fallback (works indoors & on desktop)
                console.warn("High-accuracy GPS failed, falling back to network location...");
                position = await getPos({ enableHighAccuracy: false, maximumAge: 30000, timeout: 8000 });
              }

              const locationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };

              console.log("Got location:", locationData);

              // Re-send original message with location
              const retryRequest: AIChatRequest = {
                message: currentMessage,
                session_id: sessionId,
                location: locationData
              };

              const retryResponse = await apiService.chatWithAI(retryRequest);

              if (retryResponse.success && retryResponse.data) {
                const aiResponse: Message = {
                  id: (Date.now() + 1).toString(),
                  type: 'ai',
                  content: retryResponse.data.response,
                  timestamp: new Date(),
                  isNew: true,
                  places_data: retryResponse.data.places_data
                };
                setMessages(prev => [...prev, aiResponse]);
                if (retryResponse.data.emergency_detected) {
                  setIsEmergency(true);
                }

                return; // Exit early
              }

            } catch (locationError: any) {
              console.error("Location access denied or error:", locationError);
              // Provide specific error message based on error code
              let errMsg = "I couldn't access your location. Please ensure location permission is granted in your browser settings and try again.";
              if (locationError?.code === 1) {
                errMsg = "Location permission was denied. Please allow location access in your browser settings and try again.";
              } else if (locationError?.code === 3) {
                errMsg = "Location request timed out. Please try again or move to an area with better signal.";
              }
              const errorResponse: Message = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                content: errMsg,
                timestamp: new Date(),
                isNew: true
              };
              setMessages(prev => [...prev, errorResponse]);
              return;
            }
          } else {
            const errorResponse: Message = {
              id: (Date.now() + 1).toString(),
              type: 'ai',
              content: "Geolocation is not supported by your browser.",
              timestamp: new Date(),
              isNew: true
            };
            setMessages(prev => [...prev, errorResponse]);
            return;
          }
        }

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: response.data.response,
          timestamp: new Date(),
          isNew: true, // Trigger typing effect
          places_data: response.data.places_data
        };
        console.log('Creating AI message:', aiResponse);

        // Check for emergency flag directly from API
        if (response.data.emergency_detected) {
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
        <span className="sm:hidden">Ask Salus AI</span>
        <span className="hidden sm:inline">
          {messages.length > 1 ? "Ask Salus AI" : `Ask Salus AI : ${displayText}`}
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
    <SidebarProvider defaultOpen={false}>
      <style jsx global>{`
        /* GPT-style chat scrollbar: no top/bottom arrow button gaps */
        .chat-scrollbar::-webkit-scrollbar-button {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        {/* ChatGPT Style Sidebar */}
        <Sidebar variant="sidebar" collapsible="icon" className="border-r border-border/50 bg-secondary/30 backdrop-blur-xl border-t-0 shadow-none">
          <SidebarHeader className="p-3 transition-all duration-300 ease-in-out">
            {/* Top row: Logo + Toggle */}
            <div className="flex w-full items-center h-9 mb-4 group-data-[collapsible=icon]:mb-2 group-data-[collapsible=icon]:justify-center">
              <Link
                href="/ai-assistant"
                className="flex items-center transition-all duration-300 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 overflow-hidden"
                title="Salus AI"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.reload();
                }}
              >
                <Image src={SalusLogo} alt="Salus AI Logo" className="h-6 w-auto pl-1" priority />
              </Link>
              <SidebarTrigger className="hover:bg-accent rounded-lg text-foreground/80 h-9 w-9 shrink-0 transition-all duration-300 ml-auto group-data-[collapsible=icon]:m-0 [&>svg]:w-[18px] [&>svg]:h-[18px]" />
            </div>

            {/* Menu items row */}
            <div className="flex flex-col gap-1 w-full relative">
              <Button
                onClick={() => window.location.reload()}
                variant="ghost"
                className="w-full justify-start gap-3 h-[38px] px-2 font-medium text-[14px] hover:bg-accent text-foreground/90 rounded-lg transition-all duration-300 overflow-hidden group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:mx-auto"
                title="New Chat"
              >
                <div className="flex items-center justify-center shrink-0 w-[22px] h-[22px] rounded-full bg-accent/30 border border-border/80 text-foreground group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:h-full group-data-[collapsible=icon]:border-none group-data-[collapsible=icon]:bg-transparent transition-all duration-300">
                  <Plus className="h-[14px] w-[14px] shrink-0 group-data-[collapsible=icon]:w-5 group-data-[collapsible=icon]:h-5" />
                </div>
                <span className="truncate whitespace-nowrap group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 transition-all duration-300">New chat</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-[38px] px-2 font-medium text-[14px] hover:bg-accent text-foreground/90 rounded-lg transition-all duration-300 overflow-hidden group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:mx-auto"
                title="Search"
              >
                <div className="flex items-center justify-center shrink-0 w-[22px] text-foreground">
                  <Search className="h-[17px] w-[17px] shrink-0" />
                </div>
                <span className="truncate whitespace-nowrap group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 transition-all duration-300">Search</span>
              </Button>
            </div>
          </SidebarHeader>

          <SidebarContent className="transition-all duration-300 overflow-hidden group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0">
            <SidebarGroup>
              <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground/80 mb-1 group-data-[collapsible=icon]:hidden">Your chats</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* Real chats will map here */}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-3 transition-all duration-300">
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-accent/50 transition-all duration-300 cursor-pointer group group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:mx-auto bg-transparent">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-medium text-xs border border-border">
                    GU
                  </div>
                  <div className="flex flex-col min-w-0 transition-all duration-300 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 overflow-hidden whitespace-nowrap">
                    <p className="text-[14px] font-medium truncate leading-tight">Guest User</p>
                    <p className="text-[12px] text-muted-foreground truncate opacity-80">Free plan</p>
                  </div>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content Area */}
        <SidebarInset
          ref={chatContainerRef}
          className={`flex flex-col relative w-full bg-background ${messages.length > 1 ? 'overflow-y-auto chat-scrollbar' : 'overflow-hidden'}`}
        >
          {/* Top Navigation Bar (Minimal) */}
          <header className={`sticky top-0 shrink-0 z-40 transition-all duration-300 ${isChatScrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm' : 'bg-transparent'}`}>
            <div className="flex items-center justify-between h-14 px-4 md:px-6">
              <div className="flex items-center gap-1 md:gap-3">
                <MobileMenuTrigger />
                <TopBarLogo />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex font-medium px-3 sm:px-4 h-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 sm:bg-transparent sm:text-foreground sm:hover:bg-accent"
                  asChild
                >
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" className="hidden sm:flex bg-primary text-primary-foreground hover:opacity-90 font-medium px-4 h-9 rounded-full" asChild>
                  <Link href="/signup">Sign up for free</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-accent h-9 w-9"
                  onClick={() => setIsHelpOpen(true)}
                  aria-label="Open help"
                >
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 flex flex-col relative">
            {/* Unified Background */}
            <div className="absolute inset-0 bg-[image:var(--bg-subtle-mesh)] pointer-events-none opacity-90 z-0" />
            {messages.length <= 1 && (
              <div className="absolute inset-0 bg-[image:var(--bg-dot-pattern)] bg-[length:24px_24px] pointer-events-none opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] z-0" />
            )}
            <div className="absolute inset-0 bg-slate-50/40 dark:bg-transparent pointer-events-none z-0" />

            <div className="relative z-10 flex-1 flex flex-col min-h-0">
              {messages.length <= 1 ? (
                /* Hero Section */
                <div ref={heroContainerRef} className="flex-1 flex flex-col items-center justify-center px-4 overflow-hidden sm:overflow-y-auto custom-scrollbar pt-10 pb-36 sm:pb-20">


                  <div className="text-center mb-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    <p className="sm:hidden text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground/80 mb-2">
                      Hi, I&apos;m Salus AI
                    </p>
                    <h1 className="text-2xl min-[390px]:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground mb-4">
                      <span className="sm:hidden">How can I help?</span>
                      <span className="hidden sm:inline">What can I help you with?</span>
                    </h1>
                    <p className="text-base md:text-lg lg:text-xl text-muted-foreground">
                      Ask anything about pet health, training, local services, or community.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 px-2 w-full max-w-4xl mx-auto sm:hidden max-[380px]:max-h-[30vh] max-[380px]:overflow-y-auto max-[380px]:overscroll-contain max-[380px]:scroll-smooth max-[380px]:custom-scrollbar max-[380px]:pr-1">
                    {heroSuggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-between h-auto py-3 px-5 rounded-xl bg-white/50 dark:bg-zinc-800/40 border border-black/10 dark:border-white/10 hover:bg-white dark:hover:bg-zinc-800/60 backdrop-blur-md transition-all duration-200 text-sm font-medium text-foreground/90 hover:text-foreground hover:border-black/20 dark:hover:border-white/20 active:scale-[0.98] animate-in fade-in slide-in-from-top-4"
                        style={{ animationDelay: `${500 + (index * 100)}ms` }}
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

                  <div className="fixed bottom-0 left-0 right-0 z-20 w-full px-4 sm:static sm:z-auto sm:max-w-4xl sm:mx-auto sm:px-4 mt-8 sm:mt-8 bg-gradient-to-t from-background via-background/95 to-transparent sm:bg-none pt-2 pb-4 sm:pt-0 sm:pb-0 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <div className="relative group">
                      <div className="relative bg-white/80 dark:bg-zinc-900/60 backdrop-blur-3xl rounded-[32px] border border-white/20 ring-1 ring-black/[0.05] p-2 flex items-end gap-2 transition-all duration-300 sm:max-w-2xl sm:mx-auto sm:bg-white/70 sm:rounded-[28px] sm:p-4 sm:flex-col sm:items-stretch sm:gap-0 sm:ring-black/5 sm:dark:ring-white/5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleVoiceInput}
                          className={`sm:hidden rounded-full h-11 w-11 shrink-0 transition-all duration-300 ${isRecording ? 'bg-red-500/10 text-red-500 animate-pulse' : 'text-muted-foreground hover:text-primary'}`}
                        >
                          {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        </Button>

                        <div className="flex-1 relative flex items-center min-h-[2.75rem] py-2 sm:min-h-[44px] sm:py-0">
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
                            className="w-full bg-transparent text-base focus:outline-none text-foreground px-2 py-1 resize-none max-h-[200px] leading-relaxed custom-scrollbar sm:px-1"
                          />
                          {!inputMessage && (
                            <div className="absolute inset-0 flex items-center pointer-events-none px-2 py-1 sm:px-1">
                              <AnimatedPlaceholder />
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={() => handleSendMessage()}
                          disabled={!inputMessage.trim() || isTyping}
                          className="sm:hidden rounded-full h-11 w-11 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-30"
                          size="icon"
                        >
                          <ArrowUp className="h-5 w-5" />
                        </Button>

                        {/* Bottom: Action Bar (Compact) */}
                        <div className="hidden sm:flex items-center justify-between mt-2 pt-2 border-t border-border/5 dark:border-white/5">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleVoiceInput}
                              className={`rounded-full h-11 w-11 transition-all duration-300 ${isRecording ? 'bg-red-500/10 text-red-500 animate-pulse' : 'text-muted-foreground hover:text-primary'}`}
                            >
                              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleSendMessage()}
                              disabled={!inputMessage.trim() || isTyping}
                              className="rounded-full h-11 w-11 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-30"
                              size="icon"
                            >
                              <ArrowUp className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hero Suggestions */}
                  <div className="hidden mt-10 sm:flex flex-wrap justify-center gap-3 px-2 max-w-4xl mx-auto">
                    {heroSuggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className={`w-full sm:w-auto justify-between sm:justify-center h-auto py-3 px-5 rounded-xl sm:rounded-full bg-white/50 dark:bg-zinc-800/40 border border-black/10 dark:border-white/10 hover:bg-white dark:hover:bg-zinc-800/60 backdrop-blur-md transition-all duration-200 text-sm font-medium text-foreground/90 hover:text-foreground hover:border-black/20 dark:hover:border-white/20 active:scale-[0.98] ${index === 3 || index === 4 ? 'hidden sm:flex' : ''} animate-in fade-in slide-in-from-top-4`}
                        style={{ animationDelay: `${500 + (index * 100)}ms` }}
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
                </div>
              ) : (
                /* Chat Interface */
                <div key="chat-interface" className="flex-1 h-full relative">
                  <div className="min-h-full flex flex-col">
                    <div className="max-w-3xl w-full mx-auto p-4 md:p-8 space-y-8 flex-1">
                      {messages.slice(1).map((message) => (
                        <MessageBubble
                          key={message.id}
                          message={message}
                          onEdit={handleEditMessage}
                          onTypingComplete={handleTypingComplete}
                          onVersionChange={handleVersionChange}
                        />
                      ))}
                      {isTyping && <ProcessLoader />}
                      <div className="h-20" />
                      <div ref={messagesEndRef} className="h-4" />
                    </div>

                    {/* Chat Input Area */}
                    <div className="sticky bottom-0 z-20 w-full bg-gradient-to-t from-background via-background/95 to-transparent pt-3 pb-1 px-4 md:pt-4 md:pb-2">
                      <div className="w-full max-w-3xl mx-auto relative px-2">
                      {showScrollButton && (
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={scrollToBottom}
                          className="absolute left-1/2 -translate-x-1/2 -top-14 z-50 rounded-full bg-background border border-border hover:bg-accent hover:scale-110 transition-all animate-in fade-in zoom-in duration-300"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      )}

                      {isEmergency && (
                        <div className="mb-4 animate-in slide-in-from-bottom-6 duration-500">
                          <div className="bg-destructive/5 dark:bg-destructive/10 backdrop-blur-3xl border border-destructive/20 rounded-[28px] p-5 shadow-2xl shadow-destructive/10">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3 text-destructive">
                                <AlertTriangle className="h-6 w-6 animate-pulse" />
                                <span className="font-bold text-lg">Emergency Mode Active</span>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => setIsEmergency(false)} className="rounded-xl h-8 w-8 p-0 hover:bg-destructive/10">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <Button
                                className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold h-12 rounded-2xl shadow-lg shadow-destructive/20"
                                onClick={() => window.open('https://www.google.com/maps/search/emergency+vet+clinic+near+me', '_blank')}
                                size="lg"
                              >
                                <MapPin className="h-5 w-5 mr-3" />
                                Open Maps Now
                              </Button>
                              <Button
                                className="w-full bg-background border-2 border-primary text-primary hover:bg-primary/5 font-bold h-12 rounded-2xl transition-all"
                                size="lg"
                                onClick={() => setIsConsultationPopupOpen(true)}
                              >
                                <Video className="h-5 w-5 mr-3" />
                                Instant Video Call
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="relative bg-white/80 dark:bg-zinc-900/60 backdrop-blur-3xl rounded-[32px] border border-white/20 ring-1 ring-black/[0.05] p-2 flex items-end gap-2 transition-all duration-300">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleVoiceInput}
                          className={`rounded-full h-11 w-11 shrink-0 transition-all duration-300 ${isRecording ? 'bg-red-500/10 text-red-500 animate-pulse' : 'text-muted-foreground hover:text-primary'}`}
                        >
                          {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        </Button>

                        <div className="flex-1 relative flex items-center min-h-[2.75rem] py-2">
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
                            className="w-full bg-transparent text-base focus:outline-none text-foreground px-2 resize-none max-h-[200px] self-center leading-relaxed custom-scrollbar"
                            placeholder="Message Salus..."
                          />
                        </div>

                        <Button
                          onClick={() => handleSendMessage()}
                          disabled={!inputMessage.trim() || isTyping}
                          className="rounded-full h-11 w-11 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105 active:scale-95"
                          size="icon"
                        >
                          <ArrowUp className="h-5 w-5" />
                        </Button>
                      </div>

                        <p className="mx-auto mt-2 md:mt-3 max-w-[42rem] px-3 text-center text-[11px] leading-[1.35] text-muted-foreground/75 sm:text-xs">
                          {safetyNoteText}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>

      <ConsultationPopup
        isOpen={isConsultationPopupOpen}
        onClose={() => setIsConsultationPopupOpen(false)}
      />

      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="w-[94vw] max-w-xl rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-0 overflow-hidden">
          <div className="p-5 md:p-6">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-xl font-bold">How To Use Salus AI</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Quick guidance for better results and safer decisions.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-5 md:px-6 pb-5 md:pb-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="rounded-xl border border-border bg-background/70 p-4 space-y-2">
              <h3 className="text-sm font-semibold">Ask Better Questions</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-outside pl-4">
                <li>Include pet type, age, weight, and symptoms.</li>
                <li>Share duration, severity, and what changed recently.</li>
                <li>Use one clear question per prompt for best accuracy.</li>
              </ul>
            </div>

            <div className="rounded-xl border border-amber-300/50 bg-amber-50/60 dark:bg-amber-500/10 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">Safety First</h3>
              <p className="text-sm text-amber-900/80 dark:text-amber-200/80">
                Salus AI can help with guidance, but it is not a medical diagnosis. For urgent or worsening symptoms, contact a licensed veterinarian immediately.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background/70 p-4 space-y-3">
              <h3 className="text-sm font-semibold">Need Immediate Help?</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  className="sm:flex-1"
                  onClick={() => window.open('https://www.google.com/maps/search/emergency+vet+clinic+near+me', '_blank')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Find Emergency Vet
                </Button>
                <Button
                  variant="outline"
                  className="sm:flex-1"
                  onClick={() => {
                    setIsHelpOpen(false);
                    setIsConsultationPopupOpen(true);
                  }}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Start Instant Consultation
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">
                Need support or want to report an issue?{" "}
                <Link href="/contact" className="font-medium text-primary hover:underline" onClick={() => setIsHelpOpen(false)}>
                  Contact Zoodo Support
                </Link>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
