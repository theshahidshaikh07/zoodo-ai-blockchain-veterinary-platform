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

from models.ai_models import SymptomAnalysisRequest, ProviderRecommendationRequest, CareRoutineRequest
from utils.conversational_ai_vet import ConversationalAIVet
from utils.blockchain_client import BlockchainClient
from utils.mongodb_manager import MongoDBManager
from utils.redis_manager import RedisManager
from utils.auth import verify_token

app = FastAPI(
    title="Dr. Salus AI Vet Assistant - Conversational",
    description="Conversational AI-powered virtual veterinary assistant for natural pet health consultations",
    version="2.1.0"
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
ai_vet = ConversationalAIVet()
blockchain_client = BlockchainClient()
mongo_manager = MongoDBManager()
redis_manager = RedisManager()

# Session storage for maintaining conversation context
user_sessions = {}

async def get_or_create_session(user_id: str, session_id: str = None) -> ConversationalAIVet:
    """Get existing session or create new one for user"""
    if session_id:
        session_key = f"{user_id}_{session_id}"
    else:
        session_key = f"{user_id}_default"
    
    if session_key not in user_sessions:
        # Create new session
        session_ai = ConversationalAIVet(mongo_manager, redis_manager)
        await session_ai.initialize()
        
        # Try to load from Redis first
        loaded = await session_ai.load_session_from_redis(session_key)
        if loaded:
            print(f"Loaded existing session from Redis for user {user_id}")
        else:
            print(f"Created new session for user {user_id}")
        
        user_sessions[session_key] = session_ai
    else:
        session_ai = user_sessions[session_key]
        print(f"Retrieved existing session from memory for user {user_id}")
    
    return session_ai

def cleanup_old_sessions():
    """Clean up old sessions (optional - for memory management)"""
    # This could be implemented to remove sessions older than X hours
    pass

@app.on_event("startup")
async def startup_event():
    """Initialize AI Vet Assistant and services on startup"""
    # Initialize database managers first
    await mongo_manager.initialize()
    await redis_manager.initialize()
    
    # Initialize blockchain client
    await blockchain_client.initialize()
    
    # Initialize AI Vet Assistant with managers
    ai_vet.mongo_manager = mongo_manager
    ai_vet.redis_manager = redis_manager
    await ai_vet.initialize()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": f"{ai_vet.name} is running in conversational mode",
        "version": "2.1.0",
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

# Pydantic models for conversational AI
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    timestamp: str
    pet_profile: Optional[Dict[str, Any]] = None
    location_set: bool = False
    emergency_detected: bool = False

class LocationRequest(BaseModel):
    city: str
    country: str

class LocationResponse(BaseModel):
    message: str
    location: str

@app.post("/chat", response_model=ChatResponse)
async def chat_with_ai_vet(
    request: ChatRequest,
    background_tasks: BackgroundTasks,
    token: str = Depends(security)
):
    """
    Main conversational chat endpoint with AI Vet Assistant
    
    This endpoint provides natural, step-by-step veterinary consultations.
    The AI will gradually gather information and provide personalized advice.
    """
    try:
        # Verify user token
        user_id = await verify_token(token.credentials)
        
        # Check rate limit
        rate_limit_key = f"ai_vet_chat:{user_id}"
        if not await redis_manager.check_rate_limit(rate_limit_key, 30, 3600):  # 30 requests per hour
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
        
        # Get or create session for this user
        session_ai = await get_or_create_session(user_id, request.session_id)
        
        # Get AI response using the session
        response = await session_ai.chat(request.message)
        
        # Save session state to Redis after each interaction
        session_key = f"{user_id}_{request.session_id}" if request.session_id else f"{user_id}_default"
        await session_ai.save_session_to_redis(session_key)
        
        # Check if emergency was detected
        emergency_detected = session_ai._contains_emergency_keywords(request.message)
        
        # Store interaction for analytics
        background_tasks.add_task(
            redis_manager.store_user_interaction,
            user_id=user_id,
            interaction_type="ai_vet_conversational_chat",
            interaction_data={
                "message": request.message,
                "response": response,
                "emergency_detected": emergency_detected,
                "pet_profile": session_ai.pet_profile.to_dict(),
                "session_id": request.session_id
            }
        )
        
        # Increment analytics counter
        background_tasks.add_task(
            redis_manager.increment_analytics_counter,
            metric_name="ai_vet_conversational_queries"
        )
        
        return ChatResponse(
            response=response,
            session_id=request.session_id or f"session_{user_id}_{datetime.utcnow().timestamp()}",
            timestamp=datetime.utcnow().isoformat(),
            pet_profile=session_ai.pet_profile.to_dict(),
            location_set=session_ai.location.location_set,
            emergency_detected=emergency_detected
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")

@app.post("/location", response_model=LocationResponse)
async def set_location(
    request: LocationRequest,
    session_id: str = None,
    token: str = Depends(security)
):
    """Set user location for vet recommendations"""
    try:
        user_id = await verify_token(token.credentials)
        
        # Get or create session for this user
        session_ai = await get_or_create_session(user_id, session_id)
        
        # Set location in session
        message = session_ai.location.set_location(request.city, request.country)
        
        return LocationResponse(
            message=message,
            location=session_ai.location.get_location_string()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error setting location: {str(e)}")

@app.get("/profile")
async def get_pet_profile(
    session_id: str = None,
    token: str = Depends(security)
):
    """Get current pet profile information"""
    try:
        user_id = await verify_token(token.credentials)
        
        # Get or create session for this user
        session_ai = await get_or_create_session(user_id, session_id)
        
        profile_summary = session_ai.get_profile()
        profile_data = session_ai.pet_profile.to_dict()
        
        return {
            "profile_summary": profile_summary,
            "profile_data": profile_data,
            "location": session_ai.location.get_location_string() if session_ai.location.location_set else None
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting profile: {str(e)}")

@app.get("/find-vet")
async def find_vet(
    emergency: bool = False,
    token: str = Depends(security)
):
    """Get vet search recommendations"""
    try:
        user_id = await verify_token(token.credentials)
        
        if not ai_vet.location.location_set:
            return {
                "message": "Please set your location first using the /location endpoint",
                "searches": []
            }
        
        search_suggestions = ai_vet.find_vet(emergency=emergency)
        
        return {
            "message": search_suggestions,
            "location": ai_vet.location.get_location_string(),
            "emergency": emergency
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error finding vets: {str(e)}")

@app.get("/find-specialist")
async def find_specialist(
    token: str = Depends(security)
):
    """Find specialist vets for exotic animals"""
    try:
        user_id = await verify_token(token.credentials)
        
        if not ai_vet.location.location_set:
            return {
                "message": "Please set your location first using the /location endpoint",
                "searches": []
            }
        
        search_suggestions = ai_vet.find_specialist()
        
        return {
            "message": search_suggestions,
            "location": ai_vet.location.get_location_string()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error finding specialists: {str(e)}")

@app.post("/reminder")
async def set_reminder(
    reminder_text: str,
    days_from_now: int = 7,
    token: str = Depends(security)
):
    """Set a follow-up reminder"""
    try:
        user_id = await verify_token(token.credentials)
        
        result = ai_vet.set_reminder(reminder_text, days_from_now)
        
        return {
            "message": result,
            "reminder_text": reminder_text,
            "days_from_now": days_from_now
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error setting reminder: {str(e)}")

@app.get("/reminders")
async def get_reminders(
    token: str = Depends(security)
):
    """Get all active reminders"""
    try:
        user_id = await verify_token(token.credentials)
        
        reminders = ai_vet.get_reminders()
        
        return {
            "message": reminders,
            "reminders": ai_vet.follow_up_reminders
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting reminders: {str(e)}")

@app.get("/summary")
async def get_consultation_summary(
    token: str = Depends(security)
):
    """Get consultation summary"""
    try:
        user_id = await verify_token(token.credentials)
        
        summary = ai_vet.export_summary()
        
        return {
            "summary": summary,
            "session_duration": (datetime.utcnow() - ai_vet.session_start).seconds // 60,
            "pet_profile": ai_vet.pet_profile.to_dict(),
            "location": ai_vet.location.get_location_string() if ai_vet.location.location_set else None
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting summary: {str(e)}")

@app.get("/ai-vet/info")
async def get_ai_vet_info():
    """Get information about the AI Vet Assistant"""
    return {
        "name": ai_vet.name,
        "version": "2.1.0",
        "mode": "conversational",
        "capabilities": [
            "Natural conversation flow",
            "Step-by-step information gathering",
            "Species-specific advice for all animals",
            "Emergency detection and escalation",
            "Location-based vet recommendations",
            "Follow-up reminders",
            "Consultation summaries"
        ],
        "emergency_keywords": ai_vet.emergency_keywords,
        "status": "ready" if ai_vet.is_ready() else "initializing"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main_conversational:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
