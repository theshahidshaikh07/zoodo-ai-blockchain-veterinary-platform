#!/usr/bin/env python3
"""
Test script to verify environment setup and API key loading
"""

import asyncio
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_env_variables():
    """Test if environment variables are loaded correctly"""
    print("🔍 Testing Environment Variables...")
    
    # Test OpenAI API Key
    api_key = os.getenv('OPENAI_API_KEY')
    if api_key:
        print(f"✅ OpenAI API Key: Loaded (starts with: {api_key[:20]}...)")
    else:
        print("❌ OpenAI API Key: Not found")
    
    # Test other variables
    model_name = os.getenv('AI_MODEL_NAME', 'gpt-4-turbo-preview')
    print(f"✅ AI Model: {model_name}")
    
    backend_url = os.getenv('BACKEND_URL', 'http://localhost:8080')
    print(f"✅ Backend URL: {backend_url}")
    
    mongo_uri = os.getenv('MONGO_URI')
    if mongo_uri:
        print(f"✅ MongoDB URI: Loaded")
    else:
        print("❌ MongoDB URI: Not found")
    
    redis_host = os.getenv('REDIS_HOST', 'redis')
    print(f"✅ Redis Host: {redis_host}")
    
    print("\n" + "="*50)

async def test_ai_vet_assistant():
    """Test AI Vet Assistant initialization"""
    print("🤖 Testing AI Vet Assistant...")
    
    try:
        from app.utils.ai_vet_assistant import AIVetAssistant
        
        ai_vet = AIVetAssistant()
        
        print(f"✅ AI Vet Assistant created: {ai_vet.name}")
        print(f"✅ OpenAI API Key: {'Loaded' if ai_vet.openai_api_key else 'Missing'}")
        print(f"✅ Model Name: {ai_vet.model_name}")
        print(f"✅ Backend URL: {ai_vet.backend_url}")
        print(f"✅ Emergency Keywords: {len(ai_vet.emergency_keywords)} loaded")
        print(f"✅ Vet Topics: {len(ai_vet.vet_topics)} loaded")
        
        # Test initialization (without actually connecting to databases)
        print("\n🔄 Testing initialization...")
        try:
            await ai_vet.initialize()
            print("✅ AI Vet Assistant initialized successfully")
        except Exception as e:
            print(f"⚠️  Initialization warning (expected if databases not running): {str(e)}")
        
    except ImportError as e:
        print(f"❌ Import error: {str(e)}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

async def main():
    """Main test function"""
    print("🚀 Starting Environment Setup Test...\n")
    
    # Test environment variables
    test_env_variables()
    
    # Test AI Vet Assistant
    await test_ai_vet_assistant()
    
    print("\n" + "="*50)
    print("🎉 Environment setup test completed!")
    print("\nNext steps:")
    print("1. Start the services: docker-compose up -d")
    print("2. Test the API: curl http://localhost:8000/health")
    print("3. Test AI chat: curl -X POST http://localhost:8000/chat")

if __name__ == "__main__":
    asyncio.run(main()) 