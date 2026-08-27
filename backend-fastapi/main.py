import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import engine, Base
import models
from routers import auth, business, pets, appointments, ai, admin
import security
from database import SessionLocal

# Initialize DB tables automatically on boot
Base.metadata.create_all(bind=engine)

def ensure_super_admin():
    """Ensure the Super Admin account exists in the database on boot."""
    db = SessionLocal()
    try:
        if not settings.ADMIN_PASSWORD:
            print("[*] ADMIN_PASSWORD not configured in environment. Skipping auto-seed.")
            return

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
            print(f"[*] Super Admin '{settings.ADMIN_USERNAME}' initialized successfully.")
        else:
            admin_user.user_type = "admin"
            admin_user.is_verified = True
            admin_user.hashed_password = security.get_password_hash(settings.ADMIN_PASSWORD)
            db.commit()
    except Exception as e:
        print(f"[!] Super Admin auto-seed warning: {e}")
    finally:
        db.close()

ensure_super_admin()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Unified API for Zoodo Pet Platform — Healthcare, Care, 8 Business Verticals & Salus AI",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=r"^https?://([a-zA-Z0-9-]+\.)*(zoodo\.(dev|vercel\.app)|localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all unified routers under /api/v1
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(business.router, prefix=settings.API_V1_STR)
app.include_router(pets.router, prefix=settings.API_V1_STR)
app.include_router(appointments.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "email_service": f"Configured ({settings.SMTP_USER})",
        "docs": "/docs",
    }

@app.get("/health")
def health():
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
