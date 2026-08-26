import sqlite3
import os

def clear_db():
    db_path = "zoodo.db"
    if not os.path.exists(db_path):
        print(f"Database {db_path} not found.")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Disable foreign keys temporarily for clean truncation
    cursor.execute("PRAGMA foreign_keys = OFF;")
    
    tables = [
        "pets",
        "business_documents",
        "business_profiles",
        "otp_verifications",
        "users"
    ]

    for table in tables:
        try:
            cursor.execute(f"DELETE FROM {table};")
            print(f"Cleared table: {table}")
        except Exception as e:
            print(f"Could not clear {table}: {e}")

    cursor.execute("PRAGMA foreign_keys = ON;")
    conn.commit()
    conn.close()
    print("\nDatabase zoodo.db successfully cleared of all users, pets, businesses, and OTP records.")

if __name__ == "__main__":
    clear_db()
