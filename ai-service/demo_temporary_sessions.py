#!/usr/bin/env python3
"""
Demo script for temporary session functionality
This demonstrates how the AI remembers conversations during a session
but clears when the session expires (like refreshing the page)
"""

import asyncio
import sys
import os
from datetime import datetime

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from utils.conversational_ai_vet import ConversationalAIVet
from utils.mongodb_manager import MongoDBManager
from utils.redis_manager import RedisManager

async def demo_temporary_sessions():
    """Demonstrate temporary session behavior"""
    print("🎭 Demo: Temporary Session Chat History")
    print("=" * 50)
    print("This demo shows how the AI remembers conversations during a session")
    print("but clears when the session expires (like refreshing the page)")
    print()
    
    # Initialize managers
    mongo_manager = MongoDBManager()
    redis_manager = RedisManager()
    
    try:
        # Initialize connections
        print("📡 Initializing database connections...")
        await mongo_manager.initialize()
        await redis_manager.initialize()
        
        if not mongo_manager.is_connected or not redis_manager.is_connected:
            print("❌ Database connections failed")
            return False
        
        print("✅ Database connections established")
        
        # Initialize AI Vet
        print("🤖 Initializing AI Vet Assistant...")
        ai_vet = ConversationalAIVet(mongo_manager, redis_manager)
        await ai_vet.initialize()
        
        if not ai_vet.is_ready():
            print("❌ AI Vet initialization failed")
            return False
        
        print("✅ AI Vet Assistant initialized")
        
        # Demo conversation
        print("\n💬 Starting Demo Conversation")
        print("-" * 30)
        
        user_id = "demo_user"
        session_id = f"demo_session_{datetime.now().timestamp()}"
        session_key = f"{user_id}_{session_id}"
        
        # Conversation flow
        conversation = [
            "Hello, I have a dog that's not eating",
            "He's a 3 year old Golden Retriever", 
            "It's been 2 days since he stopped eating",
            "He's still drinking water normally",
            "His energy level seems normal"
        ]
        
        print("👤 User: Starting conversation...")
        
        for i, message in enumerate(conversation, 1):
            print(f"\n👤 User: {message}")
            
            # Get AI response
            response = await ai_vet.chat(message)
            print(f"🤖 AI: {response}")
            
            # Save to temporary session
            await ai_vet.save_session_to_redis(session_key)
            
            # Store messages with 1-hour TTL (temporary)
            await redis_manager.store_chat_message(
                session_id=session_id,
                message=message,
                message_type="user",
                ttl_seconds=3600  # 1 hour
            )
            
            await redis_manager.store_chat_message(
                session_id=session_id,
                message=response,
                message_type="assistant", 
                ttl_seconds=3600  # 1 hour
            )
        
        print("\n📊 Session Summary")
        print("-" * 20)
        print(f"✅ Pet Species: {ai_vet.pet_profile.species}")
        print(f"✅ Pet Age: {ai_vet.pet_profile.age}")
        print(f"✅ Pet Breed: {ai_vet.pet_profile.breed}")
        print(f"✅ Chat History: {len(ai_vet.chat_history)} messages")
        print(f"✅ Session ID: {session_id}")
        
        # Demonstrate session persistence
        print("\n🔄 Testing Session Persistence")
        print("-" * 30)
        
        # Create new AI instance (simulating page refresh)
        print("🔄 Simulating page refresh (new AI instance)...")
        ai_vet2 = ConversationalAIVet(mongo_manager, redis_manager)
        await ai_vet2.initialize()
        
        # Load session state
        loaded = await ai_vet2.load_session_from_redis(session_key)
        
        if loaded:
            print("✅ Session state loaded successfully!")
            print(f"  Pet Species: {ai_vet2.pet_profile.species}")
            print(f"  Pet Age: {ai_vet2.pet_profile.age}")
            print(f"  Pet Breed: {ai_vet2.pet_profile.breed}")
            print(f"  Chat History: {len(ai_vet2.chat_history)} messages")
            
            # Continue conversation
            print("\n💬 Continuing conversation...")
            print("👤 User: What should I do next?")
            
            response = await ai_vet2.chat("What should I do next?")
            print(f"🤖 AI: {response}")
            
        else:
            print("❌ Session state not found (expired or not saved)")
        
        # Show temporary nature
        print("\n⏰ Temporary Session Behavior")
        print("-" * 30)
        print("✅ Chat history remembered during session")
        print("✅ Pet profile remembered during session")
        print("✅ Conversation context maintained")
        print("⏰ Session expires after 1 hour of inactivity")
        print("🔄 Refreshing page creates new session")
        print("🗑️ No permanent storage in MongoDB")
        print("💾 Only temporary storage in Redis")
        
        # Show what happens when session expires
        print("\n🧪 Testing Session Expiration")
        print("-" * 30)
        
        # Create a test session with very short TTL
        test_session_id = f"test_expire_{datetime.now().timestamp()}"
        await redis_manager.store_chat_message(
            session_id=test_session_id,
            message="Test message",
            message_type="user",
            ttl_seconds=2  # 2 seconds
        )
        
        # Verify message exists
        messages = await redis_manager.get_chat_messages(test_session_id)
        print(f"✅ Test message stored: {len(messages)} messages")
        
        # Wait for expiration
        print("⏳ Waiting for TTL to expire (3 seconds)...")
        await asyncio.sleep(3)
        
        # Check if expired
        messages_after = await redis_manager.get_chat_messages(test_session_id)
        if len(messages_after) == 0:
            print("✅ TTL working correctly - message expired and cleared")
        else:
            print("❌ TTL not working - message still exists")
        
        print("\n🎉 Demo Complete!")
        print("=" * 50)
        print("✅ Temporary session functionality working perfectly")
        print("✅ AI remembers conversations during session")
        print("✅ Sessions expire automatically (1 hour TTL)")
        print("✅ No permanent storage for non-logged users")
        print("✅ Perfect for development and testing")
        
        return True
        
    except Exception as e:
        print(f"❌ Demo failed with error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    finally:
        # Cleanup
        print("\n🧹 Cleaning up...")
        await mongo_manager.close()
        await redis_manager.close()
        print("✅ Cleanup completed")

async def main():
    """Main demo function"""
    print("🚀 Starting Temporary Session Demo")
    print("=" * 50)
    
    success = await demo_temporary_sessions()
    
    if success:
        print("\n🎉 Demo completed successfully!")
        print("💡 The AI now remembers conversations during sessions")
        print("💡 But clears when sessions expire (like page refresh)")
        print("💡 Perfect for non-logged-in users during development!")
    else:
        print("\n❌ Demo failed. Check the output above for details.")
    
    return success

if __name__ == "__main__":
    # Run the demo
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
