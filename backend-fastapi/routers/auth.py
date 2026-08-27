import random
import re
import json
import logging
from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import security
from config import settings
from services import email_service

logger = logging.getLogger("auth_router")
router = APIRouter(tags=["Authentication & Registration"])

def generate_otp() -> str:
    return f"{random.randint(100000, 999999)}"

def format_user_dict(user: models.User) -> dict:
    biz_data = None
    if user.business_profile:
        b = user.business_profile
        biz_data = {
            "id": b.id,
            "businessName": b.business_name,
            "categories": b.categories,
            "description": b.description,
            "phone": b.phone,
            "website": b.website,
            "address": b.address,
            "city": b.city,
            "state": b.state,
            "pincode": b.pincode,
            "openHours": b.open_hours,
            "gst": b.gst,
            "pan": b.pan,
            "bankAccount": b.bank_account,
            "upi": b.upi,
            "verificationStatus": b.verification_status,
        }

    return {
        "id": user.id,
        "firstName": user.first_name,
        "lastName": user.last_name,
        "email": user.email,
        "username": f"@{user.username}" if user.username else None,
        "rawUsername": user.username,
        "userType": user.user_type,
        "phone": user.phone,
        "city": user.city,
        "profilePhotoUrl": user.profile_photo_url,
        "isVerified": user.is_verified,
        "isActive": user.is_active,
        "petsCount": len(user.pets) if user.pets else 0,
        "businessProfile": biz_data,
        "createdAt": user.created_at.isoformat() if user.created_at else None,
    }

@router.get("/dev-db-view")
def dev_db_view(db: Session = Depends(get_db)):
    """Developer endpoint to view all users, pets, businesses, and recent OTPs in the cloud database."""
    users = db.query(models.User).order_by(models.User.created_at.desc()).all()
    pets = db.query(models.Pet).all()
    businesses = db.query(models.BusinessProfile).all()
    otps = db.query(models.OtpVerification).order_by(models.OtpVerification.created_at.desc()).limit(10).all()
    
    return {
        "success": True,
        "counts": {
            "users": len(users),
            "pets": len(pets),
            "businesses": len(businesses),
        },
        "users": [
            {
                "id": u.id,
                "email": u.email,
                "username": u.username,
                "name": f"{u.first_name} {u.last_name}",
                "userType": u.user_type,
                "isVerified": u.is_verified,
                "googleId": u.google_id,
                "createdAt": u.created_at.isoformat() if u.created_at else None,
            }
            for u in users
        ],
        "pets": [
            {
                "id": p.id,
                "name": p.name,
                "species": p.species,
                "ownerId": p.owner_id
            }
            for p in pets
        ],
        "recent_otps": [
            {
                "email": o.email,
                "code": o.otp_code,
                "purpose": o.purpose,
                "used": o.is_used,
                "expiresAt": o.expires_at.isoformat() if o.expires_at else None
            }
            for o in otps
        ]
    }

@router.get("/test-smtp")
def test_smtp(to: str = ""):
    """
    Real-time diagnostic endpoint for testing Gmail SMTP.
    Visit: /api/v1/test-smtp?to=your_email@gmail.com
    """
    target = to.strip() if to else settings.SMTP_USER
    return email_service.test_smtp_diagnostic(target)

@router.get("/dev-clear-database")
def dev_clear_database(db: Session = Depends(get_db)):
    """Developer endpoint to reset DB for testing."""
    try:
        from sqlalchemy import text
        try:
            db.execute(text("PRAGMA foreign_keys = OFF;"))
        except Exception:
            pass
        db.query(models.Appointment).delete()
        db.query(models.Pet).delete()
        db.query(models.BusinessDocument).delete()
        db.query(models.BusinessProfile).delete()
        db.query(models.OtpVerification).delete()
        db.query(models.User).delete()
        try:
            db.execute(text("PRAGMA foreign_keys = ON;"))
        except Exception:
            pass
        db.commit()
        return {"success": True, "message": "Database cleared successfully! All users, pets, and appointments reset."}
    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e)}

# ─────────────────────────────────────────────────────────────
# 1. Instagram-Style Username Availability Check
# ─────────────────────────────────────────────────────────────
@router.get("/users/check-email", response_model=schemas.ApiResponse[dict])
def check_email(email: str, db: Session = Depends(get_db)):
    """Check if an email exists and return its userType."""
    user = db.query(models.User).filter(models.User.email == email.lower().strip()).first()
    if user:
        return schemas.ApiResponse(
            success=True,
            data={"exists": True, "userType": user.user_type}
        )
    return schemas.ApiResponse(
        success=True,
        data={"exists": False, "userType": None}
    )

