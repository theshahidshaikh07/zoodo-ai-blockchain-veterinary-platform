#!/usr/bin/env python3
"""
Zoodo AI Service Startup Script
This script starts the AI veterinarian assistant service
"""

import os
import sys
import asyncio
import uvicorn
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Add the app directory to Python path
app_dir = Path(__file__).parent / "app"
sys.path.insert(0, str(app_dir))

def check_environment():
    """Check if required environment variables are set"""
    # Check for Google API key
    google_key = os.getenv("GOOGLE_API_KEY")
    
    if not google_key:
        print("❌ Missing required environment variable: GOOGLE_API_KEY")
        print("\nPlease create a .env file in the ai-service directory with:")
        print("GOOGLE_API_KEY=your_google_api_key_here")
        return False
    
    return True

def main():
    """Main startup function"""
    print("🐾 Starting Dr. Salus AI Veterinarian Assistant Service...")
    
    # Check environment
    if not check_environment():
        sys.exit(1)
    
    # Using Google Gemini - Simple version
    print("🤖 Using AI provider: GOOGLE GEMINI (Simple Mode)")
    app_module = "main_simple:app"
    
    # Get configuration
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", "8000"))
    debug = os.getenv("API_DEBUG", "true").lower() == "true"
    
    print(f"🌐 Starting server on {host}:{port}")
    print(f"🔧 Debug mode: {debug}")
    print(f"📚 API Documentation: http://{host}:{port}/docs")
    print("=" * 50)
    
    try:
        # Start the server
        uvicorn.run(
            app_module,
            host=host,
            port=port,
            reload=debug,
            log_level="info" if debug else "warning"
        )
    except KeyboardInterrupt:
        print("\n🛑 Service stopped by user")
    except Exception as e:
        print(f"❌ Error starting service: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
