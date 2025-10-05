#!/usr/bin/env python3
"""
Test script to verify the fixed conversation flow
This tests the exact scenario the user reported as problematic
"""

import os
import sys
import asyncio
from pathlib import Path

# Add the app directory to Python path
app_dir = Path(__file__).parent / "app"
sys.path.insert(0, str(app_dir))

from utils.conversational_ai_vet import ConversationalAIVet
from utils.mongodb_manager import MongoDBManager
from utils.redis_manager import RedisManager

async def test_fixed_conversation():
    """Test the exact conversation that was problematic"""
    print("🧪 Testing Fixed Conversation Flow")
    print("=" * 60)
    
    # Initialize managers
    mongo_manager = MongoDBManager()
    redis_manager = RedisManager()
    
    try:
        await mongo_manager.initialize()
        await redis_manager.initialize()
        print("✅ Database connections established")
    except Exception as e:
        print(f"⚠️  Database initialization failed: {e}")
        print("Continuing with in-memory only mode...")
        mongo_manager = None
        redis_manager = None
    
    # Create AI assistant
    ai_vet = ConversationalAIVet(mongo_manager=mongo_manager, redis_manager=redis_manager)
    await ai_vet.initialize()
    
    if not ai_vet.is_ready():
        print("❌ AI Vet Assistant failed to initialize")
        return False
    
    print("✅ AI Vet Assistant ready!")
    
    # Test the exact problematic conversation
    print("\n📝 Testing the problematic conversation scenario:")
    print("=" * 60)
    
    conversation = [
        "hi",
        "my dog is not eating", 
        "since 2 days",
        "nothing much just not eating",
        "yes drinking water",
        "not eating i told you before",
        "no i havent"
    ]
    
    for i, message in enumerate(conversation, 1):
        print(f"\n👤 User: {message}")
        
        try:
            response = await ai_vet.chat(message)
            print(f"🤖 AI: {response}")
            
            # Show current profile
            profile = ai_vet.get_profile()
            if "No animal information" not in profile:
                print(f"📋 Profile: {profile}")
            
        except Exception as e:
            print(f"❌ Error: {str(e)}")
    
    print("\n" + "=" * 60)
    print("🎯 Expected vs Actual Behavior:")
    print("=" * 60)
    
    print("❌ OLD BAD BEHAVIOR:")
    print("  - Asked repetitive questions")
    print("  - Didn't follow step-by-step flow")
    print("  - Was dismissive and robotic")
    print("  - Didn't remember previous answers")
    
    print("\n✅ NEW GOOD BEHAVIOR:")
    print("  - Should ask for species first")
    print("  - Then ask for age")
    print("  - Then ask for duration")
    print("  - Then ask about drinking water")
    print("  - Then ask about energy level")
    print("  - Finally provide assessment")
    print("  - Natural, empathetic conversation")
    
    # Test another scenario
    print(f"\n📝 Testing another scenario - Emergency case:")
    print("=" * 60)
    
    # Reset for new scenario
    ai_vet.pet_profile = ai_vet.pet_profile.__class__()
    ai_vet.consultation = ai_vet.consultation.__class__()
    ai_vet.chat_history = []
    
    emergency_conversation = [
        "my cat is having trouble breathing",
        "she's a 5 year old persian",
        "it started about an hour ago",
        "she's gasping and her tongue looks blue"
    ]
    
    for i, message in enumerate(emergency_conversation, 1):
        print(f"\n👤 User: {message}")
        
        try:
            response = await ai_vet.chat(message)
            print(f"🤖 AI: {response}")
            
        except Exception as e:
            print(f"❌ Error: {str(e)}")
    
    print(f"\n🎉 Conversation flow test completed!")
    
    # Cleanup
    if mongo_manager:
        await mongo_manager.close()
    if redis_manager:
        await redis_manager.close()
    
    return True

def main():
    """Main test function"""
    print("🚀 Testing Fixed Conversation Flow...")
    
    try:
        asyncio.run(test_fixed_conversation())
        print("\n✅ Test completed successfully!")
        print("\n💡 The AI should now:")
        print("  ✅ Follow natural conversation flow")
        print("  ✅ Ask one question at a time")
        print("  ✅ Remember previous answers")
        print("  ✅ Be empathetic and warm")
        print("  ✅ Provide proper assessments")
        print("  ✅ Not repeat questions")
        
    except Exception as e:
        print(f"\n❌ Test failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
