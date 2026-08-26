# 🐾 Zoodo Unified FastAPI Backend

A clean, modern, and lightweight backend for the **Zoodo AI Veterinary Platform**.

This service unites both the **Core Veterinary Platform** (Authentication, User Profiles, Pet Management, Appointments) and the **Salus AI Assistant** into a single, high-performance Python application running on port **8000**.

---

## ⚡ Key Features

1. **Unified Service:** No more managing separate Spring Boot and AI service processes. Everything runs under `http://localhost:8000`.
2. **Zero-Config Database:** Automatically creates and connects to an SQLite database (`zoodo.db`) on initial launch. Can be switched to PostgreSQL with one variable in `.env`.
3. **Interactive Swagger Docs:** Visit `http://localhost:8000/docs` to test every endpoint directly from your browser.
4. **Sub-second Boot Time:** Boots up in under 0.5s with instant auto-reload on code changes.
5. **Exact Frontend Match:** All response payloads conform strictly to the TypeScript interface `ApiResponse<T>` expected by the Next.js frontend.

---

## 🚀 Quickstart

### 1. Create and Activate Virtual Environment
```bash
cd backend-fastapi

# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Server
```bash
python main.py
```
Or with uvicorn directly:
```bash
uvicorn main:app --reload --port 8000
```

The API will be live at:
- **API Root:** `http://localhost:8000`
- **Swagger UI:** `http://localhost:8000/docs`
- **Health Check:** `http://localhost:8000/health`

---

## 🔌 Connecting to Frontend

In `frontend/.env.local`, set:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
NEXT_PUBLIC_AI_SERVICE_URL=http://127.0.0.1:8000
```
That's it! Both the website API and Salus AI will communicate with this single backend seamlessly.
