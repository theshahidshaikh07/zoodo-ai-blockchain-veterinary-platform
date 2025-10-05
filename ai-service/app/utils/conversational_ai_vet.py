import os
import json
import asyncio
import httpx
import hashlib
import re
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, timedelta
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class PetProfile:
    """Stores animal information during the conversation"""
    def __init__(self):
        self.species = None  # Dog, Cat, Bird, Rabbit, Horse, Reptile, etc.
        self.breed = None
        self.age = None
        self.weight = None
        self.gender = None
        self.name = None
        self.medical_history = []
        self.current_symptoms = []
        self.medications = []
        
    def to_dict(self):
        return {
            "species": self.species,
            "breed": self.breed,
            "age": self.age,
            "weight": self.weight,
            "gender": self.gender,
            "name": self.name,
            "medical_history": self.medical_history,
            "current_symptoms": self.current_symptoms,
            "medications": self.medications
        }
    
    def get_summary(self):
        """Get a concise summary of animal profile"""
        info = []
        if self.name:
            info.append(f"Name: {self.name}")
        if self.species:
            info.append(f"Species: {self.species}")
        if self.breed:
            info.append(f"Breed/Type: {self.breed}")
        if self.age:
            info.append(f"Age: {self.age}")
        if self.weight:
            info.append(f"Weight: {self.weight}")
        if self.gender:
            info.append(f"Gender: {self.gender}")
        return " | ".join(info) if info else "No animal information gathered yet"

class LocationManager:
    """Manages user location for worldwide vet recommendations"""
    def __init__(self):
        self.city = None
        self.country = None
        self.latitude = None
        self.longitude = None
        self.location_set = False
        
    def set_location(self, city, country):
        """Manually set location"""
        self.city = city
        self.country = country
        self.location_set = True
        return f"📍 Location set to: {city}, {country}"
    
    def get_location_string(self):
        """Get formatted location string"""
        if self.location_set:
            return f"{self.city}, {self.country}"
        return "Location not set"
    
    def suggest_google_search(self, service_type="veterinarian"):
        """Suggest Google search queries for local services"""
        if not self.location_set:
            return f"Please set your location first to get recommendations.\nUse: location [city] [country]"
        
        searches = []
        base_location = f"{self.city}, {self.country}"
        
        if service_type == "emergency":
            searches.append(f"24 hour emergency veterinarian near {base_location}")
            searches.append(f"emergency animal hospital {self.city}")
            searches.append(f"after hours vet {self.city}")
        elif service_type == "specialist":
            searches.append(f"veterinary specialist {base_location}")
            searches.append(f"exotic animal vet {self.city}")
            searches.append(f"avian veterinarian {self.city}")
        else:
            searches.append(f"veterinarian near {base_location}")
            searches.append(f"animal hospital {self.city}")
            searches.append(f"vet clinic near me {self.city}")
        
        result = f"🔍 GOOGLE SEARCH SUGGESTIONS FOR {base_location.upper()}:\n"
        result += "─" * 60 + "\n\n"
        result += "Copy and search these on Google Maps or Google Search:\n\n"
        for i, search in enumerate(searches, 1):
            result += f"{i}. \"{search}\"\n"
        
        result += f"\n💡 TIP: On mobile, you can also search 'veterinarian near me' with location services on!"
        return result

class ConsultationTracker:
    """Tracks the consultation stage and what info has been gathered"""
    def __init__(self):
        self.stage = "initial"
        self.urgency_level = None
        self.symptom_onset = None
        self.info_gathered = {
            "species": False,
            "age": False,
            "breed": False,
            "duration": False,
            "severity": False,
            "behavior": False,
            "context": False
        }
        self.assessment_given = False
        
    def mark_gathered(self, info_type):
        if info_type in self.info_gathered:
            self.info_gathered[info_type] = True
    
    def next_needed_info(self):
        """Returns the next piece of info needed"""
        for key, gathered in self.info_gathered.items():
            if not gathered:
                return key
        return None
    
    def is_ready_for_assessment(self):
        """Check if we have enough info for assessment"""
        essential = ["species", "age", "duration", "severity"]
        return all(self.info_gathered.get(key, False) for key in essential)

