import sqlite3
import json

def view_database():
    conn = sqlite3.connect("zoodo.db")
    cursor = conn.cursor()

    print("\n" + "="*60)
    print("🐾 ZOODO DATABASE OVERVIEW (zoodo.db)")
    print("="*60)

    # 1. Users
    print("\n--- 👤 USERS TABLE ---")
    cursor.execute("SELECT id, first_name, last_name, username, email, user_type, is_verified, created_at FROM users")
    users = cursor.fetchall()
    if not users:
        print("No users found.")
    else:
        for u in users:
            print(f"ID: {u[0][:8]}... | Name: {u[1]} {u[2]} | @{u[3]} | Email: {u[4]} | Role: {u[5]} | Verified: {'✅' if u[6] else '❌'} | Registered: {u[7]}")

    # 2. Business Profiles
    print("\n--- 🏢 BUSINESS PROFILES TABLE ---")
    cursor.execute("SELECT id, user_id, business_name, categories_json, city, verification_status FROM business_profiles")
    businesses = cursor.fetchall()
    if not businesses:
        print("No business profiles found.")
    else:
        for b in businesses:
            print(f"ID: {b[0][:8]}... | Business: {b[2]} | Categories: {b[3]} | City: {b[4]} | Status: {b[5]}")

    # 3. Pets
    print("\n--- 🐶 PETS TABLE ---")
    cursor.execute("SELECT id, owner_id, name, species, breed, age, age_unit FROM pets")
    pets = cursor.fetchall()
    if not pets:
        print("No pets found.")
    else:
        for p in pets:
            print(f"ID: {p[0][:8]}... | Name: {p[2]} ({p[3]} - {p[4]}) | Age: {p[5]} {p[6]}")

    # 4. OTP Verifications
    print("\n--- 🔑 OTP VERIFICATIONS LOG ---")
    cursor.execute("SELECT id, email, otp_code, purpose, is_used, created_at, expires_at FROM otp_verifications ORDER BY created_at DESC LIMIT 5")
    otps = cursor.fetchall()
    if not otps:
        print("No OTP records found.")
    else:
        for o in otps:
            print(f"Email: {o[1]} | Code: {o[2]} | Purpose: {o[3]} | Used: {'✅' if o[4] else '❌'} | Sent: {o[5]}")

    print("\n" + "="*60 + "\n")
    conn.close()

if __name__ == "__main__":
    view_database()
