"""
Dr. Salus AI - Main FastAPI Application
AI-powered veterinary assistant for pet parents
"""

from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env file

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
import uvicorn

app = FastAPI(
    title="Dr. Salus AI",
    description="AI-powered veterinary assistant for pet health guidance",
    version="1.0.0"
)

# CORS middleware
# In production, this will be your Vercel URL (e.g., https://zoodo.vercel.app)
origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001")
origins = [origin.strip() for origin in origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "Dr. Salus AI - Veterinary Assistant API",
        "status": "active",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