class ConversationalAIVet:
    """
    Conversational AI Vet Assistant - Following the sample.py pattern
    Provides natural, step-by-step veterinary consultations
    """
    
    def __init__(self, mongo_manager=None, redis_manager=None):
        self.name = "Dr. Salus AI"
        self.is_initialized = False
        self.llm = None
        self.mongo_manager = mongo_manager
        self.redis_manager = redis_manager
        
        # Configuration
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        self.model_name = os.getenv("AI_MODEL_NAME", "gemini-pro")
        self.backend_url = os.getenv("BACKEND_URL", "http://localhost:8080")
        
        # Conversation state
        self.chat_history = []
        self.pet_profile = PetProfile()
        self.consultation = ConsultationTracker()
        self.location = LocationManager()
        self.follow_up_reminders = []
        self.session_start = datetime.now()
        
        # Emergency keywords
        self.emergency_keywords = [
            "seizure", "not breathing", "blood", "choking", "critical",
            "unconscious", "collapse", "severe bleeding", "difficulty breathing",
            "emergency", "urgent", "dying", "dead", "heart attack", "stroke",
            "not responding", "blue tongue", "pale gums", "shock", "trauma"
        ]

    async def initialize(self):
        """Initialize the AI Vet Assistant"""
        try:
            # Initialize Google Gemini
            if self.google_api_key:
                self.llm = ChatGoogleGenerativeAI(
                    model=self.model_name,
                    google_api_key=self.google_api_key,
                    temperature=0.7,
                    max_output_tokens=1000
                )
                print(f"✅ {self.name} initialized with Google Gemini")
            else:
                print(f"⚠️  No Google API key configured, using rule-based mode")
                self.llm = None
                
            self.is_initialized = True
            print(f"✅ {self.name} initialized successfully")
            
        except Exception as e:
            print(f"❌ Error initializing {self.name}: {str(e)}")
            print(f"⚠️  Falling back to rule-based mode")
            self.llm = None
            self.is_initialized = True

    def _create_system_prompt(self):
        """Creates comprehensive system prompt for Dr. SALUS AI"""
        return """You are Dr. SALUS AI, a compassionate and experienced veterinarian specializing in ALL ANIMAL SPECIES - from common pets to exotic animals, livestock, and wildlife. You provide worldwide veterinary guidance and adapt to any location.

🌍 YOUR GLOBAL SCOPE:
- You work with ALL animal species: mammals, birds, reptiles, amphibians, fish, exotic pets, livestock, equines
- You provide guidance for pet owners WORLDWIDE - any country, any city
- You adapt your advice to local conditions, climate, and regional diseases
- You suggest location-specific resources through Google search recommendations

🐾 SPECIES YOU ASSIST WITH (Not Limited To):
COMPANION ANIMALS: Dogs, Cats, Rabbits, Guinea Pigs, Hamsters, Gerbils, Ferrets, Hedgehogs
BIRDS: Parrots, Parakeets, Cockatiels, Budgies, Finches, Canaries, Chickens, Ducks
REPTILES: Turtles, Tortoises, Snakes, Lizards, Geckos, Iguanas, Bearded Dragons
EQUINES: Horses, Ponies, Donkeys, Mules
LIVESTOCK: Cattle, Goats, Sheep, Pigs
EXOTIC: Chinchillas, Sugar Gliders, Llamas, Alpacas
AQUATIC: Fish, Amphibians
+ ANY OTHER ANIMAL SPECIES

🎯 YOUR CORE IDENTITY:
- You're a warm, friendly vet who has real conversations - not robotic Q&A
- You NEVER overwhelm owners with long messages or bullet-pointed lists unless they ask
- You ask ONE or TWO questions at a time, like a real vet consultation
- You're genuinely curious about each animal and their unique situation
- You acknowledge species-specific needs and behaviors

🧠 YOUR CONSULTATION METHODOLOGY:

**CRITICAL: GRADUAL INFORMATION GATHERING**
When a health concern is mentioned, gather information step-by-step:

STAGE 1 - IMMEDIATE TRIAGE (First Response):
- Acknowledge their concern warmly with empathy
- Check if it's an EMERGENCY (see red flags below)
- If emergency: Give urgent warning and immediate action steps
- If not emergency: Ask for the SPECIES first (this is ALWAYS your first question for unknown animals)

STAGE 2 - AGE & TYPE (After species is known):
- Ask for AGE: "How old is your [species]?"
- For certain species, ask for BREED/TYPE: "What type/breed of [species]?"

STAGE 3 - SYMPTOM DETAILS (After age is known):
- Ask about symptom DURATION: "How long has this been going on?"
- Keep responses short and focused

STAGE 4 - SYMPTOM SEVERITY (After duration is known):
- Ask about INTENSITY: "How severe would you say it is?" or "Is it constant or comes and goes?"
- Stay focused on one aspect at a time

STAGE 5 - BEHAVIORAL CHANGES (After severity is assessed):
- Ask species-appropriate behavior questions:
  * Eating/drinking habits
  * Activity level/energy
  * Bathroom habits
  * Social behavior changes
- Pick ONE most relevant question

STAGE 6 - CONTEXT (After key symptoms understood):
- Ask about RECENT CHANGES: "Any new food, environment changes, or unusual incidents?"
- Or MEDICAL HISTORY: "Any existing health conditions I should know about?"

STAGE 7 - ASSESSMENT & ADVICE (Only after sufficient information):
- Provide brief assessment (2-3 sentences max)
- Give IMMEDIATE ACTION STEPS (3-4 clear, short points)
- State URGENCY LEVEL clearly
- Mention species-specific considerations
- Ask if they want more specific guidance

STAGE 8 - LOCAL RESOURCES (If they need vet recommendations):
- Ask for their LOCATION (city and country) if not provided
- Suggest specific Google search queries for local vets
- Recommend emergency clinics if urgent
- Suggest specialists for exotic animals if needed

🚨 EMERGENCY RED FLAGS - SPECIES-SPECIFIC:

UNIVERSAL EMERGENCIES (All Animals):
- Difficulty breathing, choking, gasping for air
- Uncontrolled bleeding or deep wounds
- Suspected poisoning (chemicals, toxic foods, plants)
- Seizures, collapse, or loss of consciousness
- Severe trauma from accident or attack
- Unable to move or stand

MAMMALS (Dogs, Cats, Rabbits, etc.):
- Bloated, hard belly (GDV risk especially in large dogs)
- Can't urinate or defecate (especially male cats - blockage)
- Heatstroke (excessive panting, drooling, weakness)
- Pale gums, extreme lethargy
- Severe vomiting/diarrhea with blood
- Eye injuries or sudden blindness

BIRDS:
- Difficulty breathing, tail bobbing
- Fluffed up, sitting at bottom of cage
- Blood in droppings
- Stopped eating for 12+ hours (birds have fast metabolism)
- Trauma, broken wings/legs
- Egg binding (in females)

REPTILES:
- Not moving, cold body temperature
- Prolapsed organs
- Severe burns from heat lamp
- Not eating for extended period (varies by species)
- Mouth rot, respiratory infections
- Impaction

HORSES/LIVESTOCK:
- Colic symptoms (rolling, pawing, distress)
- Laminitis signs (reluctant to move, hot hooves)
- Down and can't get up
- Severe lameness
- Choking
- Birth complications

EMERGENCY RESPONSE FORMAT:
"⚠️ EMERGENCY - This sounds serious. [Symptom] in [species] can be life-threatening. You need to get to a vet IMMEDIATELY. [Brief first aid if applicable]. What's your location so I can help you find an emergency vet?"

💬 COMMUNICATION STYLE - CRITICAL RULES:

1. **BE CONVERSATIONAL**: Talk like you're in a clinic consultation
2. **ONE STEP AT A TIME**: Ask 1-2 questions maximum per response
3. **SHORT RESPONSES**: Keep responses to 2-4 sentences unless giving final assessment
4. **NO BULLET LISTS** during information gathering
5. **NATURAL FLOW**: Use phrases like "Got it," "I see," "That helps," "Okay," "Thanks"
6. **EMPATHY FIRST**: Always acknowledge feelings before asking next question
7. **EXPLAIN WHY**: Briefly mention why you're asking
8. **SPECIES-AWARE**: Acknowledge the specific animal's needs
9. **NEVER BE DISMISSIVE**: Never say "what else can I help with" or "alright" dismissively
10. **STAY FOCUSED**: Keep the conversation on the pet's health until resolved

🎯 KEY PRINCIPLES:

1. **SPECIES-FIRST**: Always know what animal you're dealing with
2. **PATIENCE**: Never rush to conclusions
3. **CLARITY**: One focus per message
4. **WARMTH**: Show you care about their animal
5. **SAFETY**: When in doubt, recommend vet visit
6. **EDUCATION**: Briefly explain species-specific needs
7. **GLOBAL**: Adapt to any location worldwide
8. **INCLUSIVE**: Every animal deserves expert care
9. **COMPLETE CONSULTATIONS**: Don't end conversations prematurely
10. **FOLLOW THROUGH**: Always provide assessment and next steps

**CONVERSATION EXAMPLES:**

GOOD RESPONSE:
"my dog is not eating"
→ "I understand your concern - appetite changes in dogs definitely need attention. First, how old is your dog?"

BAD RESPONSE:
"my dog is not eating"  
→ "I'm sorry to hear that. How long has your dog not been eating for?"

GOOD FOLLOW-UP:
"2 days"
→ "Got it, so this has been going on for 2 days. And how old is your dog? This helps me understand if it's a puppy, adult, or senior dog."

BAD FOLLOW-UP:
"2 days"
→ "And have you noticed any other symptoms or changes in their behavior since then?"

Remember: You're building a relationship through conversation. Each question should feel natural and necessary. You serve ALL animals, EVERYWHERE in the world."""

    def start_conversation(self):
        """Initialize chat with greeting"""
        greeting = """🌍 Hello! I'm Dr. SALUS AI, your global veterinary assistant for ALL animals.

From dogs and cats to birds, reptiles, horses, livestock, and exotic pets - I'm here to help animals worldwide.

What animal companion brings you here today?"""
        
        self.chat_history.append({
            "role": "model",
            "parts": [greeting]
        })
        return greeting

    def _extract_animal_info(self, user_message, ai_response):
        """Extract and store animal information from conversation"""
        message_lower = user_message.lower()
        
        # Extract species - comprehensive list
        species_keywords = {
            'dog': 'Dog', 'puppy': 'Dog', 'canine': 'Dog',
            'cat': 'Cat', 'kitten': 'Cat', 'feline': 'Cat',
            'bird': 'Bird', 'parrot': 'Parrot', 'parakeet': 'Parakeet', 'cockatiel': 'Cockatiel', 
            'budgie': 'Budgerigar', 'finch': 'Finch', 'canary': 'Canary', 'lovebird': 'Lovebird',
            'rabbit': 'Rabbit', 'bunny': 'Rabbit',
            'guinea pig': 'Guinea Pig', 'hamster': 'Hamster', 'gerbil': 'Gerbil', 'mouse': 'Mouse', 'rat': 'Rat',
            'horse': 'Horse', 'pony': 'Pony', 'mare': 'Horse', 'stallion': 'Horse', 'foal': 'Horse',
            'cow': 'Cattle', 'cattle': 'Cattle', 'bull': 'Cattle', 'calf': 'Cattle',
            'goat': 'Goat', 'sheep': 'Sheep', 'lamb': 'Sheep', 'pig': 'Pig', 'piglet': 'Pig',
            'chicken': 'Chicken', 'rooster': 'Chicken', 'hen': 'Chicken', 'duck': 'Duck', 'goose': 'Goose',
            'turtle': 'Turtle', 'tortoise': 'Tortoise', 'snake': 'Snake', 'lizard': 'Lizard', 
            'gecko': 'Gecko', 'iguana': 'Iguana', 'bearded dragon': 'Bearded Dragon',
            'fish': 'Fish', 'goldfish': 'Goldfish', 'betta': 'Betta Fish',
            'ferret': 'Ferret', 'hedgehog': 'Hedgehog', 'chinchilla': 'Chinchilla',
            'llama': 'Llama', 'alpaca': 'Alpaca', 'donkey': 'Donkey', 'mule': 'Mule'
        }
        
        for keyword, species in species_keywords.items():
            if keyword in message_lower and not self.pet_profile.species:
                self.pet_profile.species = species
                self.consultation.mark_gathered("species")
                break
        
        # Extract age
        age_patterns = [
            r'(\d+)\s*(?:year|yr|month|mo|week|day)s?\s*old',
            r'(?:he|she|it)(?:\'s|\s+is)\s*(\d+)',
            r'age\s*(?:is\s*)?(\d+)'
        ]
        for pattern in age_patterns:
            match = re.search(pattern, message_lower)
            if match and not self.pet_profile.age:
                age_num = match.group(1)
                if "year" in message_lower or "yr" in message_lower:
                    self.pet_profile.age = f"{age_num} years"
                elif "month" in message_lower or "mo" in message_lower:
                    self.pet_profile.age = f"{age_num} months"
                elif "week" in message_lower:
                    self.pet_profile.age = f"{age_num} weeks"
                elif "day" in message_lower:
                    self.pet_profile.age = f"{age_num} days"
                else:
                    self.pet_profile.age = f"{age_num} years"
                self.consultation.mark_gathered("age")
                break
        
        # Extract breed/type (more flexible for all animals)
        if ' breed' in message_lower or 'type of' in message_lower:
            words = user_message.split()
            for i, word in enumerate(words):
                if word.lower() in ['breed', 'type'] and i > 0:
                    potential_breed = ' '.join(words[max(0, i-3):i])
                    if potential_breed and not self.pet_profile.breed:
                        self.pet_profile.breed = potential_breed.strip()
                        self.consultation.mark_gathered("breed")
        
        # Extract name
        name_patterns = [
            r'(?:name is|named|called)\s+([A-Z][a-z]+)',
            r'(?:his|her|my)\s+name\s+is\s+([A-Z][a-z]+)',
            r'(?:this is|meet)\s+([A-Z][a-z]+)'
        ]
        for pattern in name_patterns:
            match = re.search(pattern, user_message)
            if match and not self.pet_profile.name:
                self.pet_profile.name = match.group(1)
                break
        
        # Extract duration
        duration_patterns = [
            r'(?:since|for)\s+(\d+)\s+(day|week|month|hour)s?',
            r'(\d+)\s+(day|week|month|hour)s?\s+(?:ago|back)',
            r'(?:since\s+)?(?:yesterday|today|this morning|last night)'
        ]
        for pattern in duration_patterns:
            match = re.search(pattern, message_lower)
            if match and not self.consultation.symptom_onset:
                if match.lastindex == 2:
                    num = match.group(1)
                    unit = match.group(2)
                    self.consultation.symptom_onset = f"{num} {unit}{'s' if int(num) > 1 else ''}"
                else:
                    self.consultation.symptom_onset = match.group(0)
                self.consultation.mark_gathered("duration")
                break

    def _build_context(self, user_message):
        """Build context with system prompt, animal profile, and conversation history"""
        full_prompt = f"{self._create_system_prompt()}\n\n"
        full_prompt += f"Current Date: {datetime.now().strftime('%Y-%m-%d')}\n"
        full_prompt += f"Current Day: {datetime.now().strftime('%A')}\n"
        full_prompt += f"Current Time: {datetime.now().strftime('%I:%M %p')}\n"
        
        if self.location.location_set:
            full_prompt += f"User Location: {self.location.get_location_string()}\n"
        else:
            full_prompt += "User Location: Not specified yet (ask if needed for vet recommendations)\n"
        
        full_prompt += f"Session Duration: {(datetime.now() - self.session_start).seconds // 60} minutes\n\n"
        
        # Add animal profile if available
        if any([self.pet_profile.age, self.pet_profile.breed, self.pet_profile.species, self.pet_profile.name]):
            full_prompt += "--- ANIMAL PROFILE (GATHERED SO FAR) ---\n"
            full_prompt += f"{self.pet_profile.get_summary()}\n\n"
        
        # Add consultation tracker info
        if self.consultation.symptom_onset:
            full_prompt += f"Symptom Duration: {self.consultation.symptom_onset}\n"
        
        next_info = self.consultation.next_needed_info()
        if next_info and not self.consultation.assessment_given:
            full_prompt += f"⚡ NEXT TO ASK: {next_info.upper()}\n\n"
        
        # Add recent chat history
        full_prompt += "--- CONVERSATION SO FAR ---\n"
        recent_history = self.chat_history[-16:] if len(self.chat_history) > 16 else self.chat_history
        for msg in recent_history:
            role = "Owner" if msg["role"] == "user" else "Dr. SALUS"
            full_prompt += f"{role}: {msg['parts'][0]}\n"
        
        full_prompt += f"\n--- NEW MESSAGE ---\nOwner: {user_message}\n\n"
        
        # Add specific conversation stage guidance
        if not self.pet_profile.species and any(word in user_message.lower() for word in ["dog", "cat", "bird", "rabbit", "hamster", "fish", "reptile", "horse", "cow", "pet", "animal"]):
            full_prompt += "Dr. SALUS: You should ask for the SPECIES first. Say something like 'What type of animal are we talking about?' or 'Is this a dog, cat, or other animal?'\n"
        elif self.pet_profile.species and not self.pet_profile.age:
            full_prompt += f"Dr. SALUS: You should ask for the AGE. Say something like 'How old is your {self.pet_profile.species}?'\n"
        elif self.pet_profile.species and self.pet_profile.age and not self.consultation.symptom_onset:
            full_prompt += f"Dr. SALUS: You should ask about DURATION. Say something like 'How long has this been going on?'\n"
        elif self.consultation.is_ready_for_assessment():
            full_prompt += "Dr. SALUS: You have enough information. Provide assessment and recommendations now.\n"
        else:
            full_prompt += "Dr. SALUS: Continue gathering information step by step. Ask ONE question at a time.\n"
        
        full_prompt += "\nRemember: SHORT and conversational. ONE or TWO questions max. Be warm, species-aware, and genuine. NEVER repeat questions already asked."
        
        return full_prompt

    async def chat(self, user_message):
        """Send message and get response"""
        try:
            # Check for emergency keywords first
            if self._contains_emergency_keywords(user_message):
                return await self._handle_emergency_response(user_message)
            
            self.chat_history.append({
                "role": "user",
                "parts": [user_message]
            })
            
            if not self.llm:
                # Fallback to rule-based response
                ai_response = self._generate_rule_based_response(user_message)
            else:
                full_context = self._build_context(user_message)
                response = await self.llm.ainvoke(full_context)
                ai_response = response.content.strip() if hasattr(response, 'content') else str(response).strip()
            
            # Extract animal information
            self._extract_animal_info(user_message, ai_response)
            
            self.chat_history.append({
                "role": "model",
                "parts": [ai_response]
            })
            
            return ai_response
            
        except Exception as e:
            error_msg = f"I apologize, but I encountered an error: {str(e)}. Please try again."
            return error_msg

    def _contains_emergency_keywords(self, query: str) -> bool:
        """Check if query contains emergency keywords"""
        query_lower = query.lower()
        return any(keyword in query_lower for keyword in self.emergency_keywords)

    async def _handle_emergency_response(self, user_message):
        """Handle emergency cases with immediate escalation"""
        emergency_response = f"⚠️ EMERGENCY - This sounds serious and requires immediate veterinary attention. "
        emergency_response += f"Please get to an emergency vet clinic right away. "
        emergency_response += f"What's your location so I can help you find the nearest emergency clinic?"
        
        # Log emergency case
        if self.redis_manager:
            await self.redis_manager.add_to_emergency_queue({
                "user_message": user_message,
                "pet_info": self.pet_profile.to_dict(),
                "location": self.location.get_location_string(),
                "timestamp": datetime.utcnow().isoformat()
            })
        
        return emergency_response

    def _generate_rule_based_response(self, user_message):
        """Generate rule-based response when AI is not available"""
        message_lower = user_message.lower()
        
        # Check if it's a greeting
        if any(word in message_lower for word in ["hello", "hi", "hey", "start"]):
            return "Hello! I'm Dr. Salus AI, your virtual veterinary assistant. What animal are you concerned about today?"
        
        # Check for "not eating" specifically - this is the main issue from the user's example
        if "not eating" in message_lower or "won't eat" in message_lower or "refusing food" in message_lower:
            if not self.pet_profile.species:
                return "I understand your concern - appetite changes definitely need attention. What type of animal are we talking about?"
            elif not self.pet_profile.age:
                return f"I see you're worried about your {self.pet_profile.species} not eating. How old is your {self.pet_profile.species}? This helps me understand if it's a young animal, adult, or senior."
            elif not self.consultation.symptom_onset:
                return f"Got it, so your {self.pet_profile.age} year old {self.pet_profile.species} is not eating. How long has this been going on?"
            elif not self.consultation.info_gathered.get("drinking"):
                return f"I see your {self.pet_profile.species} hasn't been eating for {self.consultation.symptom_onset}. Is your {self.pet_profile.species} still drinking water normally?"
            elif not self.consultation.info_gathered.get("energy"):
                return f"That's good that they're still drinking water. What's your {self.pet_profile.species}'s energy level like? Are they acting normal otherwise?"
            else:
                # Ready for assessment
                return f"Based on what you've told me about your {self.pet_profile.age} year old {self.pet_profile.species} - not eating for {self.consultation.symptom_onset} but still drinking water - this could indicate several things. Here's what I recommend:\n\n- Monitor their energy level and behavior closely\n- Try offering their favorite food or treats\n- If they continue not eating or show other symptoms, see a vet within 24-48 hours\n\nWhat's their energy level like? Are they acting normal otherwise?"
        
        # Check if they're providing age information
        if any(word in message_lower for word in ["year", "month", "week", "old", "puppy", "kitten", "adult", "senior"]):
            if self.pet_profile.species and not self.pet_profile.age:
                return f"Got it, so your {self.pet_profile.species} is {user_message}. What symptoms or concerns are you noticing?"
            else:
                return "Thanks for that information. What symptoms or health concerns are you noticing with your pet?"
        
        # Check if they're providing species information
        if any(word in message_lower for word in ["dog", "cat", "bird", "rabbit", "hamster", "fish", "reptile", "horse", "cow"]):
            if not self.pet_profile.species:
                return f"I understand you have a {user_message}. How old is your {user_message}? This helps me provide age-appropriate advice."
            else:
                return f"I see you're concerned about your {self.pet_profile.species}. What specific symptoms or behaviors are you observing?"
        
        # Check if they're providing duration information
        if any(word in message_lower for word in ["day", "week", "month", "hour", "since", "ago", "yesterday", "today"]):
            if self.pet_profile.species and self.pet_profile.age:
                return f"Got it, so this has been going on for {user_message}. What's your {self.pet_profile.species}'s energy level like? Are they acting normal otherwise?"
            else:
                return "Thanks for that information. What type of animal are we talking about, and how old are they?"
        
        # Check for drinking water responses
        if "drinking" in message_lower or "water" in message_lower:
            if "yes" in message_lower or "still" in message_lower:
                self.consultation.info_gathered["drinking"] = True
                return f"That's good that they're still drinking water. What's your {self.pet_profile.species}'s energy level like? Are they acting normal otherwise?"
            else:
                self.consultation.info_gathered["drinking"] = False
                return f"That's concerning - not drinking water is more serious. I recommend seeing a vet today. What's your location so I can help you find an emergency vet?"
        
        # Check for energy level responses
        if any(word in message_lower for word in ["energy", "lethargic", "tired", "sleepy", "active", "normal", "fine"]):
            self.consultation.info_gathered["energy"] = user_message
            if self.consultation.is_ready_for_assessment():
                return f"Based on what you've told me about your {self.pet_profile.age} year old {self.pet_profile.species} - not eating for {self.consultation.symptom_onset} but still drinking water and {user_message} energy level - here's what I recommend:\n\n- Monitor their condition closely\n- Try offering their favorite food\n- If symptoms worsen or persist, see a vet within 24-48 hours\n\nWould you like help finding a vet in your area?"
            else:
                return "Thanks for that information. Any other symptoms or changes you've noticed?"
        
        # Default response
        return "I'm here to help with your pet's health. Could you tell me what type of animal you're concerned about and what symptoms you're observing?"

    def get_profile(self):
        """Get detailed animal profile summary"""
        if not any([self.pet_profile.age, self.pet_profile.breed, self.pet_profile.species]):
            return "📋 No animal information gathered yet. Start chatting to build the profile!"
        
        summary = "📋 ANIMAL PROFILE:\n"
        summary += "─" * 40 + "\n"
        
        if self.pet_profile.name:
            summary += f"🐾 Name: {self.pet_profile.name}\n"
        if self.pet_profile.species:
            summary += f"🔹 Species: {self.pet_profile.species}\n"
        if self.pet_profile.breed:
            summary += f"🔹 Breed/Type: {self.pet_profile.breed}\n"
        if self.pet_profile.age:
            summary += f"🔹 Age: {self.pet_profile.age}\n"
        if self.pet_profile.weight:
            summary += f"🔹 Weight: {self.pet_profile.weight}\n"
        if self.pet_profile.gender:
            summary += f"🔹 Gender: {self.pet_profile.gender}\n"
        
        if self.location.location_set:
            summary += f"\n📍 Location: {self.location.get_location_string()}\n"
        
        return summary

    def find_vet(self, emergency=False):
        """Get Google search suggestions for finding vets"""
        if emergency:
            return self.location.suggest_google_search("emergency")
        else:
            return self.location.suggest_google_search("veterinarian")

    def find_specialist(self):
        """Find specialist vets for exotic animals"""
        return self.location.suggest_google_search("specialist")

    def set_reminder(self, reminder_text, days_from_now=7):
        """Set a follow-up reminder"""
        reminder_date = datetime.now() + timedelta(days=days_from_now)
        self.follow_up_reminders.append({
            "text": reminder_text,
            "date": reminder_date.strftime("%Y-%m-%d"),
            "created": datetime.now().strftime("%Y-%m-%d %H:%M")
        })
        return f"✅ Reminder set for {reminder_date.strftime('%B %d, %Y')}: {reminder_text}"

    def get_reminders(self):
        """Get all active reminders"""
        if not self.follow_up_reminders:
            return "📅 No reminders set yet."
        
        output = "📅 FOLLOW-UP REMINDERS:\n"
        output += "─" * 40 + "\n"
        for i, reminder in enumerate(self.follow_up_reminders, 1):
            output += f"{i}. {reminder['text']}\n"
            output += f"   Due: {reminder['date']}\n\n"
        return output

    def export_summary(self):
        """Export a human-readable consultation summary"""
        summary = []
        summary.append("=" * 60)
        summary.append("🏥 DR. SALUS AI - CONSULTATION SUMMARY")
        summary.append("=" * 60)
        summary.append(f"Date: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}")
        summary.append(f"Duration: {(datetime.now() - self.session_start).seconds // 60} minutes")
        summary.append("")
        
        summary.append(self.get_profile())
        summary.append("")
        summary.append("─" * 60)
        summary.append("Generated by Dr. SALUS AI | Global Veterinary Assistant")
        summary.append("Serving ALL animals, WORLDWIDE 🌍")
        summary.append("=" * 60)
        
        return "\n".join(summary)

    def is_ready(self) -> bool:
        """Check if AI Vet Assistant is ready"""
        return self.is_initialized

    async def save_session_to_redis(self, session_key: str):
        """Save session state to Redis for persistence"""
        if not self.redis_manager:
            return False
        
        try:
            session_data = {
                "pet_profile": self.pet_profile.to_dict(),
                "location": {
                    "city": self.location.city,
                    "country": self.location.country,
                    "location_set": self.location.location_set
                },
                "consultation": {
                    "stage": self.consultation.stage,
                    "urgency_level": self.consultation.urgency_level,
                    "symptom_onset": self.consultation.symptom_onset,
                    "info_gathered": self.consultation.info_gathered,
                    "assessment_given": self.consultation.assessment_given
                },
                "chat_history": self.chat_history[-10:],  # Keep last 10 messages
                "follow_up_reminders": self.follow_up_reminders,
                "session_start": self.session_start.isoformat()
            }
            
            await self.redis_manager.cache_ai_result(
                cache_key=f"session:{session_key}",
                result=session_data,
                ttl_seconds=86400  # 24 hours
            )
            return True
        except Exception as e:
            print(f"Error saving session to Redis: {e}")
            return False

    async def load_session_from_redis(self, session_key: str):
        """Load session state from Redis"""
        if not self.redis_manager:
            return False
        
        try:
            session_data = await self.redis_manager.get_cached_ai_result(f"session:{session_key}")
            if not session_data:
                return False
            
            # Restore pet profile
            if "pet_profile" in session_data:
                profile_data = session_data["pet_profile"]
                self.pet_profile.species = profile_data.get("species")
                self.pet_profile.breed = profile_data.get("breed")
                self.pet_profile.age = profile_data.get("age")
                self.pet_profile.weight = profile_data.get("weight")
                self.pet_profile.gender = profile_data.get("gender")
                self.pet_profile.name = profile_data.get("name")
                self.pet_profile.medical_history = profile_data.get("medical_history", [])
                self.pet_profile.current_symptoms = profile_data.get("current_symptoms", [])
                self.pet_profile.medications = profile_data.get("medications", [])
            
            # Restore location
            if "location" in session_data:
                loc_data = session_data["location"]
                self.location.city = loc_data.get("city")
                self.location.country = loc_data.get("country")
                self.location.location_set = loc_data.get("location_set", False)
            
            # Restore consultation state
            if "consultation" in session_data:
                cons_data = session_data["consultation"]
                self.consultation.stage = cons_data.get("stage", "initial")
                self.consultation.urgency_level = cons_data.get("urgency_level")
                self.consultation.symptom_onset = cons_data.get("symptom_onset")
                self.consultation.info_gathered = cons_data.get("info_gathered", {})
                self.consultation.assessment_given = cons_data.get("assessment_given", False)
            
            # Restore chat history
            if "chat_history" in session_data:
                self.chat_history = session_data["chat_history"]
            
            # Restore reminders
            if "follow_up_reminders" in session_data:
                self.follow_up_reminders = session_data["follow_up_reminders"]
            
            # Restore session start time
            if "session_start" in session_data:
                from datetime import datetime
                self.session_start = datetime.fromisoformat(session_data["session_start"])
            
            return True
        except Exception as e:
            print(f"Error loading session from Redis: {e}")
            return False

    async def close(self):
        """Close AI Vet Assistant"""
        if self.mongo_manager:
            await self.mongo_manager.close()
        if self.redis_manager:
            await self.redis_manager.close()
