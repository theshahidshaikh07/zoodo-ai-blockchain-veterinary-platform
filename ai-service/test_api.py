"""
Quick API Test Script for Dr. Salus AI
Tests if the service is running and responding correctly
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing Health Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/health", timeout=5)
        print(f"✅ Status Code: {response.status_code}")
        print(f"✅ Response: {response.json()}")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Service not running on port 8000")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_chat():
    """Test chat endpoint"""
    print("\n🔍 Testing Chat Endpoint...")
    try:
        payload = {
            "message": "Hello, I have a question about my dog",
            "session_id": "test_session_123"
        }
        response = requests.post(
            f"{BASE_URL}/api/v1/chat",
            json=payload,
            timeout=30
        )
        print(f"✅ Status Code: {response.status_code}")
        data = response.json()
        print(f"✅ Success: {data.get('success')}")
        if data.get('success'):
            print(f"✅ AI Response: {data['data']['response'][:100]}...")
        else:
            print(f"❌ Error: {data.get('error')}")
        return data.get('success', False)
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_emergency_detection():
    """Test emergency detection"""
    print("\n🔍 Testing Emergency Detection...")
    try:
        payload = {
            "message": "My dog can't breathe!",
            "session_id": "test_emergency_456"
        }
        response = requests.post(
            f"{BASE_URL}/api/v1/chat",
            json=payload,
            timeout=30
        )
        data = response.json()
        if data.get('success'):
            is_emergency = data['data'].get('is_emergency', False)
            print(f"✅ Emergency Detected: {is_emergency}")
            if is_emergency:
                print(f"✅ Emergency Response: {data['data']['response'][:150]}...")
            return is_emergency
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("Dr. Salus AI - API Test Suite")
    print("=" * 60)
    
    # Test 1: Health Check
    health_ok = test_health()
    
    if not health_ok:
        print("\n❌ Service is not running. Please start with: python main.py")
        exit(1)
    
    # Test 2: Chat
    chat_ok = test_chat()
    
    # Test 3: Emergency Detection
    emergency_ok = test_emergency_detection()
    
    # Summary
    print("\n" + "=" * 60)
    print("Test Summary:")
    print("=" * 60)
    print(f"Health Check: {'✅ PASS' if health_ok else '❌ FAIL'}")
    print(f"Chat Endpoint: {'✅ PASS' if chat_ok else '❌ FAIL'}")
    print(f"Emergency Detection: {'✅ PASS' if emergency_ok else '❌ FAIL'}")
    print("=" * 60)
    
    if health_ok and chat_ok and emergency_ok:
        print("\n🎉 All tests passed! Dr. Salus AI is ready!")
        print("\n📱 Open frontend: http://localhost:3000/ai-assistant")
    else:
        print("\n⚠️  Some tests failed. Check the errors above.")
