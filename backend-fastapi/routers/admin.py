from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

from database import get_db
from config import settings
import models
import schemas
import security

from routers.auth import format_user_dict

router = APIRouter(prefix="/admin", tags=["Admin Command Center"])

class VerifyBusinessPayload(BaseModel):
    businessId: str
    status: str # "verified", "rejected", "under_review", "needs_action"
    notes: Optional[str] = None

class VerifyDocumentPayload(BaseModel):
    documentId: str
    status: str # "verified", "rejected"
    rejectReason: Optional[str] = None

@router.post("/login", response_model=schemas.ApiResponse[schemas.AuthResponseData])
def admin_login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    """Direct login for Super Administrator."""
    login_id = payload.email.strip()
    clean_handle = login_id.lstrip("@").lower()

    is_valid = (
        clean_handle == settings.ADMIN_USERNAME.lower() or 
        login_id.lower() == settings.ADMIN_EMAIL.lower()
    ) and payload.password == settings.ADMIN_PASSWORD

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrator credentials"
        )

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

    token = security.create_access_token({"sub": admin_user.id, "email": admin_user.email, "userType": "admin"})
    return schemas.ApiResponse(
        success=True,
        message="Super Admin authenticated successfully!",
        data=schemas.AuthResponseData(
            token=token,
            user=format_user_dict(admin_user)
        )
    )

