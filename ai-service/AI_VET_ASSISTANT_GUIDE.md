# Dr. Zoodo AI - AI Vet Assistant Guide

## 🏥 Overview

**Dr. Zoodo AI** is your virtual veterinary assistant, built into the Zoodo veterinary and pet care platform. This AI assistant provides professional veterinary guidance, symptom analysis, vet recommendations, and emergency handling.

## 🎯 Key Features

### 1. **Symptom Checker + Advice**
- Analyze pet symptoms in natural language
- Provide basic health advice
- Determine if veterinary attention is needed
- Identify potential conditions and causes

### 2. **Find a Vet Nearby / By Breed & Symptoms**
- Recommend vets based on location
- Filter by breed-specific needs
- Consider symptoms and urgency
- Provide contact information and ratings

### 3. **Suggest Diet & Health Care**
- Personalized diet recommendations
- Exercise and grooming advice
- Age and breed-specific care routines
- Health monitoring checklists

### 4. **Emergency Handling**
- Detect emergency keywords (seizure, not breathing, blood, choking, critical)
- Immediate escalation for urgent cases
- Show nearest 24x7 emergency clinics
- Provide immediate action steps

### 5. **Vet-Only Focus**
- Strictly refuse non-vet topics
- Focus on pet health and veterinary care
- Professional, caring responses

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   AI Vet        │    │   Spring Boot   │
│   (Next.js)     │◄──►│   Assistant     │◄──►│   Backend       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
   ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
   │ User        │       │ MongoDB     │       │ PostgreSQL  │
   │ Interface   │       │ (AI Data)   │       │ (Users/     │
   │             │       │             │       │  Appts)     │
   └─────────────┘       └─────────────┘       └─────────────┘
                                │
                                ▼
                        ┌─────────────┐
                        │ Redis       │
                        │ (Cache/     │
                        │  Sessions)  │
                        └─────────────┘
```

## 🚀 API Endpoints

### Main Chat Endpoint
```http
POST /chat
```

**Request:**
```json
{
  "query": "My dog is vomiting and seems lethargic",
  "pet_info": {
    "species": "dog",
    "breed": "Golden Retriever",
    "age": 5,
    "weight": 25.5
  },
  "user_location": {
    "lat": 40.7128,
    "lng": -74.0060
  }
}
```

**Response:**
```json
{
  "response": "Based on your dog's symptoms, I'm concerned about the vomiting and lethargy...",
  "type": "symptom_check",
  "confidence": 0.85,
  "should_see_vet": true,
  "emergency": false,
  "urgency_level": "medium",
  "symptoms_identified": ["vomiting", "lethargy"],
  "vet_recommendations": [...],
  "immediate_actions": [...]
}
```

### Other Endpoints
- `POST /analyze-symptoms` - Legacy symptom analysis
- `POST /recommend-providers` - Vet recommendations
- `POST /suggest-care-routine` - Care suggestions
- `POST /emergency-assessment` - Emergency evaluation
- `GET /ai-vet/info` - AI Vet information

## 🧠 AI Capabilities

### Query Classification
The AI automatically classifies queries into:

1. **Symptom Check** - Health concerns and symptoms
2. **Vet Finder** - Finding veterinarians
3. **Diet Care** - Nutrition and care advice
4. **Emergency** - Urgent health issues
5. **General Advice** - General pet health questions

### Emergency Detection
**Emergency Keywords:**
- seizure, not breathing, blood, choking, critical
- unconscious, collapse, severe bleeding
- difficulty breathing, emergency, urgent
- dying, dead, heart attack, stroke

### Vet-Only Topics
**Accepted Topics:**
- pet health, veterinary, animal care
- pet symptoms, pet diet, pet exercise
- pet grooming, pet behavior
- pet emergency, pet medication, pet vaccination

## 📊 Data Storage

### MongoDB Collections
- `ai_recommendations` - AI-generated advice
- `user_interactions` - User chat history
- `symptom_analyses` - Symptom analysis results
- `provider_recommendations` - Vet recommendations
- `care_routines` - Care suggestions
- `emergency_assessments` - Emergency cases
- `ai_models_cache` - Cached AI results
- `analytics` - Usage analytics

### Redis Storage
- **AI Cache** - Cached AI responses
- **User Sessions** - User session data
- **User Interactions** - Real-time interactions
- **Emergency Queue** - Emergency cases
- **Analytics** - Real-time metrics
- **Rate Limits** - API rate limiting

## 🔗 Backend Integration

### Spring Boot Backend APIs
- `GET /api/vets/search` - Search veterinarians
- `GET /api/vets/recommendations` - Get vet recommendations
- `GET /api/emergency-clinics` - Get emergency clinics
- `POST /api/appointments` - Create appointments
- `GET /api/users/{id}/pets` - Get user pets

### Integration Features
- Real-time vet data from backend
- User authentication and authorization
- Pet information synchronization
- Appointment scheduling integration

## 🎨 Response Types

### 1. Symptom Check Response
```json
{
  "type": "symptom_check",
  "response": "Professional symptom analysis...",
  "urgency_level": "medium",
  "should_see_vet": true,
  "symptoms_identified": ["vomiting", "lethargy"],
  "confidence": 0.85
}
```

### 2. Vet Finder Response
```json
{
  "type": "vet_finder",
  "response": "I found 3 veterinarians near you...",
  "vet_recommendations": [
    {
      "name": "Dr. Sarah Smith",
      "specialization": "General Practice",
      "rating": 4.8,
      "address": "123 Main St",
      "phone": "+1-555-0123"
    }
  ],
  "confidence": 0.9
}
```

### 3. Emergency Response
```json
{
  "type": "emergency",
  "response": "🚨 EMERGENCY ALERT 🚨\n\nImmediate veterinary attention required...",
  "emergency": true,
  "immediate_actions": [
    "Call emergency veterinary clinic immediately",
    "Keep pet calm and comfortable",
    "Do not attempt home treatment"
  ],
  "emergency_clinics": [...]
}
```

### 4. Non-Vet Response
```json
{
  "type": "non_vet_query",
  "response": "I'm Dr. Zoodo AI, your virtual veterinary assistant. I'm here specifically to help with pet health and veterinary-related questions...",
  "confidence": 1.0,
  "should_see_vet": false,
  "emergency": false
}
```

## 🧪 Testing

### Run Tests
```bash
cd ai_service
python test_ai_vet_assistant.py
```

### Test Scenarios
1. **Symptom Analysis** - Test symptom extraction and analysis
2. **Emergency Detection** - Test emergency keyword detection
3. **Vet Finder** - Test vet recommendation system
4. **Diet Care** - Test care and diet suggestions
5. **Non-Vet Queries** - Test vet-only focus
6. **Backend Integration** - Test Spring Boot connectivity
7. **Database Integration** - Test MongoDB/Redis operations

## 📈 Analytics

### Metrics Tracked
- `ai_vet_symptom_check_queries` - Symptom analysis requests
- `ai_vet_vet_finder_queries` - Vet finder requests
- `ai_vet_diet_care_queries` - Diet/care requests
- `ai_vet_emergency_queries` - Emergency cases
- `ai_vet_general_advice_queries` - General advice requests

### Real-time Monitoring
- User interaction patterns
- Emergency case frequency
- Response time metrics
- Cache hit rates
- Error rates

## 🔒 Security & Rate Limiting

### Rate Limits
- **General Chat**: 30 requests per hour
- **Emergency Cases**: Higher limits for urgent situations
- **API Endpoints**: Individual limits per endpoint

### Security Features
- JWT token authentication
- User session management
- Input validation and sanitization
- Emergency case logging
- Audit trail for medical advice

## 🚀 Deployment

### Environment Variables
```bash
OPENAI_API_KEY=your_openai_api_key
AI_MODEL_NAME=gpt-4-turbo-preview
BACKEND_URL=http://localhost:8080
MONGO_URI=mongodb://admin:password@mongodb:27017/zoodo_ai?authSource=admin
REDIS_HOST=redis
REDIS_PORT=6379
```

### Docker Setup
```yaml
ai_service:
  environment:
    OPENAI_API_KEY: ${OPENAI_API_KEY}
    BACKEND_URL: http://backend:8080
    MONGO_URI: mongodb://admin:password@mongodb:27017/zoodo_ai?authSource=admin
    REDIS_HOST: redis
    REDIS_PORT: 6379
