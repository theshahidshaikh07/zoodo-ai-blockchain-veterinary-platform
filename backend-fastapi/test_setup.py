import sys
import smtplib
from config import settings
from database import engine, Base
import models

def test_database():
    print("Testing database table creation...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")

def test_smtp_auth():
    print(f"Testing Gmail SMTP connection for {settings.SMTP_USER}...")
    clean_password = settings.SMTP_PASSWORD.replace(" ", "")
    try:
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(settings.SMTP_USER, clean_password)
        server.quit()
        print("✅ Gmail SMTP Authentication Successful! Your App Password is valid.")
        return True
    except Exception as e:
        print(f"❌ SMTP Authentication failed: {e}")
        return False

if __name__ == "__main__":
    test_database()
    test_smtp_auth()
