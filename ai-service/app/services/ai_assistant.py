"""
AI Assistant Service - Orchestrates all AI operations
Combines LLM, datasets, and session management
"""

from app.core.llm import GeminiService
from app.services.dataset_service import DatasetService
from app.services.session_service import SessionService
from typing import Dict, Optional, List

class AIAssistantService:
    def __init__(self):
        """Initialize AI Assistant with all required services"""
        self.llm = GeminiService()
        self.dataset = DatasetService()
        self.session = SessionService()
    
    def process_message(
        self, 
        session_id: str, 
        user_message: str,
        user_location: Optional[Dict] = None,
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict:
        """
        Process user message and generate response
        
        Args:
            session_id: Unique session identifier
            user_message: User's message
            user_location: Optional location data for nearby services
        
        Returns:
            Dict with response and metadata
        """
        try:
            # Get or create session
            session = self.session.get_session(session_id)
            
            # Add user message to history
            self.session.add_message(session_id, "user", user_message)
            
            # Detect emergency
            emergency_info = self.llm.detect_emergency(user_message)
            is_emergency = emergency_info["is_emergency"]
            
            if is_emergency:
                self.session.mark_emergency(session_id)
            
            # Get pet context from session for consistent usage
            pet_context = self.session.get_pet_context(session_id)

            # Detect intent: Find Vets/Hospital
            msg_lower = user_message.lower()
            if any(k in msg_lower for k in ["vet", "veterinary", "clinic", "hospital", "doctor"]) and \
               any(k in msg_lower for k in ["find", "search", "near", "location", "where", "closest", "around"]):
                
                # If we don't have location yet, request it
                if not user_location:
                    return {
                        "response": "I can help you find veterinary clinics nearby. To provide accurate recommendations, I need to know your current location. Please allow access when prompted.",
                        "is_emergency": False, # Explicitly False for location requests
                        "session_id": session_id,
                        "action_required": "request_location",
                        "pet_context": pet_context
                    }
                else:
                    # User provided location, fetch real data (or mock)
                    from app.services.places_service import PlacesService
                    places_service = PlacesService()
                    # Extract lat/lng from user_location dict
                    lat = user_location.get("latitude", 0)
                    lng = user_location.get("longitude", 0)
                    
                    clinics = places_service.search_nearby_vets(lat, lng)
                    
                    # Tailor response message based on whether results are exact or fallback
                    is_fallback = clinics and clinics[0].get("is_nearby_fallback", False)
                    user_city = clinics[0].get("user_city") if clinics else None
                    fallback_city = clinics[0].get("fallback_city") if clinics else None

                    if clinics and is_fallback:
                        # Build specific message: "couldn't find in Ahmednagar, showing Pune"
                        if user_city and fallback_city and user_city.lower() != fallback_city.lower():
                            response_msg = (
                                f"I couldn't find any veterinary clinics in **{user_city}** through our current map provider. "
                                f"The nearest I found were in **{fallback_city}** — they may be a drive away, but can definitely help your pet. 🐾"
                            )
                        elif fallback_city:
                            response_msg = (
                                f"No clinics were found in your immediate area, so I've expanded the search. "
                                f"Here are the nearest veterinary clinics found in **{fallback_city}**:"
                            )
                        else:
                            response_msg = "No clinics were found nearby, so I've expanded the search to a wider region. Here are the closest available:"
                    elif clinics:
                        response_msg = "Here are veterinary clinics I found near your location:"
                    else:
                        response_msg = "I wasn't able to find any veterinary clinics nearby using our current map data. Our data coverage may be limited in your area. Please try searching on Google Maps directly."
                    
                    return {
                        "response": response_msg,
                        "is_emergency": False,
                        "session_id": session_id,
                        "action_required": "show_places",
                        "places_data": clinics,
                        "pet_context": pet_context
                    }

            # Get relevant context from datasets (RAG)
            dataset_context = self.dataset.get_context_for_query(user_message)
            
            # Get conversation history (use provided or fetch from session)
            if conversation_history is None:
                conversation_history = self.session.get_conversation_history(session_id)
                # Get pet context from session only if not already retrieved (though we retrieved it above, this handles branching)
                pet_context = self.session.get_pet_context(session_id)
            else:
                # If using custom history (branching), ignore stored pet context to prevent mixing
                # The AI will rely on the provided history to infer context
                pet_context = {}
            
            # Build enhanced prompt with dataset context
            
            # Build enhanced prompt with dataset context
            enhanced_message = user_message
            if dataset_context:
                enhanced_message = f"""Based on the following veterinary knowledge:

{dataset_context}

User's question: {user_message}

Please provide a helpful, accurate response using the above information as reference."""
            
            # Generate AI response
            ai_response = self.llm.generate_response(
                user_message=enhanced_message,
                conversation_history=conversation_history,
                pet_context=pet_context
            )
            
            # Add AI response to history
            self.session.add_message(session_id, "assistant", ai_response)
            
            # Prepare response
            response_data = {
                "response": ai_response,
                "is_emergency": is_emergency,
                "emergency_severity": emergency_info["severity"],
                "session_id": session_id,
                "message_count": session["message_count"],
                "pet_context": pet_context
            }
            
            # Add action buttons for emergencies
            if is_emergency:
                response_data["suggested_actions"] = [
                    {
                        "type": "connect_vet_online",
                        "label": "Connect with Vet Online",
                        "priority": "high"
                    },
                    {
                        "type": "find_vet_nearby",
                        "label": "Find Vet Clinic Nearby",
                        "priority": "high"
                    }
                ]
            
            return response_data
            
        except Exception as e:
            print(f"Error processing message: {str(e)}")
            return {
                "response": "I apologize, but I encountered an error processing your request. Please try again.",
                "is_emergency": False,
                "error": str(e)
            }
    
    def get_nutrition_advice(
        self,
        session_id: str,
        pet_type: str,
        breed: Optional[str] = None,
        age: Optional[str] = None,
        weight: Optional[float] = None
    ) -> Dict:
        """
        Get nutrition and diet recommendations
        
        Args:
            session_id: Session ID
            pet_type: Type of pet (dog, cat, etc.)
            breed: Breed (optional)
            age: Age or life stage (optional)
            weight: Weight in kg (optional)
        
        Returns:
            Nutrition recommendations
        """
        # Get dataset-based recommendations
        nutrition_info = self.dataset.get_nutrition_recommendations(
            pet_type=pet_type,
            breed=breed,
            age=age
        )
        
        # Enhance with AI-generated personalized advice
        prompt = f"""Provide personalized nutrition advice for:
- Pet Type: {pet_type}
- Breed: {breed or 'Not specified'}
- Age: {age or 'Not specified'}
- Weight: {weight or 'Not specified'} kg

Dataset recommendations:
{nutrition_info}

Please provide additional personalized advice, feeding schedules, and portion recommendations."""
        
        ai_advice = self.llm.generate_response(
            user_message=prompt,
            conversation_history=[],
            pet_context={"type": pet_type, "breed": breed, "age": age, "weight": weight}
        )
        
        return {
            "dataset_recommendations": nutrition_info,
            "personalized_advice": ai_advice,
            "session_id": session_id
        }
    
    def get_session_info(self, session_id: str) -> Dict:
        """Get session information"""
        return self.session.get_session(session_id)
    
    def clear_session(self, session_id: str):
        """Clear a session"""
        self.session.clear_session(session_id)
