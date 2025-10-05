# Google Gemini API Setup Guide

## Why Google Gemini?
- **Generous Free Tier**: 15 requests per minute, 1 million tokens per day
- **No Credit Card Required**: For free tier usage
- **High Quality**: Excellent for veterinary advice and analysis
- **Easy Integration**: Simple API setup

## Step 1: Get Google API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" in the left sidebar
4. Click "Create API Key" 
5. Copy the generated API key

## Step 2: Configure Your Environment

1. Create a `.env` file in the `ai-service` directory
2. Add your Google API key:

```env
AI_PROVIDER=google
GOOGLE_API_KEY=your_actual_api_key_here
AI_MODEL_NAME=gemini-pro
```

## Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

## Step 4: Test the Setup

```bash
python test_ai_vet_assistant.py
```

## Why Google Gemini?

- **Generous Free Tier**: 15 requests per minute, 1 million tokens per day
- **No Credit Card Required**: For free tier usage
- **High Quality**: Excellent for veterinary advice and analysis
- **Easy Integration**: Simple API setup
- **Reliable**: Google's infrastructure and support

## Troubleshooting

- **"API key not found"**: Make sure your `.env` file is in the `ai-service` directory
- **"Quota exceeded"**: You've hit the free tier limit, consider upgrading your Google AI Studio plan
- **"Model not found"**: Check that your model name is correct (gemini-pro)
