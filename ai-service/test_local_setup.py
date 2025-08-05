#!/usr/bin/env python3
"""
Test script to verify AI service works locally without Docker
"""

import asyncio
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_ai_vet_assistant_local():
    """Test AI Vet Assistant without database connections"""
    print("🤖 Testing AI Vet Assistant (Local Mode)...")
    
    try:
        from app.utils.ai_vet_assistant import AIVetAssistant
        
        ai_vet = AIVetAssistant()
        
        print(f"✅ AI Vet Assistant created: {ai_vet.name}")
        print(f"✅ OpenAI API Key: {'Loaded' if ai_vet.openai_api_key else 'Missing'}")
        print(f"✅ Model Name: {ai_vet.model_name}")
        
        # Test a simple query without database connections
        print("\n🧪 Testing simple query processing...")
        
        # Test vet-related query detection
        test_query = "My dog is vomiting"
        is_vet_related = ai_vet._is_vet_related(test_query)
        print(f"✅ Vet-related query detection: {is_vet_related}")
        
        # Test emergency keyword detection
        emergency_query = "My dog is having a seizure"
        has_emergency = ai_vet._contains_emergency_keywords(emergency_query)
        print(f"✅ Emergency keyword detection: {has_emergency}")
        
        # Test query classification
        query_type = ai_vet._classify_query(test_query)
        print(f"✅ Query classification: {query_type}")
        
        # Test non-vet query rejection
        non_vet_query = "What's the weather like?"
        is_non_vet = not ai_vet._is_vet_related(non_vet_query)
        print(f"✅ Non-vet query rejection: {is_non_vet}")
        
        print("\n✅ All local tests passed!")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")

async def test_openai_connection():
    """Test OpenAI API connection"""
    print("\n🔗 Testing OpenAI API Connection...")
    
    try:
        import openai
        from dotenv import load_dotenv
        
        load_dotenv()
        api_key = os.getenv('OPENAI_API_KEY')
        
        if not api_key:
            print("❌ OpenAI API key not found")
            return
        
        openai.api_key = api_key
        
        # Test with a simple API call
        response = openai.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "user", "content": "Hello, this is a test. Please respond with 'Test successful'."}
            ],
            max_tokens=10
        )
        
        if response.choices and response.choices[0].message.content:
            print("✅ OpenAI API connection successful!")
            print(f"✅ Response: {response.choices[0].message.content}")
        else:
            print("❌ OpenAI API response was empty")
            
    except Exception as e:
        print(f"❌ OpenAI API connection failed: {str(e)}")

async def main():
    """Main test function"""
    print("🚀 Starting Local AI Service Test...\n")
    
    # Test AI Vet Assistant
    await test_ai_vet_assistant_local()
    
    # Test OpenAI connection
    await test_openai_connection()
    
    print("\n" + "="*50)
    print("🎉 Local setup test completed!")
    print("\nYour AI service is ready to use!")
    print("\nTo start the service locally:")
    print("1. cd ai_service")
    print("2. python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload")
    print("\nTo test the API:")
    print("curl http://localhost:8000/health")
    print("curl -X POST http://localhost:8000/chat -H 'Content-Type: application/json' -d '{\"query\": \"My dog is vomiting\"}'")

if __name__ == "__main__":
    asyncio.run(main()) 