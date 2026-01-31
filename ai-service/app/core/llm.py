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
        
        # Model name - gemini-2.0-flash is the stable V2 model
        self.model_name = "gemini-2.0-flash"
        
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
- Start with pet's name if not provided (EXCEPT in emergencies - skip name if urgency is required)
- Ask for breed, age, weight, gender ONLY when relevant to the question
- Speak like a real veterinarian would - professional but friendly
- Keep responses concise and actionable
- Use simple language, avoid excessive medical jargon
- **CRITICAL:** Do NOT use formal support phrase like "Thank you for reaching out". Be natural.
- **CRITICAL:** Check the chat history. If you have ALREADY introduced yourself, NEVER do it again.
- **CRITICAL:** Do NOT start your response with "Hello", "Hi", "Hey" unless the user's PRIMARY intent in the *immediate last message* was a greeting. If they gave you information (e.g. "His name is Tom"), dive STRAIGHT into the response (e.g. "Thanks! Tom is a great name...").
- **CRITICAL:** If the user says "Hi", respond warmly. Otherwise, skip the greeting.
- **CRITICAL:** Context-Aware Name Detection:
  - If you asked "What is your pet's name?", treat the subsequent response as the Pet's Name.
  - If the user says "My name is [X] and my pet is [Y]", correctly identify [X] as the Owner and [Y] as the Pet.
  - Always address the user as the "Pet Parent" or by their name if given, and refer to the animal by the Pet's Name.

**Emergency Detection:**
- Immediately identify emergency symptoms (difficulty breathing, severe bleeding, poisoning, seizures, bloat, trauma, collapse, inability to urinate, etc.)
- For emergencies: PRIORITIZE immediate first-aid advice. Do NOT ask for name/breed/age until the situation is stabilized.
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
            
            # List of models to try in order of preference (speed/limits)
            # gemini-pro-latest is 1.0 Pro (Legacy) - very stable and free
            models_to_try = [self.model_name, "gemini-flash-latest", "gemini-2.0-flash-lite-001", "gemini-pro-latest"]
            
            last_error = None
            
            for model in models_to_try:
                try:
                    # Generate response using new API
                    response = self.client.models.generate_content(
                        model=model,
                        contents=full_prompt
                    )
                    
                    # Extract text from response
                    if hasattr(response, 'text'):
                        return response.text
                    elif hasattr(response, 'candidates') and len(response.candidates) > 0:
                        return response.candidates[0].content.parts[0].text
                    else:
                        print(f"Unexpected response format from {model}: {type(response)}")
                
                except Exception as api_error:
                    error_str = str(api_error)
                    print(f"Error with model {model}: {error_str}")
                    last_error = api_error
                    
                    # Continue to next model on ANY error to maximize chance of success
                    # (e.g. 404 Not Found, 429 Limit Exceeded, 503 Service Unavailable)
                    continue
            
            # If we exhausted all models
            if last_error:
                raise last_error
            
            return "I'm having trouble generating a response. Please try again."
                    

            
        except Exception as e:
            error_msg = str(e)
            print(f"Error generating response: {error_msg}")
            
            if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg or "Quota exceeded" in error_msg:
                return "The AI model usage limit has been exceeded. Please try again later."
                
            return "I apologize, but I'm having trouble connecting to the service right now. Please try again in a moment."

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
