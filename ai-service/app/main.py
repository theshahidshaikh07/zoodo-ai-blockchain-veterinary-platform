from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import os
from datetime import datetime
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from .models.ai_models import SymptomAnalysisRequest, ProviderRecommendationRequest, CareRoutineRequest
from .utils.ai_vet_assistant import AIVetAssistant
from .utils.blockchain_client import BlockchainClient
from .utils.mongodb_manager import MongoDBManager
from .utils.redis_manager import RedisManager
from .utils.auth import verify_token

app = FastAPI(
    title="Zoodo AI Vet Assistant",
    description="AI-powered virtual veterinary assistant for pet health, symptom analysis, and care recommendations",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Initialize services
ai_vet = AIVetAssistant()
blockchain_client = BlockchainClient()
mongo_manager = MongoDBManager()
redis_manager = RedisManager()

@app.on_event("startup")
async def startup_event():
    """Initialize AI Vet Assistant and services on startup"""
    await ai_vet.initialize()
    await blockchain_client.initialize()
    await mongo_manager.initialize()
    await redis_manager.initialize()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": f"{ai_vet.name} is running",
        "version": "2.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "ai_vet": ai_vet.is_ready(),
        "blockchain": blockchain_client.is_connected(),
        "mongodb": await mongo_manager.is_connected(),
        "redis": await redis_manager.is_connected()
    }

# New Pydantic models for AI Vet Assistant
class VetQueryRequest(BaseModel):
    query: str
    pet_info: Optional[Dict[str, Any]] = None
    user_location: Optional[Dict[str, float]] = None

class VetQueryResponse(BaseModel):
    response: str
    type: str
    confidence: float
    should_see_vet: bool
    emergency: bool
    urgency_level: Optional[str] = None
    symptoms_identified: Optional[List[str]] = None
    vet_recommendations: Optional[List[Dict[str, Any]]] = None
    care_recommendations: Optional[Dict[str, Any]] = None
    emergency_clinics: Optional[List[Dict[str, Any]]] = None
    immediate_actions: Optional[List[str]] = None

@app.post("/chat", response_model=VetQueryResponse)
async def chat_with_ai_vet(
    request: VetQueryRequest,
    background_tasks: BackgroundTasks,
    token: str = Depends(security)
):
    """
    Main chat endpoint with AI Vet Assistant
    
    This is the primary endpoint for interacting with Dr. Zoodo AI.
    The AI will:
    - Analyze symptoms and provide health advice
    - Recommend vets based on location and symptoms
    - Suggest diet and care routines
    - Handle emergency cases with immediate escalation
    - Only answer veterinary-related questions
    """
    try:
        # Verify user token
        user_id = await verify_token(token.credentials)
        
        # Check rate limit
        rate_limit_key = f"ai_vet_chat:{user_id}"
        if not await redis_manager.check_rate_limit(rate_limit_key, 30, 3600):  # 30 requests per hour
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
        
        # Process query with AI Vet Assistant
        result = await ai_vet.process_user_query(
            user_id=user_id,
            query=request.query,
            pet_info=request.pet_info,
            user_location=request.user_location
        )
        
        # Store interaction for analytics
        background_tasks.add_task(
            redis_manager.store_user_interaction,
            user_id=user_id,
            interaction_type=f"ai_vet_{result['type']}",
            interaction_data={
                "query": request.query,
                "pet_info": request.pet_info,
                "response_type": result['type'],
                "emergency": result.get('emergency', False)
            }
        )
        
        # Increment analytics counter
        background_tasks.add_task(
            redis_manager.increment_analytics_counter,
            metric_name=f"ai_vet_{result['type']}_queries"
        )
        
        return VetQueryResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@app.post("/analyze-symptoms")
