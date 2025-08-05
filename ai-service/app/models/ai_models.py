from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class SymptomAnalysisRequest(BaseModel):
    pet_id: Optional[str] = None
    species: str = Field(..., description="Pet species (dog, cat, etc.)")
    breed: Optional[str] = Field(None, description="Pet breed")
    age: Optional[int] = Field(None, description="Pet age in years")
    symptoms: List[str] = Field(..., description="List of symptoms observed")
    behavior_changes: Optional[List[str]] = Field(None, description="Changes in behavior")
    duration: Optional[str] = Field(None, description="How long symptoms have been present")
    severity: Optional[str] = Field("medium", description="Symptom severity level")

class ProviderRecommendationRequest(BaseModel):
    user_location: Dict[str, float] = Field(..., description="User location coordinates")
    pet_species: str = Field(..., description="Pet species")
    pet_breed: Optional[str] = Field(None, description="Pet breed")
    service_type: str = Field(..., description="Type of service needed (veterinary, training)")
    urgency_level: str = Field("medium", description="Urgency level")
    budget_range: Optional[Dict[str, float]] = Field(None, description="Budget range")
    preferred_specialization: Optional[str] = Field(None, description="Preferred specialization")
    max_distance: Optional[float] = Field(50.0, description="Maximum distance in km")

class CareRoutineRequest(BaseModel):
    species: str = Field(..., description="Pet species")
    breed: Optional[str] = Field(None, description="Pet breed")
    age: Optional[int] = Field(None, description="Pet age in years")
    weight: Optional[float] = Field(None, description="Pet weight in kg")
    health_conditions: Optional[List[str]] = Field(None, description="Existing health conditions")
    activity_level: Optional[str] = Field("moderate", description="Activity level")
    dietary_restrictions: Optional[List[str]] = Field(None, description="Dietary restrictions")

class SymptomAnalysisResponse(BaseModel):
    analysis: str = Field(..., description="AI analysis of symptoms")
    urgency_level: str = Field(..., description="Urgency level (low, medium, high, emergency)")
    confidence_score: float = Field(..., description="AI confidence score (0-1)")
    recommended_actions: List[str] = Field(..., description="Recommended immediate actions")
    potential_conditions: List[str] = Field(..., description="Potential medical conditions")
    should_see_vet: bool = Field(..., description="Whether veterinary attention is needed")

class ProviderRecommendationResponse(BaseModel):
    providers: List[Dict[str, Any]] = Field(..., description="List of recommended providers")
    total_found: int = Field(..., description="Total number of providers found")
    confidence_score: float = Field(..., description="Recommendation confidence score")
    reasoning: str = Field(..., description="Explanation for recommendations")

class CareRoutineResponse(BaseModel):
    daily_routine: Dict[str, Any] = Field(..., description="Daily care routine")
    diet_recommendations: Dict[str, Any] = Field(..., description="Diet recommendations")
    exercise_plan: Dict[str, Any] = Field(..., description="Exercise plan")
    grooming_schedule: Dict[str, Any] = Field(..., description="Grooming schedule")
    health_monitoring: Dict[str, Any] = Field(..., description="Health monitoring checklist")

class EmergencyAssessmentResponse(BaseModel):
    is_emergency: bool = Field(..., description="Whether this is an emergency situation")
    immediate_actions: List[str] = Field(..., description="Immediate actions to take")
    nearest_clinics: List[Dict[str, Any]] = Field(..., description="Nearest emergency clinics")
    critical_symptoms: List[str] = Field(..., description="Critical symptoms identified")
    estimated_response_time: str = Field(..., description="Estimated emergency response time")

class CommunityEventResponse(BaseModel):
    events: List[Dict[str, Any]] = Field(..., description="List of community events")
    total_events: int = Field(..., description="Total number of events")
    recommended_events: List[Dict[str, Any]] = Field(..., description="AI-recommended events") 