@router.get("/users/check-username", response_model=schemas.ApiResponse[schemas.UsernameCheckResponse])
def check_username(username: str, db: Session = Depends(get_db)):
    """
    Real-time check if an Instagram-style handle is valid and available.
    Supports debounced typing in frontend.
    """
    try:
        clean_handle = schemas.sanitize_username(username)
    except ValueError as e:
        return schemas.ApiResponse(
            success=True,
            data=schemas.UsernameCheckResponse(
                available=False,
                username=username,
                message=str(e)
            )
        )

    if clean_handle.lower() in ("admin", "administrator", "root", "support", settings.ADMIN_USERNAME.lower()):
        return schemas.ApiResponse(
            success=True,
            data=schemas.UsernameCheckResponse(
                available=False,
                username=username,
                message="This handle is reserved and cannot be registered."
            )
        )

    existing = db.query(models.User).filter(models.User.username == clean_handle).first()
    if existing:
        # Generate 3 smart alternatives
        suggestions = [
            f"{clean_handle}_{random.randint(1, 99)}",
            f"{clean_handle}_vet",
            f"{clean_handle}_care"
        ]
        return schemas.ApiResponse(
            success=True,
            data=schemas.UsernameCheckResponse(
                available=False,
                username=clean_handle,
                message="Handle is already taken. Try one of our suggestions!",
                suggestions=suggestions
            )
        )

    return schemas.ApiResponse(
        success=True,
        data=schemas.UsernameCheckResponse(
            available=True,
            username=clean_handle,
            message="Username is available! 🎉"
        )
    )

