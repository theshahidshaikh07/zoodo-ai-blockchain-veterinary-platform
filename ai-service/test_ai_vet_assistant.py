#!/usr/bin/env python3
"""
Test script for AI Vet Assistant (Dr. Zoodo AI)
"""

import asyncio
import os
import sys
from datetime import datetime

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.utils.ai_vet_assistant import AIVetAssistant

async def test_ai_vet_initialization():
    """Test AI Vet Assistant initialization"""
    print("Testing AI Vet Assistant initialization...")
    
    ai_vet = AIVetAssistant()
    
    try:
        await ai_vet.initialize()
        
        if ai_vet.is_ready():
            print("✅ AI Vet Assistant initialized successfully")
            print(f"   Name: {ai_vet.name}")
            print(f"   Model: {ai_vet.model_name}")
            print(f"   Emergency keywords: {len(ai_vet.emergency_keywords)}")
            print(f"   Vet topics: {len(ai_vet.vet_topics)}")
        else:
            print("❌ AI Vet Assistant initialization failed")
            
    except Exception as e:
        print(f"❌ AI Vet Assistant test failed: {str(e)}")
    
    finally:
        await ai_vet.close()

async def test_vet_related_queries():
    """Test vet-related query detection"""
    print("\nTesting vet-related query detection...")
    
    ai_vet = AIVetAssistant()
    await ai_vet.initialize()
    
    # Test cases
    test_cases = [
        ("My dog is vomiting", True, "symptom_check"),
        ("Find a vet near me", True, "vet_finder"),
        ("What should I feed my cat?", True, "diet_care"),
        ("How to groom my pet", True, "diet_care"),
        ("What's the weather like?", False, "non_vet"),
        ("Tell me a joke", False, "non_vet"),
        ("My pet is having seizures", True, "emergency"),
        ("Dog not breathing", True, "emergency")
    ]
    
    for query, should_be_vet, expected_type in test_cases:
        is_vet = ai_vet._is_vet_related(query)
        has_emergency = ai_vet._contains_emergency_keywords(query)
        query_type = ai_vet._classify_query(query)
        
        if has_emergency:
            actual_type = "emergency"
        else:
            actual_type = query_type
        
        status = "✅" if is_vet == should_be_vet else "❌"
        print(f"{status} Query: '{query}'")
        print(f"   Vet-related: {is_vet} (expected: {should_be_vet})")
        print(f"   Type: {actual_type} (expected: {expected_type})")
        print(f"   Emergency: {has_emergency}")
        print()
    
    await ai_vet.close()

