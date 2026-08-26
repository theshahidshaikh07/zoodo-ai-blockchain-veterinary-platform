import uuid
from datetime import datetime
import json
from sqlalchemy import Column, String, Boolean, Integer, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    # Instagram-style unique lowercase handle
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True) # nullable for pure Google OAuth users
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    user_type = Column(String(50), default="pet_owner", nullable=False) # "pet_owner" | "business"
    
    phone = Column(String(50), nullable=True)
    city = Column(String(100), nullable=True)
    profile_photo_url = Column(String(500), nullable=True)
    
    google_id = Column(String(255), unique=True, index=True, nullable=True)
    is_verified = Column(Boolean, default=False) # True immediately for Google users, False for email until OTP
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    pets = relationship("Pet", back_populates="owner", cascade="all, delete-orphan")
    business_profile = relationship("BusinessProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")

class BusinessProfile(Base):
    __tablename__ = "business_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False)
    business_name = Column(String(200), nullable=False)
    # Stores JSON array of categories: e.g. ["veterinarian", "hotel", "grooming"]
    categories_json = Column(Text, default="[]", nullable=False)
    
    description = Column(Text, nullable=True)
    phone = Column(String(50), nullable=True)
    website = Column(String(255), nullable=True)
    address = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    pincode = Column(String(20), nullable=True)
    open_hours = Column(String(255), nullable=True)
    
    # Financial & Legal verification
    gst = Column(String(50), nullable=True)
    pan = Column(String(50), nullable=True)
    bank_account = Column(String(100), nullable=True)
    upi = Column(String(100), nullable=True)
    
    # Status: "pending", "under_review", "verified", "needs_action"
    verification_status = Column(String(50), default="pending")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="business_profile")
    documents = relationship("BusinessDocument", back_populates="business", cascade="all, delete-orphan")

    @property
    def categories(self) -> list:
        try:
            return json.loads(self.categories_json) if self.categories_json else []
        except Exception:
            return []

    @categories.setter
    def categories(self, val: list):
        self.categories_json = json.dumps(val or [])

class BusinessDocument(Base):
    __tablename__ = "business_documents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    business_id = Column(String(36), ForeignKey("business_profiles.id"), nullable=False)
    category = Column(String(50), nullable=False) # e.g. "veterinarian", "hotel", "common"
    doc_type = Column(String(100), nullable=False) # e.g. "vcin", "degree", "shop_est"
    doc_name = Column(String(200), nullable=False)
    file_url = Column(String(500), nullable=True)
    # Status: "not_started", "uploaded", "under_review", "verified", "needs_action"
    status = Column(String(50), default="not_started")
    reject_reason = Column(Text, nullable=True)
    
    uploaded_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    business = relationship("BusinessProfile", back_populates="documents")

class Pet(Base):
    __tablename__ = "pets"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    owner_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    species = Column(String(50), nullable=False) # Dog, Cat, Bird, etc.
    breed = Column(String(100), nullable=True)
    gender = Column(String(20), default="unknown") # male, female, unknown
    birthday = Column(String(50), nullable=True)
    age = Column(Integer, nullable=True)
    age_unit = Column(String(20), default="Years")
    weight = Column(Float, nullable=True)
    weight_unit = Column(String(20), default="Kgs")
    microchip = Column(String(100), nullable=True)
    sterilized = Column(Boolean, default=False)
    photo_url = Column(String(500), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="pets")

class OtpVerification(Base):
    __tablename__ = "otp_verifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), index=True, nullable=False)
    otp_code = Column(String(6), nullable=False)
    purpose = Column(String(50), default="registration") # "registration", "login", "reset"
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    attempts = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    owner_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    pet_id = Column(String(36), ForeignKey("pets.id"), nullable=True)
    provider_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    appointment_date = Column(String(100), nullable=False)
    type = Column(String(50), default="consultation")
    status = Column(String(50), default="scheduled")
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
