# Dr. Salus AI - Conversational Veterinary Assistant

## 🌍 Overview

**Dr. Salus AI** is a conversational AI veterinary assistant that provides natural, step-by-step veterinary consultations for ALL animal species worldwide. Built following the sample.py pattern, it offers a human-like conversation flow that gradually gathers information and provides personalized veterinary guidance.

## 🎯 Key Features

### 1. **Natural Conversation Flow**
- Step-by-step information gathering
- One or two questions at a time (like a real vet consultation)
- Warm, empathetic responses
- No overwhelming bullet-pointed lists during information gathering

### 2. **Universal Animal Support**
- **Companion Animals**: Dogs, Cats, Rabbits, Guinea Pigs, Hamsters, Gerbils, Ferrets, Hedgehogs
- **Birds**: Parrots, Parakeets, Cockatiels, Budgies, Finches, Canaries, Chickens, Ducks
- **Reptiles**: Turtles, Tortoises, Snakes, Lizards, Geckos, Iguanas, Bearded Dragons
- **Equines**: Horses, Ponies, Donkeys, Mules
- **Livestock**: Cattle, Goats, Sheep, Pigs
- **Exotic**: Chinchillas, Sugar Gliders, Llamas, Alpacas
- **Aquatic**: Fish, Amphibians
- **+ ANY OTHER ANIMAL SPECIES**

### 3. **Emergency Detection & Response**
- Automatic detection of emergency keywords
- Immediate escalation for critical cases
- Species-specific emergency protocols
- Location-based emergency clinic recommendations

### 4. **Global Location Support**
- Worldwide veterinary recommendations
- Location-specific Google search suggestions
- Emergency clinic finder
- Specialist vet recommendations for exotic animals

### 5. **Smart Information Extraction**
- Automatic extraction of pet information from conversation
- Species, age, breed, name, and medical history tracking
- Symptom duration and severity assessment
- Context-aware follow-up questions

### 6. **Follow-up & Reminders**
- Set follow-up reminders for pet care
- Consultation summaries
- Export consultation data
- Session tracking and analytics

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Conversational│    │   Spring Boot   │
│   (Next.js)     │◄──►│   AI Vet        │◄──►│   Backend       │
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

## 🚀 Quick Start

### 1. Set Up Environment

```bash
# Copy environment template
cp env_template.txt .env

# Edit .env and add your Google API key
GOOGLE_API_KEY=your_google_api_key_here
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Start the Service

```bash
# Start conversational AI service
python start_conversational_ai.py