```

## 🎯 Use Cases

### 1. **Pet Owner with Sick Pet**
```
User: "My dog is vomiting and not eating"
AI: Analyzes symptoms, provides advice, recommends vet if needed
```

### 2. **Finding a Vet**
```
User: "I need a good vet for my Persian cat"
AI: Finds nearby vets, considers cat-specific needs
```

### 3. **Emergency Situation**
```
User: "My dog is having seizures!"
AI: Detects emergency, provides immediate actions, shows emergency clinics
```

### 4. **Care Advice**
```
User: "What should I feed my 6-month-old puppy?"
AI: Provides age-appropriate diet recommendations
```

### 5. **Non-Vet Query**
```
User: "What's the weather like?"
AI: Politely redirects to vet-related topics
```

## 🔧 Configuration

### AI Model Settings
- **Model**: GPT-4 Turbo (configurable)
- **Temperature**: 0.7 (balanced creativity/accuracy)
- **Max Tokens**: 1000 (reasonable response length)

### Emergency Settings
- **Keywords**: Configurable emergency detection
- **Escalation**: Immediate for critical cases
- **Clinics**: Integration with emergency clinic database

### Cache Settings
- **AI Responses**: 1-2 hours TTL
- **User Sessions**: 24 hours TTL
- **Vet Data**: 30 minutes TTL
- **Emergency Data**: No caching

## 📞 Support

### Health Check
```http
GET /health
```

### AI Vet Info
```http
GET /ai-vet/info
```

### Logs
- Application logs: `docker logs zoodo_ai_service`
- MongoDB logs: `docker logs zoodo_mongodb`
- Redis logs: `docker logs zoodo_redis`

## 🎉 Success Metrics

### Performance
- Response time < 2 seconds
- Cache hit rate > 80%
- Emergency detection accuracy > 95%
- User satisfaction > 90%

### Usage
- Daily active users
- Queries per user
- Emergency case resolution
- Vet appointment bookings

---

**Dr. Zoodo AI** - Your trusted virtual veterinary assistant, always ready to help with your pet's health and care! 🐾 