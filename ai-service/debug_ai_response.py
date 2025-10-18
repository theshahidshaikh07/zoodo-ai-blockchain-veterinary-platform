#!/usr/bin/env python3
"""
Debug script to test AI response generation
"""

import asyncio
import sys
import os
from pathlib import Path

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from utils.conversational_ai_vet import ConversationalAIVet
from utils.mongodb_manager import MongoDBManager
from utils.redis_manager import RedisManager

async def debug_ai_response():
    """Debug AI response generation"""
    print("🔍 Debugging AI Response Generation")
    print("=" * 50)
    
    # Initialize managers
    mongo_manager = MongoDBManager()
    redis_manager = RedisManager()
    
    try:
        # Initialize connections
        print("📡 Initializing database connections...")
        await mongo_manager.initialize()
        await redis_manager.initialize()
        
        # Initialize AI Vet
        print("🤖 Initializing AI Vet Assistant...")
        ai_vet = ConversationalAIVet(mongo_manager, redis_manager)
        await ai_vet.initialize()
        
        if not ai_vet.is_ready():
            print("❌ AI Vet initialization failed")
            return False
        
        print("✅ AI Vet Assistant initialized")
        
        # Test messages
        test_messages = [
            "hey",
            "whats up",
            "my dog is not eating"
        ]
        
        for i, message in enumerate(test_messages, 1):
            print(f"\n💬 Test {i}: '{message}'")
            print("-" * 30)
            
            try:
                # Get AI response
                response = await ai_vet.chat(message)
                
                print(f"Raw response type: {type(response)}")
                print(f"Raw response: {repr(response)}")
                print(f"Response length: {len(response) if response else 0}")
                print(f"Response after strip: {repr(response.strip() if response else '')}")
                
                if not response or not response.strip():
                    print("❌ Empty response detected!")
                    
                    # Check if LLM is available
                    print(f"LLM available: {ai_vet.llm is not None}")
                    
                    # Check chat history
                    print(f"Chat history length: {len(ai_vet.chat_history)}")
                    
                    # Try to get context
                    try:
                        context = ai_vet._build_context(message)
                        print(f"Context length: {len(context)}")
                        print(f"Context preview: {context[:200]}...")
                    except Exception as e:
                        print(f"Context error: {e}")
                        
                else:
                    print(f"✅ Response: {response}")
                    
            except Exception as e:
                print(f"❌ Error: {e}")
                import traceback
                traceback.print_exc()
        
        return True
        
    except Exception as e:
        print(f"❌ Debug failed: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    finally:
        # Cleanup
        await mongo_manager.close()
        await redis_manager.close()

async def main():
    """Main debug function"""
    success = await debug_ai_response()
    return success

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
