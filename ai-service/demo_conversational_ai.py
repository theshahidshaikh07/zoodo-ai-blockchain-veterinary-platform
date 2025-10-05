#!/usr/bin/env python3
"""
Demo script for Conversational AI Veterinarian Assistant
This script demonstrates the natural conversation flow with session persistence
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

async def demo_conversation():
    """Demonstrate a natural conversation with the AI vet"""
    print("🐾 Dr. Salus AI - Conversational Veterinary Assistant Demo")
    print("=" * 60)
    print("This demo shows how the AI maintains conversation context")
    print("and remembers information throughout the consultation.")
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
    
    # Start conversation
    greeting = ai_vet.start_conversation()
    print(f"\n🤖 {greeting}")
    
    # Demo conversation scenarios
    demo_scenarios = [
        {
            "name": "Dog Health Concern",
            "messages": [
                "Hi, I'm worried about my dog",
                "He's a 3 year old Golden Retriever named Max",
                "He's been vomiting for 2 days and seems lethargic",
                "He's not eating much and just wants to sleep",
                "No, no blood in the vomit",
                "He's drinking water normally",
                "What should I do about Max?"
            ]
        },
        {
            "name": "Emergency Case",
            "messages": [
                "My cat is having trouble breathing!",
                "She's a 5 year old Persian named Luna",
                "It started about an hour ago",
                "She's gasping and her tongue looks blue"
            ]
        },
        {
            "name": "Exotic Pet Care",
            "messages": [
                "I have a bearded dragon that's not eating",
                "He's about 2 years old, his name is Spike",
                "It's been 4 days now",
                "The temperature is around 85 degrees in his tank"
            ]
        }
    ]
    
    for i, scenario in enumerate(demo_scenarios, 1):
        print(f"\n📋 Demo Scenario {i}: {scenario['name']}")
        print("=" * 50)
        
        # Reset for each scenario
        ai_vet.pet_profile = ai_vet.pet_profile.__class__()
        ai_vet.consultation = ai_vet.consultation.__class__()
        ai_vet.chat_history = []
        ai_vet.location = ai_vet.location.__class__()
        
        for j, message in enumerate(scenario['messages'], 1):
            print(f"\n👤 User: {message}")
            
            try:
                response = await ai_vet.chat(message)
                print(f"🤖 AI: {response}")
                
                # Show profile updates
                if j == len(scenario['messages']):  # Last message
                    profile = ai_vet.get_profile()
                    if "No animal information" not in profile:
                        print(f"\n📋 Final Profile: {profile}")
                
            except Exception as e:
                print(f"❌ Error: {str(e)}")
        
        print("-" * 50)
    
    # Demo session persistence
    print(f"\n🔄 Demo: Session Persistence")
    print("=" * 50)
    
    # Save current session
    session_key = "demo_user_session"
    if redis_manager:
        await ai_vet.save_session_to_redis(session_key)
        print("✅ Session saved to Redis")
        
        # Create new AI instance and load session
        ai_vet2 = ConversationalAIVet(mongo_manager=mongo_manager, redis_manager=redis_manager)
        await ai_vet2.initialize()
        
        loaded = await ai_vet2.load_session_from_redis(session_key)
        if loaded:
            print("✅ Session loaded from Redis")
            print(f"📋 Restored Profile: {ai_vet2.get_profile()}")
            
            # Test memory
            response = await ai_vet2.chat("Can you remind me what we discussed?")
            print(f"\n👤 User: Can you remind me what we discussed?")
            print(f"🤖 AI: {response}")
        else:
            print("❌ Failed to load session from Redis")
    
    # Demo special commands
    print(f"\n🔧 Demo: Special Commands")
    print("=" * 50)
    
    # Set location
    location_result = ai_vet.location.set_location("New York", "USA")
    print(f"📍 {location_result}")
    
    # Find vets
    vet_search = ai_vet.find_vet(emergency=False)
    print(f"🔍 Vet Search: {vet_search[:100]}...")
    
    # Set reminder
    reminder_result = ai_vet.set_reminder("Check up on pet's condition", 3)
    print(f"📅 {reminder_result}")
    
    # Get reminders
    reminders = ai_vet.get_reminders()
    print(f"📋 {reminders}")
    
    # Get summary
    summary = ai_vet.export_summary()
    print(f"📄 Summary: {summary[:200]}...")
    
    print(f"\n🎉 Demo completed successfully!")
    print(f"\n💡 Key Features Demonstrated:")
    print(f"  ✅ Natural conversation flow")
    print(f"  ✅ Information extraction and memory")
    print(f"  ✅ Emergency detection")
    print(f"  ✅ Species-specific advice")
    print(f"  ✅ Session persistence")
    print(f"  ✅ Location-based recommendations")
    print(f"  ✅ Follow-up reminders")
    print(f"  ✅ Consultation summaries")
    
    # Cleanup
    if mongo_manager:
        await mongo_manager.close()
    if redis_manager:
        await redis_manager.close()
    
    return True

def main():
    """Main demo function"""
    print("🚀 Starting Conversational AI Demo...")
    
    # Check environment
    if not os.getenv("GOOGLE_API_KEY"):
        print("⚠️  No Google API key found. Will run in rule-based mode.")
        print("💡 Set GOOGLE_API_KEY environment variable for full AI functionality.")
    
    try:
        asyncio.run(demo_conversation())
    except KeyboardInterrupt:
        print("\n\n🛑 Demo stopped by user")
    except Exception as e:
        print(f"\n❌ Demo failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