@router.get("/overview", response_model=schemas.ApiResponse[dict])
def get_admin_overview(
    current_admin: models.User = Depends(security.get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Retrieve complete database inspection records for Super Admin Command Center."""
    users = db.query(models.User).order_by(models.User.created_at.desc()).all()
    businesses = db.query(models.BusinessProfile).order_by(models.BusinessProfile.created_at.desc()).all()
    pets = db.query(models.Pet).order_by(models.Pet.created_at.desc()).all()
    appointments = db.query(models.Appointment).order_by(models.Appointment.created_at.desc()).all()
    otps = db.query(models.OtpVerification).order_by(models.OtpVerification.created_at.desc()).limit(20).all()

    # Build lookup map for owners
    user_map = {u.id: u for u in users}

    verified_count = sum(1 for b in businesses if b.verification_status == "verified")
    pending_count = sum(1 for b in businesses if b.verification_status in ("pending", "under_review"))

    formatted_businesses = []
    for b in businesses:
        owner = user_map.get(b.user_id)
        docs = [
            {
                "id": d.id,
                "category": d.category,
                "docType": d.doc_type,
                "docName": d.doc_name,
                "fileUrl": d.file_url,
                "status": d.status,
                "rejectReason": d.reject_reason,
                "uploadedAt": d.uploaded_at.isoformat() if d.uploaded_at else None,
            }
            for d in b.documents
        ]
        formatted_businesses.append({
            "id": b.id,
            "userId": b.user_id,
            "businessName": b.business_name,
            "categories": b.categories,
            "verificationStatus": b.verification_status,
            "description": b.description,
            "phone": b.phone,
            "website": b.website,
            "address": b.address,
            "city": b.city,
            "state": b.state,
            "pincode": b.pincode,
            "gst": b.gst,
            "pan": b.pan,
            "documents": docs,
            "ownerName": f"{owner.first_name} {owner.last_name}" if owner else "Unknown",
            "ownerEmail": owner.email if owner else "Unknown",
            "createdAt": b.created_at.isoformat() if b.created_at else None,
        })

    formatted_users = [
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "firstName": u.first_name,
            "lastName": u.last_name,
            "userType": u.user_type,
            "status": "active" if u.is_active else "inactive",
            "isVerified": u.is_verified,
            "googleId": u.google_id,
            "profilePhotoUrl": u.profile_photo_url,
            "createdAt": u.created_at.isoformat() if u.created_at else None,
        }
        for u in users
    ]

    formatted_pets = []
    for p in pets:
        owner = user_map.get(p.owner_id)
        formatted_pets.append({
            "id": p.id,
            "name": p.name,
            "species": p.species,
            "breed": p.breed,
            "gender": p.gender,
            "birthday": p.birthday,
            "age": p.age,
            "ageUnit": p.age_unit,
            "weight": p.weight,
            "weightUnit": p.weight_unit,
            "sterilized": p.sterilized,
            "photoUrl": p.photo_url,
            "ownerId": p.owner_id,
            "ownerName": f"{owner.first_name} {owner.last_name}" if owner else "Unknown",
            "ownerEmail": owner.email if owner else "Unknown",
            "createdAt": p.created_at.isoformat() if p.created_at else None,
        })

    formatted_appointments = [
        {
            "id": a.id,
            "ownerId": a.owner_id,
            "petId": a.pet_id,
            "providerId": a.provider_id,
            "appointmentDate": a.appointment_date,
            "type": a.type,
            "status": a.status,
            "notes": a.notes,
            "createdAt": a.created_at.isoformat() if a.created_at else None,
        }
        for a in appointments
    ]

    formatted_otps = [
        {
            "id": o.id,
            "email": o.email,
            "otpCode": o.otp_code,
            "purpose": o.purpose,
            "isUsed": o.is_used,
            "attempts": o.attempts,
            "expiresAt": o.expires_at.isoformat() if o.expires_at else None,
            "createdAt": o.created_at.isoformat() if o.created_at else None,
        }
        for o in otps
    ]

    return schemas.ApiResponse(
        success=True,
        message="Admin overview retrieved",
        data={
            "counts": {
                "totalUsers": len(users),
                "totalBusinesses": len(businesses),
                "verifiedBusinesses": verified_count,
                "pendingBusinesses": pending_count,
                "totalPets": len(pets),
                "totalAppointments": len(appointments),
                "totalOtps": len(otps),
            },
            "users": formatted_users,
            "businesses": formatted_businesses,
            "pets": formatted_pets,
            "appointments": formatted_appointments,
            "otps": formatted_otps,
        }
    )

@router.post("/verify-business", response_model=schemas.ApiResponse[dict])
def verify_business(
    payload: VerifyBusinessPayload,
    current_admin: models.User = Depends(security.get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Approve or reject a business profile and award the verified green tick."""
    biz = db.query(models.BusinessProfile).filter(models.BusinessProfile.id == payload.businessId).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business profile not found")

    new_status = payload.status.lower().strip()
    biz.verification_status = new_status

    # Do not revoke user's email login verification when business license is reviewed
    user = db.query(models.User).filter(models.User.id == biz.user_id).first()

    # If verified or rejected, update documents
    doc_status = "verified" if new_status == "verified" else "needs_action" if new_status == "rejected" else new_status
    for doc in biz.documents:
        doc.status = doc_status
        if payload.notes and new_status == "rejected":
            doc.reject_reason = payload.notes

    db.commit()
    db.refresh(biz)

    return schemas.ApiResponse(
        success=True,
        message=f"Business verification status updated to '{new_status}' successfully! 🎉",
        data={
            "businessId": biz.id,
            "businessName": biz.business_name,
            "verificationStatus": biz.verification_status,
            "isUserVerified": user.is_verified if user else False,
        }
    )

@router.post("/verify-document", response_model=schemas.ApiResponse[dict])
def verify_document(
    payload: VerifyDocumentPayload,
    current_admin: models.User = Depends(security.get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Approve or reject a specific document."""
    doc = db.query(models.BusinessDocument).filter(models.BusinessDocument.id == payload.documentId).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    doc.status = payload.status.lower().strip()
    if payload.rejectReason:
        doc.reject_reason = payload.rejectReason
    
    db.commit()
    return schemas.ApiResponse(
        success=True,
        message="Document status updated",
        data={"documentId": doc.id, "status": doc.status}
    )

@router.delete("/users/{user_id}", response_model=schemas.ApiResponse[dict])
def delete_user(
    user_id: str,
    current_admin: models.User = Depends(security.get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a user account and cascading data."""
    target_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    if target_user.id == current_admin.id or target_user.username == settings.ADMIN_USERNAME:
        raise HTTPException(status_code=400, detail="Cannot delete the Super Admin account")

    db.delete(target_user)
    db.commit()

    return schemas.ApiResponse(
        success=True,
        message=f"User {target_user.email} and all associated data deleted successfully."
    )

@router.post("/clear-db", response_model=schemas.ApiResponse[dict])
def clear_database_admin(
    current_admin: models.User = Depends(security.get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Reset the database for testing while safely preserving the Super Admin account."""
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
        # Delete all users EXCEPT super admin
        db.query(models.User).filter(models.User.username != settings.ADMIN_USERNAME).delete()

        try:
            db.execute(text("PRAGMA foreign_keys = ON;"))
        except Exception:
            pass

        db.commit()
        return schemas.ApiResponse(
            success=True,
            message="Database reset successfully! All test accounts wiped, Super Admin preserved."
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to reset database: {e}")
