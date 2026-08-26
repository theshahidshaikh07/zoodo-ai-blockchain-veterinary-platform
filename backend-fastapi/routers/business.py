import json
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import security

router = APIRouter(prefix="/business", tags=["Business Portal & Verification"])

# Standard document requirements per category (matches dashboard/business)
COMMON_DOC_DEFINITIONS = [
    {"id": "phone_verified", "label": "Phone Number (OTP)", "category": "common", "required": True},
    {"id": "business_address", "label": "Business Address Proof", "category": "common", "required": True},
    {"id": "logo_photos", "label": "Business Logo & Photos (3+)", "category": "common", "required": True},
    {"id": "bank_account", "label": "Bank Account / UPI", "category": "common", "required": True},
    {"id": "gst", "label": "GST Registration", "category": "common", "required": False},
]

CATEGORY_DOC_DEFINITIONS = {
    "veterinarian": [
        {"id": "vcin", "label": "Veterinary Council Registration (VCIN)", "required": True},
        {"id": "degree", "label": "Degree Certificate (BVSc & AH / MVSc)", "required": True},
        {"id": "clinical_est", "label": "Clinical Establishment Certificate", "required": True},
        {"id": "practice_license", "label": "Current Practicing License", "required": True},
    ],
    "grooming": [
        {"id": "shop_est", "label": "Shop & Establishment License", "required": True},
        {"id": "biz_reg", "label": "Business Registration", "required": True},
        {"id": "portfolio", "label": "Grooming Portfolio (5+ photos)", "required": False},
    ],
    "trainer": [
        {"id": "biz_reg", "label": "Business Registration", "required": True},
        {"id": "certification", "label": "Trainer Certification", "required": False},
        {"id": "liability_ins", "label": "Liability Insurance", "required": False},
    ],
    "insurance": [
        {"id": "irdai", "label": "IRDAI Agent / Broker License", "required": True},
        {"id": "company_reg", "label": "Company Registration (CIN)", "required": True},
        {"id": "product_docs", "label": "IRDAI-Approved Product Documents", "required": True},
    ],
    "shop": [
        {"id": "shop_est", "label": "Shop & Establishment License", "required": True},
        {"id": "drug_license", "label": "Drug License", "required": False},
        {"id": "fssai", "label": "FSSAI License", "required": False},
        {"id": "gst_shop", "label": "GST Registration", "required": True},
    ],
    "ngo": [
        {"id": "ngo_reg", "label": "NGO / Trust Registration Certificate", "required": True},
        {"id": "pan_org", "label": "PAN Card (Organisation)", "required": True},
        {"id": "tax_exempt", "label": "80G / 12A Certificate", "required": False},
    ],
    "transport": [
        {"id": "biz_reg", "label": "Business Registration", "required": True},
        {"id": "vehicle_rc", "label": "Vehicle Registration Certificate (RC)", "required": False},
        {"id": "travel_license", "label": "Travel Agency License", "required": False},
    ],
    "hotel": [
        {"id": "shop_est", "label": "Shop & Establishment License", "required": True},
        {"id": "boarding_permit", "label": "Municipal Pet Boarding Permit", "required": True},
        {"id": "hygiene_cert", "label": "Health & Hygiene Certificate", "required": True},
        {"id": "capacity_decl", "label": "Capacity Declaration", "required": True},
    ],
}

def get_or_create_business_profile(user: models.User, db: Session) -> models.BusinessProfile:
    if not user.business_profile:
        biz = models.BusinessProfile(
            user_id=user.id,
            business_name=f"{user.first_name}'s Practice",
            categories_json=json.dumps(["veterinarian"]),
            verification_status="pending"
        )
        db.add(biz)
        db.commit()
        db.refresh(biz)
        return biz
    return user.business_profile

