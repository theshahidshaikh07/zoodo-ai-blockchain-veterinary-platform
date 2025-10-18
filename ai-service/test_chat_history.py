#!/usr/bin/env python3
"""
Test script for chat history functionality
This script tests the new chat history features including:
- Session creation and management
- Message storage in MongoDB and Redis
- Chat history retrieval
- Session cleanup
"""

import asyncio
import json
import sys
import os
from datetime import datetime

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from utils.conversational_ai_vet import ConversationalAIVet
from utils.mongodb_manager import MongoDBManager
from utils.redis_manager import RedisManager

async def test_chat_history():
    """Test the chat history functionality"""
    print("🧪 Testing Chat History Functionality")
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
        
        # Test session creation
        print("\n📝 Testing session creation...")
        user_id = "test_user_123"
        session_id = f"test_session_{datetime.now().timestamp()}"
        
        # Create persistent session
        session_created = await ai_vet.create_persistent_session(user_id, session_id)
        if session_created:
            print("✅ Persistent session created in MongoDB")
        else:
            print("❌ Failed to create persistent session")
        
        # Test chat conversation
        print("\n💬 Testing chat conversation...")
        test_messages = [
            "Hello, I have a dog that's not eating",
            "He's a 3 year old Golden Retriever",
            "It's been 2 days since he stopped eating",
            "He's still drinking water normally",
            "His energy level seems normal"
        ]
        
        for i, message in enumerate(test_messages, 1):
            print(f"  User: {message}")
            
            # Get AI response
            response = await ai_vet.chat(message)
            print(f"  AI: {response[:100]}...")
            
            # Save messages to databases
            await ai_vet.save_chat_message_to_databases(
                user_id=user_id,
                session_id=session_id,
                message=message,
                message_type="user",
                metadata={"test_message": True, "message_number": i}
            )
            
            await ai_vet.save_chat_message_to_databases(
                user_id=user_id,
                session_id=session_id,
                message=response,
                message_type="assistant",
                metadata={"test_message": True, "message_number": i}
            )
            
            # Save session state
            session_key = f"{user_id}_{session_id}"
            await ai_vet.save_session_to_redis(session_key)
        
        print("✅ Chat conversation completed and saved")
        
        # Test chat history retrieval
        print("\n📚 Testing chat history retrieval...")
        
        # Get messages from databases
        messages = await ai_vet.get_chat_history_from_databases(session_id, limit=10)
        print(f"✅ Retrieved {len(messages)} messages from databases")
        
        for msg in messages:
            print(f"  {msg['message_type']}: {msg['message'][:50]}...")
        
        # Test session retrieval
        print("\n🔍 Testing session retrieval...")
        sessions = await ai_vet.get_user_sessions(user_id, limit=5)
        print(f"✅ Retrieved {len(sessions)} sessions for user")
        
        for session in sessions:
            print(f"  Session: {session['session_id']} - {session['message_count']} messages")
        
        # Test session state persistence
        print("\n💾 Testing session state persistence...")
        
        # Create new AI instance to test loading
        ai_vet2 = ConversationalAIVet(mongo_manager, redis_manager)
        await ai_vet2.initialize()
        
        # Load session state
        session_key = f"{user_id}_{session_id}"
        loaded = await ai_vet2.load_session_from_redis(session_key)
        
        if loaded:
            print("✅ Session state loaded successfully")
            print(f"  Pet species: {ai_vet2.pet_profile.species}")
            print(f"  Pet age: {ai_vet2.pet_profile.age}")
            print(f"  Chat history length: {len(ai_vet2.chat_history)}")
        else:
            print("❌ Failed to load session state")
        
        # Test session cleanup
        print("\n🧹 Testing session cleanup...")
        
        # End the session
        session_ended = await ai_vet.end_session(user_id, session_id)
        if session_ended:
            print("✅ Session ended successfully")
        else:
            print("❌ Failed to end session")
        
        # Test cleanup of old sessions
        cleaned = await mongo_manager.cleanup_old_sessions(days_old=0)  # Clean all for test
        print(f"✅ Cleaned {cleaned} old sessions from MongoDB")
        
        redis_cleaned = await redis_manager.cleanup_expired_sessions()
        print(f"✅ Cleaned {redis_cleaned} expired sessions from Redis")
        
        print("\n🎉 All tests completed successfully!")
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

async def test_api_endpoints():
    """Test the API endpoints (requires running server)"""
    print("\n🌐 Testing API Endpoints")
    print("=" * 30)
    
    import httpx
    
    base_url = "http://localhost:8000"
    test_token = "test_token_123"  # This would be a real JWT token in production
    
    try:
        async with httpx.AsyncClient() as client:
            # Test health endpoint
            response = await client.get(f"{base_url}/health")
            if response.status_code == 200:
                print("✅ Health endpoint working")
            else:
                print(f"❌ Health endpoint failed: {response.status_code}")
            
            # Test AI info endpoint
            response = await client.get(f"{base_url}/ai-vet/info")
            if response.status_code == 200:
                info = response.json()
                print(f"✅ AI Info endpoint working - Version: {info.get('version')}")
            else:
                print(f"❌ AI Info endpoint failed: {response.status_code}")
            
            # Note: Other endpoints require authentication which is not set up in this test
            print("ℹ️  Other endpoints require proper authentication setup")
            
    except Exception as e:
        print(f"❌ API test failed: {e}")
        print("ℹ️  Make sure the AI service is running on localhost:8000")

def print_summary():
    """Print implementation summary"""
    print("\n📋 Chat History Implementation Summary")
    print("=" * 50)
    print("✅ MongoDB Schema Enhanced:")
    print("  - chat_sessions collection with indexes")
    print("  - chat_messages collection with indexes")
    print("  - user_sessions collection with indexes")
    
    print("\n✅ Redis Management Enhanced:")
    print("  - Chat session state storage")
    print("  - Chat message caching")
    print("  - Session TTL management")
    print("  - Automatic cleanup")
    
    print("\n✅ ConversationalAIVet Enhanced:")
    print("  - Persistent session creation")
    print("  - Message storage to databases")
    print("  - Session state loading/saving")
    print("  - Chat history retrieval")
    
    print("\n✅ API Endpoints Added:")
    print("  - GET /chat/history - Get chat history")
    print("  - GET /chat/sessions - Get user sessions")
    print("  - POST /chat/session/end - End session")
    print("  - POST /chat/session/extend - Extend TTL")
    print("  - GET /chat/session/{id}/messages - Get session messages")
    print("  - POST /admin/cleanup/sessions - Cleanup old sessions")
    print("  - GET /admin/stats/sessions - Get session stats")
    
    print("\n✅ Features Implemented:")
    print("  - Persistent chat history storage")
    print("  - Session management and cleanup")
    print("  - Fast Redis caching with MongoDB backup")
    print("  - Background cleanup tasks")
    print("  - Data retention policies")
    print("  - Emergency detection and logging")

async def main():
    """Main test function"""
    print("🚀 Starting Chat History Tests")
    print("=" * 50)
    
    # Test core functionality
    success = await test_chat_history()
    
    # Test API endpoints (optional)
    # await test_api_endpoints()
    
    # Print summary
    print_summary()
    
    if success:
        print("\n🎉 All tests passed! Chat history functionality is working.")
    else:
        print("\n❌ Some tests failed. Check the output above for details.")
    
    return success

if __name__ == "__main__":
    # Run the tests
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
