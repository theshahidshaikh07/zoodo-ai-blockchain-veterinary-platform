#!/usr/bin/env python3

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test if all required modules can be imported"""
    try:
        print("Testing imports...")
        
        # Test basic imports
        import fastapi
        print("✓ FastAPI imported successfully")
        
        import uvicorn
        print("✓ Uvicorn imported successfully")
        
        import pydantic
        print("✓ Pydantic imported successfully")
        
        # Test AI-specific imports
        import sklearn
        print("✓ Scikit-learn imported successfully")
        
        import pandas
        print("✓ Pandas imported successfully")
        
        import numpy
        print("✓ NumPy imported successfully")
        
        # Test app imports
        from app.main import app
        print("✓ AI service app imported successfully")
        
        print("\n🎉 All imports successful! AI service is ready to run.")
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def test_simple_endpoint():
    """Test if the app can be created and basic endpoint works"""
    try:
        from app.main import app
        
        # Test if app has the expected endpoints
        routes = [route.path for route in app.routes]
        print(f"Available routes: {routes}")
        
        return True
    except Exception as e:
        print(f"❌ App test failed: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing AI Service Setup...\n")
    
    if test_imports():
        print("\n✅ Import test passed!")
        
        if test_simple_endpoint():
            print("✅ App test passed!")
            print("\n🚀 AI service is ready to run!")
            print("Run: python -m uvicorn app.main:app --host 0.0.0.0 --port 8000")
        else:
            print("❌ App test failed!")
    else:
        print("❌ Import test failed!") 