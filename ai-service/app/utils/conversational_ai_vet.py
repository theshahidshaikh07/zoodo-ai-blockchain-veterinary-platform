#!/usr/bin/env python3
"""
Conversational AI Vet Assistant - Handles conversation flow and memory
This class manages conversation state, pet information extraction, and context retention
"""

import re
import json
import asyncio
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from utils.enhanced_ai_vet_assistant import enhanced_ai_vet
from utils.mongodb_manager import MongoDBManager
from utils.redis_manager import RedisManager

@dataclass
class PetProfile:
    """Pet profile information"""
    species: str = ""
    breed: str = ""
    age: str = ""
    weight: str = ""
    gender: str = ""
    name: str = ""
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
    
    def is_complete(self) -> bool:
        """Check if basic pet information is complete"""
        return bool(self.species and self.breed and self.age)
    
    def get_summary(self) -> str:
        """Get a summary of the pet profile"""
        parts = []
        if self.name:
            parts.append(f"Name: {self.name}")
        if self.species:
            parts.append(f"Species: {self.species}")
        if self.breed:
            parts.append(f"Breed: {self.breed}")
        if self.age:
            parts.append(f"Age: {self.age}")
        if self.weight:
            parts.append(f"Weight: {self.weight}")
        if self.gender:
            parts.append(f"Gender: {self.gender}")
        
        return ", ".join(parts) if parts else "No pet information provided yet"

@dataclass
class ChatMessage:
    """Chat message structure"""
    id: str
    type: str  # 'user' or 'assistant'
    content: str
    timestamp: datetime
    metadata: Optional[Dict[str, Any]] = None

