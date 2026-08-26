import os
import logging
from fastapi import APIRouter
from config import settings
import schemas

logger = logging.getLogger("salus_ai")
router = APIRouter(tags=["Salus AI Assistant"])

SALUS_SYSTEM_PROMPT = """You are Dr. Salus, an empathetic, highly knowledgeable veterinary AI assistant for Zoodo Pet Health Platform.
Your goal is to guide pet parents with clear, compassionate, and medically sound advice.

Rules:
1. Always ask for the pet's species, breed, and age if not provided.
2. If symptoms suggest an emergency (difficulty breathing, seizures, suspected toxin ingestion like chocolate/xylitol/grapes, bloat, extreme lethargy), immediately advise seeing an emergency vet.
3. Be warm, supportive, and structure answers clearly with bullet points.
4. Always clarify that while you provide veterinary guidance, hands-on physical examinations by a licensed veterinarian are essential for definitive diagnosis and treatment.
"""

def generate_ai_response(user_message: str, conversation_history: list = None) -> str:
    api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
    if not api_key:
        return (
            "Hello! I am Dr. Salus, your veterinary AI assistant. "
            "Please configure your `GEMINI_API_KEY` in the backend `.env` file to enable live AI responses. "
            f"Regarding your query: '{user_message}' - please monitor your pet closely and consult a licensed veterinarian for urgent concerns."
        )

    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        
        # Build contents from history if available
        prompt = f"{SALUS_SYSTEM_PROMPT}\n\nUser: {user_message}\nDr. Salus:"
        
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )
        return response.text
    except Exception as e:
        logger.error(f"Gemini API call failed: {e}")
        # Fallback to smart offline response
        return (
            "I'm Dr. Salus. I'm currently operating in offline mode. "
            f"You asked: '{user_message}'. If your pet is showing acute distress, vomiting repeatedly, or in pain, please visit a local emergency clinic right away."
        )

@router.post("/chat", response_model=schemas.ApiResponse[schemas.AIChatResponseData])
def chat(payload: schemas.AIChatRequest):
    msg_lower = payload.message.lower()
    
    # Simple emergency detection check
    emergency_keywords = ["seizure", "unconscious", "poison", "chocolate", "xylitol", "antifreeze", "not breathing", "collapsed"]
    is_emergency = any(k in msg_lower for k in emergency_keywords)
    
    response_text = generate_ai_response(payload.message, payload.conversation_history)
    
    return schemas.ApiResponse(
        success=True,
        message="AI response generated",
        data=schemas.AIChatResponseData(
            response=response_text,
            session_id=payload.session_id or "session_1",
            emergency_detected=is_emergency,
            places_data=[]
        )
    )

@router.get("/health")
def ai_health():
    return {
        "status": "healthy",
        "service": "Salus AI",
        "provider": "google-gemini" if settings.GEMINI_API_KEY else "offline-fallback"
    }