# Or start with custom settings
API_HOST=0.0.0.0 API_PORT=8000 python start_conversational_ai.py
```

### 4. Test the Service

```bash
# Run comprehensive tests
python test_conversational_ai.py
```

## 📡 API Endpoints

### Main Chat Endpoint
```http
POST /chat
```

**Request:**
```json
{
  "message": "Hi, I'm worried about my dog",
  "session_id": "optional_session_id"
}
```

**Response:**
```json
{
  "response": "Hello! I'm Dr. SALUS AI, your global veterinary assistant. What's concerning you about your dog today?",
  "session_id": "session_123_456789",
  "timestamp": "2024-01-15T10:30:00Z",
  "pet_profile": {
    "species": null,
    "breed": null,
    "age": null,
    "name": null
  },
  "location_set": false,
  "emergency_detected": false
}
```

### Other Endpoints

- `POST /location` - Set user location for vet recommendations
- `GET /profile` - Get current pet profile information
- `GET /find-vet` - Find veterinarians near user location
- `GET /find-specialist` - Find specialist vets for exotic animals
- `POST /reminder` - Set follow-up reminder
- `GET /reminders` - Get active reminders
- `GET /summary` - Get consultation summary
- `GET /health` - Health check
- `GET /ai-vet/info` - AI assistant information

## 🧠 Conversation Flow

### Stage 1: Initial Triage
- Acknowledge concern warmly
- Check for emergency keywords
- Ask for species (first question for unknown animals)

### Stage 2: Age & Type
- Ask for age: "How old is your [species]?"
- Ask for breed/type if relevant

### Stage 3: Symptom Details
- Ask about duration: "How long has this been going on?"
- Keep responses short and focused

### Stage 4: Symptom Severity
- Ask about intensity: "How severe would you say it is?"
- Focus on one aspect at a time

### Stage 5: Behavioral Changes
- Ask species-appropriate behavior questions
- Eating/drinking, activity level, bathroom habits

### Stage 6: Context
- Ask about recent changes or medical history
- Environment or dietary changes

### Stage 7: Assessment & Advice
- Provide brief assessment (2-3 sentences max)
- Give immediate action steps (3-4 clear points)
- State urgency level clearly
- Mention species-specific considerations

### Stage 8: Local Resources
- Ask for location if not provided
- Suggest specific Google search queries
- Recommend emergency clinics if urgent

## 🚨 Emergency Detection

### Universal Emergencies (All Animals)
- Difficulty breathing, choking, gasping for air
- Uncontrolled bleeding or deep wounds
- Suspected poisoning
- Seizures, collapse, or loss of consciousness
- Severe trauma from accident or attack
- Unable to move or stand

### Species-Specific Emergencies

**Mammals (Dogs, Cats, Rabbits, etc.):**
- Bloated, hard belly (GDV risk)
- Can't urinate or defecate
- Heatstroke symptoms
- Pale gums, extreme lethargy
- Severe vomiting/diarrhea with blood

**Birds:**
- Difficulty breathing, tail bobbing
- Fluffed up, sitting at bottom of cage
- Blood in droppings
- Stopped eating for 12+ hours

**Reptiles:**
- Not moving, cold body temperature
- Prolapsed organs
- Severe burns from heat lamp
- Not eating for extended period

**Horses/Livestock:**
- Colic symptoms
- Laminitis signs
- Down and can't get up
- Severe lameness

## 💬 Communication Style

### Key Rules
1. **BE CONVERSATIONAL**: Talk like you're in a clinic consultation
2. **ONE STEP AT A TIME**: Ask 1-2 questions maximum per response
3. **SHORT RESPONSES**: Keep responses to 2-4 sentences unless giving final assessment
4. **NO BULLET LISTS** during information gathering
5. **NATURAL FLOW**: Use phrases like "Got it," "I see," "That helps," "Okay," "Thanks"
6. **EMPATHY FIRST**: Always acknowledge feelings before asking next question
7. **EXPLAIN WHY**: Briefly mention why you're asking
8. **SPECIES-AWARE**: Acknowledge the specific animal's needs

### Example Conversation

```
👤 User: My bearded dragon isn't eating

🤖 AI: I understand your concern - appetite changes in bearded dragons definitely need attention. First, how old is your beardie?

👤 User: About 2 years old

🤖 AI: Got it, an adult dragon. How long has this been going on - just today or longer?

👤 User: For about 4 days now

🤖 AI: I see. And what's the temperature in the basking spot? This is really important for bearded dragons' digestion.

👤 User: I think around 85 degrees

🤖 AI: Ah, that might be part of the issue. For a 2-year-old bearded dragon, the basking spot should be 95-105°F. When it's too cool, they can't digest properly and lose appetite.

Here's what to do:
- Increase basking spot temperature to 100-105°F immediately
- Check UVB bulb - replace if older than 6 months
- Offer favorite live insects today
- Monitor for 24-48 hours