class ConversationalAIVet:
    """
    Conversational AI Vet Assistant with memory and context retention
    
    Features:
    - Conversation memory and context retention
    - Pet information extraction and storage
    - Session management
    - Natural conversation flow
    - Integration with Enhanced AI Vet
    """
    
    def __init__(self, mongo_manager: MongoDBManager, redis_manager: RedisManager):
        self.name = "Dr. Salus AI"
        self.mongo_manager = mongo_manager
        self.redis_manager = redis_manager
        
        # Conversation state
        self.chat_history: List[ChatMessage] = []
        self.pet_profile = PetProfile()
        self.conversation_stage = "greeting"  # greeting, gathering_info, consultation, follow_up
        self.session_start = datetime.utcnow()
        
        # Information gathering flags
        self.info_needed = {
            "species": True,
            "breed": True,
            "age": True,
            "symptoms": True
        }
        
        # Conversation patterns
        self.greeting_patterns = [
            r"\b(hi|hello|hey|good morning|good afternoon|good evening)\b",
            r"\b(start|begin|help)\b"
        ]
        
        self.species_patterns = [
            r"\b(dog|puppy|canine)\b",
            r"\b(cat|kitten|feline)\b",
            r"\b(bird|parrot|canary)\b",
            r"\b(rabbit|bunny)\b",
            r"\b(hamster|guinea pig|gerbil)\b",
            r"\b(fish|goldfish)\b",
            r"\b(reptile|snake|lizard|turtle)\b"
        ]
        
        self.age_patterns = [
            r"\b(\d+)\s*(year|yr|month|mo|week|wk|day|old)\b",
            r"\b(\d+)\s*(years?|months?|weeks?|days?)\s*old\b",
            r"\b(puppy|kitten|baby|young|adult|senior|elderly)\b"
        ]
        
        self.breed_patterns = [
            r"\b(german shepherd|golden retriever|labrador|poodle|bulldog|beagle|rottweiler|doberman|boxer|siberian husky)\b",
            r"\b(persian|siamese|maine coon|ragdoll|british shorthair|scottish fold|bengal|sphynx)\b"
        ]
        
        self.symptom_patterns = [
            r"\b(vomiting|throwing up|puking)\b",
            r"\b(diarrhea|loose stool|runny poop)\b",
            r"\b(lethargy|tired|sleepy|not active)\b",
            r"\b(not eating|loss of appetite|refusing food)\b",
            r"\b(limping|lameness|favoring leg)\b",
            r"\b(coughing|sneezing|wheezing)\b",
            r"\b(itching|scratching|rubbing)\b",
            r"\b(pain|hurting|sore)\b",
            r"\b(swelling|lump|bump)\b",
            r"\b(bleeding|blood|injury)\b"
        ]

    async def initialize(self):
        """Initialize the conversational AI"""
        try:
            # Initialize the enhanced AI vet
            if not enhanced_ai_vet.is_initialized:
                await enhanced_ai_vet.initialize()
            
            print("Conversational AI Vet initialized successfully")
            return True
        except Exception as e:
            print(f"Error initializing Conversational AI: {str(e)}")
            return False

    def is_ready(self) -> bool:
        """Check if the AI is ready"""
        return enhanced_ai_vet.is_initialized

    async def chat(self, message: str) -> str:
        """
        Main chat method with conversation memory and context
        """
        try:
            # Add user message to history
            user_msg = ChatMessage(
                id=f"user_{datetime.utcnow().timestamp()}",
                type="user",
                content=message,
                timestamp=datetime.utcnow()
            )
            self.chat_history.append(user_msg)
            
            # Extract pet information from the message
            self._extract_pet_information(message)
            
            # Determine conversation stage
            self._update_conversation_stage(message)
            
            # Generate contextual response
            response = await self._generate_contextual_response(message)
            
            # Add AI response to history
            ai_msg = ChatMessage(
                id=f"ai_{datetime.utcnow().timestamp()}",
                type="assistant",
                content=response,
                timestamp=datetime.utcnow()
            )
            self.chat_history.append(ai_msg)
            
            return response
            
        except Exception as e:
            print(f"Error in chat: {str(e)}")
            return "I'm sorry, I'm having trouble processing your message. Please try again."

    def _extract_pet_information(self, message: str):
        """Extract pet information from user message"""
        message_lower = message.lower()
        
        # Extract species
        for pattern in self.species_patterns:
            match = re.search(pattern, message_lower)
            if match:
                species = match.group(1)
                if species in ["dog", "puppy", "canine"]:
                    self.pet_profile.species = "dog"
                elif species in ["cat", "kitten", "feline"]:
                    self.pet_profile.species = "cat"
                elif species in ["bird", "parrot", "canary"]:
                    self.pet_profile.species = "bird"
                elif species in ["rabbit", "bunny"]:
                    self.pet_profile.species = "rabbit"
                elif species in ["hamster", "guinea pig", "gerbil"]:
                    self.pet_profile.species = "small mammal"
                elif species in ["fish", "goldfish"]:
                    self.pet_profile.species = "fish"
                elif species in ["reptile", "snake", "lizard", "turtle"]:
                    self.pet_profile.species = "reptile"
                self.info_needed["species"] = False
                break
        
        # If we have a breed but no species, infer species from breed
        if not self.pet_profile.species and self.pet_profile.breed:
            # Common dog breeds
            dog_breeds = ["german shepherd", "golden retriever", "labrador", "poodle", "bulldog", "beagle", "rottweiler", "doberman", "boxer", "siberian husky"]
            # Common cat breeds  
            cat_breeds = ["persian", "siamese", "maine coon", "ragdoll", "british shorthair", "scottish fold", "bengal", "sphynx"]
            
            if any(breed in self.pet_profile.breed.lower() for breed in dog_breeds):
                self.pet_profile.species = "dog"
                self.info_needed["species"] = False
            elif any(breed in self.pet_profile.breed.lower() for breed in cat_breeds):
                self.pet_profile.species = "cat"
                self.info_needed["species"] = False
        
        # Extract age
        for pattern in self.age_patterns:
            match = re.search(pattern, message_lower)
            if match:
                age_text = match.group(0)
                self.pet_profile.age = age_text
                self.info_needed["age"] = False
                break
        
        # Extract breed
        for pattern in self.breed_patterns:
            match = re.search(pattern, message_lower)
            if match:
                breed = match.group(1)
                self.pet_profile.breed = breed
                self.info_needed["breed"] = False
                break
        
        # Extract symptoms
        symptoms_found = []
        for pattern in self.symptom_patterns:
            match = re.search(pattern, message_lower)
            if match:
                symptoms_found.append(match.group(1))
        
        if symptoms_found:
            self.info_needed["symptoms"] = False

    def _update_conversation_stage(self, message: str):
        """Update conversation stage based on current state"""
        message_lower = message.lower()
        
        # Check for greeting
        if any(re.search(pattern, message_lower) for pattern in self.greeting_patterns):
            self.conversation_stage = "greeting"
        
        # Check if we have basic pet info
        elif self.pet_profile.is_complete() and not self.info_needed["symptoms"]:
            self.conversation_stage = "consultation"
        elif self.pet_profile.is_complete():
            self.conversation_stage = "gathering_symptoms"
        else:
            self.conversation_stage = "gathering_info"

    async def _generate_contextual_response(self, message: str) -> str:
        """Generate contextual response based on conversation stage and history"""
        
        # Get conversation context
        context = self._get_conversation_context()
        
        # Build enhanced query with context
        enhanced_query = f"""
        Conversation Context: {context}
        Current Message: {message}
        Pet Profile: {self.pet_profile.get_summary()}
        Conversation Stage: {self.conversation_stage}
        """
        
        # Get response from enhanced AI vet
        pet_info = {
            "species": self.pet_profile.species,
            "breed": self.pet_profile.breed,
            "age": self.pet_profile.age,
            "weight": self.pet_profile.weight,
            "gender": self.pet_profile.gender,
            "name": self.pet_profile.name
        }
        
        response = await enhanced_ai_vet.process_user_query(
            user_id="conversational_user",
            query=enhanced_query,
            pet_info=pet_info
        )
        
        # Add conversation flow logic
        response = self._enhance_response_with_conversation_flow(response, message)
        
        return response

    def _get_conversation_context(self) -> str:
        """Get conversation context from chat history"""
        if len(self.chat_history) <= 2:  # Only current exchange
            return "This is the beginning of our conversation."
        
        # Get last few exchanges for context
        recent_messages = self.chat_history[-6:]  # Last 3 exchanges
        context_parts = []
        
        for msg in recent_messages:
            if msg.type == "user":
                context_parts.append(f"User: {msg.content}")
            else:
                context_parts.append(f"AI: {msg.content}")
        
        return "Recent conversation: " + " | ".join(context_parts)

    def _enhance_response_with_conversation_flow(self, response: str, message: str) -> str:
        """Enhance response with conversation flow logic"""
        
        # If we're still gathering information, add specific prompts
        if self.conversation_stage == "gathering_info":
            missing_info = []
            if self.info_needed["species"]:
                missing_info.append("What type of pet do you have? (dog, cat, bird, etc.)")
            if self.info_needed["breed"]:
                missing_info.append("What breed is your pet?")
            if self.info_needed["age"]:
                missing_info.append("How old is your pet?")
            
            if missing_info:
                response += f"\n\nTo give you the best advice, I still need to know: {' • '.join(missing_info)}"
        
        elif self.conversation_stage == "gathering_symptoms":
            if self.info_needed["symptoms"]:
                response += "\n\nWhat symptoms or concerns are you noticing with your pet?"
        
        # Add pet profile acknowledgment if we have info
        if self.pet_profile.is_complete():
            response = f"Thank you for providing information about your {self.pet_profile.species} ({self.pet_profile.breed}, {self.pet_profile.age}). " + response
        
        return response

    async def save_session_to_redis(self, session_key: str):
        """Save current session state to Redis"""
        try:
            session_data = {
                "pet_profile": self.pet_profile.to_dict(),
                "conversation_stage": self.conversation_stage,
                "info_needed": self.info_needed,
                "session_start": self.session_start.isoformat(),
                "chat_history": [
                    {
                        "id": msg.id,
                        "type": msg.type,
                        "content": msg.content,
                        "timestamp": msg.timestamp.isoformat(),
                        "metadata": msg.metadata
                    }
                    for msg in self.chat_history
                ]
            }
            
            await self.redis_manager.redis_client.setex(
                f"session:{session_key}",
                3600,  # 1 hour TTL
                json.dumps(session_data)
            )
            
        except Exception as e:
            print(f"Error saving session to Redis: {str(e)}")

    async def load_session_from_redis(self, session_key: str) -> bool:
        """Load session state from Redis"""
        try:
            session_data = await self.redis_manager.redis_client.get(f"session:{session_key}")
            
            if not session_data:
                return False
            
            data = json.loads(session_data)
            
            # Restore pet profile
            self.pet_profile = PetProfile(**data.get("pet_profile", {}))
            
            # Restore conversation state
            self.conversation_stage = data.get("conversation_stage", "greeting")
            self.info_needed = data.get("info_needed", {
                "species": True,
                "breed": True,
                "age": True,
                "symptoms": True
            })
            
            # Restore chat history
            self.chat_history = []
            for msg_data in data.get("chat_history", []):
                msg = ChatMessage(
                    id=msg_data["id"],
                    type=msg_data["type"],
                    content=msg_data["content"],
                    timestamp=datetime.fromisoformat(msg_data["timestamp"]),
                    metadata=msg_data.get("metadata")
                )
                self.chat_history.append(msg)
            
            # Restore session start
            self.session_start = datetime.fromisoformat(data.get("session_start", datetime.utcnow().isoformat()))
            
            return True
            
        except Exception as e:
            print(f"Error loading session from Redis: {str(e)}")
            return False

    def get_profile(self) -> str:
        """Get current pet profile summary"""
        return self.pet_profile.get_summary()

    def get_chat_history_from_databases(self, session_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Get chat history from databases"""
        # For now, return current chat history
        return [
            {
                "id": msg.id,
                "type": msg.type,
                "content": msg.content,
                "timestamp": msg.timestamp.isoformat(),
                "metadata": msg.metadata
            }
            for msg in self.chat_history[-limit:]
        ]

    async def get_user_sessions(self, user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get user's chat sessions"""
        # For temporary sessions, return current session info
        return [{
            "session_id": f"temp_session_{user_id}",
            "start_time": self.session_start.isoformat(),
            "message_count": len(self.chat_history),
            "pet_profile": self.pet_profile.to_dict()
        }]

    async def end_session(self, user_id: str, session_id: str) -> bool:
        """End a chat session"""
        try:
            # Clear current session data
            self.chat_history = []
            self.pet_profile = PetProfile()
            self.conversation_stage = "greeting"
            self.info_needed = {
                "species": True,
                "breed": True,
                "age": True,
                "symptoms": True
            }
            self.session_start = datetime.utcnow()
            
            return True
        except Exception as e:
            print(f"Error ending session: {str(e)}")
            return False

    async def extend_session_ttl(self, user_id: str, session_id: str) -> bool:
        """Extend session TTL"""
        try:
            # Extend TTL for current session
            session_key = f"{user_id}_{session_id}"
            await self.save_session_to_redis(session_key)
            return True
        except Exception as e:
            print(f"Error extending session TTL: {str(e)}")
            return False
