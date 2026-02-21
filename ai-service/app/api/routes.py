"""
API Routes for Dr. Salus AI
"""

from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from app.services.ai_assistant import AIAssistantService

router = APIRouter()

# Initialize AI Assistant Service
ai_assistant = AIAssistantService()

# Request/Response Models
class ChatRequest(BaseModel):
    message: str = Field(..., description="User's message")
    session_id: str = Field(..., description="Session ID for conversation tracking")
    location: Optional[Dict] = Field(None, description="User's location for nearby services")
    conversation_history: Optional[List[Dict[str, str]]] = Field(None, description="Optional conversation history to override stored context")

class ChatResponse(BaseModel):
    success: bool
    data: Optional[Dict] = None
    error: Optional[str] = None
    action_required: Optional[str] = None
    places_data: Optional[List[Dict]] = None

class NutritionRequest(BaseModel):
    session_id: str
    pet_type: str
    breed: Optional[str] = None
    age: Optional[str] = None
    weight: Optional[float] = None

class SessionRequest(BaseModel):
    session_id: str

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint for Dr. Salus AI
    
    Processes user messages and returns AI-generated responses
    """
    try:
        result = ai_assistant.process_message(
            session_id=request.session_id,
            user_message=request.message,
            user_location=request.location,
            conversation_history=request.conversation_history
        )
        
        return ChatResponse(
            success=True,
            data=result,
            action_required=result.get("action_required"),
            places_data=result.get("places_data")
        )
    
    except Exception as e:
        print(f"Chat error: {str(e)}")
        return ChatResponse(
            success=False,
            error=str(e)
        )

@router.post("/nutrition", response_model=ChatResponse)
async def get_nutrition_advice(request: NutritionRequest):
    """
    Get nutrition and diet recommendations
    """
    try:
        result = ai_assistant.get_nutrition_advice(
            session_id=request.session_id,
            pet_type=request.pet_type,
            breed=request.breed,
            age=request.age,
            weight=request.weight
        )
        
        return ChatResponse(
            success=True,
            data=result
        )
    
    except Exception as e:
        print(f"Nutrition advice error: {str(e)}")
        return ChatResponse(
            success=False,
            error=str(e)
        )

@router.post("/session/info", response_model=ChatResponse)
async def get_session_info(request: SessionRequest):
    """
    Get session information including conversation history and pet context
    """
    try:
        session_info = ai_assistant.get_session_info(request.session_id)
        
        return ChatResponse(
            success=True,
            data=session_info
        )
    
    except Exception as e:
        print(f"Session info error: {str(e)}")
        return ChatResponse(
            success=False,
            error=str(e)
        )

@router.post("/session/clear", response_model=ChatResponse)
async def clear_session(request: SessionRequest):
    """
    Clear a conversation session
    """
    try:
        ai_assistant.clear_session(request.session_id)
        
        return ChatResponse(
            success=True,
            data={"message": "Session cleared successfully"}
        )
    
    except Exception as e:
        print(f"Clear session error: {str(e)}")
        return ChatResponse(
            success=False,
            error=str(e)
        )

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Dr. Salus AI",
        "version": "1.0.0"
    }