If still not eating after fixing temperatures, or if lethargic/losing weight, see a reptile vet. Would you like help finding an exotic vet in your area?
```

## 🌍 Location & Resources

### Setting Location
```http
POST /location
{
  "city": "Paris",
  "country": "France"
}
```

### Finding Vets
```http
GET /find-vet?emergency=false
```

### Finding Specialists
```http
GET /find-specialist
```

## 📊 Data Storage

### MongoDB Collections
- `ai_recommendations` - AI-generated advice
- `user_interactions` - User chat history
- `symptom_analyses` - Symptom analysis results
- `emergency_assessments` - Emergency cases
- `consultation_summaries` - Complete consultation data

### Redis Storage
- **AI Cache** - Cached AI responses
- **User Sessions** - User session data
- **User Interactions** - Real-time interactions
- **Emergency Queue** - Emergency cases
- **Analytics** - Real-time metrics

## 🔧 Configuration

### Environment Variables
```bash
# Required
GOOGLE_API_KEY=your_google_api_key_here

# Optional
AI_MODEL_NAME=gemini-pro
BACKEND_URL=http://localhost:8080
API_HOST=0.0.0.0
API_PORT=8000
API_DEBUG=true
MONGO_URI=mongodb://localhost:27017
REDIS_HOST=localhost
REDIS_PORT=6379
```

### AI Model Settings
- **Model**: Google Gemini Pro
- **Temperature**: 0.7 (balanced creativity/accuracy)
- **Max Tokens**: 1000 (reasonable response length)

## 🧪 Testing

### Run All Tests
```bash
python test_conversational_ai.py
```

### Test Scenarios
1. **Dog Health Concern** - Complete conversation flow
2. **Emergency Case** - Emergency detection and response
3. **Exotic Pet Care** - Species-specific advice
4. **Location and Vet Search** - Location-based recommendations
5. **Emergency Detection** - Keyword detection accuracy
6. **Rule-based Fallback** - Fallback when AI is unavailable

## 📈 Analytics

### Metrics Tracked
- `ai_vet_conversational_queries` - Total chat interactions
- `ai_vet_emergency_detections` - Emergency cases detected
- `ai_vet_location_requests` - Location-based searches
- `ai_vet_specialist_requests` - Specialist vet searches

### Real-time Monitoring
- User interaction patterns
- Emergency case frequency
- Response time metrics
- Cache hit rates
- Error rates

## 🔒 Security & Rate Limiting

### Rate Limits
- **General Chat**: 30 requests per hour per user
- **Emergency Cases**: Higher limits for urgent situations
- **Location Requests**: 10 requests per hour per user

### Security Features
- JWT token authentication
- User session management
- Input validation and sanitization
- Emergency case logging
- Audit trail for medical advice

## 🚀 Deployment

### Docker Support
```yaml
ai_service:
  environment:
    GOOGLE_API_KEY: ${GOOGLE_API_KEY}
    BACKEND_URL: http://backend:8080
    MONGO_URI: mongodb://admin:password@mongodb:27017/zoodo_ai?authSource=admin
    REDIS_HOST: redis
    REDIS_PORT: 6379
```

### Production Considerations
- Configure proper CORS settings
- Set up SSL/TLS certificates
- Configure proper logging
- Set up monitoring and alerting
- Configure backup strategies for databases

## 🎯 Use Cases

### 1. **Pet Owner with Sick Pet**
```
User: "My dog has been vomiting for 2 days"
AI: Natural conversation flow → Symptom analysis → Vet recommendation
```

### 2. **Emergency Situation**
```
User: "My cat is having seizures!"
AI: Emergency detection → Immediate actions → Emergency clinic finder
```

### 3. **Exotic Pet Care**
```
User: "My bearded dragon isn't eating"
AI: Species-specific questions → Temperature advice → Reptile vet finder
```

### 4. **Location-based Vet Search**
```
User: "I need a vet in Tokyo, Japan"
AI: Location set → Google search suggestions → Specialist options
```

### 5. **Follow-up Care**
```
User: "Set a reminder to check on Max in 3 days"
AI: Reminder set → Follow-up tracking → Consultation summary
```

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
- Application logs: Check console output
- MongoDB logs: Check MongoDB container logs
- Redis logs: Check Redis container logs

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
- Consultation completion rate

---

**Dr. Salus AI** - Your trusted conversational veterinary assistant, providing natural, empathetic care for ALL animals, EVERYWHERE in the world! 🐾🌍
