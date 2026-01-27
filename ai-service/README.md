# Dr. Salus AI - AI-Powered Veterinary Assistant

## Overview

Dr. Salus AI is an intelligent veterinary assistant designed to help pet parents with:
- **Emergency Detection**: Identifies urgent health situations and provides immediate guidance
- **Symptom Analysis**: Analyzes pet symptoms using veterinary datasets
- **Nutrition Advice**: Provides personalized diet recommendations
- **Conversational Support**: Natural, empathetic conversations like talking to a real vet
- **Location Services**: Suggests nearby vets, hospitals, and pet care facilities

## Architecture

### Core Components

1. **LLM Service** (`app/core/llm.py`)
   - Google Gemini AI integration
   - Emergency detection
   - Conversational AI with veterinary expertise

2. **Dataset Service** (`app/services/dataset_service.py`)
   - RAG (Retrieval-Augmented Generation) implementation
   - Loads and searches veterinary datasets
   - Provides context-aware responses

3. **Session Service** (`app/services/session_service.py`)
   - Manages conversation history
   - Tracks pet context (name, breed, age, etc.)
   - Session persistence

4. **AI Assistant Service** (`app/services/ai_assistant.py`)
   - Orchestrates all services
   - Main business logic
   - Response generation

5. **API Routes** (`app/api/routes.py`)
   - RESTful API endpoints
   - Request/response handling

## Features

### 1. Emergency Detection
- Automatically detects emergency keywords in user messages
- Provides immediate first-aid guidance
- Suggests urgent vet connection options

### 2. RAG-Enhanced Responses
- Searches 5 veterinary datasets:
  - Pet health symptoms (2000+ records)
  - Animal disease prediction
  - General animal data
  - Dog breed health information
  - Veterinary clinical notes
- Augments AI responses with real veterinary knowledge

### 3. Progressive Information Collection
- Asks for pet details only when needed
- Remembers context across conversation
- Natural conversation flow

### 4. Nutrition Recommendations
- Pet type-specific advice
- Breed-specific recommendations
- Age-appropriate nutrition plans
- Portion and feeding schedule guidance

### 5. Scope Limitation
- Only answers pet/vet-related questions
- Politely declines off-topic queries

## API Endpoints

### POST `/api/v1/chat`
Main chat endpoint for conversing with Dr. Salus AI.

**Request:**
```json
{
  "message": "My dog is vomiting and won't eat",
  "session_id": "frontend_session_123456",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "I'm sorry to hear your dog isn't feeling well...",
    "is_emergency": false,
    "emergency_severity": "normal",
    "session_id": "frontend_session_123456",
    "message_count": 2,
    "pet_context": {}
  }
}
```

### POST `/api/v1/nutrition`
Get nutrition and diet recommendations.

**Request:**
```json
{
  "session_id": "frontend_session_123456",
  "pet_type": "dog",
  "breed": "Golden Retriever",
  "age": "adult",
  "weight": 30
}
```

### POST `/api/v1/session/info`
Get session information and conversation history.

### POST `/api/v1/session/clear`
Clear a conversation session.

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the `ai-service` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Install Dependencies

```bash
cd ai-service
pip install -r requirements.txt
```

### 3. Run the Service

```bash
python main.py
```

The service will start on `http://localhost:8000`

### 4. Test the API

Visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI).

## Datasets

The service uses 5 CSV datasets located in `datasets/01_raw_data/`:

1. `01_pet_health_symptoms.csv` - 2000+ symptom records
2. `02_animal_disease_prediction.csv` - Disease information
3. `03_general_animal_data.csv` - General animal health data
4. `04_dog_breed_health.csv` - Breed-specific health info
5. `05_veterinary_clinical.csv` - Clinical case notes

## How It Works

### Conversation Flow

1. **User sends message** → Frontend calls `/api/v1/chat`
2. **Session management** → Creates/retrieves session
3. **Emergency detection** → Checks for urgent keywords
4. **RAG search** → Searches datasets for relevant context
5. **AI generation** → Gemini generates response with context
6. **Response** → Returns AI response with metadata

### Emergency Handling

When an emergency is detected:
- Response includes `"is_emergency": true`
- Provides immediate first-aid steps
- Suggests action buttons:
  - "Connect with Vet Online"
  - "Find Vet Clinic Nearby"

### Context Management

- **Pet Context**: Stores pet name, breed, age, weight, gender
- **Conversation History**: Maintains last 10 messages
- **Progressive Collection**: Asks for details only when needed

## Integration with Frontend

The frontend (`frontend/src/app/ai-assistant/page.tsx`) already integrates with this service:

```typescript
const response = await apiService.chatWithAI({
  message: currentMessage,
  session_id: sessionId
});
```

## Future Enhancements

1. **Redis Integration**: Persistent session storage
2. **MongoDB**: Long-term conversation and pet profile storage
3. **Advanced NLP**: Better entity extraction (pet names, breeds, etc.)
4. **Image Analysis**: Gemini Vision for analyzing pet photos
5. **Voice Support**: Speech-to-text integration
6. **Multi-language**: Support for multiple languages
7. **Appointment Booking**: Integration with vet booking systems
8. **Telemedicine**: Video consultation features

## Development Notes

### Adding New Features

1. **New Dataset**: Add CSV to `datasets/01_raw_data/` and update `dataset_service.py`
2. **New Endpoint**: Add route in `app/api/routes.py`
3. **New Service**: Create in `app/services/` and integrate in `ai_assistant.py`

### Testing

```bash
# Test emergency detection
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "My dog can'\''t breathe!", "session_id": "test_123"}'

# Test normal conversation
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What should I feed my puppy?", "session_id": "test_123"}'
```

## Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY not found"**
   - Ensure `.env` file exists with valid API key
   - Check environment variable is loaded

2. **Dataset loading errors**
   - Verify CSV files exist in `datasets/01_raw_data/`
   - Check file permissions

3. **CORS errors**
   - Frontend URL is in allowed origins (main.py)
   - Check frontend is running on correct port

## License

Part of the Zoodo AI Blockchain Veterinary Platform

## Contact

For support or questions about Dr. Salus AI, please contact the development team.
