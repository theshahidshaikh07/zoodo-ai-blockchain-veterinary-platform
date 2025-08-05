import os
import json
import asyncio
from typing import List, Dict, Any, Optional
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import openai
from langchain.llms import OpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

class AIEngine:
    def __init__(self):
        self.is_initialized = False
        self.symptom_classifier = None
        self.provider_recommender = None
        self.care_advisor = None
        self.openai_client = None
        self.llm = None
        
        # Load configuration
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.model_name = os.getenv("AI_MODEL_NAME", "gpt-3.5-turbo")
        
        # Symptom database
        self.symptom_database = {
            "dog": {
                "emergency_symptoms": [
                    "difficulty breathing", "severe bleeding", "unconsciousness", 
                    "seizures", "inability to walk", "extreme lethargy"
                ],
                "common_conditions": {
                    "vomiting": ["gastroenteritis", "food poisoning", "parasites"],
                    "diarrhea": ["gastroenteritis", "parasites", "dietary indiscretion"],
                    "limping": ["injury", "arthritis", "hip dysplasia"],
                    "excessive scratching": ["allergies", "fleas", "skin infection"]
                }
            },
            "cat": {
                "emergency_symptoms": [
                    "difficulty breathing", "severe bleeding", "unconsciousness",
                    "seizures", "inability to walk", "extreme lethargy"
                ],
                "common_conditions": {
                    "vomiting": ["hairballs", "gastroenteritis", "kidney disease"],
                    "diarrhea": ["gastroenteritis", "parasites", "dietary change"],
                    "limping": ["injury", "arthritis", "joint problems"],
                    "excessive grooming": ["stress", "allergies", "skin problems"]
                }
            }
        }

    async def initialize(self):
        """Initialize AI models and services"""
        try:
            # Initialize OpenAI client
            if self.openai_api_key:
                openai.api_key = self.openai_api_key
                self.openai_client = openai
                self.llm = OpenAI(temperature=0.7, openai_api_key=self.openai_api_key)
            
            # Initialize symptom classifier
            await self._initialize_symptom_classifier()
            
            # Initialize provider recommender
            await self._initialize_provider_recommender()
            
            # Initialize care advisor
            await self._initialize_care_advisor()
            
            self.is_initialized = True
            print("AI Engine initialized successfully")
            
        except Exception as e:
            print(f"Error initializing AI Engine: {str(e)}")
            self.is_initialized = False

    async def _initialize_symptom_classifier(self):
        """Initialize symptom classification model"""
        # This would typically load a trained ML model
        # For now, we'll use rule-based classification
        self.symptom_classifier = {
            "vectorizer": TfidfVectorizer(max_features=1000),
            "symptom_patterns": self._load_symptom_patterns()
        }

    async def _initialize_provider_recommender(self):
        """Initialize provider recommendation system"""
        self.provider_recommender = {
            "location_weight": 0.3,
            "specialization_weight": 0.25,
            "rating_weight": 0.2,
            "availability_weight": 0.15,
            "cost_weight": 0.1
        }

    async def _initialize_care_advisor(self):
        """Initialize care routine advisor"""
        self.care_advisor = {
            "species_specific_routines": self._load_care_routines(),
            "diet_recommendations": self._load_diet_recommendations()
        }

    def _load_symptom_patterns(self):
        """Load symptom patterns for classification"""
        return {
            "emergency": ["bleeding", "breathing", "unconscious", "seizure", "collapse"],
            "high": ["fever", "severe pain", "not eating", "lethargic", "vomiting blood"],
            "medium": ["mild pain", "slight limp", "reduced appetite", "mild vomiting"],
            "low": ["slight behavior change", "minor skin irritation", "mild itching"]
        }

    def _load_care_routines(self):
        """Load species-specific care routines"""
        return {
            "dog": {
                "daily_routine": [
                    "Morning walk and bathroom break",
                    "Fresh water and food",
                    "Playtime and exercise",
                    "Evening walk and bathroom break",
                    "Dinner and rest"
                ],
                "weekly_routine": [
                    "Grooming session",
                    "Nail trimming if needed",
                    "Ear cleaning",
                    "Dental care"
                ]
            },
            "cat": {
                "daily_routine": [
                    "Fresh water and food",
                    "Litter box cleaning",
                    "Playtime and exercise",
                    "Evening feeding",
                    "Rest and sleep"
                ],
                "weekly_routine": [
                    "Brushing and grooming",
                    "Nail trimming if needed",
                    "Litter box deep cleaning",
                    "Dental care"
                ]
            }
        }

    def _load_diet_recommendations(self):
        """Load diet recommendations by species and age"""
        return {
            "dog": {
                "puppy": "High-protein puppy food, 3-4 meals daily",
                "adult": "Balanced adult dog food, 2 meals daily",
                "senior": "Senior dog food with joint support, 2 meals daily"
            },
            "cat": {
                "kitten": "High-protein kitten food, 3-4 meals daily",
                "adult": "Balanced adult cat food, 2 meals daily",
                "senior": "Senior cat food with kidney support, 2 meals daily"
            }
        }

    async def analyze_symptoms(
        self,
        species: str,
        breed: Optional[str],
        age: Optional[int],
        symptoms: List[str],
        behavior_changes: Optional[List[str]] = None,
        duration: Optional[str] = None
    ) -> Dict[str, Any]:
        """Analyze pet symptoms and provide assessment"""
        
        # Combine all symptoms and behavior changes
        all_symptoms = symptoms + (behavior_changes or [])
        symptom_text = " ".join(all_symptoms).lower()
        
        # Determine urgency level
        urgency_level = self._classify_urgency(species, symptom_text)
        
        # Get potential conditions
        potential_conditions = self._identify_conditions(species, symptoms)
        
        # Generate AI analysis
        analysis = await self._generate_symptom_analysis(
            species, breed, age, symptoms, behavior_changes, duration
        )
        
        # Calculate confidence score
        confidence_score = self._calculate_confidence(symptoms, urgency_level)
        
        # Determine recommended actions
        recommended_actions = self._get_recommended_actions(urgency_level, species)
        
        return {
            "analysis": analysis,
            "urgency_level": urgency_level,
            "confidence_score": confidence_score,
            "recommended_actions": recommended_actions,
            "potential_conditions": potential_conditions,
            "should_see_vet": urgency_level in ["high", "emergency"]
        }

    def _classify_urgency(self, species: str, symptom_text: str) -> str:
        """Classify symptom urgency level"""
        emergency_patterns = self.symptom_database[species]["emergency_symptoms"]
        
        # Check for emergency symptoms
        for emergency_symptom in emergency_patterns:
            if emergency_symptom in symptom_text:
                return "emergency"
        
        # Check other urgency patterns
        for level, patterns in self.symptom_classifier["symptom_patterns"].items():
            for pattern in patterns:
                if pattern in symptom_text:
                    return level
        
        return "low"

    def _identify_conditions(self, species: str, symptoms: List[str]) -> List[str]:
        """Identify potential medical conditions based on symptoms"""
        conditions = []
        species_conditions = self.symptom_database[species]["common_conditions"]
        
        for symptom in symptoms:
            symptom_lower = symptom.lower()
            for condition_symptom, possible_conditions in species_conditions.items():
                if condition_symptom in symptom_lower:
                    conditions.extend(possible_conditions)
        
        return list(set(conditions))  # Remove duplicates

    async def _generate_symptom_analysis(
        self,
        species: str,
        breed: Optional[str],
        age: Optional[int],
        symptoms: List[str],
        behavior_changes: Optional[List[str]],
        duration: Optional[str]
    ) -> str:
        """Generate AI-powered symptom analysis"""
        
        if not self.llm:
            return self._generate_rule_based_analysis(species, symptoms)
        
        try:
            prompt_template = PromptTemplate(
                input_variables=["species", "breed", "age", "symptoms", "behavior_changes", "duration"],
                template="""
                Analyze the following pet symptoms and provide a professional veterinary assessment:
                
                Species: {species}
                Breed: {breed}
                Age: {age} years
                Symptoms: {symptoms}
                Behavior Changes: {behavior_changes}
                Duration: {duration}
                
                Please provide:
                1. A clear analysis of the symptoms
                2. Potential causes
                3. Recommended next steps
                4. Whether immediate veterinary attention is needed
                
                Keep the response professional but accessible to pet owners.
                """
            )
            
            chain = LLMChain(llm=self.llm, prompt=prompt_template)
            
            result = await chain.arun(
                species=species,
                breed=breed or "unknown",
                age=age or "unknown",
                symptoms=", ".join(symptoms),
                behavior_changes=", ".join(behavior_changes or []),
                duration=duration or "unknown"
            )
            
            return result.strip()
            
        except Exception as e:
            print(f"Error generating AI analysis: {str(e)}")
            return self._generate_rule_based_analysis(species, symptoms)

    def _generate_rule_based_analysis(self, species: str, symptoms: List[str]) -> str:
        """Generate rule-based analysis when AI is not available"""
        analysis = f"Based on the symptoms observed in your {species}, "
        
        if len(symptoms) == 1:
            analysis += f"the primary concern is {symptoms[0]}. "
        else:
            analysis += f"multiple symptoms are present: {', '.join(symptoms)}. "
        
        analysis += "It's recommended to monitor your pet closely and consider consulting a veterinarian if symptoms persist or worsen."
        
        return analysis

    def _calculate_confidence(self, symptoms: List[str], urgency_level: str) -> float:
        """Calculate confidence score for the analysis"""
        base_confidence = 0.7
        
        # Adjust based on number of symptoms
        if len(symptoms) >= 3:
            base_confidence += 0.1
        elif len(symptoms) == 1:
            base_confidence -= 0.1
        
        # Adjust based on urgency level
        urgency_adjustments = {
            "emergency": 0.2,
            "high": 0.1,
            "medium": 0.0,
            "low": -0.1
        }
        
        base_confidence += urgency_adjustments.get(urgency_level, 0.0)
        
        return min(max(base_confidence, 0.0), 1.0)

    def _get_recommended_actions(self, urgency_level: str, species: str) -> List[str]:
        """Get recommended actions based on urgency level"""
        actions = {
            "emergency": [
                "Seek immediate veterinary care",
                "Call emergency veterinary clinic",
                "Keep pet calm and comfortable",
                "Do not attempt home treatment"
            ],
            "high": [
                "Schedule veterinary appointment within 24 hours",
                "Monitor symptoms closely",
                "Keep pet comfortable and hydrated",
                "Avoid strenuous activity"
            ],
            "medium": [
                "Schedule veterinary appointment within 48-72 hours",
                "Monitor for symptom changes",
                "Maintain normal routine unless symptoms worsen"
            ],
            "low": [
                "Monitor symptoms for 24-48 hours",
                "Schedule appointment if symptoms persist",
                "Maintain normal routine"
            ]
        }
        
        return actions.get(urgency_level, ["Monitor symptoms and consult veterinarian if concerned"])

    async def recommend_providers(
        self,
        user_location: Dict[str, float],
        pet_species: str,
        pet_breed: Optional[str],
        service_type: str,
        urgency_level: str,
        budget_range: Optional[Dict[str, float]],
        preferred_specialization: Optional[str],
        max_distance: float = 50.0
    ) -> Dict[str, Any]:
        """Recommend suitable service providers"""
        
        # This would typically query a database of providers
        # For now, return mock recommendations
        mock_providers = self._get_mock_providers(
            user_location, service_type, preferred_specialization
        )
        
        # Filter by distance and other criteria
        filtered_providers = self._filter_providers(
            mock_providers, user_location, max_distance, budget_range
        )
        
        # Calculate confidence score
        confidence_score = self._calculate_recommendation_confidence(
            len(filtered_providers), urgency_level
        )
        
        return {
            "providers": filtered_providers,
            "confidence_score": confidence_score,
            "reasoning": f"Found {len(filtered_providers)} providers matching your criteria"
        }

    def _get_mock_providers(self, location: Dict[str, float], service_type: str, specialization: Optional[str]) -> List[Dict[str, Any]]:
        """Get mock provider data"""
        providers = [
            {
                "id": "1",
                "name": "Dr. Sarah Smith",
                "type": "veterinarian",
                "specialization": "General Practice",
                "rating": 4.8,
                "total_reviews": 156,
                "location": {"lat": location["lat"] + 0.01, "lng": location["lng"] + 0.01},
                "address": "123 Main St, City",
                "phone": "+1-555-0123",
                "availability": "Available today",
                "cost_range": "$50-$150"
            },
            {
                "id": "2",
                "name": "John Wilson",
                "type": "trainer",
                "specialization": "Behavioral Training",
                "rating": 4.6,
                "total_reviews": 89,
                "location": {"lat": location["lat"] - 0.01, "lng": location["lng"] - 0.01},
                "address": "456 Oak Ave, City",
                "phone": "+1-555-0456",
                "availability": "Available this week",
                "cost_range": "$30-$80"
            }
        ]
        
        if service_type == "veterinary":
            return [p for p in providers if p["type"] == "veterinarian"]
        elif service_type == "training":
            return [p for p in providers if p["type"] == "trainer"]
        
        return providers

    def _filter_providers(
        self,
        providers: List[Dict[str, Any]],
        user_location: Dict[str, float],
        max_distance: float,
        budget_range: Optional[Dict[str, float]]
    ) -> List[Dict[str, Any]]:
        """Filter providers based on criteria"""
        filtered = []
        
        for provider in providers:
            # Calculate distance
            distance = self._calculate_distance(user_location, provider["location"])
            
            if distance <= max_distance:
                provider["distance_km"] = distance
                filtered.append(provider)
        
        # Sort by rating and distance
        filtered.sort(key=lambda x: (x["rating"], -x["distance_km"]), reverse=True)
        
        return filtered

    def _calculate_distance(self, loc1: Dict[str, float], loc2: Dict[str, float]) -> float:
        """Calculate distance between two points"""
        import math
        
        lat1, lng1 = loc1["lat"], loc1["lng"]
        lat2, lng2 = loc2["lat"], loc2["lng"]
        
        # Simple distance calculation (for production, use proper geolocation library)
        return math.sqrt((lat2 - lat1)**2 + (lng2 - lng1)**2) * 111  # Approximate km

    def _calculate_recommendation_confidence(self, provider_count: int, urgency_level: str) -> float:
        """Calculate confidence score for provider recommendations"""
        base_confidence = min(provider_count / 10.0, 1.0)
        
        urgency_adjustments = {
            "emergency": 0.2,
            "high": 0.1,
            "medium": 0.0,
            "low": -0.1
        }
        
        base_confidence += urgency_adjustments.get(urgency_level, 0.0)
        return min(max(base_confidence, 0.0), 1.0)

    async def suggest_care_routine(
        self,
        species: str,
        breed: Optional[str],
        age: Optional[int],
        weight: Optional[float],
        health_conditions: Optional[List[str]],
        activity_level: str,
        dietary_restrictions: Optional[List[str]]
    ) -> Dict[str, Any]:
        """Suggest personalized care routine"""
        
        # Get base routine for species
        base_routine = self.care_advisor["species_specific_routines"].get(species, {})
        
        # Customize based on age
        age_category = self._get_age_category(age, species)
        diet_recommendations = self.care_advisor["diet_recommendations"][species][age_category]
        
        # Customize exercise plan based on activity level
        exercise_plan = self._get_exercise_plan(species, activity_level, age)
        
        # Customize grooming schedule
        grooming_schedule = self._get_grooming_schedule(species, breed)
        
        return {
            "daily_routine": base_routine.get("daily_routine", []),
            "diet_recommendations": {
                "recommendation": diet_recommendations,
                "restrictions": dietary_restrictions or [],
                "feeding_schedule": "2 meals daily" if age_category != "puppy" else "3-4 meals daily"
            },
            "exercise_plan": exercise_plan,
            "grooming_schedule": grooming_schedule,
            "health_monitoring": self._get_health_monitoring_checklist(species, health_conditions)
        }

    def _get_age_category(self, age: Optional[int], species: str) -> str:
        """Get age category for care recommendations"""
        if not age:
            return "adult"
        
        if species == "dog":
            if age < 1:
                return "puppy"
            elif age > 7:
                return "senior"
            else:
                return "adult"
        elif species == "cat":
            if age < 1:
                return "kitten"
            elif age > 10:
                return "senior"
            else:
                return "adult"
        
        return "adult"

    def _get_exercise_plan(self, species: str, activity_level: str, age: Optional[int]) -> Dict[str, Any]:
        """Get exercise plan based on species and activity level"""
        if species == "dog":
            plans = {
                "high": {"daily_walks": "2-3 walks, 30-45 minutes each", "playtime": "1-2 hours"},
                "moderate": {"daily_walks": "2 walks, 20-30 minutes each", "playtime": "30-60 minutes"},
                "low": {"daily_walks": "1-2 walks, 15-20 minutes each", "playtime": "15-30 minutes"}
            }
        else:  # cat
            plans = {
                "high": {"playtime": "2-3 sessions, 15-20 minutes each", "climbing": "Cat tree access"},
                "moderate": {"playtime": "2 sessions, 10-15 minutes each", "climbing": "Moderate access"},
                "low": {"playtime": "1-2 sessions, 10 minutes each", "climbing": "Basic access"}
            }
        
        plan = plans.get(activity_level, plans["moderate"])
        
        # Adjust for age
        if age and age > 7:
            if "daily_walks" in plan:
                plan["daily_walks"] = "Shorter, gentler walks"
            if "playtime" in plan:
                plan["playtime"] = "Gentle play sessions"
        
        return plan

    def _get_grooming_schedule(self, species: str, breed: Optional[str]) -> Dict[str, Any]:
        """Get grooming schedule based on species and breed"""
        if species == "dog":
            if breed and "long" in breed.lower():
                return {"brushing": "Daily", "bathing": "Monthly", "nail_trimming": "Monthly"}
            else:
                return {"brushing": "2-3 times per week", "bathing": "Every 2-3 months", "nail_trimming": "Monthly"}
        else:  # cat
            return {"brushing": "2-3 times per week", "bathing": "As needed", "nail_trimming": "Monthly"}

    def _get_health_monitoring_checklist(self, species: str, health_conditions: Optional[List[str]]) -> Dict[str, Any]:
        """Get health monitoring checklist"""
        checklist = {
            "daily": ["Appetite", "Energy level", "Bathroom habits", "Behavior changes"],
            "weekly": ["Weight check", "Coat condition", "Eye and ear health"],
            "monthly": ["Dental health", "Nail length", "Overall body condition"]
        }
        
        if health_conditions:
            checklist["special_monitoring"] = health_conditions
        
        return checklist

    async def emergency_assessment(
        self,
        species: str,
        symptoms: List[str],
        behavior_changes: Optional[List[str]],
        duration: Optional[str]
    ) -> Dict[str, Any]:
        """Emergency symptom assessment"""
        
        all_symptoms = symptoms + (behavior_changes or [])
        symptom_text = " ".join(all_symptoms).lower()
        
        # Check for emergency indicators
        emergency_indicators = self.symptom_database[species]["emergency_symptoms"]
        is_emergency = any(indicator in symptom_text for indicator in emergency_indicators)
        
        if is_emergency:
            return {
                "is_emergency": True,
                "immediate_actions": [
                    "Call emergency veterinary clinic immediately",
                    "Keep pet calm and comfortable",
                    "Do not attempt home treatment",
                    "Transport to nearest emergency facility"
                ],
                "nearest_clinics": self._get_emergency_clinics(),
                "critical_symptoms": [s for s in symptoms if any(indicator in s.lower() for indicator in emergency_indicators)],
                "estimated_response_time": "Immediate (within 15-30 minutes)"
            }
        else:
            return {
                "is_emergency": False,
                "immediate_actions": [
                    "Monitor symptoms closely",
                    "Contact regular veterinarian",
                    "Keep pet comfortable",
                    "Document symptoms and changes"
                ],
                "nearest_clinics": [],
                "critical_symptoms": [],
                "estimated_response_time": "Within 24 hours"
            }

    def _get_emergency_clinics(self) -> List[Dict[str, Any]]:
        """Get list of emergency clinics"""
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

    async def get_relevant_events(
        self,
        location: str,
        event_type: Optional[str] = None,
        date_range: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get relevant community events"""
        
        # Mock community events
        events = [
            {
                "id": "1",
                "title": "Pet Vaccination Drive",
                "type": "vaccination_drive",
                "date": "2024-02-15",
                "location": "Central Park",
                "description": "Free vaccination drive for pets",
                "organizer": "City Animal Welfare",
                "cost": 0.0
            },
            {
                "id": "2",
                "title": "Pet Adoption Fair",
                "type": "adoption_camp",
                "date": "2024-02-20",
                "location": "Community Center",
                "description": "Find your perfect companion",
                "organizer": "Local Shelter",
                "cost": 0.0
            }
        ]
        
        # Filter by event type if specified
        if event_type:
            events = [e for e in events if e["type"] == event_type]
        
        return {
            "events": events,
            "recommended_events": events[:2]  # Top 2 recommendations
        }

    def is_ready(self) -> bool:
        """Check if AI engine is ready"""
        return self.is_initialized 