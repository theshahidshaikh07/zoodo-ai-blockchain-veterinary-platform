#!/usr/bin/env python3
"""
Zoodo AI Service Environment Setup Script
This script helps you create a .env file with the required configuration
"""

import os
import sys
from pathlib import Path

def create_env_file():
    """Create .env file from template"""
    ai_service_dir = Path(__file__).parent
    env_file = ai_service_dir / ".env"
    template_file = ai_service_dir / "env_template.txt"
    
    if env_file.exists():
        print("⚠️  .env file already exists!")
        response = input("Do you want to overwrite it? (y/N): ").lower()
        if response != 'y':
            print("❌ Setup cancelled")
            return False
    
    try:
        # Read template
        with open(template_file, 'r') as f:
            template_content = f.read()
        
        # Write .env file
        with open(env_file, 'w') as f:
            f.write(template_content)
        
        print("✅ .env file created successfully!")
        print(f"📁 Location: {env_file}")
        print("\n🔧 Next steps:")
        print("1. Edit the .env file and add your actual API keys")
        print("2. For Google Gemini:")
        print("   - Get API key from: https://aistudio.google.com/")
        print("   - Set GOOGLE_API_KEY=your_actual_key")
        print("3. Run: python start_ai_service.py")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating .env file: {e}")
        return False

def main():
    """Main setup function"""
    print("🐾 Zoodo AI Service Environment Setup")
    print("=" * 40)
    
    if create_env_file():
        print("\n🎉 Setup completed successfully!")
    else:
        print("\n💥 Setup failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
