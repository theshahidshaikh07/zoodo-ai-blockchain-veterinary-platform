import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Zoodo Veterinary & Pet Services Platform"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    ALLOWED_ORIGINS: str = "https://zoodo.dev,https://www.zoodo.dev,https://zoodo.vercel.app,http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000"
    
    # JWT
    JWT_SECRET: str = "zoodo-super-secret-production-grade-key-2026-secure-32chars"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Admin Credentials
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin@123"
    ADMIN_EMAIL: str = "admin@zoodo.care"

    # Database
    DATABASE_URL: str = "sqlite:///./zoodo.db"
    
    # SMTP Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "zoodo.care@gmail.com"
    SMTP_PASSWORD: str = ""
    SMTP_FROM_NAME: str = "Zoodo Care"
    SMTP_FROM_EMAIL: str = "zoodo.care@gmail.com"
    
    # AI Key
    GEMINI_API_KEY: str = ""

    @property
    def cors_origins(self) -> List[str]:
        origins = []
        for origin in self.ALLOWED_ORIGINS.split(","):
            origin = origin.strip()
            if not origin:
                continue
            origins.append(origin)
            if not origin.startswith("http://") and not origin.startswith("https://"):
                origins.append(f"https://{origin}")
                origins.append(f"https://www.{origin}")
                origins.append(f"http://{origin}")
            elif origin.startswith("https://") and not origin.startswith("https://www."):
                d = origin[len("https://"):]
                origins.append(f"https://www.{d}")

        always_allow = [
            "https://zoodo.dev",
            "https://www.zoodo.dev",
            "http://zoodo.dev",
            "http://www.zoodo.dev",
            "https://zoodo.vercel.app",
            "https://www.zoodo.vercel.app",
            "http://localhost:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3000",
        ]
        for a in always_allow:
            if a not in origins:
                origins.append(a)
        return origins

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
