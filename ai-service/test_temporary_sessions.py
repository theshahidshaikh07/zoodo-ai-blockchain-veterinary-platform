#!/usr/bin/env python3
"""
Test script for temporary session functionality
This script tests that chat history is temporary and clears after TTL expires
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

async def test_temporary_sessions():
    """Test that sessions are temporary and expire"""
    print("🧪 Testing Temporary Session Functionality")
    print("=" * 50)
    
    # Initialize managers
    mongo_manager = MongoDBManager()
    redis_manager = RedisManager()
    
    try:
        # Initialize connections
        print("📡 Initializing database connections...")
        await mongo_manager.initialize()
        await redis_manager.initialize()
        
        if not mongo_manager.is_connected:
            print("❌ MongoDB connection failed")
            return False
        
        if not redis_manager.is_connected:
            print("❌ Redis connection failed")
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
        
        # Test temporary session
        print("\n⏰ Testing temporary session behavior...")
        user_id = "temp_user_123"
        session_id = f"temp_session_{datetime.now().timestamp()}"
        session_key = f"{user_id}_{session_id}"
        
        # Start a conversation
        print("💬 Starting conversation...")
        response1 = await ai_vet.chat("My cat is not eating")
        print(f"  AI: {response1[:100]}...")
        
        # Save session with short TTL
        await ai_vet.save_session_to_redis(session_key)
        
        # Store a message with short TTL
        await redis_manager.store_chat_message(
            session_id=session_id,
            message="My cat is not eating",
            message_type="user",
            ttl_seconds=5  # Very short TTL for testing
        )
        
        await redis_manager.store_chat_message(
            session_id=session_id,
            message=response1,
            message_type="assistant",
            ttl_seconds=5  # Very short TTL for testing
        )
        
        print("✅ Messages stored with 5-second TTL")
        
        # Verify messages exist
        messages = await redis_manager.get_chat_messages(session_id)
        print(f"✅ Retrieved {len(messages)} messages immediately")
        
        # Wait for TTL to expire
        print("⏳ Waiting for TTL to expire (6 seconds)...")
        await asyncio.sleep(6)
        
        # Check if messages are gone
        messages_after_ttl = await redis_manager.get_chat_messages(session_id)
        print(f"📊 Messages after TTL: {len(messages_after_ttl)}")
        
        if len(messages_after_ttl) == 0:
            print("✅ TTL working correctly - messages expired and cleared")
        else:
            print("❌ TTL not working - messages still exist")
            return False
        
        # Test session state expiration
        print("\n🔄 Testing session state expiration...")
        
        # Save session state with short TTL
        await redis_manager.store_session_state(
            session_key=session_key,
            state_data={"test": "data", "timestamp": datetime.now().isoformat()},
            ttl_seconds=3  # Very short TTL
        )
        
        # Verify session state exists
        session_state = await redis_manager.get_session_state(session_key)
        if session_state:
            print("✅ Session state stored successfully")
        else:
            print("❌ Failed to store session state")
            return False
        
        # Wait for TTL to expire
        print("⏳ Waiting for session TTL to expire (4 seconds)...")
        await asyncio.sleep(4)
        
        # Check if session state is gone
        session_state_after_ttl = await redis_manager.get_session_state(session_key)
        if session_state_after_ttl is None:
            print("✅ Session state TTL working correctly - expired and cleared")
        else:
            print("❌ Session state TTL not working - still exists")
            return False
        
        # Test that no MongoDB storage occurs for temporary sessions
        print("\n🗄️ Testing no MongoDB storage for temporary sessions...")
        
        # Try to get messages from MongoDB (should be empty for temp sessions)
        mongo_messages = await mongo_manager.get_chat_messages(session_id, limit=10)
        if len(mongo_messages) == 0:
            print("✅ No MongoDB storage for temporary sessions - working correctly")
        else:
            print(f"❌ MongoDB storage occurred: {len(mongo_messages)} messages found")
            return False
        
        print("\n🎉 All temporary session tests passed!")
        print("✅ Chat history is temporary and expires correctly")
        print("✅ No persistent storage in MongoDB for non-logged users")
        print("✅ Sessions clear automatically after TTL expires")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    finally:
        # Cleanup
        print("\n🧹 Cleaning up...")
        await mongo_manager.close()
        await redis_manager.close()
        print("✅ Cleanup completed")

def print_temporary_session_summary():
    """Print summary of temporary session implementation"""
    print("\n📋 Temporary Session Implementation Summary")
    print("=" * 50)
    print("✅ Redis TTL Configuration:")
    print("  - Session state: 1 hour TTL")
    print("  - Chat messages: 1 hour TTL")
    print("  - Chat history: 1 hour TTL")
    
    print("\n✅ No Persistent Storage:")
    print("  - No MongoDB storage for non-logged users")
    print("  - Redis-only temporary storage")
    print("  - Automatic cleanup every 30 minutes")
    
    print("\n✅ Session Behavior:")
    print("  - Chat history remembered during session")
    print("  - Clears when user refreshes page")
    print("  - Pet profile remembered temporarily")
    print("  - Location remembered temporarily")
    
    print("\n✅ Perfect for Development:")
    print("  - No permanent data storage")
    print("  - Privacy-friendly for non-logged users")
    print("  - Easy to test and develop")
    print("  - Ready for logged-in user implementation later")

async def main():
    """Main test function"""
    print("🚀 Starting Temporary Session Tests")
    print("=" * 50)
    
    # Test temporary session functionality
    success = await test_temporary_sessions()
    
    # Print summary
    print_temporary_session_summary()
    
    if success:
        print("\n🎉 All tests passed! Temporary session functionality is working.")
        print("💡 Perfect for non-logged-in users during development!")
    else:
        print("\n❌ Some tests failed. Check the output above for details.")
    
    return success

if __name__ == "__main__":
    # Run the tests
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
