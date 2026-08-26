import re
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Any, Generic, TypeVar
from datetime import datetime

T = TypeVar("T")

# Unified API Response wrapper matching frontend ApiResponse<T>
class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str = "Success"
    data: Optional[T] = None
    error: Optional[str] = None

# Instagram-Style Username Validation Regex:
# 3-30 chars, alphanumeric + underscores + periods, no consecutive periods, no spaces
USERNAME_REGEX = re.compile(r"^(?!.*\.\.)(?!.*\.$)[a-z0-9_.]{3,30}$")
EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

def sanitize_username(val: str) -> str:
    if not val:
        raise ValueError("Username cannot be empty")
    cleaned = val.strip().lstrip("@").lower()
    if not USERNAME_REGEX.match(cleaned):
        raise ValueError(
            "Username must be 3-30 characters long and can only contain lowercase letters, numbers, underscores (_), and periods (.)."
        )
    return cleaned

def sanitize_email(val: str) -> str:
    if not val:
        raise ValueError("Email cannot be empty")
    cleaned = val.strip().lower()
    if not EMAIL_REGEX.match(cleaned):
        raise ValueError("Please enter a valid email address.")
    return cleaned

class UsernameCheckResponse(BaseModel):
    available: bool
    username: str
    message: str
    suggestions: Optional[List[str]] = None

# Pet Item Schema (for Pet Owner Registration)
class PetRegisterItem(BaseModel):
    name: str
    species: str = "Dog"
    customSpecies: Optional[str] = None
    breed: Optional[str] = None
    gender: Optional[str] = "unknown"
    birthday: Optional[str] = None
    age: Optional[int] = None
    ageUnit: Optional[str] = "Years"
    weight: Optional[float] = None
    weightUnit: Optional[str] = "Kgs"
    microchip: Optional[str] = None
    sterilized: Optional[bool] = False

# Pet Creation Schema (for /pets endpoint)
class PetCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    species: str = "Dog"
    customSpecies: Optional[str] = None
    breed: Optional[str] = None
    gender: Optional[str] = "unknown"
    birthday: Optional[str] = None
    age: Optional[int] = None
    ageUnit: Optional[str] = "Years"
    weight: Optional[float] = None
    weightUnit: Optional[str] = "Kgs"
    microchip: Optional[str] = None
    sterilized: Optional[bool] = False

# Registration: Pet Owner
class PetOwnerRegisterRequest(BaseModel):
    firstName: str = Field(..., min_length=1, max_length=100)
    lastName: str = Field(..., min_length=1, max_length=100)
    username: str
    email: str
    password: str = Field(..., min_length=6)
    phoneNumber: Optional[str] = None
    city: Optional[str] = None
    pets: Optional[List[PetRegisterItem]] = None

    @field_validator("username")
    @classmethod
    def validate_username(cls, v):
        return sanitize_username(v)

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        return sanitize_email(v)

# Registration: Business (All 8 Verticals)
class BusinessRegisterRequest(BaseModel):
    firstName: str = Field(..., min_length=1, max_length=100)
    lastName: str = Field(..., min_length=1, max_length=100)
    username: str
    email: str
    password: str = Field(..., min_length=6)
    businessName: str = Field(..., min_length=2, max_length=200)
    categories: List[str] = Field(..., min_length=1) # e.g. ["veterinarian", "hotel"]
    phoneNumber: Optional[str] = None
    city: Optional[str] = None

    @field_validator("username")
    @classmethod
    def validate_username(cls, v):
        return sanitize_username(v)

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        return sanitize_email(v)

# Login Request (Accepts either email OR @username!)
class LoginRequest(BaseModel):
    email: str # Can be email or username
    password: str

# OTP Verification
class OtpVerifyRequest(BaseModel):
    email: str
    code: str = Field(..., min_length=6, max_length=6)

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        return sanitize_email(v)

class OtpResendRequest(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        return sanitize_email(v)

# Google OAuth / Firebase Handshake
class GoogleAuthRequest(BaseModel):
    email: str
    googleId: str
    firstName: str
    lastName: str
    profilePhotoUrl: Optional[str] = None
    username: Optional[str] = None
    userType: Optional[str] = "pet_owner" # "pet_owner" | "business"
    businessName: Optional[str] = None
    categories: Optional[List[str]] = None

    @field_validator("username")
    @classmethod
    def validate_opt_username(cls, v):
        if v:
            return sanitize_username(v)
        return v

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        return sanitize_email(v)

# Auth Response with User and JWT
class AuthResponseData(BaseModel):
    token: str
    user: dict

# Appointment Creation
class AppointmentCreate(BaseModel):
    petId: Optional[str] = None
    providerId: Optional[str] = None
    appointmentDate: str
    type: Optional[str] = "consultation"
    notes: Optional[str] = None

# AI Assistant Chat
class AIChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[dict]] = None
    petId: Optional[str] = None

class AIChatResponseData(BaseModel):
    reply: str
    isEmergency: bool = False
    suggestedActions: Optional[List[str]] = None
