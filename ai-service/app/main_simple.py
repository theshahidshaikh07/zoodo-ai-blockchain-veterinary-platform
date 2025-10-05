from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import uvicorn
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from utils.ai_vet_simple import SimpleAIVetAssistant

app = FastAPI(
    title="Dr. Salus AI Vet Assistant - Simple",
    description="Simple AI-powered virtual veterinary assistant using Google Gemini",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI Vet Assistant
ai_vet = SimpleAIVetAssistant()

@app.on_event("startup")
async def startup_event():
    """Initialize AI Vet Assistant on startup"""
    await ai_vet.initialize()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": f"{ai_vet.name} is running",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "status": "ready"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "ai_vet": ai_vet.is_ready(),
        "provider": "Google Gemini"
    }

# Simple chat models
class ChatRequest(BaseModel):
    message: str
    pet_info: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    response: str
    timestamp: str

@app.post("/chat", response_model=ChatResponse)
async def chat_with_vet(request: ChatRequest):
    """
    Simple chat endpoint with AI Vet Assistant
    
    Just send a message and get veterinary advice from Dr. Salus AI
    """
    try:
        # Process the message with AI Vet Assistant
        result = await ai_vet.process_user_query(
            user_id="simple_user",  # Simple user ID for testing
            query=request.message,
            pet_info=request.pet_info
        )
        
        return ChatResponse(
            response=result["response"],
            timestamp=datetime.utcnow().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")

@app.get("/ai-vet/info")
async def get_ai_vet_info():
    """
    Get information about the AI Vet Assistant
    """
    return {
        "name": ai_vet.name,
        "version": "1.0.0",
        "provider": "Google Gemini",
        "capabilities": [
            "Veterinary advice and consultation",
            "Pet health guidance",
            "Symptom analysis",
            "Care recommendations",
            "Emergency guidance"
        ],
        "status": "ready" if ai_vet.is_ready() else "initializing"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main_simple:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