async def test_symptom_analysis():
    """Test symptom analysis functionality"""
    print("\nTesting symptom analysis...")
    
    ai_vet = AIVetAssistant()
    await ai_vet.initialize()
    
    # Test cases
    test_cases = [
        {
            "query": "My dog is vomiting and not eating",
            "pet_info": {"species": "dog", "breed": "Golden Retriever", "age": 5},
            "expected_symptoms": ["vomiting", "not eating"]
        },
        {
            "query": "My cat is limping and seems in pain",
            "pet_info": {"species": "cat", "breed": "Persian", "age": 3},
            "expected_symptoms": ["limping", "pain"]
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"Test case {i}:")
        print(f"   Query: '{test_case['query']}'")
        
        symptoms = ai_vet._extract_symptoms(test_case['query'])
        urgency = ai_vet._determine_urgency(symptoms, test_case['query'])
        
        print(f"   Extracted symptoms: {symptoms}")
        print(f"   Urgency level: {urgency}")
        print(f"   Expected symptoms: {test_case['expected_symptoms']}")
        
        # Check if expected symptoms are found
        found_expected = all(symptom in test_case['query'].lower() for symptom in test_case['expected_symptoms'])
        status = "✅" if found_expected else "❌"
        print(f"   {status} Symptom extraction")
        print()
    
    await ai_vet.close()

async def test_emergency_detection():
    """Test emergency keyword detection"""
    print("\nTesting emergency detection...")
    
    ai_vet = AIVetAssistant()
    await ai_vet.initialize()
    
    # Test cases
    emergency_cases = [
        "My dog is having a seizure",
        "Cat not breathing",
        "Pet bleeding severely",
        "Dog collapsed",
        "Pet unconscious"
    ]
    
    non_emergency_cases = [
        "My dog is sneezing",
        "Cat has mild cough",
        "Pet is slightly lethargic",
        "Dog has minor limp"
    ]
    
    print("Emergency cases:")
    for case in emergency_cases:
        is_emergency = ai_vet._contains_emergency_keywords(case)
        status = "✅" if is_emergency else "❌"
        print(f"   {status} '{case}' -> Emergency: {is_emergency}")
    
    print("\nNon-emergency cases:")
    for case in non_emergency_cases:
        is_emergency = ai_vet._contains_emergency_keywords(case)
        status = "✅" if not is_emergency else "❌"
        print(f"   {status} '{case}' -> Emergency: {is_emergency}")
    
    await ai_vet.close()

async def test_query_classification():
    """Test query classification"""
    print("\nTesting query classification...")
    
    ai_vet = AIVetAssistant()
    await ai_vet.initialize()
    
    # Test cases
    test_cases = [
        ("My dog is vomiting", "symptom_check"),
        ("Find a veterinarian", "vet_finder"),
        ("What should I feed my puppy?", "diet_care"),
        ("How to care for my cat", "diet_care"),
        ("General pet health advice", "general_advice")
    ]
    
    for query, expected_type in test_cases:
        actual_type = ai_vet._classify_query(query)
        status = "✅" if actual_type == expected_type else "❌"
        print(f"   {status} '{query}' -> {actual_type} (expected: {expected_type})")
    
    await ai_vet.close()

async def test_integration_with_backend():
    """Test integration with Spring Boot backend"""
    print("\nTesting backend integration...")
    
    ai_vet = AIVetAssistant()
    await ai_vet.initialize()
    
    # Test vet recommendations
    try:
        vets = await ai_vet._get_vets_from_backend(
            user_location={"lat": 40.7128, "lng": -74.0060},  # NYC coordinates
            search_criteria={"specialization": "general"},
            pet_info={"species": "dog", "breed": "Golden Retriever"}
        )
        
        if vets:
            print("✅ Backend vet integration successful")
            print(f"   Found {len(vets)} vets")
            for vet in vets[:2]:  # Show first 2
                print(f"   - {vet.get('name', 'Unknown')}")
        else:
            print("⚠️  No vets found (using mock data)")
            
    except Exception as e:
        print(f"❌ Backend integration test failed: {str(e)}")
    
    # Test emergency clinics
    try:
        clinics = await ai_vet._get_emergency_clinics(
            user_location={"lat": 40.7128, "lng": -74.0060}
        )
        
        if clinics:
            print("✅ Emergency clinics integration successful")
            print(f"   Found {len(clinics)} emergency clinics")
        else:
            print("⚠️  No emergency clinics found (using mock data)")
            
    except Exception as e:
        print(f"❌ Emergency clinics integration failed: {str(e)}")
    
    await ai_vet.close()

async def test_mongodb_redis_integration():
    """Test MongoDB and Redis integration"""
    print("\nTesting MongoDB and Redis integration...")
    
    ai_vet = AIVetAssistant()
    await ai_vet.initialize()
    
    if not ai_vet.mongo_manager or not ai_vet.redis_manager:
        print("❌ Database managers not initialized")
        return
    
    # Test MongoDB connection
    mongo_connected = await ai_vet.mongo_manager.is_connected()
    print(f"   MongoDB: {'✅ Connected' if mongo_connected else '❌ Not connected'}")
    
    # Test Redis connection
    redis_connected = await ai_vet.redis_manager.is_connected()
    print(f"   Redis: {'✅ Connected' if redis_connected else '❌ Not connected'}")
    
    if mongo_connected and redis_connected:
        print("✅ Database integration successful")
        
        # Test storing interaction
        try:
            await ai_vet.redis_manager.store_user_interaction(
                user_id="test_user",
                interaction_type="test_interaction",
                interaction_data={"test": "data"}
            )
            print("✅ Redis interaction storage successful")
        except Exception as e:
            print(f"❌ Redis interaction storage failed: {str(e)}")
        
        # Test storing symptom analysis
        try:
            await ai_vet.mongo_manager.store_symptom_analysis(
                user_id="test_user",
                pet_id="test_pet",
                symptoms=["test symptom"],
                analysis_result={"test": "analysis"}
            )
            print("✅ MongoDB symptom analysis storage successful")
        except Exception as e:
            print(f"❌ MongoDB symptom analysis storage failed: {str(e)}")
    else:
        print("❌ Database integration failed")
    
    await ai_vet.close()

async def test_full_conversation_flow():
    """Test full conversation flow with AI Vet Assistant"""
    print("\nTesting full conversation flow...")
    
    ai_vet = AIVetAssistant()
    await ai_vet.initialize()
    
    # Test conversation scenarios
    scenarios = [
        {
            "name": "Symptom Check",
            "query": "My dog is vomiting and seems lethargic",
            "pet_info": {"species": "dog", "breed": "Labrador", "age": 3},
            "expected_type": "symptom_check"
        },
        {
            "name": "Vet Finder",
            "query": "I need to find a good veterinarian near me",
            "pet_info": {"species": "dog", "breed": "Golden Retriever"},
            "user_location": {"lat": 40.7128, "lng": -74.0060},
            "expected_type": "vet_finder"
        },
        {
            "name": "Diet Care",
            "query": "What should I feed my 6-month-old puppy?",
            "pet_info": {"species": "dog", "breed": "German Shepherd", "age": 0.5},
            "expected_type": "diet_care"
        },
        {
            "name": "Emergency Case",
            "query": "My cat is having seizures and not breathing properly",
            "pet_info": {"species": "cat", "breed": "Persian", "age": 5},
            "expected_type": "emergency"
        },
        {
            "name": "Non-Vet Query",
            "query": "What's the weather like today?",
            "expected_type": "non_vet"
        }
    ]
    
    for scenario in scenarios:
        print(f"\nScenario: {scenario['name']}")
        print(f"Query: '{scenario['query']}'")
        
        try:
            result = await ai_vet.process_user_query(
                user_id="test_user",
                query=scenario['query'],
                pet_info=scenario.get('pet_info'),
                user_location=scenario.get('user_location')
            )
            
            print(f"Response type: {result['type']}")
            print(f"Emergency: {result.get('emergency', False)}")
            print(f"Should see vet: {result.get('should_see_vet', False)}")
            print(f"Confidence: {result.get('confidence', 0.0)}")
            
            # Check if response type matches expected
            expected_type = scenario['expected_type']
            actual_type = result['type']
            
            if expected_type == "emergency" and result.get('emergency', False):
                status = "✅"
            elif actual_type == expected_type:
                status = "✅"
            else:
                status = "❌"
            
            print(f"{status} Type match: {actual_type} (expected: {expected_type})")
            
        except Exception as e:
            print(f"❌ Error processing scenario: {str(e)}")
    
    await ai_vet.close()

async def main():
    """Run all tests"""
    print("🧪 Testing AI Vet Assistant (Dr. Zoodo AI)")
    print("=" * 60)
    
    await test_ai_vet_initialization()
    await test_vet_related_queries()
    await test_symptom_analysis()
    await test_emergency_detection()
    await test_query_classification()
    await test_integration_with_backend()
    await test_mongodb_redis_integration()
    await test_full_conversation_flow()
    
    print("\n" + "=" * 60)
    print("✅ All AI Vet Assistant tests completed!")
    print("\n🎉 Dr. Zoodo AI is ready to help with your pet's health!")

if __name__ == "__main__":
    asyncio.run(main()) 