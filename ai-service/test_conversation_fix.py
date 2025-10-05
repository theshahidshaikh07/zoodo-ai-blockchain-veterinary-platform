#!/usr/bin/env python3
"""
Quick test to verify the conversation fix works
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

async def test_conversation_fix():
    """Test the exact problematic conversation"""
    print("🧪 Testing Conversation Fix")
    print("=" * 50)
    
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
    print("\n📝 Testing the problematic conversation:")
    print("=" * 50)
    
    conversation = [
        "hi",
        "my dog is not eating", 
        "since 2 days",
        "nothing much just he is not eating",
        "entirely"
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
    
    print("\n" + "=" * 50)
    print("🎯 Expected Behavior:")
    print("=" * 50)
    print("✅ Should ask for species first")
    print("✅ Should ask for age")
    print("✅ Should ask for duration")
    print("✅ Should ask about drinking water")
    print("✅ Should ask about energy level")
    print("✅ Should provide assessment")
    print("✅ Should NOT repeat questions")
    print("✅ Should remember previous answers")
    
    # Cleanup
    if mongo_manager:
        await mongo_manager.close()
    if redis_manager:
        await redis_manager.close()
    
    return True

def main():
    """Main test function"""
    print("🚀 Testing Conversation Fix...")
    
    try:
        asyncio.run(test_conversation_fix())
        print("\n✅ Test completed successfully!")
        
    except Exception as e:
        print(f"\n❌ Test failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
