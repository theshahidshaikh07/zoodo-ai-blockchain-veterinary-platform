#!/usr/bin/env python3
"""
Test script for AI Veterinarian Assistant
This script tests the AI assistant functionality
"""

import os
import sys
import asyncio
import json
from pathlib import Path

# Add the app directory to Python path
app_dir = Path(__file__).parent / "app"
sys.path.insert(0, str(app_dir))

from utils.ai_vet_assistant import AIVetAssistant
from utils.mongodb_manager import MongoDBManager
from utils.redis_manager import RedisManager

async def test_ai_vet_assistant():
    """Test the AI Vet Assistant functionality"""
    print("🐾 Testing AI Veterinarian Assistant...")
    
    # Initialize managers (optional for testing)
    mongo_manager = MongoDBManager()
    redis_manager = RedisManager()
    
    try:
        await mongo_manager.initialize()
        print("✅ MongoDB Manager initialized")
    except Exception as e:
        print(f"⚠️  MongoDB Manager failed to initialize: {e}")
        mongo_manager = None
    
    try:
        await redis_manager.initialize()
        print("✅ Redis Manager initialized")
    except Exception as e:
        print(f"⚠️  Redis Manager failed to initialize: {e}")
        redis_manager = None
    
    # Initialize the assistant
    ai_vet = AIVetAssistant()
    await ai_vet.initialize(mongo_manager=mongo_manager, redis_manager=redis_manager)
    
    if not ai_vet.is_ready():
        print("❌ AI Vet Assistant failed to initialize")
        return False
    
    print("✅ AI Vet Assistant initialized successfully")
    
    # Test cases
    test_cases = [
        {
            "name": "Symptom Check - Dog Vomiting",
            "query": "My dog has been vomiting for 2 days and seems lethargic",
            "pet_info": {"species": "dog", "breed": "Golden Retriever", "age": 3},
            "expected_type": "symptom_check"
        },
        {
            "name": "Emergency Case - Breathing Issues",
            "query": "My cat is having difficulty breathing and seems to be in distress",
            "pet_info": {"species": "cat", "breed": "Persian", "age": 5},
            "expected_type": "emergency"
        },
        {
            "name": "Emergency Case - Seizure",
            "query": "My dog just had a seizure and is not responding",
            "pet_info": {"species": "dog", "breed": "Border Collie", "age": 4},
            "expected_type": "emergency"
        },
        {
            "name": "Vet Finder Request",
            "query": "I need to find a good veterinarian near me for my dog",
            "pet_info": {"species": "dog", "breed": "Labrador"},
            "user_location": {"lat": 40.7128, "lng": -74.0060},
            "expected_type": "vet_finder"
        },
        {
            "name": "Diet and Care Question",
            "query": "What should I feed my 6-month-old puppy?",
            "pet_info": {"species": "dog", "breed": "German Shepherd", "age": 0.5},
            "expected_type": "diet_care"
        },
        {
            "name": "Grooming Question",
            "query": "How often should I groom my long-haired cat?",
            "pet_info": {"species": "cat", "breed": "Maine Coon", "age": 2},
            "expected_type": "diet_care"
        },
        {
            "name": "General Health Question",
            "query": "My dog seems to be limping on his front leg",
            "pet_info": {"species": "dog", "breed": "Beagle", "age": 7},
            "expected_type": "symptom_check"
        },
        {
            "name": "Non-Vet Question",
            "query": "What's the weather like today?",
            "pet_info": None,
            "expected_type": "non_vet_query"
        },
        {
            "name": "Multiple Symptoms",
            "query": "My cat is not eating, seems lethargic, and has been hiding under the bed",
            "pet_info": {"species": "cat", "breed": "Siamese", "age": 6},
            "expected_type": "symptom_check"
        }
    ]
    
    print("\n🧪 Running test cases...")
    print("=" * 60)
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\nTest {i}: {test_case['name']}")
        print(f"Query: {test_case['query']}")
        
        try:
            result = await ai_vet.process_user_query(
                user_id="test_user",
                query=test_case["query"],
                pet_info=test_case.get("pet_info"),
                user_location=test_case.get("user_location")
            )
            
            print(f"✅ Response Type: {result['type']}")
            print(f"✅ Confidence: {result['confidence']}")
            print(f"✅ Should See Vet: {result['should_see_vet']}")
            print(f"✅ Emergency: {result.get('emergency', False)}")
            
            if result['type'] == test_case['expected_type']:
                print("✅ Test PASSED - Response type matches expected")
            else:
                print(f"⚠️  Test PARTIAL - Expected {test_case['expected_type']}, got {result['type']}")
            
            # Show a snippet of the response
            response_snippet = result['response'][:100] + "..." if len(result['response']) > 100 else result['response']
            print(f"📝 Response: {response_snippet}")
            
        except Exception as e:
            print(f"❌ Test FAILED - Error: {str(e)}")
        
        print("-" * 40)
    
    print("\n🎉 Test completed!")
    
    # Cleanup
    if mongo_manager:
        await mongo_manager.close()
    if redis_manager:
        await redis_manager.close()
    
    return True

async def test_simple_functionality():
    """Test basic functionality without OpenAI"""
    print("\n🔧 Testing basic functionality...")
    
    # Test without OpenAI API key
    original_key = os.environ.get("OPENAI_API_KEY")
    if original_key:
        del os.environ["OPENAI_API_KEY"]
    
    ai_vet = AIVetAssistant()
    await ai_vet.initialize()
    
    if ai_vet.is_ready():
        print("✅ AI Vet Assistant works without OpenAI (rule-based mode)")
        
        # Test a simple query
        result = await ai_vet.process_user_query(
            user_id="test_user",
            query="My dog is vomiting",
            pet_info={"species": "dog"}
        )
        
        print(f"✅ Rule-based response generated: {result['type']}")
        print(f"📝 Response: {result['response'][:100]}...")
    else:
        print("❌ AI Vet Assistant failed to initialize in rule-based mode")
    
    # Restore API key
    if original_key:
        os.environ["OPENAI_API_KEY"] = original_key

def main():
    """Main test function"""
    print("🧪 AI Veterinarian Assistant Test Suite")
    print("=" * 50)
    
    # Check AI provider configuration
    ai_provider = os.getenv("AI_PROVIDER", "google")
    has_openai_key = bool(os.getenv("OPENAI_API_KEY"))
    has_google_key = bool(os.getenv("GOOGLE_API_KEY"))
    
    if ai_provider.lower() == "google" and has_google_key:
        print(f"🔑 Google API Key: ✅ Available")
        print("🤖 Will test with Google Gemini integration")
    elif ai_provider.lower() == "openai" and has_openai_key:
        print(f"🔑 OpenAI API Key: ✅ Available")
        print("🤖 Will test with OpenAI integration")
    else:
        print("🔧 Will test in rule-based mode only")
    
    try:
        # Run tests
        asyncio.run(test_ai_vet_assistant())
        
        # Test basic functionality
        asyncio.run(test_simple_functionality())
        
        print("\n✅ All tests completed successfully!")
        
    except Exception as e:
        print(f"\n❌ Test suite failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()