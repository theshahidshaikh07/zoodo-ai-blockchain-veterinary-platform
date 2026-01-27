# 🚀 Deploying Dr. Salus AI to Render

This backend service is ready to be deployed to Render.com (a free cloud hosting provider).

## 1. Push Latest Code
Make sure you have pushed all your latest changes to GitHub:
```bash
git add .
git commit -m "prepare for render deployment"
git push origin main
```

## 2. Setup on Render

1.  **Create Account:** Go to [dashboard.render.com](https://dashboard.render.com/) and log in (use GitHub).
2.  **New Web Service:** Click **"New +"** -> **"Web Service"**.
3.  **Connect GitHub:** Select your `zoodo-ai-blockchain-veterinary-platform` repository.
4.  **Configure:** Render might auto-detect the `render.yaml` file. If it does, great! If not, manually copy these settings:

    *   **Name:** `dr-salus-ai-backend`
    *   **Root Directory:** `ai-service`  <-- IMPORTANT!
    *   **Runtime:** `Python 3`
    *   **Build Command:** `pip install -r requirements.txt`
    *   **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
    *   **Instance Type:** `Free`

## 3. Environment Variables (Critical!)

Scroll down to the **"Environment Variables"** section and add these:

| Key | Value |
| --- | --- |
| `GEMINI_API_KEY` | Paste your actual Google Gemini API Key here |
| `ALLOWED_ORIGINS` | `https://your-vercel-app-name.vercel.app` (Add your actual Vercel URL here!) |
| `PYTHON_VERSION` | `3.11.0` |

> **Note:** For `ALLOWED_ORIGINS`, you can add multiple URLs by separating them with commas:
> `https://zoodo.vercel.app,http://localhost:3000`

## 4. Deploy

Click **"Create Web Service"**. Render will start building your app. It might take 2-3 minutes.

## 5. Connect Frontend

Once deployed, Render will give you a URL (e.g., `https://dr-salus-ai-backend.onrender.com`).

1.  Go to your **Vercel Dashboard**.
2.  Select your frontend project.
3.  Go to **Settings** -> **Environment Variables**.
4.  Update (or Add) `NEXT_PUBLIC_AI_SERVICE_URL`.
5.  Set the value to your new Render URL: `https://dr-salus-ai-backend.onrender.com` (no trailing slash).
6.  **Redeploy** your Vercel project (Deployment -> Redeploy) so it picks up the new variable.

## 🎉 Done!
Your AI assistant is now live on the web!
