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
from utils.enhanced_ai_vet_assistant import enhanced_ai_vet
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
security = HTTPBearer(auto_error=False)  # Make authentication optional

# Initialize services
blockchain_client = BlockchainClient()
mongo_manager = MongoDBManager()
redis_manager = RedisManager()

# Initialize conversational AI instances (one per session)
conversational_ai_instances = {}

async def get_or_create_conversational_ai(session_id: str) -> ConversationalAIVet:
    """Get or create a conversational AI instance for a session"""
    if session_id not in conversational_ai_instances:
        ai_instance = ConversationalAIVet(mongo_manager, redis_manager)
        await ai_instance.initialize()
        conversational_ai_instances[session_id] = ai_instance
    return conversational_ai_instances[session_id]

def cleanup_old_sessions():
    """Clean up old sessions (optional - for memory management)"""
    # This could be implemented to remove sessions older than X hours
    pass

async def background_cleanup_task():
    """Background task to clean up expired temporary sessions periodically"""
    import asyncio
    while True:
        try:
            # Clean up expired sessions every 30 minutes for temporary sessions
            await asyncio.sleep(1800)  # Wait 30 minutes
            
            # Clean up Redis expired sessions (MongoDB not used for temporary sessions)
            redis_cleaned = await redis_manager.cleanup_expired_sessions()
            
            print(f"Background cleanup: Redis expired sessions={redis_cleaned}")
            
        except Exception as e:
            print(f"Error in background cleanup task: {e}")

@app.on_event("startup")
async def startup_event():
    """Initialize AI Vet Assistant and services on startup"""
    # Initialize database managers first
    await mongo_manager.initialize()
    await redis_manager.initialize()
    
    # Initialize blockchain client
    await blockchain_client.initialize()
    
    # Initialize Enhanced AI Vet Assistant with ALL datasets
    print("Initializing AI Vet Assistant...")
    await enhanced_ai_vet.initialize()
    print("AI Vet Assistant ready with comprehensive veterinary knowledge!")
    
    # Start background cleanup task
    import asyncio
    asyncio.create_task(background_cleanup_task())

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": f"{enhanced_ai_vet.name} is running in conversational mode",
        "version": "2.1.0",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "ai_vet": enhanced_ai_vet.is_initialized,
        "blockchain": blockchain_client.is_connected,
        "mongodb": mongo_manager.is_connected,
        "redis": redis_manager.is_connected
    }

