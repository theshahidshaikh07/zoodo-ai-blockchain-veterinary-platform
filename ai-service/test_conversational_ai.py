#!/usr/bin/env python3
"""
Test script for Conversational AI Veterinarian Assistant
This script tests the conversational AI assistant functionality
"""

import os
import sys
import asyncio
import json
from pathlib import Path

# Add the app directory to Python path
app_dir = Path(__file__).parent / "app"
sys.path.insert(0, str(app_dir))

from utils.conversational_ai_vet import ConversationalAIVet
from utils.mongodb_manager import MongoDBManager
from utils.redis_manager import RedisManager

async def test_conversational_ai():
    """Test the Conversational AI Vet Assistant functionality"""
    print("🐾 Testing Conversational AI Veterinarian Assistant...")
    
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
    
    # Initialize the conversational AI assistant
    ai_vet = ConversationalAIVet(mongo_manager=mongo_manager, redis_manager=redis_manager)
    await ai_vet.initialize()
    
    if not ai_vet.is_ready():
        print("❌ Conversational AI Vet Assistant failed to initialize")
        return False
    
    print("✅ Conversational AI Vet Assistant initialized successfully")
    
    # Test conversation flow
    print("\n🧪 Testing conversation flow...")
    print("=" * 60)
    
    # Start conversation
    greeting = ai_vet.start_conversation()
    print(f"🤖 AI: {greeting}")
    
    # Test conversation scenarios
    test_conversations = [
        {
            "name": "Dog Health Concern",
            "messages": [
                "Hi, I'm worried about my dog",
                "He's a 3 year old Golden Retriever named Max",
                "He's been vomiting for 2 days and seems lethargic",
                "He's not eating much and just wants to sleep",
                "No, no blood in the vomit",
                "He's drinking water normally"
            ]
        },
        {
            "name": "Emergency Case",
            "messages": [
                "My cat is having trouble breathing!",
                "She's a 5 year old Persian",
                "It started about an hour ago",
                "She's gasping and her tongue looks blue"
            ]
        },
        {
            "name": "Exotic Pet Care",
            "messages": [
                "I have a bearded dragon that's not eating",
                "He's about 2 years old",
                "It's been 4 days now",
                "The temperature is around 85 degrees in his tank"
            ]
        },
        {
            "name": "Location and Vet Search",
            "messages": [
                "I need to find a vet near me",
                "I'm in Paris, France",
                "Can you help me find emergency vets?"
            ]
        }
    ]
    
    for i, conversation in enumerate(test_conversations, 1):
        print(f"\n📝 Test {i}: {conversation['name']}")
        print("-" * 40)
        
        # Reset for each conversation
        ai_vet.pet_profile = ai_vet.pet_profile.__class__()
        ai_vet.consultation = ai_vet.consultation.__class__()
        ai_vet.chat_history = []
        
        for j, message in enumerate(conversation['messages'], 1):
            print(f"\n👤 User: {message}")
            
            try:
                response = await ai_vet.chat(message)
                print(f"🤖 AI: {response}")
                
                # Show profile updates
                if j == len(conversation['messages']):  # Last message
                    profile = ai_vet.get_profile()
                    if "No animal information" not in profile:
                        print(f"\n📋 Profile: {profile}")
                
            except Exception as e:
                print(f"❌ Error in conversation: {str(e)}")
        
        print("-" * 40)
    
    # Test special commands
    print("\n🔧 Testing special commands...")
    print("=" * 60)
    
    # Test location setting
    location_result = ai_vet.location.set_location("New York", "USA")
    print(f"📍 Location: {location_result}")
    
    # Test vet search
    vet_search = ai_vet.find_vet(emergency=False)
    print(f"🔍 Vet Search: {vet_search[:100]}...")
    
    # Test emergency vet search
    emergency_search = ai_vet.find_vet(emergency=True)
    print(f"🚨 Emergency Search: {emergency_search[:100]}...")
    
    # Test specialist search
    specialist_search = ai_vet.find_specialist()
    print(f"👨‍⚕️ Specialist Search: {specialist_search[:100]}...")
    
    # Test reminder setting
    reminder_result = ai_vet.set_reminder("Check up on Max's condition", 3)
    print(f"📅 Reminder: {reminder_result}")
    
    # Test reminders list
    reminders = ai_vet.get_reminders()
    print(f"📋 Reminders: {reminders}")
    
    # Test profile
    profile = ai_vet.get_profile()
    print(f"🐾 Profile: {profile}")
    
    # Test summary
    summary = ai_vet.export_summary()
    print(f"📄 Summary: {summary[:200]}...")
    
    print("\n🎉 Conversational AI test completed!")
    
    # Cleanup
    if mongo_manager:
        await mongo_manager.close()
    if redis_manager:
        await redis_manager.close()
    
    return True

async def test_emergency_detection():
    """Test emergency keyword detection"""
    print("\n🚨 Testing emergency detection...")
    
    ai_vet = ConversationalAIVet()
    await ai_vet.initialize()
    
    emergency_messages = [
        "My dog is having a seizure!",
        "My cat is not breathing",
        "There's blood everywhere",
        "My pet is unconscious",
        "This is an emergency",
        "My dog collapsed"
    ]
    
    for message in emergency_messages:
        is_emergency = ai_vet._contains_emergency_keywords(message)
        print(f"Message: '{message}' -> Emergency: {is_emergency}")
    
    return True

async def test_rule_based_fallback():
    """Test rule-based responses when AI is not available"""
    print("\n🔧 Testing rule-based fallback...")
    
    # Test without API key
    original_key = os.environ.get("GOOGLE_API_KEY")
    if original_key:
        del os.environ["GOOGLE_API_KEY"]
    
    ai_vet = ConversationalAIVet()
    await ai_vet.initialize()
    
    if ai_vet.is_ready():
        print("✅ AI Vet Assistant works without API key (rule-based mode)")
        
        # Test responses
        test_messages = [
            "Hello",
            "My dog is sick",
            "What should I do?",
            "My cat is vomiting"
        ]
        
        for message in test_messages:
            response = await ai_vet.chat(message)
            print(f"User: {message}")
            print(f"AI: {response}")
            print("-" * 30)
    else:
        print("❌ AI Vet Assistant failed to initialize in rule-based mode")
    
    # Restore API key
    if original_key:
        os.environ["GOOGLE_API_KEY"] = original_key
    
    return True

def main():
    """Main test function"""
    print("🧪 Conversational AI Veterinarian Assistant Test Suite")
    print("=" * 60)
    
    # Check AI provider configuration
    ai_provider = os.getenv("AI_PROVIDER", "google")
    has_google_key = bool(os.getenv("GOOGLE_API_KEY"))
    
    if ai_provider.lower() == "google" and has_google_key:
        print(f"🔑 Google API Key: ✅ Available")
        print("🤖 Will test with Google Gemini integration")
    else:
        print("🔧 Will test in rule-based mode only")
    
    try:
        # Run tests
        asyncio.run(test_conversational_ai())
        asyncio.run(test_emergency_detection())
        asyncio.run(test_rule_based_fallback())
        
        print("\n✅ All conversational AI tests completed successfully!")
        
    except Exception as e:
        print(f"\n❌ Test suite failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
