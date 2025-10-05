import os
import json
import asyncio
import httpx
import hashlib
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, timedelta
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class AIVetAssistant:
    """
    AI Vet Assistant - Your Virtual Veterinary Doctor
    
    Features:
    - Symptom analysis and health advice
    - Vet recommendations based on location and symptoms
    - Diet and care suggestions
    - Emergency handling
    - Integration with Spring Boot backend
    - MongoDB/Redis data storage
    """
    
    def __init__(self):
        self.name = "Dr. Salus AI"  # AI Vet Assistant name
        self.is_initialized = False
        self.llm = None
        self.mongo_manager = None
        self.redis_manager = None
        
        # Configuration
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        self.model_name = os.getenv("AI_MODEL_NAME", "gemini-pro")
        self.backend_url = os.getenv("BACKEND_URL", "http://localhost:8080")
        
        # Emergency keywords that trigger immediate escalation
        self.emergency_keywords = [
            "seizure", "not breathing", "blood", "choking", "critical",
            "unconscious", "collapse", "severe bleeding", "difficulty breathing",
            "emergency", "urgent", "dying", "dead", "heart attack", "stroke",
            "not responding", "blue tongue", "pale gums", "shock", "trauma"
        ]
        
        # Vet-only topics - AI will refuse non-vet questions
        self.vet_topics = [
            "pet health", "veterinary", "animal care", "pet symptoms",
            "pet diet", "pet exercise", "pet grooming", "pet behavior",
            "pet emergency", "pet medication", "pet vaccination", "pet training",
            "pet nutrition", "pet wellness", "pet disease", "pet injury"
        ]
        
        # Symptom severity levels
        self.severity_levels = {
            "emergency": ["seizure", "not breathing", "unconscious", "severe bleeding", "choking"],
            "high": ["difficulty breathing", "severe pain", "vomiting blood", "collapse", "shock"],
            "medium": ["vomiting", "diarrhea", "lethargy", "not eating", "limping"],
            "low": ["mild cough", "slight limp", "reduced appetite", "mild itching"]
        }

    async def initialize(self, mongo_manager=None, redis_manager=None):
        """Initialize the AI Vet Assistant"""
        try:
            # Store manager references
            self.mongo_manager = mongo_manager
            self.redis_manager = redis_manager
            
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

    async def process_user_query(
        self,
        user_id: str,
        query: str,
        pet_info: Optional[Dict[str, Any]] = None,
        user_location: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        """
        Main method to process user queries and provide veterinary assistance
        """
        
        # Check if query is vet-related
        if not self._is_vet_related(query):
            return self._get_non_vet_response()
        
        # Check for emergency keywords
        if self._contains_emergency_keywords(query):
            return await self._handle_emergency_case(user_id, query, pet_info, user_location)
        
        # Determine query type and route accordingly
        query_type = self._classify_query(query)
        
        if query_type == "symptom_check":
            return await self._handle_symptom_check(user_id, query, pet_info, user_location)
        elif query_type == "vet_finder":
            return await self._handle_vet_finder(user_id, query, pet_info, user_location)
        elif query_type == "diet_care":
            return await self._handle_diet_care(user_id, query, pet_info)
        elif query_type == "general_advice":
            return await self._handle_general_advice(user_id, query, pet_info)
        else:
            return await self._handle_general_advice(user_id, query, pet_info)

    def _is_vet_related(self, query: str) -> bool:
        """Check if query is veterinary-related"""
        query_lower = query.lower()
        
        # Check for vet-related keywords
        for topic in self.vet_topics:
            if topic in query_lower:
                return True
        
        # Check for pet-related words
        pet_keywords = ["pet", "dog", "cat", "puppy", "kitten", "animal", "vet", "veterinary"]
        return any(keyword in query_lower for keyword in pet_keywords)

    def _get_non_vet_response(self) -> Dict[str, Any]:
        """Response for non-vet related queries"""
        return {
            "response": f"I'm {self.name}, your virtual veterinary assistant. I'm here specifically to help with pet health and veterinary-related questions. Please feel free to ask me about your pet's health, symptoms, care, or any veterinary concerns.",
            "type": "non_vet_query",
            "confidence": 1.0,
            "should_see_vet": False,
            "emergency": False
        }

    def _contains_emergency_keywords(self, query: str) -> bool:
        """Check if query contains emergency keywords"""
        query_lower = query.lower()
        return any(keyword in query_lower for keyword in self.emergency_keywords)

    def _classify_query(self, query: str) -> str:
        """Classify the type of veterinary query"""
        query_lower = query.lower()
        
        # Symptom-related keywords
        symptom_keywords = ["symptom", "sick", "not feeling well", "acting strange", "vomiting", "diarrhea", "limping", "coughing", "sneezing", "itching", "scratching"]
        if any(keyword in query_lower for keyword in symptom_keywords):
            return "symptom_check"
        
        # Vet finder keywords
        vet_keywords = ["find vet", "recommend vet", "nearest vet", "good vet", "veterinarian", "vet clinic", "animal hospital"]
        if any(keyword in query_lower for keyword in vet_keywords):
            return "vet_finder"
        
        # Diet and care keywords
        care_keywords = ["diet", "food", "feeding", "exercise", "grooming", "care routine", "what to feed", "how to care"]
        if any(keyword in query_lower for keyword in care_keywords):
            return "diet_care"
        
        return "general_advice"

    async def _handle_emergency_case(
        self,
        user_id: str,
        query: str,
        pet_info: Optional[Dict[str, Any]],
        user_location: Optional[Dict[str, float]]
    ) -> Dict[str, Any]:
        """Handle emergency cases with immediate escalation"""
        
        # Log emergency case
        if self.redis_manager:
            await self.redis_manager.add_to_emergency_queue({
                "user_id": user_id,
                "query": query,
                "pet_info": pet_info,
                "location": user_location,
                "timestamp": datetime.utcnow().isoformat()
            })
        
        # Get nearest emergency clinics
        emergency_clinics = await self._get_emergency_clinics(user_location)
        
        # Generate emergency response
        emergency_response = await self._generate_emergency_response(query, pet_info, emergency_clinics)
        
        # Store emergency assessment in MongoDB
        if self.mongo_manager:
            await self.mongo_manager.store_emergency_assessment(
                user_id=user_id,
                pet_id=pet_info.get("pet_id") if pet_info else None,
                assessment_data={
                    "query": query,
                    "pet_info": pet_info,
                    "emergency_clinics": emergency_clinics,
                    "response": emergency_response
                }
            )
        
        return {
            "response": emergency_response,
            "type": "emergency",
            "confidence": 1.0,
            "should_see_vet": True,
            "emergency": True,
            "emergency_clinics": emergency_clinics,
            "immediate_actions": [
                "🚨 Call emergency veterinary clinic immediately",
                "Keep your pet calm and comfortable",
                "Do not attempt home treatment",
                "Transport to nearest emergency facility",
                "Monitor vital signs if possible",
                "Have pet's medical records ready"
            ],
            "urgency_level": "emergency"
        }

    async def _handle_symptom_check(
        self,
        user_id: str,
        query: str,
        pet_info: Optional[Dict[str, Any]],
        user_location: Optional[Dict[str, float]]
    ) -> Dict[str, Any]:
        """Handle symptom checking and analysis"""
        
        # Extract symptoms from query
        symptoms = self._extract_symptoms(query)
        
        # Generate AI analysis
        analysis = await self._generate_symptom_analysis(query, pet_info, symptoms)
        
        # Determine urgency
        urgency_level = self._determine_urgency(symptoms, query)
        
        # Get vet recommendations if needed
        vet_recommendations = []
        if urgency_level in ["high", "emergency"]:
            vet_recommendations = await self._get_vet_recommendations(user_location, pet_info)
        
        # Return the result
        result = {
            "response": analysis["response"],
            "type": "symptom_check",
            "confidence": analysis["confidence"],
            "should_see_vet": analysis["should_see_vet"],
            "urgency_level": urgency_level,
            "symptoms_identified": symptoms,
            "vet_recommendations": vet_recommendations,
            "emergency": urgency_level == "emergency"
        }
        
        return result

    async def _handle_vet_finder(
        self,
        user_id: str,
        query: str,
        pet_info: Optional[Dict[str, Any]],
        user_location: Optional[Dict[str, float]]
    ) -> Dict[str, Any]:
        """Handle vet finder requests"""
        
        # Extract search criteria from query
        search_criteria = self._extract_vet_search_criteria(query)
        
        # Get vet recommendations from backend
        vets = await self._get_vets_from_backend(user_location, search_criteria, pet_info)
        
        # Generate response
        response = await self._generate_vet_finder_response(vets, search_criteria)
        
        return {
            "response": response,
            "type": "vet_finder",
            "confidence": 0.9,
            "should_see_vet": False,
            "vet_recommendations": vets,
            "emergency": False
        }

    async def _handle_diet_care(
        self,
        user_id: str,
        query: str,
        pet_info: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Handle diet and care questions"""
        
        # Extract care-related information from query
        care_info = self._extract_care_info(query)
        
        # Generate diet/care recommendations
        recommendations = await self._generate_care_recommendations(query, pet_info, care_info)
        
        return {
            "response": recommendations["response"],
            "type": "diet_care",
            "confidence": 0.85,
            "should_see_vet": False,
            "care_recommendations": recommendations["care_data"],
            "emergency": False
        }

    async def _handle_general_advice(
        self,
        user_id: str,
        query: str,
        pet_info: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Handle general veterinary advice"""
        
        # Generate general advice
        advice = await self._generate_general_advice(query, pet_info)
        
        return {
            "response": advice,
            "type": "general_advice",
            "confidence": 0.8,
            "should_see_vet": False,
            "emergency": False
        }

    def _extract_symptoms(self, query: str) -> List[str]:
        """Extract symptoms from user query"""
        # This is a simplified extraction - in production, use NLP
        common_symptoms = [
            "vomiting", "diarrhea", "limping", "coughing", "sneezing",
            "itching", "scratching", "lethargy", "not eating", "fever",
            "pain", "swelling", "bleeding", "difficulty breathing"
        ]
        
        symptoms = []
        query_lower = query.lower()
        
        for symptom in common_symptoms:
            if symptom in query_lower:
                symptoms.append(symptom)
        
        return symptoms

    def _determine_urgency(self, symptoms: List[str], query: str) -> str:
        """Determine urgency level based on symptoms"""
        query_lower = query.lower()
        
        # Emergency symptoms
        emergency_symptoms = ["bleeding", "difficulty breathing", "unconscious", "seizure", "collapse"]
        if any(symptom in query_lower for symptom in emergency_symptoms):
            return "emergency"
        
        # High urgency symptoms
        high_symptoms = ["severe pain", "not eating", "lethargic", "vomiting blood"]
        if any(symptom in query_lower for symptom in high_symptoms):
            return "high"
        
        # Medium urgency symptoms
        medium_symptoms = ["mild pain", "slight limp", "reduced appetite", "mild vomiting"]
        if any(symptom in query_lower for symptom in medium_symptoms):
            return "medium"
        
        return "low"

    def _should_recommend_vet_visit(self, symptoms: List[str], response_text: str) -> bool:
        """Determine if vet visit should be recommended based on symptoms and response"""
        if not symptoms:
            return False
        
        # Check for high-priority symptoms
        high_priority_symptoms = [
            "vomiting", "diarrhea", "lethargy", "not eating", "limping", 
            "coughing", "sneezing", "bleeding", "pain", "swelling"
        ]
        
        # If multiple symptoms or high-priority symptoms, recommend vet visit
        if len(symptoms) >= 2 or any(symptom in high_priority_symptoms for symptom in symptoms):
            return True
        
        # Check response text for vet recommendation keywords
        vet_keywords = ["veterinarian", "vet", "clinic", "examination", "diagnosis", "urgent", "immediate"]
        response_lower = response_text.lower()
        
        return any(keyword in response_lower for keyword in vet_keywords)

    def _extract_care_data_from_response(self, response_text: str, pet_info: Optional[Dict[str, Any]], care_info: Dict[str, Any]) -> Dict[str, Any]:
        """Extract structured care data from AI response"""
        species = care_info.get("species") or (pet_info.get("species") if pet_info else "unknown")
        age_category = care_info.get("age_category", "adult")
        
        # Default care data based on species and age
        care_data = {
            "diet": "Consult veterinarian for specific recommendations",
            "exercise": "Appropriate for age and health",
            "grooming": "Regular maintenance schedule",
            "health_monitoring": "Regular check-ups recommended"
        }
        
        # Try to extract specific information from response
        response_lower = response_text.lower()
        
        # Extract diet information
        if "diet" in response_lower or "food" in response_lower:
            care_data["diet"] = "See detailed recommendations in response"
        
        # Extract exercise information
        if "exercise" in response_lower or "activity" in response_lower:
            care_data["exercise"] = "See detailed recommendations in response"
        
        # Extract grooming information
        if "grooming" in response_lower or "bathing" in response_lower:
            care_data["grooming"] = "See detailed recommendations in response"
        
        return care_data

    async def _generate_symptom_analysis(
        self,
        query: str,
        pet_info: Optional[Dict[str, Any]],
        symptoms: List[str]
    ) -> Dict[str, Any]:
        """Generate AI-powered symptom analysis"""
        
        # Check cache first
        if self.redis_manager:
            cache_key = f"symptom_analysis:{hashlib.md5(query.encode()).hexdigest()}"
            cached_result = await self.redis_manager.get_cached_ai_result(cache_key)
            if cached_result:
                return cached_result
        
        if not self.llm:
            result = self._generate_rule_based_analysis(query, symptoms)
        else:
            try:
                # Enhanced prompt for better analysis
                prompt_template = PromptTemplate(
                    input_variables=["query", "pet_info", "symptoms", "assistant_name"],
                    template="""
                    You are {assistant_name}, a professional virtual veterinary assistant with extensive experience in pet health. 
                    
                    Analyze the following pet health situation and provide comprehensive, professional advice:
                    
                    **Pet Owner's Query:** {query}
                    **Pet Information:** {pet_info}
                    **Identified Symptoms:** {symptoms}
                    
                    Please provide a detailed analysis including:
                    
                    1. **Symptom Assessment**: Clear analysis of the described symptoms and their potential significance
                    2. **Possible Causes**: Common conditions that could cause these symptoms (but avoid definitive diagnosis)
                    3. **Urgency Level**: Assess whether this requires immediate, same-day, or routine veterinary attention
                    4. **Immediate Actions**: Specific steps the owner should take right now
                    5. **Home Care**: Safe home care measures while waiting for veterinary attention
                    6. **Warning Signs**: Red flags that indicate the situation is worsening
                    7. **Veterinary Recommendation**: Clear guidance on when and why to see a vet
                    
                    **Important Guidelines:**
                    - Always prioritize pet safety and welfare
                    - Never provide specific medical diagnoses
                    - Be empathetic and reassuring to worried pet owners
                    - Use clear, non-technical language
                    - Emphasize that you cannot replace professional veterinary examination
                    - If symptoms are severe or multiple, strongly recommend immediate veterinary care
                    
                    Format your response in a clear, structured manner that's easy for pet owners to follow.
                    """
                )
                
                # Use the new LangChain syntax
                chain = prompt_template | self.llm
                
                result = await chain.ainvoke({
                    "query": query,
                    "pet_info": json.dumps(pet_info) if pet_info else "Not provided",
                    "symptoms": ", ".join(symptoms) if symptoms else "No specific symptoms identified",
                    "assistant_name": self.name
                })
                
                response_text = result.content.strip() if hasattr(result, 'content') else str(result).strip()
                
                # Determine if vet visit is needed based on symptoms and response
                should_see_vet = self._should_recommend_vet_visit(symptoms, response_text)
                
                result = {
                    "response": response_text,
                    "confidence": 0.9,
                    "should_see_vet": should_see_vet
                }
                
            except Exception as e:
                print(f"Error generating symptom analysis: {str(e)}")
                result = self._generate_rule_based_analysis(query, symptoms)
        
        # Cache the result
        if self.redis_manager:
            await self.redis_manager.cache_ai_result(
                cache_key=f"symptom_analysis:{hashlib.md5(query.encode()).hexdigest()}",
                result=result,
                ttl_seconds=3600  # 1 hour cache
            )
        
        return result

    def _generate_rule_based_analysis(self, query: str, symptoms: List[str]) -> Dict[str, Any]:
        """Generate rule-based analysis when AI is not available"""
        if not symptoms:
            return {
                "response": f"I understand you're concerned about your pet. To provide better advice, could you please describe the specific symptoms or behaviors you're observing?",
                "confidence": 0.6,
                "should_see_vet": False
            }
        
        response = f"Based on the symptoms you've described ({', '.join(symptoms)}), I recommend monitoring your pet closely. "
        
        if len(symptoms) >= 2:
            response += "Since multiple symptoms are present, it would be wise to consult a veterinarian for a proper diagnosis."
            should_see_vet = True
        else:
            response += "If symptoms persist or worsen, please consult a veterinarian."
            should_see_vet = False
        
        return {
            "response": response,
            "confidence": 0.7,
            "should_see_vet": should_see_vet
        }

    async def _generate_emergency_response(
        self,
        query: str,
        pet_info: Optional[Dict[str, Any]],
        emergency_clinics: List[Dict[str, Any]]
    ) -> str:
        """Generate emergency response"""
        
        response = f"🚨 EMERGENCY ALERT 🚨\n\n"
        response += f"I've detected emergency keywords in your query. This requires immediate veterinary attention.\n\n"
        response += f"Immediate Actions:\n"
        response += f"• Call emergency veterinary clinic immediately\n"
        response += f"• Keep your pet calm and comfortable\n"
        response += f"• Do not attempt home treatment\n"
        response += f"• Transport to nearest emergency facility\n\n"
        
        if emergency_clinics:
            response += f"Nearest Emergency Clinics:\n"
            for clinic in emergency_clinics[:3]:
                response += f"• {clinic['name']} - {clinic['phone']} ({clinic['distance']})\n"
        
        response += f"\nPlease seek immediate veterinary care. Your pet's safety is the priority."
        
        return response

    async def _get_emergency_clinics(self, user_location: Optional[Dict[str, float]]) -> List[Dict[str, Any]]:
        """Get emergency clinics from backend"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.backend_url}/api/emergency-clinics",
                    params={"lat": user_location.get("lat"), "lng": user_location.get("lng")} if user_location else {}
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    return self._get_mock_emergency_clinics()
                    
        except Exception as e:
            print(f"Error getting emergency clinics: {str(e)}")
            return self._get_mock_emergency_clinics()

    def _get_mock_emergency_clinics(self) -> List[Dict[str, Any]]:
        """Get mock emergency clinics"""
        return [
            {
                "name": "Emergency Veterinary Hospital",
                "address": "789 Emergency St, City",
                "phone": "+1-555-9999",
                "distance": "2.5 km",
                "open_24_7": True
            },
            {
                "name": "Animal Emergency Center",
                "address": "456 Urgent Care Ave, City",
                "phone": "+1-555-8888",
                "distance": "4.1 km",
                "open_24_7": True
            }
        ]

    async def _get_vet_recommendations(
        self,
        user_location: Optional[Dict[str, float]],
        pet_info: Optional[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Get vet recommendations from backend"""
        try:
            async with httpx.AsyncClient() as client:
                params = {}
                if user_location:
                    params.update(user_location)
                if pet_info:
                    params["species"] = pet_info.get("species")
                    params["breed"] = pet_info.get("breed")
                
                response = await client.get(
                    f"{self.backend_url}/api/vets/recommendations",
                    params=params
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    return []
                    
        except Exception as e:
            print(f"Error getting vet recommendations: {str(e)}")
            return []

    async def _get_vets_from_backend(
        self,
        user_location: Optional[Dict[str, float]],
        search_criteria: Dict[str, Any],
        pet_info: Optional[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Get vets from backend API"""
        try:
            async with httpx.AsyncClient() as client:
                params = search_criteria.copy()
                if user_location:
                    params.update(user_location)
                if pet_info:
                    params["species"] = pet_info.get("species")
                    params["breed"] = pet_info.get("breed")
                
                response = await client.get(
                    f"{self.backend_url}/api/vets/search",
                    params=params
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    return self._get_mock_vets()
                    
        except Exception as e:
            print(f"Error getting vets from backend: {str(e)}")
            return self._get_mock_vets()

    def _get_mock_vets(self) -> List[Dict[str, Any]]:
        """Get mock vet data"""
        return [
            {
                "id": "1",
                "name": "Dr. Sarah Smith",
                "specialization": "General Practice",
                "rating": 4.8,
                "total_reviews": 156,
                "address": "123 Main St, City",
                "phone": "+1-555-0123",
                "availability": "Available today",
                "cost_range": "$50-$150"
            },
            {
                "id": "2",
                "name": "Dr. John Wilson",
                "specialization": "Surgery",
                "rating": 4.6,
                "total_reviews": 89,
                "address": "456 Oak Ave, City",
                "phone": "+1-555-0456",
                "availability": "Available this week",
                "cost_range": "$100-$300"
            }
        ]

    def _extract_vet_search_criteria(self, query: str) -> Dict[str, Any]:
        """Extract vet search criteria from query"""
        criteria = {}
        query_lower = query.lower()
        
        # Extract specialization
        specializations = ["surgery", "dental", "emergency", "general", "specialist"]
        for spec in specializations:
            if spec in query_lower:
                criteria["specialization"] = spec
                break
        
        # Extract urgency
        if any(word in query_lower for word in ["emergency", "urgent", "immediate"]):
            criteria["urgency"] = "high"
        
        return criteria

    def _extract_care_info(self, query: str) -> Dict[str, Any]:
        """Extract care-related information from query"""
        info = {}
        query_lower = query.lower()
        
        # Extract age-related info
        age_keywords = ["puppy", "kitten", "young", "adult", "senior", "old"]
        for keyword in age_keywords:
            if keyword in query_lower:
                info["age_category"] = keyword
                break
        
        # Extract species
        if "dog" in query_lower or "puppy" in query_lower:
            info["species"] = "dog"
        elif "cat" in query_lower or "kitten" in query_lower:
            info["species"] = "cat"
        
        return info

    async def _generate_care_recommendations(
        self,
        query: str,
        pet_info: Optional[Dict[str, Any]],
        care_info: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate care recommendations"""
        
        # Check cache first
        if self.redis_manager:
            cache_key = f"care_recommendations:{hashlib.md5(query.encode()).hexdigest()}"
            cached_result = await self.redis_manager.get_cached_ai_result(cache_key)
            if cached_result:
                return cached_result
        
        if not self.llm:
            result = self._generate_rule_based_care_recommendations(pet_info, care_info)
        else:
            try:
                prompt_template = PromptTemplate(
                    input_variables=["query", "pet_info", "care_info", "assistant_name"],
                    template="""
                    You are {assistant_name}, a professional veterinary assistant specializing in pet care and nutrition.
                    
                    Provide comprehensive care recommendations based on the following:
                    
                    **Pet Owner's Query:** {query}
                    **Pet Information:** {pet_info}
                    **Care Information:** {care_info}
                    
                    Please provide detailed recommendations for:
                    
                    1. **Nutrition & Diet**: 
                       - Specific food recommendations based on age, breed, and health
                       - Feeding schedule and portion sizes
                       - Foods to avoid and dietary restrictions
                       - Supplements if needed
                    
                    2. **Exercise & Activity**:
                       - Daily exercise requirements
                       - Activity types appropriate for the pet
                       - Mental stimulation activities
                       - Age-appropriate modifications
                    
                    3. **Grooming & Hygiene**:
                       - Grooming schedule and techniques
                       - Bathing frequency and products
                       - Dental care routine
                       - Nail trimming and ear cleaning
                    
                    4. **Health Monitoring**:
                       - Signs to watch for
                       - Regular health checks
                       - Vaccination schedule reminders
                       - Preventive care measures
                    
                    5. **Special Considerations**:
                       - Breed-specific needs
                       - Age-related care changes
                       - Seasonal considerations
                       - Environmental factors
                    
                    **Guidelines:**
                    - Be specific and actionable
                    - Consider the pet's individual needs
                    - Provide age and breed-appropriate advice
                    - Include safety considerations
                    - Suggest when to consult a veterinarian
                    
                    Format your response in a clear, organized manner with practical, easy-to-follow advice.
                    """
                )
                
                # Use the new LangChain syntax
                chain = prompt_template | self.llm
                
                result = await chain.ainvoke({
                    "query": query,
                    "pet_info": json.dumps(pet_info) if pet_info else "Not provided",
                    "care_info": json.dumps(care_info),
                    "assistant_name": self.name
                })
                
                response_text = result.content.strip() if hasattr(result, 'content') else str(result).strip()
                
                # Extract structured care data
                care_data = self._extract_care_data_from_response(response_text, pet_info, care_info)
                
                result = {
                    "response": response_text,
                    "care_data": care_data
                }
                
            except Exception as e:
                print(f"Error generating care recommendations: {str(e)}")
                result = self._generate_rule_based_care_recommendations(pet_info, care_info)
        
        # Cache the result
        if self.redis_manager:
            await self.redis_manager.cache_ai_result(
                cache_key=f"care_recommendations:{hashlib.md5(query.encode()).hexdigest()}",
                result=result,
                ttl_seconds=7200  # 2 hours cache
            )
        
        return result

    def _generate_rule_based_care_recommendations(
        self,
        pet_info: Optional[Dict[str, Any]],
        care_info: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate rule-based care recommendations"""
        
        species = care_info.get("species") or (pet_info.get("species") if pet_info else "unknown")
        age_category = care_info.get("age_category", "adult")
        
        if species == "dog":
            if age_category == "puppy":
                diet = "High-protein puppy food, 3-4 meals daily"
                exercise = "Short, frequent play sessions"
            elif age_category == "senior":
                diet = "Senior dog food with joint support"
                exercise = "Gentle walks and low-impact activities"
            else:
                diet = "Balanced adult dog food, 2 meals daily"
                exercise = "Regular walks and playtime"
        elif species == "cat":
            if age_category == "kitten":
                diet = "High-protein kitten food, 3-4 meals daily"
                exercise = "Interactive play sessions"
            elif age_category == "senior":
                diet = "Senior cat food with kidney support"
                exercise = "Gentle play and climbing activities"
            else:
                diet = "Balanced adult cat food, 2 meals daily"
                exercise = "Regular play and climbing"
        else:
            diet = "Consult veterinarian for specific recommendations"
            exercise = "Appropriate exercise for species and age"
        
        return {
            "response": f"Based on your pet's information, here are my recommendations:\n\nDiet: {diet}\nExercise: {exercise}\n\nFor more specific recommendations, please provide your pet's exact age, breed, and any health conditions.",
            "care_data": {
                "diet": diet,
                "exercise": exercise,
                "grooming": "Regular grooming as needed"
            }
        }

    async def _generate_vet_finder_response(
        self,
        vets: List[Dict[str, Any]],
        search_criteria: Dict[str, Any]
    ) -> str:
        """Generate vet finder response"""
        
        if not vets:
            return "I couldn't find any veterinarians matching your criteria. Please try broadening your search or contact our support team for assistance."
        
        response = f"I found {len(vets)} veterinarians that match your criteria:\n\n"
        
        for i, vet in enumerate(vets[:5], 1):  # Show top 5
            response += f"{i}. {vet['name']}\n"
            response += f"   Specialization: {vet.get('specialization', 'General Practice')}\n"
            response += f"   Rating: {vet.get('rating', 'N/A')} ⭐\n"
            response += f"   Address: {vet.get('address', 'N/A')}\n"
            response += f"   Phone: {vet.get('phone', 'N/A')}\n"
            response += f"   Availability: {vet.get('availability', 'Contact for availability')}\n"
            response += f"   Cost Range: {vet.get('cost_range', 'Contact for pricing')}\n\n"
        
        response += "I recommend calling ahead to confirm availability and schedule an appointment."
        
        return response

    async def _generate_general_advice(
        self,
        query: str,
        pet_info: Optional[Dict[str, Any]]
    ) -> str:
        """Generate general veterinary advice"""
        
        if not self.llm:
            return "I'm here to help with your pet's health and care. Please feel free to ask specific questions about symptoms, diet, behavior, or any veterinary concerns."
        
        try:
            prompt_template = PromptTemplate(
                input_variables=["query", "pet_info", "assistant_name"],
                template="""
                You are {assistant_name}, a virtual veterinary assistant. Provide helpful, professional advice for the following pet-related question:
                
                User Query: {query}
                Pet Information: {pet_info}
                
                Provide clear, practical advice that a pet owner can easily understand and follow. Always prioritize pet safety and recommend veterinary consultation when appropriate.
                """
            )
            
            # Use the new LangChain syntax
            chain = prompt_template | self.llm
            
            result = await chain.ainvoke({
                "query": query,
                "pet_info": json.dumps(pet_info) if pet_info else "Not provided",
                "assistant_name": self.name
            })
            
            return result.content.strip() if hasattr(result, 'content') else str(result).strip()
            
        except Exception as e:
            print(f"Error generating general advice: {str(e)}")
            return "I'm here to help with your pet's health and care. Please feel free to ask specific questions about symptoms, diet, behavior, or any veterinary concerns."

    def is_ready(self) -> bool:
        """Check if AI Vet Assistant is ready"""
        return self.is_initialized

    async def close(self):
        """Close AI Vet Assistant"""
        if self.mongo_manager:
            await self.mongo_manager.close()
        if self.redis_manager:
            await self.redis_manager.close() 