# ─────────────────────────────────────────────────────────────
# 2. Universal & Personal Registration Endpoints
# ─────────────────────────────────────────────────────────────
@router.post("/users/register", response_model=schemas.ApiResponse[dict])
@router.post("/register/personal", response_model=schemas.ApiResponse[dict])
@router.post("/register/pet-owner", response_model=schemas.ApiResponse[dict])
async def generic_register(
    payload: dict,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Universal handler matching legacy and modern frontend payloads."""
    email = payload.get("email")
    if not email:
        return schemas.ApiResponse(success=False, message="Email is required", error="MISSING_EMAIL")
    
    # If only email is provided, treat as an OTP resend request (from OtpModal)
    if "password" not in payload:
        return await resend_otp(schemas.OtpResendRequest(email=email), background_tasks, db)
    
    # If business payload
    if payload.get("userType") == "business" or "businessName" in payload:
        biz_req = schemas.BusinessRegisterRequest(
            firstName=payload.get("firstName", "Owner"),
            lastName=payload.get("lastName", ""),
            username=payload.get("username", email.split("@")[0]),
            email=email,
            password=payload.get("password", ""),
            businessName=payload.get("businessName", "My Business"),
            categories=payload.get("categories", ["veterinarian"]),
            phoneNumber=payload.get("phoneNumber") or payload.get("phone"),
            city=payload.get("city")
        )
        return await register_business(biz_req, background_tasks, db)

    # Otherwise pet owner payload
    pet_req = schemas.PetOwnerRegisterRequest(
        firstName=payload.get("firstName", "Owner"),
        lastName=payload.get("lastName", ""),
        username=payload.get("username", email.split("@")[0]),
        email=email,
        password=payload.get("password", ""),
        phoneNumber=payload.get("phoneNumber") or payload.get("phone"),
        city=payload.get("city"),
        pets=payload.get("pets")
    )
    return await register_personal(pet_req, background_tasks, db)

async def register_personal(
    payload: schemas.PetOwnerRegisterRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # Check email uniqueness
    if db.query(models.User).filter(models.User.email == payload.email).first():
        return schemas.ApiResponse(
            success=False,
            message="An account with this email already exists. Please login.",
            error="EMAIL_EXISTS"
        )

    # Check username uniqueness
    if payload.username.lower() in ("admin", "administrator", "root", "support", settings.ADMIN_USERNAME.lower()):
        return schemas.ApiResponse(
            success=False,
            message="This username is reserved and cannot be registered.",
            error="USERNAME_RESERVED"
        )

    if db.query(models.User).filter(models.User.username == payload.username).first():
        return schemas.ApiResponse(
            success=False,
            message="This handle is already taken. Please choose another username.",
            error="USERNAME_EXISTS"
        )

    # Create User
    new_user = models.User(
        email=payload.email.lower().strip(),
        username=payload.username,
        hashed_password=security.get_password_hash(payload.password),
        first_name=payload.firstName.strip(),
        last_name=payload.lastName.strip(),
        user_type="pet_owner",
        phone=payload.phoneNumber,
        city=payload.city,
        is_verified=False # Requires OTP verification
    )
    db.add(new_user)
    db.flush()

    # Add initial pets if provided
    if payload.pets:
        for p in payload.pets:
            pet_species = p.customSpecies.strip() if p.species == "Other" and p.customSpecies else p.species
            pet = models.Pet(
                owner_id=new_user.id,
                name=p.name.strip(),
                species=pet_species,
                breed=p.breed,
                gender=p.gender or "unknown",
                birthday=p.birthday,
                age=p.age,
                age_unit=p.ageUnit or "Years",
                weight=p.weight,
                weight_unit=p.weightUnit or "Kgs",
                microchip=p.microchip,
                sterilized=p.sterilized or False
            )
            db.add(pet)

    # Generate 6-digit OTP
    otp_code = generate_otp()
    otp_record = models.OtpVerification(
        email=new_user.email,
        otp_code=otp_code,
        purpose="registration",
        expires_at=datetime.utcnow() + timedelta(minutes=10)
    )
    db.add(otp_record)
    db.commit()
    db.refresh(new_user)

    # Dispatch email in background task via Gmail SMTP
    background_tasks.add_task(
        email_service.send_otp_email,
        new_user.email,
        new_user.first_name,
        otp_code
    )

    logger.info(f"Created pending personal user {new_user.email} with OTP {otp_code}")

    return schemas.ApiResponse(
        success=True,
        message=f"Verification code sent to {new_user.email}",
        data={
            "email": new_user.email,
            "username": f"@{new_user.username}",
            "requiresOtp": True,
            "debugOtp": otp_code
        }
    )

# ─────────────────────────────────────────────────────────────
# 3. Business Registration (All 8 Verticals)
# ─────────────────────────────────────────────────────────────
@router.post("/register/business", response_model=schemas.ApiResponse[dict])
async def register_business(
    payload: schemas.BusinessRegisterRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # Check email uniqueness
    if db.query(models.User).filter(models.User.email == payload.email).first():
        return schemas.ApiResponse(
            success=False,
            message="An account with this email already exists. Please login.",
            error="EMAIL_EXISTS"
        )

    # Check username uniqueness
    if payload.username.lower() in ("admin", "administrator", "root", "support", settings.ADMIN_USERNAME.lower()):
        return schemas.ApiResponse(
            success=False,
            message="This username is reserved and cannot be registered.",
            error="USERNAME_RESERVED"
        )

    if db.query(models.User).filter(models.User.username == payload.username).first():
        return schemas.ApiResponse(
            success=False,
            message="This handle is already taken. Please choose another username.",
            error="USERNAME_EXISTS"
        )

    # Create User
    new_user = models.User(
        email=payload.email.lower().strip(),
        username=payload.username,
        hashed_password=security.get_password_hash(payload.password),
        first_name=payload.firstName.strip(),
        last_name=payload.lastName.strip(),
        user_type="business",
        phone=payload.phoneNumber,
        city=payload.city,
        is_verified=False
    )
    db.add(new_user)
    db.flush()

    # Create Business Profile
    biz_profile = models.BusinessProfile(
        user_id=new_user.id,
        business_name=payload.businessName.strip(),
        phone=payload.phoneNumber,
        city=payload.city,
        verification_status="pending"
    )
    biz_profile.categories = payload.categories
    db.add(biz_profile)

    # Generate 6-digit OTP
    otp_code = generate_otp()
    otp_record = models.OtpVerification(
        email=new_user.email,
        otp_code=otp_code,
        purpose="registration",
        expires_at=datetime.utcnow() + timedelta(minutes=10)
    )
    db.add(otp_record)
    db.commit()
    db.refresh(new_user)

    # Dispatch email in background task via Gmail SMTP
    background_tasks.add_task(
        email_service.send_otp_email,
        new_user.email,
        new_user.first_name,
        otp_code
    )

    logger.info(f"Created pending business user {new_user.email} ({payload.businessName}) with OTP {otp_code}")

    return schemas.ApiResponse(
        success=True,
        message=f"Verification code sent to {new_user.email}",
        data={
            "email": new_user.email,
            "username": f"@{new_user.username}",
            "businessName": payload.businessName,
            "requiresOtp": True,
            "debugOtp": otp_code
        }
    )

# ─────────────────────────────────────────────────────────────
# 4. OTP Verification
# ─────────────────────────────────────────────────────────────
@router.post("/users/verify-otp", response_model=schemas.ApiResponse[schemas.AuthResponseData])
async def verify_otp(
    payload: schemas.OtpVerifyRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    email = payload.email.lower().strip()
    code = payload.code.strip()

    # Find the most recent active OTP
    otp = db.query(models.OtpVerification).filter(
        models.OtpVerification.email == email,
        models.OtpVerification.otp_code == code,
        models.OtpVerification.is_used == False
    ).order_by(models.OtpVerification.created_at.desc()).first()

    if not otp:
        return schemas.ApiResponse(
            success=False,
            message="Invalid verification code. Please check your email and try again.",
            error="INVALID_CODE"
        )

    if datetime.utcnow() > otp.expires_at:
        return schemas.ApiResponse(
            success=False,
            message="Verification code has expired. Please request a new code.",
            error="EXPIRED_CODE"
        )

    # Mark OTP as used
    otp.is_used = True

    # Activate User
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        return schemas.ApiResponse(success=False, message="User not found", error="USER_NOT_FOUND")

    user.is_verified = True
    db.commit()
    db.refresh(user)

    # Issue Session Token
    token = security.create_access_token({"sub": user.id, "email": user.email, "userType": user.user_type})

    # Send Welcome Email in background
    background_tasks.add_task(
        email_service.send_welcome_email,
        user.email,
        user.first_name,
        user.user_type
    )

    return schemas.ApiResponse(
        success=True,
        message="Account verified successfully! Welcome to Zoodo.",
        data=schemas.AuthResponseData(
            token=token,
            user=format_user_dict(user)
        )
    )

# ─────────────────────────────────────────────────────────────
# 5. OTP Resend (Rate-limited to 60s)
# ─────────────────────────────────────────────────────────────
@router.post("/users/resend-otp", response_model=schemas.ApiResponse[dict])
async def resend_otp(
    payload: schemas.OtpResendRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    email = payload.email.lower().strip()
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        return schemas.ApiResponse(success=False, message="No account found with this email.", error="USER_NOT_FOUND")

    # Rate limiting: check if OTP was sent in the last 60 seconds
    recent = db.query(models.OtpVerification).filter(
        models.OtpVerification.email == email,
        models.OtpVerification.created_at >= datetime.utcnow() - timedelta(seconds=60)
    ).first()

    if recent:
        return schemas.ApiResponse(
            success=False,
            message="Please wait at least 60 seconds before requesting a new code.",
            error="RATE_LIMITED"
        )

    otp_code = generate_otp()
    otp_record = models.OtpVerification(
        email=email,
        otp_code=otp_code,
        purpose="registration",
        expires_at=datetime.utcnow() + timedelta(minutes=10)
    )
    db.add(otp_record)
    db.commit()

    background_tasks.add_task(
        email_service.send_otp_email,
        user.email,
        user.first_name,
        otp_code
    )

    return schemas.ApiResponse(
        success=True,
        message=f"A fresh verification code has been dispatched to {email}."
    )

# ─────────────────────────────────────────────────────────────
# 6. Login (Supports Email OR Instagram Handle!)
# ─────────────────────────────────────────────────────────────
@router.post("/users/login", response_model=schemas.ApiResponse[schemas.AuthResponseData])
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    login_id = payload.email.strip()
    clean_handle = login_id.lstrip("@").lower()

    # Special Super Admin Check (matches env credentials directly)
    is_admin_login = (
        clean_handle == settings.ADMIN_USERNAME.lower() or 
        login_id.lower() == settings.ADMIN_EMAIL.lower()
    ) and payload.password == settings.ADMIN_PASSWORD

    if is_admin_login:
        admin_user = db.query(models.User).filter(
            (models.User.username == settings.ADMIN_USERNAME) | 
            (models.User.email == settings.ADMIN_EMAIL)
        ).first()
        if not admin_user:
            admin_user = models.User(
                username=settings.ADMIN_USERNAME,
                email=settings.ADMIN_EMAIL,
                hashed_password=security.get_password_hash(settings.ADMIN_PASSWORD),
                first_name="Super",
                last_name="Admin",
                user_type="admin",
                is_verified=True,
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
        else:
            admin_user.user_type = "admin"
            admin_user.is_verified = True
            db.commit()

        token = security.create_access_token({"sub": admin_user.id, "email": admin_user.email, "userType": "admin"})
        return schemas.ApiResponse(
            success=True,
            message="Welcome back, Administrator!",
            data=schemas.AuthResponseData(
                token=token,
                user=format_user_dict(admin_user)
            )
        )

    # Find user by either email or username
    user = db.query(models.User).filter(
        (models.User.email == login_id.lower()) | (models.User.username == clean_handle)
    ).first()

    if not user or not user.hashed_password:
        return schemas.ApiResponse(
            success=False,
            message="Invalid email/username or password.",
            error="INVALID_CREDENTIALS"
        )

    if not security.verify_password(payload.password, user.hashed_password):
        return schemas.ApiResponse(
            success=False,
            message="Invalid email/username or password.",
            error="INVALID_CREDENTIALS"
        )

    # If user registered with email but never verified OTP
    if not user.is_verified:
        return schemas.ApiResponse(
            success=False,
            message="Please verify your email address to log in. Check your inbox for the 6-digit code.",
            error="EMAIL_NOT_VERIFIED",
            data={"requiresOtp": True, "email": user.email}
        )

    token = security.create_access_token({"sub": user.id, "email": user.email, "userType": user.user_type})

    return schemas.ApiResponse(
        success=True,
        message=f"Welcome back, {user.first_name}!",
        data=schemas.AuthResponseData(
            token=token,
            user=format_user_dict(user)
        )
    )

# ─────────────────────────────────────────────────────────────
# 7. Google OAuth / Firebase Handshake (Instant Verification)
# ─────────────────────────────────────────────────────────────
@router.post("/auth/google", response_model=schemas.ApiResponse[schemas.AuthResponseData])
def auth_google(payload: schemas.GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Google Sign-In / Sign-Up.
    Google users are ALREADY verified by Google, so OTP verification is bypassed!
    """
    email = payload.email.lower().strip()
    user = db.query(models.User).filter(models.User.email == email).first()

    if user:
        # Existing user logging in with Google
        if not user.google_id:
            user.google_id = payload.googleId
        if payload.profilePhotoUrl and not user.profile_photo_url:
            user.profile_photo_url = payload.profilePhotoUrl
        user.is_verified = True # Google email is verified
        db.commit()
        db.refresh(user)
    else:
        # New user registering with Google
        # Determine username: if provided, sanitize it; otherwise auto-generate from email prefix
        chosen_handle = payload.username
        if chosen_handle:
            clean_handle = schemas.sanitize_username(chosen_handle)
        else:
            base_handle = email.split("@")[0].lower()
            clean_handle = re.sub(r"[^a-z0-9_.]", "", base_handle)
            # Ensure unique
            counter = 1
            temp_handle = clean_handle
            while db.query(models.User).filter(models.User.username == temp_handle).first():
                temp_handle = f"{clean_handle}_{counter}"
                counter += 1
            clean_handle = temp_handle

        user = models.User(
            email=email,
            username=clean_handle,
            google_id=payload.googleId,
            first_name=payload.firstName.strip(),
            last_name=payload.lastName.strip(),
            profile_photo_url=payload.profilePhotoUrl,
            user_type=payload.userType or "pet_owner",
            is_verified=True # Auto-verified by Google
        )
        db.add(user)
        db.flush()

        # If registering as business via Google
        if payload.userType == "business" and payload.businessName:
            biz_profile = models.BusinessProfile(
                user_id=user.id,
                business_name=payload.businessName.strip(),
                verification_status="pending"
            )
            biz_profile.categories = payload.categories or ["veterinarian"]
            db.add(biz_profile)

        db.commit()
        db.refresh(user)

    token = security.create_access_token({"sub": user.id, "email": user.email, "userType": user.user_type})

    return schemas.ApiResponse(
        success=True,
        message="Google authentication successful!",
        data=schemas.AuthResponseData(
            token=token,
            user=format_user_dict(user)
        )
    )

# ─────────────────────────────────────────────────────────────
# 8. User Profile
# ─────────────────────────────────────────────────────────────
@router.get("/users/profile", response_model=schemas.ApiResponse[dict])
def get_current_profile(current_user: models.User = Depends(security.get_current_user)):
    return schemas.ApiResponse(
        success=True,
        message="Profile loaded",
        data=format_user_dict(current_user)
    )

@router.put("/users/profile", response_model=schemas.ApiResponse[dict])
def update_profile(
    updates: dict,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    for key, value in updates.items():
        if key == "username" and value:
            clean = schemas.sanitize_username(value)
            # Check if taken by another user
            existing = db.query(models.User).filter(models.User.username == clean, models.User.id != current_user.id).first()
            if existing:
                return schemas.ApiResponse(success=False, message="Username is already in use", error="USERNAME_TAKEN")
            current_user.username = clean
        elif hasattr(current_user, key) and key not in ["id", "email", "hashed_password"]:
            setattr(current_user, key, value)

    db.commit()
    db.refresh(current_user)
    return schemas.ApiResponse(
        success=True,
        message="Profile updated successfully",
        data=format_user_dict(current_user)
    )
