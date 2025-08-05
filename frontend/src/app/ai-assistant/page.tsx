'use client';

import { useState, useRef, useEffect } from 'react';
import { FaPaw, FaPaperPlane, FaMicrophone, FaRobot, FaUser, FaSpinner, FaLightbulb, FaHeartbeat, FaUserMd } from 'react-icons/fa';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import zoodoLogo from '@/assets/zoodo.png';
import zoodoLightLogo from '@/assets/Zoodo-light.png';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface AIResponse {
  analysis?: string;
  urgency_level?: string;
  confidence_score?: number;
  recommended_actions?: string[];
  suggested_providers?: string[];
  providers?: Array<{
    id: string;
    name: string;
    specialization: string;
    rating: number;
    experience: string;
    available: boolean;
  }>;
  daily_routine?: string[];
  weekly_routine?: string[];
  diet_recommendations?: string[];
  exercise_suggestions?: string[];
  health_monitoring?: string[];
}

export default function AIAssistantPage() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm Zoodo AI, your pet care assistant. I can help you with:\n\n🐾 Symptom analysis and health concerns\n🏥 Provider recommendations\n💊 Care routines and diet advice\n🚨 Emergency assessments\n\nHow can I help you and your pet today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPet, setSelectedPet] = useState({
    species: '',
    breed: '',
    age: ''
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, loadingMessage]);

    try {
      // Analyze the user's message to determine intent
      const intent = analyzeIntent(inputValue);
      const response = await getAIResponse(inputValue, intent);
      
      // Remove loading message and add AI response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, {
          id: (Date.now() + 2).toString(),
          type: 'ai',
          content: formatAIResponse(response, intent),
          timestamp: new Date()
        }];
      });
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, {
          id: (Date.now() + 2).toString(),
          type: 'ai',
          content: "I'm sorry, I'm having trouble processing your request right now. Please try again or contact our support team.",
          timestamp: new Date()
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeIntent = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('symptom') || lowerMessage.includes('sick') || lowerMessage.includes('not feeling well')) {
      return 'symptom_analysis';
    } else if (lowerMessage.includes('doctor') || lowerMessage.includes('veterinarian') || lowerMessage.includes('provider')) {
      return 'provider_recommendation';
    } else if (lowerMessage.includes('care') || lowerMessage.includes('routine') || lowerMessage.includes('diet')) {
      return 'care_routine';
    } else if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      return 'emergency_assessment';
    } else {
      return 'general';
    }
  };

  const getAIResponse = async (message: string, intent: string): Promise<AIResponse> => {
    // Mock API call - replace with actual API endpoint
    const response = await fetch('http://localhost:8000/analyze-symptoms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        species: selectedPet.species || 'dog',
        symptoms: extractSymptoms(message),
        breed: selectedPet.breed,
        age: selectedPet.age ? parseInt(selectedPet.age) : undefined
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    return await response.json();
  };

  const extractSymptoms = (message: string): string[] => {
    const symptomKeywords = [
      'lethargy', 'vomiting', 'diarrhea', 'coughing', 'sneezing',
      'limping', 'not eating', 'hiding', 'urination issues',
      'itching', 'scratching', 'hair loss', 'weight loss'
    ];
    
    const lowerMessage = message.toLowerCase();
    return symptomKeywords.filter(symptom => lowerMessage.includes(symptom));
  };

  const formatAIResponse = (response: AIResponse, intent: string): string => {
    let formattedResponse = '';

    if (intent === 'symptom_analysis') {
      formattedResponse += `🔍 **Analysis**: ${response.analysis}\n\n`;
      formattedResponse += `⚠️ **Urgency Level**: ${response.urgency_level?.toUpperCase()}\n\n`;
      formattedResponse += `📋 **Recommended Actions**:\n`;
      response.recommended_actions?.forEach(action => {
        formattedResponse += `• ${action}\n`;
      });
    } else if (intent === 'provider_recommendation') {
      formattedResponse += `🏥 **Recommended Providers**:\n\n`;
      response.providers?.forEach(provider => {
        formattedResponse += `👨‍⚕️ **${provider.name}**\n`;
        formattedResponse += `   Specialization: ${provider.specialization}\n`;
        formattedResponse += `   Rating: ${provider.rating}/5 ⭐\n`;
        formattedResponse += `   Experience: ${provider.experience}\n\n`;
      });
    } else if (intent === 'care_routine') {
      formattedResponse += `📅 **Daily Care Routine**:\n`;
      response.daily_routine?.forEach(item => {
        formattedResponse += `• ${item}\n`;
      });
      formattedResponse += `\n🍽️ **Diet Recommendations**:\n`;
      response.diet_recommendations?.forEach(item => {
        formattedResponse += `• ${item}\n`;
      });
    } else {
      formattedResponse = response.analysis || 'I understand your concern. Let me help you with that.';
    }

    return formattedResponse;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: FaHeartbeat, label: 'Symptom Check', action: 'My pet is not feeling well' },
    { icon: FaUserMd, label: 'Find Vet', action: 'I need to find a veterinarian' },
    { icon: FaLightbulb, label: 'Care Tips', action: 'Give me care routine advice' },
    { icon: FaPaw, label: 'Emergency', action: 'Is this an emergency?' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
                       <Image
           src={mounted && resolvedTheme === 'dark' ? zoodoLightLogo : zoodoLogo}
           alt="Zoodo"
           width={120}
           height={40}
           className="h-3 md:h-4 lg:h-5 w-auto"
           priority
         />
              <h1 className="text-xl font-bold text-gray-900">AI Assistant</h1>
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <span className="text-sm text-gray-600">Powered by AI</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Pet Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pet Profile</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Species
                  </label>
                  <select
                    value={selectedPet.species}
                    onChange={(e) => setSelectedPet(prev => ({ ...prev, species: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select species</option>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="bird">Bird</option>
                    <option value="rabbit">Rabbit</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Breed
                  </label>
                  <input
                    type="text"
                    value={selectedPet.breed}
                    onChange={(e) => setSelectedPet(prev => ({ ...prev, breed: e.target.value }))}
                    placeholder="e.g., Golden Retriever"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age (years)
                  </label>
                  <input
                    type="number"
                    value={selectedPet.age}
                    onChange={(e) => setSelectedPet(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="e.g., 3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputValue(action.action);
                        handleSendMessage();
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <action.icon className="text-blue-600" />
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {message.type === 'user' ? <FaUser className="text-sm" /> : <FaRobot className="text-sm" />}
                        </div>
                        
                        <div className={`rounded-lg px-4 py-3 ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          {message.isLoading ? (
                            <div className="flex items-center space-x-2">
                              <FaSpinner className="animate-spin" />
                              <span>AI is thinking...</span>
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap">{message.content}</div>
                          )}
                          <div className={`text-xs mt-2 ${
                            message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Describe your pet's symptoms or ask for advice..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaPaperPlane className="text-sm" />
                    </button>
                    <button className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
                      <FaMicrophone className="text-sm" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  Press Enter to send, Shift+Enter for new line
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 