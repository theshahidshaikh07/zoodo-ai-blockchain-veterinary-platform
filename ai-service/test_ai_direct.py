#!/usr/bin/env python3
"""
Direct test of the AI service to debug the blank response issue
"""

import asyncio
import httpx
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

async def test_ai_direct():
    """Test the AI service directly"""
    print("🧪 Testing AI Service Directly")
    print("=" * 50)
    
    async with httpx.AsyncClient() as client:
        # Test 1: Health Check
        print("🏥 Testing Health Check...")
        try:
            response = await client.get(f"{BASE_URL}/health")
            print(f"Status: {response.status_code}")
            print(f"Response: {response.json()}")
        except Exception as e:
            print(f"Error: {e}")
            return
        
        # Test 2: AI Info
        print("\n🤖 Testing AI Info...")
        try:
            response = await client.get(f"{BASE_URL}/ai-vet/info")
            print(f"Status: {response.status_code}")
            print(f"Response: {response.json()}")
        except Exception as e:
            print(f"Error: {e}")
        
        # Test 3: Direct Chat Test
        print("\n💬 Testing Direct Chat...")
        try:
            chat_data = {
                "message": "Hello, my dog is not eating for 2 days",
                "session_id": f"test_session_{datetime.now().timestamp()}"
            }
            
            response = await client.post(
                f"{BASE_URL}/chat",
                headers={"Content-Type": "application/json"},
                json=chat_data
            )
            
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"AI Response: {data.get('response', 'NO RESPONSE')}")
                print(f"Session ID: {data.get('session_id', 'NO SESSION')}")
                print(f"Pet Profile: {data.get('pet_profile', {})}")
            else:
                print(f"Error Response: {response.text}")
                
        except Exception as e:
            print(f"Error: {e}")
        
        # Test 4: Follow-up Chat
        print("\n💬 Testing Follow-up Chat...")
        try:
            chat_data2 = {
                "message": "He's a 3 year old German Shepherd",
                "session_id": f"test_session_{datetime.now().timestamp()}"
            }
            
            response2 = await client.post(
                f"{BASE_URL}/chat",
                headers={"Content-Type": "application/json"},
                json=chat_data2
            )
            
            print(f"Status: {response2.status_code}")
            if response2.status_code == 200:
                data2 = response2.json()
                print(f"AI Response: {data2.get('response', 'NO RESPONSE')}")
                print(f"Session ID: {data2.get('session_id', 'NO SESSION')}")
                print(f"Pet Profile: {data2.get('pet_profile', {})}")
            else:
                print(f"Error Response: {response2.text}")
                
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_ai_direct())
