from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import security

router = APIRouter(prefix="/appointments", tags=["Appointments"])

def format_appointment(a: models.Appointment) -> dict:
    return {
        "id": a.id,
        "petId": a.pet_id,
        "ownerId": a.owner_id,
        "providerId": a.provider_id,
        "appointmentDate": a.appointment_date,
        "status": a.status,
        "type": a.type,
        "notes": a.notes,
        "createdAt": a.created_at.isoformat() if a.created_at else None,
        "updatedAt": a.updated_at.isoformat() if a.updated_at else None,
    }

@router.get("", response_model=schemas.ApiResponse[list])
def get_appointments(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    apts = db.query(models.Appointment).filter(
        (models.Appointment.owner_id == current_user.id) | 
        (models.Appointment.provider_id == current_user.id)
    ).all()
    return schemas.ApiResponse(
        success=True,
        message="Appointments retrieved",
        data=[format_appointment(a) for a in apts]
    )

@router.post("", response_model=schemas.ApiResponse[dict])
def create_appointment(
    payload: schemas.AppointmentCreate,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    apt = models.Appointment(
        owner_id=current_user.id,
        pet_id=payload.petId,
        provider_id=payload.providerId,
        appointment_date=payload.appointmentDate,
        type=payload.type or "consultation",
        notes=payload.notes,
        status="scheduled"
    )
    db.add(apt)
    db.commit()
    db.refresh(apt)
    return schemas.ApiResponse(
        success=True,
        message="Appointment created",
        data=format_appointment(apt)
    )

@router.put("/{apt_id}/cancel", response_model=schemas.ApiResponse[dict])
def cancel_appointment(
    apt_id: str,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    apt = db.query(models.Appointment).filter(
        models.Appointment.id == apt_id,
        models.Appointment.owner_id == current_user.id
    ).first()
    if not apt:
        return schemas.ApiResponse(success=False, message="Appointment not found", error="Not found")
    apt.status = "cancelled"
    db.commit()
    return schemas.ApiResponse(success=True, message="Appointment cancelled", data=format_appointment(apt))
