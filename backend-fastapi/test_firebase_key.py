import requests
import json

api_key = "AIzaSyC903KM2wFey1sVNorS6Q9Ldvq0bWV53To"
url = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={api_key}"

payload = {
    "returnSecureToken": True
}

try:
    response = requests.post(url, json=payload)
    print("STATUS CODE:", response.status_code)
    print("RESPONSE JSON:", response.text)
except Exception as e:
    print("ERROR:", e)