@router.get("/profile", response_model=schemas.ApiResponse[dict])
def get_business_profile(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    biz = get_or_create_business_profile(current_user, db)
    return schemas.ApiResponse(
        success=True,
        message="Business profile loaded",
        data={
            "id": biz.id,
            "businessName": biz.business_name,
            "categories": biz.categories,
            "description": biz.description or "",
            "phone": biz.phone or current_user.phone or "",
            "website": biz.website or "",
            "address": biz.address or "",
            "city": biz.city or current_user.city or "",
            "state": biz.state or "",
            "pincode": biz.pincode or "",
            "openHours": biz.open_hours or "Mon-Sat: 09:00 - 19:00",
            "gst": biz.gst or "",
            "pan": biz.pan or "",
            "bankAccount": biz.bank_account or "",
            "upi": biz.upi or "",
            "verificationStatus": biz.verification_status,
        }
    )

@router.put("/profile", response_model=schemas.ApiResponse[dict])
def update_business_profile(
    payload: dict,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    biz = get_or_create_business_profile(current_user, db)
    
    for key, val in payload.items():
        if key == "categories" and isinstance(val, list):
            biz.categories = val
        elif key == "businessName":
            biz.business_name = str(val).strip()
        elif hasattr(biz, key) and key not in ["id", "user_id"]:
            setattr(biz, key, val)

    db.commit()
    db.refresh(biz)

    return schemas.ApiResponse(
        success=True,
        message="Business profile saved successfully!",
        data={
            "id": biz.id,
            "businessName": biz.business_name,
            "categories": biz.categories,
            "description": biz.description,
            "phone": biz.phone,
            "website": biz.website,
            "address": biz.address,
            "city": biz.city,
            "state": biz.state,
            "pincode": biz.pincode,
            "openHours": biz.open_hours,
            "gst": biz.gst,
            "pan": biz.pan,
            "bankAccount": biz.bank_account,
            "upi": biz.upi,
            "verificationStatus": biz.verification_status,
        }
    )

@router.get("/documents", response_model=schemas.ApiResponse[list])
def get_business_documents(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    biz = get_or_create_business_profile(current_user, db)
    existing_docs = {d.doc_type: d for d in biz.documents}

    seen_ids = set()
    result = []
    # 1. Common documents
    for doc in COMMON_DOC_DEFINITIONS:
        doc_id = doc["id"]
        seen_ids.add(doc_id)
        status = existing_docs[doc_id].status if doc_id in existing_docs else "not_started"
        file_url = existing_docs[doc_id].file_url if doc_id in existing_docs else None
        result.append({
            "id": doc_id,
            "label": doc["label"],
            "category": "common",
            "required": doc["required"],
            "status": status,
            "fileUrl": file_url
        })

    # 2. Category-specific documents
    for cat in biz.categories:
        cat_reqs = CATEGORY_DOC_DEFINITIONS.get(cat, [])
        for doc in cat_reqs:
            doc_id = doc["id"]
            if doc_id in seen_ids:
                continue
            seen_ids.add(doc_id)
            status = existing_docs[doc_id].status if doc_id in existing_docs else "not_started"
            file_url = existing_docs[doc_id].file_url if doc_id in existing_docs else None
            result.append({
                "id": doc_id,
                "label": doc["label"],
                "category": cat,
                "required": doc["required"],
                "status": status,
                "fileUrl": file_url
            })

    return schemas.ApiResponse(
        success=True,
        message="Verification documents retrieved",
        data=result
    )

@router.post("/documents/upload", response_model=schemas.ApiResponse[dict])
def upload_business_document(
    docId: str = Form(...),
    category: str = Form(...),
    docName: str = Form(...),
    file: Optional[UploadFile] = File(None),
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    biz = get_or_create_business_profile(current_user, db)
    
    # Check if document already exists
    doc = db.query(models.BusinessDocument).filter(
        models.BusinessDocument.business_id == biz.id,
        models.BusinessDocument.doc_type == docId
    ).first()

    file_path = f"/uploads/{biz.id}_{docId}_{file.filename}" if file else "/uploads/mock_document.pdf"

    if doc:
        doc.status = "under_review"
        doc.uploaded_at = datetime.utcnow()
        doc.file_url = file_path
    else:
        doc = models.BusinessDocument(
            business_id=biz.id,
            category=category,
            doc_type=docId,
            doc_name=docName,
            status="under_review",
            file_url=file_path,
            uploaded_at=datetime.utcnow()
        )
        db.add(doc)

    biz.verification_status = "under_review"
    db.commit()
    db.refresh(doc)

    return schemas.ApiResponse(
        success=True,
        message=f"Document '{docName}' submitted for verification",
        data={
            "id": doc.doc_type,
            "status": doc.status,
            "fileUrl": doc.file_url,
            "uploadedAt": doc.uploaded_at.isoformat() if doc.uploaded_at else None
        }
    )
