import os
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class SimpleAIVetAssistant:
    """
    Simple AI Vet Assistant - Just Google Gemini for veterinary chat
    
    Features:
    - Veterinary advice and consultation
    - Pet health guidance
    - Symptom analysis
    - Care recommendations
    - Emergency guidance
    """
    
    def __init__(self):
        self.name = "Dr. Salus AI"
        self.is_initialized = False
        self.llm = None
        
        # Configuration
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        self.model_name = os.getenv("AI_MODEL_NAME", "gemini-2.5-flash")
        
        # Emergency keywords that trigger immediate escalation
        self.emergency_keywords = [
            "seizure", "not breathing", "blood", "choking", "critical",
            "unconscious", "collapse", "severe bleeding", "difficulty breathing",
            "emergency", "urgent", "dying", "dead", "heart attack", "stroke"
        ]

    async def initialize(self):
        """Initialize the AI Vet Assistant"""
        try:
            if self.google_api_key:
                # Configure the Google Generative AI
                genai.configure(api_key=self.google_api_key)
                self.llm = genai.GenerativeModel(self.model_name)
                print(f"✅ {self.name} initialized with Google Gemini")
            else:
                print(f"⚠️  No Google API key configured")
                self.llm = None
                
            self.is_initialized = True
            print(f"✅ {self.name} initialized successfully")
            
        except Exception as e:
            print(f"❌ Error initializing {self.name}: {str(e)}")
            self.llm = None
            self.is_initialized = True

    async def process_user_query(
        self,
        user_id: str,
        query: str,
        pet_info: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Process user queries and provide veterinary assistance
        """
        
        # Check if query is vet-related
        if not self._is_vet_related(query):
            return {
                "response": "I'm here to help with pet health questions. What can I help you with regarding your pet?",
                "type": "non_vet_query",
                "confidence": 1.0,
                "should_see_vet": False,
                "emergency": False
            }
        
        # Check for emergency keywords
        if self._contains_emergency_keywords(query):
            return await self._handle_emergency_case(query, pet_info)
        
        # Generate AI response
        return await self._generate_vet_response(query, pet_info)

    def _is_vet_related(self, query: str) -> bool:
        """Check if query is veterinary-related - be more permissive"""
        query_lower = query.lower()
        
        # Allow most conversations - let Gemini handle it naturally
        # Only block obviously non-pet related topics
        non_pet_topics = ["weather", "politics", "cooking", "sports", "movies", "music", "travel", "work", "job", "school", "study"]
        
        # If it's clearly not pet-related, return False
        if any(topic in query_lower for topic in non_pet_topics):
            return False
            
        # Otherwise, let it through - Gemini will handle it appropriately
        return True

    def _contains_emergency_keywords(self, query: str) -> bool:
        """Check if query contains emergency keywords"""
        query_lower = query.lower()
        return any(keyword in query_lower for keyword in self.emergency_keywords)

    async def _handle_emergency_case(
        self,
        query: str,
        pet_info: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Handle emergency cases with immediate escalation"""
        
        response = "This sounds like an emergency! Please call an emergency veterinary clinic immediately. Keep your pet calm and get them to a vet right away."
        
        return {
            "response": response,
            "type": "emergency",
            "confidence": 1.0,
            "should_see_vet": True,
            "emergency": True
        }

    async def _generate_vet_response(
        self,
        query: str,
        pet_info: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Generate AI-powered veterinary response - Simple like Gemini website"""
        
        if not self.llm:
            return self._generate_rule_based_response(query)
        
        try:
            # Simple prompt - no bold formatting, shorter responses
            prompt = f"""You are Dr. Salus AI, a veterinary assistant. You're in the middle of a conversation with a pet owner.

User message: {query}

Rules:
- Keep responses short (1-2 sentences max)
- No bold text, no asterisks, no formatting
- Don't say hello or introduce yourself again
- Be conversational and helpful
- If they say thanks, just say "You're welcome!"
- If they say bye, just say "Take care!"

Respond naturally and briefly."""
            
            # Generate response using Google Generative AI
            response = await self.llm.generate_content_async(prompt)
            
            # Clean up the response - remove any formatting
            clean_response = response.text.strip()
            clean_response = clean_response.replace('**', '').replace('*', '')
            clean_response = clean_response.replace('##', '').replace('#', '')
            
            return {
                "response": clean_response,
                "type": "vet_advice",
                "confidence": 0.9,
                "should_see_vet": False,
                "emergency": False
            }
            
        except Exception as e:
            print(f"Error generating AI response: {str(e)}")
            return self._generate_rule_based_response(query)

    def _generate_rule_based_response(self, query: str) -> Dict[str, Any]:
        """Generate rule-based response when AI is not available"""
        return {
            "response": "I'm having trouble connecting right now. Please consult a veterinarian for proper advice.",
            "type": "rule_based",
            "confidence": 0.6,
            "should_see_vet": True,
            "emergency": False
        }

    def is_ready(self) -> bool:
        """Check if AI Vet Assistant is ready"""
        return self.is_initialized
