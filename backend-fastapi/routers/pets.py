from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import security

router = APIRouter(prefix="/pets", tags=["Pets"])

def format_pet(p: models.Pet) -> dict:
    return {
        "id": p.id,
        "ownerId": p.owner_id,
        "name": p.name,
        "species": p.species,
        "breed": p.breed,
        "gender": p.gender,
        "birthday": p.birthday,
        "age": p.age,
        "ageUnit": p.age_unit,
        "weight": p.weight,
        "weightUnit": p.weight_unit,
        "microchip": p.microchip,
        "sterilized": p.sterilized,
        "createdAt": p.created_at.isoformat() if p.created_at else None,
        "updatedAt": p.updated_at.isoformat() if p.updated_at else None,
    }

@router.get("", response_model=schemas.ApiResponse[list])
def get_user_pets(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    pets = db.query(models.Pet).filter(models.Pet.owner_id == current_user.id).all()
    return schemas.ApiResponse(
        success=True,
        message="Pets retrieved successfully",
        data=[format_pet(p) for p in pets]
    )

@router.post("", response_model=schemas.ApiResponse[dict])
def create_pet(
    payload: schemas.PetCreate,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    pet = models.Pet(
        owner_id=current_user.id,
        name=payload.name,
        species=payload.species,
        breed=payload.breed,
        gender=payload.gender or "unknown",
        age=payload.age,
        age_unit=payload.ageUnit or "Years",
        weight=payload.weight,
        weight_unit=payload.weightUnit or "Kgs",
        birthday=payload.birthday,
        microchip=payload.microchip,
        sterilized=payload.sterilized or False
    )
    db.add(pet)
    db.commit()
    db.refresh(pet)

    return schemas.ApiResponse(
        success=True,
        message="Pet added successfully",
        data=format_pet(pet)
    )

@router.get("/{pet_id}", response_model=schemas.ApiResponse[dict])
def get_pet_by_id(
    pet_id: str,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    pet = db.query(models.Pet).filter(models.Pet.id == pet_id, models.Pet.owner_id == current_user.id).first()
    if not pet:
        return schemas.ApiResponse(success=False, message="Pet not found", error="Pet not found")
    return schemas.ApiResponse(success=True, message="Pet details", data=format_pet(pet))

@router.put("/{pet_id}", response_model=schemas.ApiResponse[dict])
def update_pet(
    pet_id: str,
    payload: dict,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    pet = db.query(models.Pet).filter(models.Pet.id == pet_id, models.Pet.owner_id == current_user.id).first()
    if not pet:
        return schemas.ApiResponse(success=False, message="Pet not found", error="Pet not found")
    
    for key, val in payload.items():
        if hasattr(pet, key):
            setattr(pet, key, val)
    db.commit()
    db.refresh(pet)
    return schemas.ApiResponse(success=True, message="Pet updated", data=format_pet(pet))

@router.delete("/{pet_id}", response_model=schemas.ApiResponse[None])
def delete_pet(
    pet_id: str,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    pet = db.query(models.Pet).filter(models.Pet.id == pet_id, models.Pet.owner_id == current_user.id).first()
    if pet:
        db.delete(pet)
        db.commit()
    return schemas.ApiResponse(success=True, message="Pet deleted", data=None)