async def analyze_symptoms(
    request: SymptomAnalysisRequest,
    background_tasks: BackgroundTasks,
    token: str = Depends(security)
):
    """
    Analyze pet symptoms and provide preliminary assessment
    """
    try:
        # Verify user token
        user_id = await verify_token(token.credentials)
        
        # Convert to AI Vet query format
        query = f"My {request.species} is showing symptoms: {', '.join(request.symptoms)}"
        if request.behavior_changes:
            query += f". Behavior changes: {', '.join(request.behavior_changes)}"
        
        pet_info = {
            "species": request.species,
            "breed": request.breed,
            "age": request.age,
            "pet_id": request.pet_id
        }
        
        # Process with AI Vet Assistant
        result = await ai_vet.process_user_query(
            user_id=user_id,
            query=query,
            pet_info=pet_info
        )
        
        return {
            "analysis": result["response"],
            "urgency_level": result.get("urgency_level", "low"),
            "confidence_score": result["confidence"],
            "recommended_actions": result.get("immediate_actions", []),
            "potential_conditions": result.get("symptoms_identified", []),
            "should_see_vet": result["should_see_vet"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing symptoms: {str(e)}")

@app.post("/recommend-providers")
async def recommend_providers(
    request: ProviderRecommendationRequest,
    token: str = Depends(security)
):
    """
    Recommend suitable veterinarians or trainers based on criteria
    """
    try:
        user_id = await verify_token(token.credentials)
        
        # Convert to AI Vet query format
        query = f"I need to find a {request.service_type} for my {request.pet_species}"
        if request.preferred_specialization:
            query += f" specializing in {request.preferred_specialization}"
        
        pet_info = {
            "species": request.pet_species,
            "breed": request.pet_breed
        }
        
        # Process with AI Vet Assistant
        result = await ai_vet.process_user_query(
            user_id=user_id,
            query=query,
            pet_info=pet_info,
            user_location=request.user_location
        )
        
        return {
            "recommendations": result.get("vet_recommendations", []),
            "total_found": len(result.get("vet_recommendations", [])),
            "confidence_score": result["confidence"],
            "reasoning": result["response"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error recommending providers: {str(e)}")

@app.post("/suggest-care-routine")
async def suggest_care_routine(
    request: CareRoutineRequest,
    token: str = Depends(security)
):
    """
    Suggest personalized care routines and diet recommendations
    """
    try:
        user_id = await verify_token(token.credentials)
        
        # Convert to AI Vet query format
        query = f"What should I feed my {request.species} and how should I care for them?"
        if request.health_conditions:
            query += f" They have health conditions: {', '.join(request.health_conditions)}"
        
        pet_info = {
            "species": request.species,
            "breed": request.breed,
            "age": request.age,
            "weight": request.weight,
            "health_conditions": request.health_conditions
        }
        
        # Process with AI Vet Assistant
        result = await ai_vet.process_user_query(
            user_id=user_id,
            query=query,
            pet_info=pet_info
        )
        
        return {
            "daily_routine": result.get("care_recommendations", {}).get("daily_routine", []),
            "diet_recommendations": result.get("care_recommendations", {}).get("diet", "Consult veterinarian"),
            "exercise_plan": result.get("care_recommendations", {}).get("exercise", "Appropriate for age"),
            "grooming_schedule": result.get("care_recommendations", {}).get("grooming", "Regular maintenance"),
            "health_monitoring": result.get("care_recommendations", {}).get("health_monitoring", {})
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error suggesting care routine: {str(e)}")

@app.post("/emergency-assessment")
async def emergency_assessment(
    request: SymptomAnalysisRequest,
    token: str = Depends(security)
):
    """
    Emergency symptom assessment with higher priority
    """
    try:
        user_id = await verify_token(token.credentials)
        
        # Convert to AI Vet query format with emergency keywords
        query = f"EMERGENCY: My {request.species} is showing symptoms: {', '.join(request.symptoms)}"
        if request.behavior_changes:
            query += f". Behavior changes: {', '.join(request.behavior_changes)}"
        
        pet_info = {
            "species": request.species,
            "breed": request.breed,
            "age": request.age,
            "pet_id": request.pet_id
        }
        
        # Process with AI Vet Assistant
        result = await ai_vet.process_user_query(
            user_id=user_id,
            query=query,
            pet_info=pet_info
        )
        
        return {
            "is_emergency": result["emergency"],
            "immediate_actions": result.get("immediate_actions", []),
            "nearest_emergency_clinics": result.get("emergency_clinics", []),
            "critical_symptoms": result.get("symptoms_identified", []),
            "estimated_response_time": "Immediate" if result["emergency"] else "Within 24 hours"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in emergency assessment: {str(e)}")

@app.get("/community-events")
async def get_relevant_events(
    location: str,
    event_type: Optional[str] = None,
    date_range: Optional[str] = None,
    token: str = Depends(security)
):
    """
    Get relevant community events based on location and preferences
    """
    try:
        user_id = await verify_token(token.credentials)
        
        # Check cache first
        cache_key = f"community_events:{location}:{event_type}:{date_range}"
        cached_result = await redis_manager.get_cached_ai_result(cache_key)
        
        if cached_result:
            return cached_result
        
        # Mock events for now
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
        
        result = {
            "events": events,
            "total_events": len(events),
            "recommended_events": events[:2]  # Top 2 recommendations
        }
        
        # Cache the result
        await redis_manager.cache_ai_result(
            cache_key=cache_key,
            result=result,
            ttl_seconds=1800  # 30 minutes cache
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching community events: {str(e)}")

@app.get("/user/recommendations")
async def get_user_recommendations(
    limit: int = 10,
    token: str = Depends(security)
):
    """
    Get AI recommendations for the authenticated user
    """
    try:
        user_id = await verify_token(token.credentials)
        
        recommendations = await mongo_manager.get_user_recommendations(
            user_id=user_id,
            limit=limit
        )
        
        return {
            "recommendations": recommendations,
            "total_count": len(recommendations)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting user recommendations: {str(e)}")

@app.get("/user/interactions")
async def get_user_interactions(
    limit: int = 10,
    token: str = Depends(security)
):
    """
    Get recent user interactions
    """
    try:
        user_id = await verify_token(token.credentials)
        
        interactions = await redis_manager.get_recent_user_interactions(
            user_id=user_id,
            limit=limit
        )
        
        return {
            "interactions": interactions,
            "total_count": len(interactions)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting user interactions: {str(e)}")

@app.get("/analytics/daily")
async def get_daily_analytics(
    metric_name: str,
    date: Optional[str] = None,
    token: str = Depends(security)
):
    """
    Get daily analytics data
    """
    try:
        user_id = await verify_token(token.credentials)
        
        # Only allow admin users to access analytics
        # You might want to add role-based access control here
        
        counter_value = await redis_manager.get_analytics_counter(
            metric_name=metric_name,
            date=date
        )
        
        return {
            "metric_name": metric_name,
            "date": date or datetime.utcnow().strftime("%Y-%m-%d"),
            "value": counter_value
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting analytics: {str(e)}")

@app.get("/ai-vet/info")
async def get_ai_vet_info():
    """
    Get information about the AI Vet Assistant
    """
    return {
        "name": ai_vet.name,
        "version": "2.0.0",
        "capabilities": [
            "Symptom analysis and health advice",
            "Vet recommendations based on location and symptoms",
            "Diet and care suggestions",
            "Emergency handling",
            "Integration with Spring Boot backend",
            "MongoDB/Redis data storage"
        ],
        "emergency_keywords": ai_vet.emergency_keywords,
        "vet_topics": ai_vet.vet_topics,
        "status": "ready" if ai_vet.is_ready() else "initializing"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
