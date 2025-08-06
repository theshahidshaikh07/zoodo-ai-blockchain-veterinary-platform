'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Send,
  Camera,
  Mic,
  Settings,
  Share2,
  RotateCcw,
  Stethoscope,
  Heart,
  Utensils,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import zoodoLogo from '@/assets/zoodo.png';
import zoodoLightLogo from '@/assets/Zoodo-light.png';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  if (!mounted) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center group">
                       <Image
           src={mounted && resolvedTheme === 'dark' ? zoodoLightLogo : zoodoLogo}
           alt="Zoodo"
           width={120}
           height={40}
           priority
                  className="h-3 md:h-4 lg:h-5 w-auto group-hover:scale-105 transition-all duration-300"
         />
              </Link>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Dr. Salus AI
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] lg:max-w-[70%] ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-2xl p-4 lg:p-6`}>
                  <p className="text-sm lg:text-base leading-relaxed">{message.content}</p>
                  {message.analysis && (
                    <div className="mt-4 p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium">Analysis</span>
                        <Badge className={getSeverityColor(message.analysis.severity)}>
                          {message.analysis.severity}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        {message.analysis.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-center space-x-2 text-xs">
                            <div className="w-1 h-1 bg-primary rounded-full"></div>
                            <span>{rec}</span>
      </div>
                        ))}
                </div>
                </div>
                  )}
                  <p className="text-xs opacity-70 mt-3">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl p-4 lg:p-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="text-sm text-muted-foreground ml-2">Dr. Salus is typing...</span>
                  </div>
                </div>
              </div>
            )}
            
                  <div ref={messagesEndRef} />
                </div>
              </div>

        {/* Input Area */}
        <div className="border-t border-border/40 bg-card/50 backdrop-blur-xl p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
                  <div className="flex-1">
                <Input
                  placeholder="Describe your pet's symptoms or ask a question..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  className="min-h-[50px] text-base border-0 focus-visible:ring-0 bg-background"
                    />
                  </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleImageUpload}
                  className="hover:bg-primary/10"
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleVoiceInput}
                  className={`hover:bg-primary/10 ${isRecording ? 'bg-red-500 text-white' : ''}`}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                      onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-primary hover:bg-primary/90"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
                  </div>
                </div>
                
            {/* Quick Actions */}
            <div className="flex items-center justify-center space-x-4 mt-4 pt-4 border-t border-border/20">
              <Button variant="ghost" size="sm" className="text-xs">
                <Stethoscope className="h-3 w-3 mr-1" />
                Diagnosis
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <Utensils className="h-3 w-3 mr-1" />
                Diet
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <Heart className="h-3 w-3 mr-1" />
                Care
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                Find Vet
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 