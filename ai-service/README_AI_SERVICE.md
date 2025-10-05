# Dr. Salus AI Veterinarian Assistant Service

This is the AI-powered backend service that provides virtual veterinary assistance using OpenAI's GPT models.

## Features

- 🤖 **AI-Powered Veterinary Assistant**: Uses OpenAI GPT-4 to provide professional veterinary advice
- 🚨 **Emergency Detection**: Automatically detects emergency situations and provides immediate guidance
- 🏥 **Vet Recommendations**: Finds and recommends veterinarians based on location and symptoms
- 🍽️ **Care Recommendations**: Provides diet and care routine suggestions
- 📊 **Symptom Analysis**: Analyzes pet symptoms and provides preliminary assessments
- 🔒 **Rate Limiting**: Built-in rate limiting to prevent abuse
- 📈 **Analytics**: Tracks usage and provides insights

## Quick Start

### 1. Set Up Environment Variables

You need to create a `.env` file in the `ai-service` directory with your AI provider API key:

```bash
# Option 1: Use the setup script (recommended)
cd ai-service
python setup_env.py

# Option 2: Manual setup
cp env_template.txt .env
# Then edit .env and add your actual API keys
```

**For Google Gemini:**
```bash
# Get API key from: https://aistudio.google.com/
GOOGLE_API_KEY=your_actual_google_api_key_here
```

### 2. Install Dependencies

```bash
cd ai-service
pip install -r requirements.txt
```

### 3. Start the Service

```bash
# Start the AI service
python start_ai_service.py
```

### 4. Test the Service

```bash
# Run tests
python test_ai_vet_assistant.py
```

## API Endpoints

### Main Chat Endpoint
- **POST** `/chat` - Main AI veterinarian chat interface
- **POST** `/analyze-symptoms` - Analyze pet symptoms
- **POST** `/recommend-providers` - Get veterinarian recommendations
- **POST** `/suggest-care-routine` - Get care routine suggestions
- **POST** `/emergency-assessment` - Emergency symptom assessment

### Utility Endpoints
- **GET** `/health` - Health check
- **GET** `/ai-vet/info` - AI assistant information
- **GET** `/docs` - API documentation

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_API_KEY` | Your Google Gemini API key | Required |
| `AI_MODEL_NAME` | AI model to use | `gemini-pro` |
| `BACKEND_URL` | Spring Boot backend URL | `http://localhost:8080` |
| `API_HOST` | API host | `0.0.0.0` |
| `API_PORT` | API port | `8000` |
| `API_DEBUG` | Debug mode | `true` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `zoodo` |
| `MONGODB_URL` | MongoDB connection URL | `mongodb://localhost:27017` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |

## Getting Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" in the left sidebar
4. Click "Create API Key"
5. Copy the generated API key
6. Add it to your `.env` file as `GOOGLE_API_KEY=your_key_here`

## Usage Examples

### Chat with AI Vet
```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "My dog has been vomiting for 2 days",
    "pet_info": {
      "species": "dog",
      "breed": "Golden Retriever",
      "age": 3
    }
  }'
```

### Analyze Symptoms
```bash
curl -X POST "http://localhost:8000/analyze-symptoms" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "species": "cat",
    "symptoms": ["lethargy", "not eating"],
    "age": 2
  }'
```

## Development

### Running Tests
```bash
python test_ai_vet_assistant.py
```

### Running in Development Mode
```bash
# With auto-reload
API_DEBUG=true python start_ai_service.py
```

### Docker Support
```bash
# Build and run with Docker
docker build -t zoodo-ai-service .
docker run -p 8000:8000 --env-file .env zoodo-ai-service
```

## Troubleshooting

### Common Issues

1. **"Missing OpenAI API Key"**
   - Make sure you have created a `.env` file with your API key
   - Check that the key is valid and has sufficient credits

2. **"AI Assistant not initializing"**
   - Check your internet connection
   - Verify your OpenAI API key is correct
   - Try running in simple mode first: `USE_SIMPLE_AI=true python start_ai_service.py`

3. **"Rate limit exceeded"**
   - The service has built-in rate limiting (30 requests per hour per user)
   - Wait before making more requests or adjust the rate limit settings

### Logs
The service provides detailed logging. Check the console output for error messages and debugging information.

## Security Notes

- Never commit your `.env` file to version control
- Keep your OpenAI API key secure
- The service includes rate limiting and authentication
- For production, configure proper CORS settings

## Support

For issues or questions:
1. Check the logs for error messages
2. Run the test suite to verify functionality
3. Ensure all dependencies are installed correctly
4. Verify your OpenAI API key and account status
