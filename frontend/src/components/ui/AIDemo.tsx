import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Stethoscope, 
  Send, 
  User, 
  Bot, 
  X, 
  Sparkles,
  Heart,
  AlertCircle
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIDemo = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm Dr. Salus AI, your intelligent pet healthcare assistant. I can help analyze symptoms, recommend treatments, and connect you with the right veterinarians. What can I help you with today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sampleQuestions = [
    "My dog has been limping for 2 days",
    "What vaccines does my puppy need?",
    "Find a vet near me for emergency care",
    "My cat isn't eating much lately"
  ];

  const aiResponses = {
    "My dog has been limping for 2 days": "I understand your concern about your dog's limping. This could indicate several conditions from minor strain to more serious joint issues. I recommend:\n\n🔍 **Immediate Assessment:**\n- Check for visible swelling or cuts\n- Note if the limping is worse after rest\n- Observe which leg is affected\n\n🏥 **Recommendation:**\nBased on the 2-day duration, I suggest scheduling a vet appointment within 24-48 hours. I can help you find qualified veterinarians in your area who specialize in orthopedic issues.\n\n💡 **Meanwhile:** Keep your dog calm, limit exercise, and apply gentle cold compress if there's swelling.",
    
    "What vaccines does my puppy need?": "Great question! Puppy vaccination is crucial for their health. Here's the standard vaccination schedule:\n\n💉 **Core Vaccines (6-8 weeks):**\n- DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)\n- Rabies (12-16 weeks)\n\n📅 **Schedule:**\n- 6-8 weeks: First DHPP\n- 10-12 weeks: Second DHPP\n- 14-16 weeks: Final DHPP + Rabies\n\n🔄 **Boosters:** Annual boosters required\n\nI can connect you with certified veterinarians in your area who offer puppy vaccination packages. Would you like me to find some options for you?",
    
    "Find a vet near me for emergency care": "I'll help you find emergency veterinary care right away! 🚨\n\n🏥 **Emergency Features I Look For:**\n- 24/7 availability\n- Emergency surgery capabilities\n- ICU facilities\n- Board-certified emergency veterinarians\n\n📍 **To find the best options, I need your location:**\nPlease share your city or zip code, and I'll instantly provide:\n- Nearest emergency animal hospitals\n- Current wait times\n- Contact information\n- Driving directions\n\n⚡ **Critical situations?** Call ahead or go directly to the nearest emergency vet. I can also guide you through immediate first aid if needed.",
    
    "My cat isn't eating much lately": "Loss of appetite in cats can be concerning and needs attention. Let me help assess the situation:\n\n❓ **Key Questions:**\n- How many days has this been happening?\n- Is your cat drinking water normally?\n- Any vomiting or lethargy?\n- Any recent changes in environment?\n\n⚠️ **Red Flags:** If your cat hasn't eaten for 24+ hours, this needs immediate attention as cats can develop serious liver issues.\n\n🩺 **My Assessment:**\nBased on common causes, this could be:\n- Dental pain\n- Stress/anxiety\n- Underlying illness\n- Food preferences\n\n📋 **Recommendation:** Schedule a vet visit within 24-48 hours. I can help you find veterinarians who specialize in feline medicine and offer same-day appointments."
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const aiResponse = aiResponses[content as keyof typeof aiResponses] || 
        "Thank you for your question! As Dr. Salus AI, I'm analyzing your pet's symptoms and consulting my extensive veterinary database. For the most accurate diagnosis and treatment plan, I recommend scheduling an appointment with one of our certified veterinarians. I can help you find the best match based on your location, pet's needs, and budget. Would you like me to search for available vets in your area?";
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleSendMessage(input.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[600px] glass-card rounded-3xl shadow-elegant overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold gradient-text">Dr. Doom AI</h3>
              <p className="text-sm text-muted-foreground">Your Intelligent Pet Healthcare Assistant</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-[calc(600px-140px)]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-primary' 
                      : 'bg-gradient-primary'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`p-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'glass-card'
                  }`}>
                    <p className="text-sm whitespace-pre-line leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="glass-card p-4 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sample Questions */}
          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <p className="text-sm text-muted-foreground mb-3">Try asking me about:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(question)}
                    className="text-left p-3 glass-card rounded-xl hover:shadow-glow transition-all duration-300 text-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 border-t border-border/20">
            <form onSubmit={handleInputSubmit} className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Dr. Doom AI about your pet's health..."
                className="flex-1 px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                disabled={isTyping}
              />
              <Button 
                type="submit" 
                variant="default" 
                size="icon"
                disabled={isTyping || !input.trim()}
                className="w-12 h-12"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDemo;