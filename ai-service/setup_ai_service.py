#!/usr/bin/env python3
"""
Setup script for AI Veterinarian Assistant Service
This script helps set up the AI service with proper configuration
"""

import os
import sys
import subprocess
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    return True

def install_dependencies():
    """Install required dependencies"""
    print("\n📦 Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def setup_environment():
    """Set up environment variables"""
    print("\n🔧 Setting up environment...")
    
    env_file = Path(".env")
    template_file = Path("env_template.txt")
    
    if env_file.exists():
        print("⚠️  .env file already exists")
        response = input("Do you want to overwrite it? (y/N): ").lower()
        if response != 'y':
            print("✅ Using existing .env file")
            return True
    
    if not template_file.exists():
        print("❌ env_template.txt not found")
        return False
    
    # Copy template to .env
    with open(template_file, 'r') as f:
        template_content = f.read()
    
    with open(env_file, 'w') as f:
        f.write(template_content)
    
    print("✅ .env file created from template")
    print("⚠️  Please edit .env file and add your API keys")
    return True

def check_api_keys():
    """Check if API keys are configured"""
    print("\n🔑 Checking API configuration...")
    
    from dotenv import load_dotenv
    load_dotenv()
    
    google_key = os.getenv("GOOGLE_API_KEY")
    backend_url = os.getenv("BACKEND_URL", "http://localhost:8080")
    
    if google_key:
        print("✅ Google API key is configured")
    else:
        print("⚠️  Google API key is not configured")
        print("   Please add GOOGLE_API_KEY to your .env file")
        print("   Get your key from: https://aistudio.google.com/")
    
    print(f"✅ Backend URL: {backend_url}")
    
    return bool(google_key)

def test_imports():
    """Test if all required modules can be imported"""
    print("\n🧪 Testing imports...")
    
    try:
        import fastapi
        print("✅ FastAPI imported successfully")
    except ImportError as e:
        print(f"❌ FastAPI import failed: {e}")
        return False
    
    try:
        import langchain_google_genai
        print("✅ LangChain Google GenAI imported successfully")
    except ImportError as e:
        print(f"❌ LangChain Google GenAI import failed: {e}")
        return False
    
    try:
        import motor
        print("✅ Motor (MongoDB) imported successfully")
    except ImportError as e:
        print(f"❌ Motor import failed: {e}")
        return False
    
    try:
        import redis
        print("✅ Redis imported successfully")
    except ImportError as e:
        print(f"❌ Redis import failed: {e}")
        return False
    
    return True

def run_basic_test():
    """Run basic functionality test"""
    print("\n🧪 Running basic test...")
    
    try:
        # Add app directory to path
        app_dir = Path(__file__).parent / "app"
        sys.path.insert(0, str(app_dir))
        
        # Test AI assistant initialization
        from utils.ai_vet_assistant import AIVetAssistant
        
        async def test_init():
            ai_vet = AIVetAssistant()
            await ai_vet.initialize()
            return ai_vet.is_ready()
        
        import asyncio
        result = asyncio.run(test_init())
        
        if result:
            print("✅ AI Vet Assistant initialized successfully")
        else:
            print("❌ AI Vet Assistant initialization failed")
        
        return result
        
    except Exception as e:
        print(f"❌ Basic test failed: {e}")
        return False

def main():
    """Main setup function"""
    print("🐾 AI Veterinarian Assistant Service Setup")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        return False
    
    # Install dependencies
    if not install_dependencies():
        return False
    
    # Setup environment
    if not setup_environment():
        return False
    
    # Check API keys
    api_configured = check_api_keys()
    
    # Test imports
    if not test_imports():
        return False
    
    # Run basic test
    if not run_basic_test():
        return False
    
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Edit .env file and add your Google API key")
    print("2. Start MongoDB and Redis services")
    print("3. Run: python start_ai_service.py")
    print("4. Test with: python test_ai_vet_assistant.py")
    
    if not api_configured:
        print("\n⚠️  Remember to configure your API keys before running the service!")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
