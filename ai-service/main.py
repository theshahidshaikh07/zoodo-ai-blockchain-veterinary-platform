from fastapi import FastAPI
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI(title="Zoodo AI Service", version="1.0.0")

@app.get("/")
async def root():
    return {"message": "Zoodo AI Service is running!"}
