"""
Core LLM Service using Google Gemini API
Handles all AI interactions for Dr. Salus AI
"""

import os
from google import genai
from google.genai import types
from typing import Dict, List, Optional
import json

class GeminiService:
    def __init__(self):
        """Initialize Gemini AI service"""
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        # Initialize the new Gemini client
        self.client = genai.Client(api_key=api_key)
        
        # Model name - available model found in list
        self.model_name = "gemini-2.5-flash-lite"
        
        # System prompt for Dr. Salus AI
        self.system_prompt = """You are Dr. Salus AI, a compassionate and knowledgeable AI veterinary assistant created to help pet parents.

**Your Identity:**
- Name: Dr. Salus AI
- Role: AI-powered veterinary assistant
- Personality: Warm, professional, caring, and knowledgeable

**Your Capabilities:**
1. Analyze pet health symptoms and provide guidance
2. Detect emergencies and provide immediate first-aid advice
3. Recommend nutrition and diet plans based on pet type, breed, age, and weight
4. Suggest when to contact a veterinarian
5. Collect pet information progressively (name, age, breed, weight, gender)
6. Provide location-based recommendations for vets, hospitals, and pet care services

**Conversation Guidelines:**
- Always be warm and empathetic - pet parents are often worried
- Ask for information progressively, one question at a time
- Start with pet's name if not provided
- Ask for breed, age, weight, gender ONLY when relevant to the question
- Speak like a real veterinarian would - professional but friendly
- Keep responses concise and actionable
- Use simple language, avoid excessive medical jargon

**Emergency Detection:**
- Immediately identify emergency symptoms (difficulty breathing, severe bleeding, poisoning, seizures, bloat, trauma, collapse, inability to urinate, etc.)
- For emergencies: Provide immediate first-aid steps AND strongly recommend urgent vet care
- Suggest "Connect with Vet Online" or "Find Vet Clinic Nearby" for emergencies

**Scope Limitations:**
- ONLY answer questions related to pets, animals, veterinary care, pet nutrition, pet behavior, pet grooming, and pet care
- Politely decline questions about human health, politics, general knowledge, or unrelated topics
- If asked about non-pet topics, say: "I'm Dr. Salus AI, specialized in pet health and care. I can only help with questions about your pets. How can I assist with your pet's health today?"

**Response Format:**
- Be conversational and natural
- Use bullet points for lists or multiple recommendations
- Always end with a helpful question or next step
- For emergencies, clearly mark them as "⚠️ EMERGENCY"

Remember: You're here to help worried pet parents. Be their trusted guide."""

    def generate_response(
        self, 
        user_message: str, 
        conversation_history: List[Dict[str, str]] = None,
        pet_context: Optional[Dict] = None
    ) -> str:
        """
        Generate AI response using Gemini
        
        Args:
            user_message: The user's current message
            conversation_history: Previous conversation messages
            pet_context: Information about the pet (name, breed, age, etc.)
        
        Returns:
            AI-generated response
        """
        try:
            # Build context
            context_parts = [self.system_prompt]
            
            # Add pet context if available
            if pet_context:
                pet_info = "**Pet Information:**\n"
                for key, value in pet_context.items():
                    if value:
                        pet_info += f"- {key.title()}: {value}\n"
                context_parts.append(pet_info)
            
            # Add conversation history
            if conversation_history:
                history_text = "**Previous Conversation:**\n"
                for msg in conversation_history[-6:]:  # Last 6 messages for context
                    role = "Pet Parent" if msg["role"] == "user" else "Dr. Salus AI"
                    history_text += f"{role}: {msg['content']}\n"
                context_parts.append(history_text)
            
            # Build final prompt
            full_prompt = "\n\n".join(context_parts)
            full_prompt += f"\n\n**Current Question from Pet Parent:**\n{user_message}\n\n**Your Response:**"
            
            # Generate response using new API
            try:
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=full_prompt
                )
                
                # Extract text from response
                if hasattr(response, 'text'):
                    return response.text
                elif hasattr(response, 'candidates') and len(response.candidates) > 0:
                    return response.candidates[0].content.parts[0].text
                else:
                    print(f"Unexpected response format: {type(response)}")
                    print(f"Response: {response}")
                    return "I'm having trouble generating a response. Please try again."
                    
            except Exception as api_error:
                print(f"Gemini API Error: {str(api_error)}")
                print(f"Error type: {type(api_error)}")
                raise  # Re-raise to be caught by outer exception handler
            
        except Exception as e:
            print(f"Error generating response: {str(e)}")
            return f"I apologize, but I'm having trouble processing your request right now. Error details: {str(e)}"

    def detect_emergency(self, message: str) -> Dict[str, any]:
        """
        Detect if the message indicates a pet emergency
        
        Returns:
            Dict with 'is_emergency' boolean and 'severity' level
        """
        emergency_keywords = [
            "can't breathe", "not breathing", "difficulty breathing", "gasping",
            "severe bleeding", "blood", "bleeding heavily",
            "seizure", "seizing", "convulsing", "shaking uncontrollably",
            "poisoned", "ate poison", "toxic", "ingested",
            "bloat", "swollen abdomen", "distended belly",
            "collapsed", "unconscious", "unresponsive", "won't wake up",
            "can't urinate", "unable to pee", "blocked",
            "severe pain", "crying in pain", "screaming",
            "hit by car", "fell from height", "trauma", "accident",
            "broken bone", "can't walk", "paralyzed",
            "heatstroke", "overheating", "panting heavily",
            "choking", "can't swallow"
        ]
        
        message_lower = message.lower()
        is_emergency = any(keyword in message_lower for keyword in emergency_keywords)
        
        return {
            "is_emergency": is_emergency,
            "severity": "high" if is_emergency else "normal"
        }

    def extract_pet_info(self, message: str, current_context: Dict) -> Dict:
        """
        Extract pet information from user message
        
        Args:
            message: User's message
            current_context: Current pet context
        
        Returns:
            Updated pet context
        """
        # This is a simple implementation
        # In production, you might want to use NER or more sophisticated extraction
        
        updated_context = current_context.copy() if current_context else {}
        
        # Simple keyword-based extraction
        # You can enhance this with NLP libraries
        
        return updated_context
