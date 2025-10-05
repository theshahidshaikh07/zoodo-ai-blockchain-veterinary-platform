#!/usr/bin/env python3
"""
Start Conversational AI Veterinarian Assistant Service
This script starts the conversational AI service with proper configuration
"""

import os
import sys
import uvicorn
from pathlib import Path

# Add the app directory to Python path
app_dir = Path(__file__).parent / "app"
sys.path.insert(0, str(app_dir))

def check_environment():
    """Check if environment is properly configured"""
    print("🔧 Checking environment configuration...")
    
    # Check for required environment variables
    required_vars = ["GOOGLE_API_KEY"]
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"⚠️  Missing environment variables: {', '.join(missing_vars)}")
        print("📝 Please set these in your .env file or environment")
        print("🔗 Get Google API key from: https://aistudio.google.com/")
        return False
    
    print("✅ Environment configuration looks good")
    return True

def check_dependencies():
    """Check if required dependencies are installed"""
    print("📦 Checking dependencies...")
    
    try:
        import fastapi
        print("✅ FastAPI available")
    except ImportError:
        print("❌ FastAPI not installed")
        return False
    
    try:
        import langchain_google_genai
        print("✅ LangChain Google GenAI available")
    except ImportError:
        print("❌ LangChain Google GenAI not installed")
        return False
    
    try:
        import motor
        print("✅ Motor (MongoDB) available")
    except ImportError:
        print("⚠️  Motor not installed - MongoDB features will be limited")
    
    try:
        import redis
        print("✅ Redis available")
    except ImportError:
        print("⚠️  Redis not installed - caching features will be limited")
    
    return True

def main():
    """Main function to start the service"""
    print("🐾 Starting Conversational AI Veterinarian Assistant Service")
    print("=" * 60)
    
    # Check environment
    if not check_environment():
        print("\n❌ Environment check failed. Please fix the issues above.")
        sys.exit(1)
    
    # Check dependencies
    if not check_dependencies():
        print("\n❌ Dependency check failed. Please install missing packages.")
        print("💡 Run: pip install -r requirements.txt")
        sys.exit(1)
    
    # Get configuration
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", "8000"))
    debug = os.getenv("API_DEBUG", "true").lower() == "true"
    
    print(f"\n🚀 Starting service on {host}:{port}")
    print(f"🔧 Debug mode: {debug}")
    print(f"🌍 CORS enabled for all origins")
    print("\n📋 Available endpoints:")
    print("  POST /chat - Main conversational chat")
    print("  POST /location - Set user location")
    print("  GET /profile - Get pet profile")
    print("  GET /find-vet - Find veterinarians")
    print("  GET /find-specialist - Find specialist vets")
    print("  POST /reminder - Set follow-up reminder")
    print("  GET /reminders - Get active reminders")
    print("  GET /summary - Get consultation summary")
    print("  GET /health - Health check")
    print("  GET /ai-vet/info - AI assistant info")
    print("\n📖 API Documentation: http://localhost:8000/docs")
    print("=" * 60)
    
    try:
        # Start the service
        uvicorn.run(
            "main_conversational:app",
            host=host,
            port=port,
            reload=debug,
            log_level="info" if not debug else "debug"
        )
    except KeyboardInterrupt:
        print("\n\n🛑 Service stopped by user")
    except Exception as e:
        print(f"\n❌ Error starting service: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