# Pydantic models for conversational AI
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    pet_info: Optional[Dict[str, Any]] = None
    location: Optional[Dict[str, float]] = None

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
    background_tasks: BackgroundTasks
    # token: Optional[str] = Depends(security)  # COMMENTED OUT - NON-LOGGED USERS ONLY
):
    """
    Main conversational chat endpoint with AI Vet Assistant - NON-LOGGED USERS ONLY
    
    This endpoint provides natural, step-by-step veterinary consultations.
    The AI will gradually gather information and provide personalized advice.
    """
    try:
        # NON-LOGGED USERS ONLY - NO AUTHENTICATION
        user_id = f"temp_user_{request.session_id or 'anonymous'}"
        
        # Check rate limit
        rate_limit_key = f"ai_vet_chat:{user_id}"
        if not await redis_manager.check_rate_limit(rate_limit_key, 30, 3600):  # 30 requests per hour
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
        
        # Generate session ID if not provided
        session_id = request.session_id or f"session_{user_id}_{datetime.utcnow().timestamp()}"
        
        # Get or create conversational AI instance for this session
        conversational_ai = await get_or_create_conversational_ai(session_id)
        
        # Get AI response with conversation memory
        response = await conversational_ai.chat(request.message)
        
        # Save session state to Redis for temporary session storage
        await conversational_ai.save_session_to_redis(f"{user_id}_{session_id}")
        
        await redis_manager.store_chat_message(
            session_id=session_id,
            message=request.message,
            message_type="user",
            metadata={"timestamp": datetime.utcnow().isoformat()},
            ttl_seconds=3600  # 1 hour for temporary sessions
        )
        
        await redis_manager.store_chat_message(
            session_id=session_id,
            message=response,
            message_type="assistant",
            metadata={
                "timestamp": datetime.utcnow().isoformat(),
                "emergency_detected": False
            },
            ttl_seconds=3600  # 1 hour for temporary sessions
        )
        
        # Store interaction for analytics (simplified for non-logged users)
        background_tasks.add_task(
            redis_manager.store_user_interaction,
            user_id=user_id,
            interaction_type="ai_vet_conversational_chat",
            interaction_data={
                "message": request.message,
                "response": response,
                "emergency_detected": False,
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
            session_id=session_id,
            timestamp=datetime.utcnow().isoformat(),
            pet_profile=conversational_ai.pet_profile.to_dict(),
            location_set=False,
            emergency_detected=False
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
        
        # For non-logged users, we don't have location functionality
        return {
            "message": "Location-based vet search is not available for non-logged users. Please log in to access this feature.",
            "searches": []
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
        
        # For non-logged users, we don't have location functionality
        return {
            "message": "Location-based specialist search is not available for non-logged users. Please log in to access this feature.",
            "searches": []
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
        
        # For non-logged users, reminders are not available
        return {
            "message": "Reminder functionality is not available for non-logged users. Please log in to access this feature.",
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
        
        # For non-logged users, reminders are not available
        return {
            "message": "Reminder functionality is not available for non-logged users. Please log in to access this feature.",
            "reminders": []
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
        
        # For non-logged users, we can provide a basic summary
        return {
            "summary": "This is a temporary session. Please log in to access full consultation summaries.",
            "session_duration": 0,
            "pet_profile": {},
            "location": None
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting summary: {str(e)}")

@app.get("/chat/history")
async def get_chat_history(
    session_id: str,
    limit: int = 50,
    token: str = Depends(security)
):
    """Get chat history for a session"""
    try:
        user_id = await verify_token(token.credentials)
        
        # Get or create session for this user
        session_ai = await get_or_create_session(user_id, session_id)
        
        # Get chat history from databases
        messages = await session_ai.get_chat_history_from_databases(session_id, limit)
        
        return {
            "session_id": session_id,
            "messages": messages,
            "total_count": len(messages),
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting chat history: {str(e)}")

# COMMENTED OUT - LOGGED IN USER ENDPOINT
# @app.get("/chat/sessions")
async def get_user_sessions(
    limit: int = 10,
    token: str = Depends(security)
):
    """Get user's chat sessions"""
    try:
        user_id = await verify_token(token.credentials)
        
        # Get or create session for this user
        session_ai = await get_or_create_session(user_id)
        
        # Get user sessions
        sessions = await session_ai.get_user_sessions(user_id, limit)
        
        return {
            "user_id": user_id,
            "sessions": sessions,
            "total_count": len(sessions),
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting user sessions: {str(e)}")

# COMMENTED OUT - LOGGED IN USER ENDPOINT
# @app.post("/chat/session/end")
async def end_chat_session(
    session_id: str,
    token: str = Depends(security)
):
    """End a chat session"""
    try:
        user_id = await verify_token(token.credentials)
        
        # Get or create session for this user
        session_ai = await get_or_create_session(user_id, session_id)
        
        # End the session
        success = await session_ai.end_session(user_id, session_id)
        
        if success:
            return {
                "message": "Session ended successfully",
                "session_id": session_id,
                "timestamp": datetime.utcnow().isoformat()
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to end session")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error ending session: {str(e)}")

# COMMENTED OUT - LOGGED IN USER ENDPOINT  
# @app.post("/chat/session/extend")
async def extend_session_ttl(
    session_id: str,
    token: str = Depends(security)
):
    """Extend session TTL"""
    try:
        user_id = await verify_token(token.credentials)
        
        # Get or create session for this user
        session_ai = await get_or_create_session(user_id, session_id)
        
        # Extend session TTL
        success = await session_ai.extend_session_ttl(user_id, session_id)
        
        if success:
            return {
                "message": "Session TTL extended successfully",
                "session_id": session_id,
                "timestamp": datetime.utcnow().isoformat()
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to extend session TTL")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extending session TTL: {str(e)}")

# COMMENTED OUT - LOGGED IN USER ENDPOINT
# @app.get("/chat/session/{session_id}/messages")
async def get_session_messages(
    session_id: str,
    limit: int = 50,
    offset: int = 0,
    token: str = Depends(security)
):
    """Get messages for a specific session"""
    try:
        user_id = await verify_token(token.credentials)
        
        # Get messages from MongoDB directly
        messages = await mongo_manager.get_chat_messages(session_id, limit, offset)
        
        return {
            "session_id": session_id,
            "messages": messages,
            "limit": limit,
            "offset": offset,
            "total_count": len(messages),
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting session messages: {str(e)}")

# COMMENTED OUT - ADMIN ENDPOINT
# @app.post("/admin/cleanup/sessions")
async def cleanup_old_sessions(
    days_old: int = 30,
    token: str = Depends(security)
):
    """Clean up old inactive sessions (Admin only)"""
    try:
        user_id = await verify_token(token.credentials)
        
        # TODO: Add admin role check here
        # For now, allow any authenticated user
        
        # Clean up MongoDB sessions
        mongo_cleaned = await mongo_manager.cleanup_old_sessions(days_old)
        
        # Clean up Redis sessions
        redis_cleaned = await redis_manager.cleanup_expired_sessions()
        
        return {
            "message": "Session cleanup completed",
            "mongo_sessions_cleaned": mongo_cleaned,
            "redis_sessions_cleaned": redis_cleaned,
            "days_old": days_old,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error cleaning up sessions: {str(e)}")

# COMMENTED OUT - ADMIN ENDPOINT
# @app.get("/admin/stats/sessions")
async def get_session_stats(
    token: str = Depends(security)
):
    """Get session statistics (Admin only)"""
    try:
        user_id = await verify_token(token.credentials)
        
        # TODO: Add admin role check here
        # For now, allow any authenticated user
        
        # Get active sessions from Redis
        active_sessions = await redis_manager.get_user_active_sessions("*")
        
        return {
            "active_sessions_count": len(active_sessions),
            "active_sessions": active_sessions[:10],  # Show first 10
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting session stats: {str(e)}")

@app.get("/ai-vet/info")
async def get_ai_vet_info():
    """Get information about the AI Vet Assistant"""
    return {
        "name": enhanced_ai_vet.name,
        "version": "3.0.0",
        "mode": "conversational_with_ml",
        "capabilities": [
            "9,060+ veterinary cases database",
            "ML-powered disease prediction",
            "Breed-specific health recommendations",
            "Emergency detection and escalation",
            "Nutrition and care advice",
            "Natural conversation flow",
            "Symptom analysis with dataset matching",
            "Real-time vet recommendations",
            "Species-specific advice for all animals",
            "Location-based vet recommendations"
        ],
        "datasets": {
            "veterinary_cases": "9,060+ cases",
            "nutrition_data": "4 comprehensive datasets",
            "breed_health": "Breed-specific health data",
            "training_data": "ML-ready training sets"
        },
        "emergency_keywords": enhanced_ai_vet.emergency_keywords,
        "status": "ready" if enhanced_ai_vet.is_initialized else "initializing"
    }



if __name__ == "__main__":
    uvicorn.run(
        "main_conversational:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
