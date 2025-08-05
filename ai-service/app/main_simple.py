from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import os

# Create FastAPI app
app = FastAPI(
    title="Zoodo AI Service",
    description="AI-powered pet care assistant for symptom analysis and recommendations",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class SymptomAnalysisRequest(BaseModel):
    pet_id: Optional[str] = None
    species: str
    breed: Optional[str] = None
    age: Optional[int] = None
    symptoms: List[str]
    behavior_changes: Optional[List[str]] = None
    duration: Optional[str] = None
    severity: Optional[str] = "medium"

class SymptomAnalysisResponse(BaseModel):
    analysis: str
    urgency_level: str
    confidence_score: float
    recommended_actions: List[str]
    suggested_providers: List[str]

class ProviderRecommendationRequest(BaseModel):
    pet_species: str
    pet_breed: Optional[str] = None
    symptoms: List[str]
    location: Optional[Dict[str, float]] = None
    user_type: str = "veterinarian"

class ProviderRecommendationResponse(BaseModel):
    providers: List[Dict[str, Any]]
    total_count: int
    reasoning: str

class CareRoutineRequest(BaseModel):
    pet_species: str
    pet_breed: Optional[str] = None
    pet_age: Optional[int] = None
    health_conditions: Optional[List[str]] = None
    lifestyle: Optional[str] = None

class CareRoutineResponse(BaseModel):
    daily_routine: List[str]
    weekly_routine: List[str]
    diet_recommendations: List[str]
    exercise_suggestions: List[str]
    health_monitoring: List[str]

# Mock AI Engine
class SimpleAIEngine:
    def __init__(self):
        self.symptom_database = {
            "dog": {
                "lethargy": {"urgency": "medium", "actions": ["Monitor closely", "Check temperature"], "providers": ["veterinarian"]},
                "vomiting": {"urgency": "high", "actions": ["Seek immediate care", "Withhold food"], "providers": ["veterinarian"]},
                "limping": {"urgency": "medium", "actions": ["Rest", "Check for injury"], "providers": ["veterinarian"]},
                "coughing": {"urgency": "medium", "actions": ["Monitor", "Check for respiratory issues"], "providers": ["veterinarian"]}
            },
            "cat": {
                "lethargy": {"urgency": "high", "actions": ["Seek immediate care", "Check for dehydration"], "providers": ["veterinarian"]},
                "not eating": {"urgency": "high", "actions": ["Seek immediate care", "Check for underlying issues"], "providers": ["veterinarian"]},
                "hiding": {"urgency": "medium", "actions": ["Monitor behavior", "Check environment"], "providers": ["veterinarian"]},
                "urination issues": {"urgency": "high", "actions": ["Seek immediate care", "Check for UTI"], "providers": ["veterinarian"]}
            }
        }
    
    def analyze_symptoms(self, species: str, symptoms: List[str]) -> Dict[str, Any]:
        """Analyze symptoms and provide recommendations"""
        analysis = f"Analysis for {species} with symptoms: {', '.join(symptoms)}"
        
        # Find the highest urgency level among symptoms
        urgency_levels = []
        recommended_actions = []
        suggested_providers = []
        
        for symptom in symptoms:
            if species in self.symptom_database and symptom in self.symptom_database[species]:
                symptom_info = self.symptom_database[species][symptom]
                urgency_levels.append(symptom_info["urgency"])
                recommended_actions.extend(symptom_info["actions"])
                suggested_providers.extend(symptom_info["providers"])
        
        # Determine overall urgency
        if not urgency_levels:
            overall_urgency = "low"
        elif "high" in urgency_levels:
            overall_urgency = "high"
        elif "medium" in urgency_levels:
            overall_urgency = "medium"
        else:
            overall_urgency = "low"
        
        return {
            "analysis": analysis,
            "urgency_level": overall_urgency,
            "confidence_score": 0.85,
            "recommended_actions": list(set(recommended_actions)),
            "suggested_providers": list(set(suggested_providers))
        }
    
    def recommend_providers(self, species: str, symptoms: List[str], user_type: str) -> Dict[str, Any]:
        """Recommend providers based on symptoms"""
        providers = [
            {
                "id": "1",
                "name": "Dr. Sarah Smith",
                "specialization": "General Veterinary",
                "rating": 4.8,
                "experience": "10 years",
                "location": {"lat": 40.7128, "lng": -74.0060},
                "available": True
            },
            {
                "id": "2", 
                "name": "Dr. Mike Johnson",
                "specialization": "Emergency Care",
                "rating": 4.9,
                "experience": "15 years",
                "location": {"lat": 40.7589, "lng": -73.9851},
                "available": True
            }
        ]
        
        return {
            "providers": providers,
            "total_count": len(providers),
            "reasoning": f"Recommended {len(providers)} {user_type}s based on symptoms: {', '.join(symptoms)}"
        }
    
    def suggest_care_routine(self, species: str, breed: Optional[str] = None, age: Optional[int] = None) -> Dict[str, Any]:
        """Suggest care routine for pet"""
        daily_routine = [
            "Fresh water available 24/7",
            "Regular feeding schedule",
            "Daily exercise and playtime",
            "Grooming and hygiene check"
        ]
        
        weekly_routine = [
            "Thorough grooming session",
            "Health check and monitoring",
            "Environmental enrichment activities"
        ]
        
        diet_recommendations = [
            "High-quality commercial pet food",
            "Appropriate portion sizes",
            "Treats in moderation"
        ]
        
        exercise_suggestions = [
            "Daily walks for dogs",
            "Interactive play sessions",
            "Mental stimulation activities"
        ]
        
        health_monitoring = [
            "Regular weight monitoring",
            "Behavior observation",
            "Appetite and energy level tracking"
        ]
        
        return {
            "daily_routine": daily_routine,
            "weekly_routine": weekly_routine,
            "diet_recommendations": diet_recommendations,
            "exercise_suggestions": exercise_suggestions,
            "health_monitoring": health_monitoring
        }

# Initialize AI engine
ai_engine = SimpleAIEngine()

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Zoodo AI Service", "version": "1.0.0"}

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to Zoodo AI Service", "docs": "/docs"}

# Symptom analysis endpoint
@app.post("/analyze-symptoms", response_model=SymptomAnalysisResponse)
async def analyze_symptoms(request: SymptomAnalysisRequest):
    """Analyze pet symptoms and provide recommendations"""
    try:
        result = ai_engine.analyze_symptoms(request.species, request.symptoms)
        return SymptomAnalysisResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# Provider recommendation endpoint
@app.post("/recommend-providers", response_model=ProviderRecommendationResponse)
async def recommend_providers(request: ProviderRecommendationRequest):
    """Recommend providers based on pet needs"""
    try:
        result = ai_engine.recommend_providers(
            request.pet_species, 
            request.symptoms, 
            request.user_type
        )
        return ProviderRecommendationResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {str(e)}")

# Care routine suggestion endpoint
@app.post("/suggest-care-routine", response_model=CareRoutineResponse)
async def suggest_care_routine(request: CareRoutineRequest):
    """Suggest care routine for pet"""
    try:
        result = ai_engine.suggest_care_routine(
            request.pet_species,
            request.pet_breed,
            request.pet_age
        )
        return CareRoutineResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Care routine suggestion failed: {str(e)}")

# Emergency assessment endpoint
@app.post("/emergency-assessment")
async def emergency_assessment(request: SymptomAnalysisRequest):
    """Assess if symptoms require emergency care"""
    try:
        result = ai_engine.analyze_symptoms(request.species, request.symptoms)
        is_emergency = result["urgency_level"] == "high"
        
        return {
            "is_emergency": is_emergency,
            "urgency_level": result["urgency_level"],
            "immediate_actions": result["recommended_actions"],
            "should_seek_care": is_emergency
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Emergency assessment failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 