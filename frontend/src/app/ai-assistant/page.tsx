'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Plus,
  ArrowUp,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import Header from '@/components/Header';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  analysis?: {
    confidence: number;
    recommendations: string[];
    severity: 'low' | 'medium' | 'high';
  };
}

export default function AIAssistantPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isPlaceholderTyping, setIsPlaceholderTyping] = useState(false);
  const [isChatScrolled, setIsChatScrolled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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
        content: "Hello! I'm Dr. Salus AI, your intelligent veterinary assistant. I can help you with pet diagnosis, diet recommendations, personalized care plans, and connect you with the best vets and trainers. How can I assist you today?",
        timestamp: new Date(),
      }
    ]);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  // Handle chat container scroll for header styling
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer || messages.length <= 1) return;

    const handleChatScroll = () => {
      const scrolled = chatContainer.scrollTop > 20;
      setIsChatScrolled(scrolled);
    };

    // Set initial state
    handleChatScroll();

    chatContainer.addEventListener('scroll', handleChatScroll);
    return () => chatContainer.removeEventListener('scroll', handleChatScroll);
  }, [messages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
        content: generateAIResponse(),
      timestamp: new Date(),
        analysis: {
          confidence: 0.85,
          recommendations: ['Schedule a vet visit', 'Monitor symptoms', 'Keep pet hydrated'],
          severity: 'medium'
        }
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
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

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
  };

  const handleImageUpload = () => {
    // Implement image upload logic here
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'high': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
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
        {messages.length > 1 ? "Ask Dr. Salus AI" : `Ask Dr. Salus AI : ${displayText}`}
        {messages.length <= 1 && <span className="animate-pulse">|</span>}
      </span>
    );
  };

  if (!mounted) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Header - Different for landing vs chat */}
      {messages.length <= 1 ? (
        <Header />
      ) : (
        /* Chat Header */
        <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/30 shadow-elegant">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between h-20 md:h-22 lg:h-24 py-5 md:py-6 lg:py-7">
              {/* Left side - Back button + Dr. Salus AI */}
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => window.location.reload()}
                  className="hover:bg-primary/10 hover:scale-105 transition-all duration-300"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Heart className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="font-semibold text-foreground">Dr. Salus AI</h1>
                    <p className="text-xs text-muted-foreground">Your Pet's Health Assistant</p>
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
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-primary/3 via-transparent to-primary/3"></div>
      
      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {messages.length <= 1 ? (
          /* Hero Section - Only show when not chatting */
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 pt-32">
            {/* Cloud Graphic */}
            <div className="mb-8 opacity-60">
              <div className="w-24 h-12 bg-muted/30 rounded-full relative">
                <div className="absolute -top-2 left-4 w-8 h-8 bg-muted/30 rounded-full"></div>
                <div className="absolute -top-1 right-6 w-6 h-6 bg-muted/30 rounded-full"></div>
                <div className="absolute top-1 left-8 w-4 h-4 bg-muted/30 rounded-full"></div>
              </div>
            </div>
            
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
            
            {/* Large AI Chat Input Area - Centered when not chatting */}
            <div className="w-full max-w-4xl mx-auto px-4 mt-8">
              <div className="relative">
                <div className="bg-muted/50 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder=""
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        className="w-full min-h-[60px] text-base border-0 focus:border-0 focus:outline-none focus:ring-0 bg-transparent text-foreground placeholder:text-muted-foreground"
                      />
                      {!inputMessage && (
                        <div className="absolute inset-0 flex items-center pointer-events-none">
                          <AnimatedPlaceholder />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Bottom Controls */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/20">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        size="icon"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Chat Interface - Full screen when chatting */
          <div className="flex-1 flex flex-col h-screen">
            
            {/* Chat Messages Area */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-6 pt-24">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.slice(1).map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted/80 backdrop-blur-sm'} rounded-3xl p-6 shadow-lg`}>
                      <p className="text-base leading-relaxed">{message.content}</p>
                      {message.analysis && (
                        <div className="mt-4 p-4 bg-background/60 backdrop-blur-sm rounded-2xl border border-border/20">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-foreground">Analysis</span>
                            <Badge className={`${getSeverityColor(message.analysis.severity)} shadow-sm`}>
                              {message.analysis.severity}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            {message.analysis.recommendations.map((rec, index) => (
                              <div key={index} className="flex items-start space-x-3 text-sm">
                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-foreground">{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-muted-foreground">Dr. Salus is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>
            
            {/* Chat Input Area - Same styling as before */}
            <div className="w-full max-w-4xl mx-auto px-4 pb-8">
              <div className="relative">
                <div className="bg-muted/50 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder=""
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        className="w-full min-h-[60px] text-base border-0 focus:border-0 focus:outline-none focus:ring-0 bg-transparent text-foreground placeholder:text-muted-foreground"
                      />
                      {!inputMessage && (
                        <div className="absolute inset-0 flex items-center pointer-events-none">
                          <AnimatedPlaceholder />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Bottom Controls */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/20">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        size="icon"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 