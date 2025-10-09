# 🤖 AI Service Enhancement Plan

## 📊 Database Architecture

### Multi-Database Strategy
- **PostgreSQL**: Backend database (users, pets, appointments, medical records)
- **MongoDB**: AI service database (conversations, AI recommendations, datasets)
- **Redis**: AI service caching and session management

### Data Flow
```
User Request → Frontend → Backend (PostgreSQL) → AI Service (MongoDB + Redis) → Response
```

### AI Service Data Storage
- **CSV Datasets**: Stored in MongoDB for fast symptom matching
- **Image Datasets**: File system storage with MongoDB metadata
- **User Data**: Replicated from PostgreSQL to MongoDB for AI context
- **Conversations**: Persistent storage in MongoDB with Redis caching

---

## 🎯 Current AI Capabilities

### Dr. Salus AI Features
- **Conversational AI**: Advanced chatbot trained on veterinary knowledge
- **Multi-modal Support**: Text, images, and speech-to-text processing
- **Dataset Integration**: Veterinary datasets for symptom analysis
- **Persistent Memory**: Conversation history and user context

### Current Database Setup
- **MongoDB**: Version 8.0.12 ✅ (Production Ready)
- **Redis**: Version 3.0.504 ⚠️ (Development - Will upgrade to 7.x for production)
- **PostgreSQL**: Backend database (separate from AI service)

---

## 🚀 Enhanced AI Features (In Development)

### 1. User Context Integration
```
User Login → Check Authentication → Retrieve Pet Data → AI Context
```

**Features:**
- **Authenticated Users**: Direct access to pet profiles and medical history
- **Guest Users**: Collect pet information through conversation
- **Pet Data Integration**: Breed, age, medical history, previous consultations

**Implementation:**
- Check if user is logged in via JWT token
- If logged in: Retrieve pet data from PostgreSQL via Backend API
- If not logged in: Ask for pet name, breed, age through conversation
- Store pet context in MongoDB for AI processing

### 2. Multi-Modal Processing Pipeline
```
User Input → Dr. Salus AI → Gemini AI → Dataset Analysis → Response
```

**Features:**
- **Text Analysis**: Symptom description and health concerns
- **Image Processing**: Pet photos, medical images, symptom visualization
- **Speech-to-Text**: Voice input for hands-free consultation
- **Dataset Matching**: Compare symptoms with veterinary datasets

**Implementation:**
- Process text, images, and speech input
- Use Google Gemini for multi-modal analysis
- Match symptoms with veterinary datasets
- Generate evidence-based recommendations

### 3. Persistent Conversation Memory
**Features:**
- **Session Management**: Redis caching for fast access
- **Long-term Storage**: MongoDB persistence across sessions
- **Context Awareness**: Remember previous conversations and recommendations
- **Follow-up Tracking**: Monitor treatment progress and outcomes

**Implementation:**
- Store full conversation history in MongoDB
- Cache recent conversations in Redis
- Maintain pet profile and medical context
- Track treatment progress and outcomes

### 4. Dataset Integration
**Features:**
- **Symptom Matching**: Compare user descriptions with veterinary datasets
- **Disease Prediction**: AI-powered diagnosis suggestions
- **Treatment Recommendations**: Evidence-based care suggestions
- **Emergency Detection**: Automatic emergency assessment and alerts

**Implementation:**
- Load CSV datasets into MongoDB
- Store image datasets with metadata
- Implement symptom matching algorithms
- Generate treatment recommendations

### 5. AI-Powered Provider Recommendation System
**Features:**
- **Intelligent Provider Detection**: AI understands whether user needs vet, hospital, clinic, or trainer
- **Service Type Recognition**: Distinguishes between online consultation, in-person visits, and home visits
- **Home Visit Intelligence**: Understands when home visits are preferred or necessary
- **Geolocation-Based Recommendations**: Find providers by location with distance calculation
- **Radius-Based Home Visits**: Match home visit providers within service radius
- **Platform Priority**: Prioritize platform providers over external suggestions
- **Specialization Matching**: Match pet needs with provider specializations (vets, trainers, facilities)
- **Google Places Integration**: Suggest external providers when platform providers unavailable
- **Smart Booking**: Differentiate between bookable (platform) and non-bookable (external) providers

**AI Understanding Examples:**
```
User: "My dog has a fever and is lethargic"
AI: Understands → Needs immediate vet consultation (in-person, online, or home visit)

User: "I need a routine checkup for my cat"
AI: Understands → Can suggest clinic/hospital for in-person visit or home visit

User: "My pet has skin issues, can I get online consultation?"
AI: Understands → Needs dermatology specialist with online availability

User: "My elderly dog can't travel, need vet at home"
AI: Understands → Needs vet with home visit service within radius

User: "Emergency! My dog is bleeding"
AI: Understands → Needs emergency hospital/clinic (in-person only) or emergency home visit

User: "My pet is anxious about clinic visits"
AI: Understands → Prioritize home visit options or online consultation

User: "My dog needs obedience training"
AI: Understands → Needs trainer with behavioral modification specialization

User: "My puppy is aggressive, need training at home"
AI: Understands → Needs trainer with home training service within radius

User: "I want to train my dog for competitions"
AI: Understands → Needs specialized trainer with competition training experience

User: "My cat has behavioral issues, can I get online training?"
AI: Understands → Needs trainer with online consultation and behavioral specialization
```

**Workflow:**
```
User Input (Pet Needs + Location + Service Preference) 
    ↓
AI Analysis (Gemini + Datasets + Context Understanding)
    ↓
Provider Type Detection (Vet/Hospital/Clinic/Trainer)
    ↓
Service Type Detection (Online/In-person/Home Visit/Emergency)
    ↓
Home Visit Radius Check (if home visit requested)
    ↓
Priority 1: Platform Providers (Location + Specialization + Service Match + Radius)
    ↓
Priority 2: Google Places API (External Providers)
    ↓
Smart Recommendations with Booking Status
```

**Implementation:**
- Add geolocation fields to users table (latitude, longitude)
- Implement Haversine formula for distance calculation
- Integrate Google Places API for external provider suggestions
- Cache recommendations in Redis for performance
- Create provider recommendation endpoints in AI service
- Add service type detection algorithms
- Implement home visit radius matching
- Add home visit availability checking

---

## 🔧 Technical Specifications

### Provider Recommendation API Endpoints

**Main Recommendation Endpoint:**
```python
POST /ai/recommend-providers
{
    "pet_needs": ["fever", "lethargy"],  # or ["aggressive", "obedience"] for training
    "pet_species": "dog",
    "pet_breed": "golden_retriever",
    "user_location": {
        "latitude": 18.5204,
        "longitude": 73.8567,
        "city": "Pune"
    },
    "preferred_radius": 25,  # km
    "service_type": "home_visit",  # "online", "in_person", "home_visit", "emergency"
    "provider_type": "veterinarian",  # "veterinarian", "trainer", "hospital", "clinic", "any"
    "urgency": "moderate"  # "low", "moderate", "high", "emergency"
}

# Response
{
    "platform_providers": [
        {
            "provider_id": "uuid",
            "provider_type": "veterinarian",  # "veterinarian", "trainer", "hospital", "clinic"
            "name": "Dr. Sarah Smith",
            "specializations": ["General Practice", "Surgery"],
            "distance_km": 5.2,
            "rating": 4.8,
            "can_book": true,
            "available_today": true,
            "services": {
                "online_consultation": true,
                "in_person_visit": true,
                "home_visit": true,
                "home_visit_radius": 30
            },
            "estimated_cost": "₹800-1200"
        },
        {
            "provider_id": "uuid",
            "provider_type": "trainer",
            "name": "John Wilson",
            "specializations": ["Behavioral Modification", "Basic Obedience Training"],
            "distance_km": 3.8,
            "rating": 4.9,
            "can_book": true,
            "available_today": true,
            "services": {
                "online_consultation": true,
                "in_person_visit": true,
                "home_visit": true,
                "home_visit_radius": 25,
                "has_academy": true,
                "academy_name": "Paws & Progress Academy"
            },
            "estimated_cost": "₹600-1000"
        }
    ],
    "external_providers": [
        {
            "name": "Pune Pet Hospital",
            "provider_type": "hospital",
            "address": "123 Main St, Pune",
            "distance_km": 8.5,
            "rating": 4.6,
            "can_book": false,
            "phone": "+91-1234567890",
            "services": {
                "in_person_visit": true,
                "home_visit": false
            },
            "google_place_id": "ChIJ..."
        }
    ],
    "recommendation_reasoning": "Based on your pet's symptoms and location, we recommend home visit for immediate care..."
}
```

### Database Schema Enhancements

**1. Add Geolocation to Users Table:**
```sql
-- Add geolocation fields
ALTER TABLE users ADD COLUMN latitude DECIMAL(10, 8);
ALTER TABLE users ADD COLUMN longitude DECIMAL(11, 8);
ALTER TABLE users ADD COLUMN location_verified BOOLEAN DEFAULT FALSE;

-- Add indexes for geolocation queries
CREATE INDEX idx_users_location ON users(latitude, longitude);
CREATE INDEX idx_users_city ON users(city);
```

**2. Enhanced Veterinarians Table:**
```sql
-- Add performance metrics
ALTER TABLE veterinarians ADD COLUMN total_appointments INTEGER DEFAULT 0;
ALTER TABLE veterinarians ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0.0;
ALTER TABLE veterinarians ADD COLUMN response_time_minutes INTEGER DEFAULT 60;
ALTER TABLE veterinarians ADD COLUMN home_visit_cost_range VARCHAR(50); -- "₹500-1000"
```

**3. Enhanced Hospitals Table:**
```sql
-- Add service details
ALTER TABLE hospitals ADD COLUMN services_offered JSONB; -- {"online": true, "in_person": true, "home_visit": false}
ALTER TABLE hospitals ADD COLUMN emergency_services BOOLEAN DEFAULT FALSE;
ALTER TABLE hospitals ADD COLUMN operating_hours JSONB; -- {"monday": "9:00-18:00", ...}
```

**4. Enhanced Trainers Table:**
```sql
-- Add performance metrics
ALTER TABLE trainers ADD COLUMN total_sessions INTEGER DEFAULT 0;
ALTER TABLE trainers ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0.0;
ALTER TABLE trainers ADD COLUMN response_time_minutes INTEGER DEFAULT 60;
ALTER TABLE trainers ADD COLUMN home_training_cost_range VARCHAR(50); -- "₹500-800"
ALTER TABLE trainers ADD COLUMN academy_training_cost_range VARCHAR(50); -- "₹300-600"
```

**5. Provider Recommendations Cache:**
```sql
-- Cache table for recommendations
CREATE TABLE provider_recommendations_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_location_hash VARCHAR(64) NOT NULL,
    symptoms_hash VARCHAR(64) NOT NULL,
    service_type VARCHAR(20) NOT NULL,
    recommendations JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_provider_cache_location_symptoms ON provider_recommendations_cache(user_location_hash, symptoms_hash, service_type);
```

### AI Service Type Detection Logic

**Service Type Classification:**
```python
def detect_service_type(user_input, pet_needs, urgency):
    """
    AI logic to determine appropriate service type
    """
    service_indicators = {
        "home_visit": [
            "can't travel", "elderly", "anxious", "home visit", 
            "come to my house", "mobile vet", "at home", "home training"
        ],
        "online": [
            "online", "video call", "teleconsultation", "remote", 
            "can't leave home", "busy schedule", "online training"
        ],
        "in_person": [
            "clinic", "hospital", "visit", "appointment", 
            "checkup", "examination", "academy", "training center"
        ],
        "emergency": [
            "emergency", "urgent", "bleeding", "unconscious", 
            "severe", "critical", "immediately"
        ]
    }
    
    provider_indicators = {
        "veterinarian": [
            "sick", "fever", "pain", "injury", "medical", "health", 
            "symptoms", "diagnosis", "treatment", "medicine"
        ],
        "trainer": [
            "training", "behavior", "obedience", "aggressive", "anxious", 
            "socialization", "commands", "discipline", "competition"
        ],
        "hospital": [
            "emergency", "surgery", "serious", "critical", "hospitalization"
        ],
        "clinic": [
            "routine", "checkup", "vaccination", "preventive", "wellness"
        ]
    }
    
    # AI analysis using Gemini + need analysis
    # Return recommended service types and provider types with confidence scores
```

### Home Visit Radius Matching

**Distance Calculation:**
```python
def find_home_visit_providers(user_lat, user_lng, radius_km=25):
    """
    Find vets offering home visits within specified radius
    """
    # Haversine formula for distance calculation
    # Check veterinarians.home_visit_radius >= calculated_distance
    # Return providers sorted by distance and rating
```

### Google Places API Integration

**External Provider Search:**
```python
def search_external_providers(location, service_type):
    """
    Search Google Places for external veterinary providers
    """
    # Use Google Places Nearby Search
    # Filter by veterinary clinics, animal hospitals
    # Get ratings, reviews, contact information
    # Cache results for 24 hours
```

---

## 📁 Available Datasets

### CSV Datasets (Located in `ai-service/datasets/`)
- `pet-health-symptoms-dataset.csv` - Pet health symptoms data
- `cleaned_animal_disease_prediction.csv` - Animal disease prediction
- `veterinary_clinical_data.csv` - Clinical veterinary data
- `veterinary_training_dataset.csv` - Training dataset
- `synthetic_dog_breed_health_data.csv` - Dog breed health data

### Image Dataset
- `ImageDataset/` - 1,700+ images categorized by disease
- Categories: "Dental Disease in Cat", "Distemper in Dog", etc.

### Dataset Storage Strategy
- **CSV Data**: Imported into MongoDB for fast querying and symptom matching
- **Image Data**: Stored in file system with MongoDB metadata for searchability
- **User Data**: Replicated from PostgreSQL to MongoDB for AI context

---

## 🔧 Implementation Plan

### Phase 1: Database Setup ✅
- [x] MongoDB 8.0.12 installed and configured
- [x] Redis 3.0.504 installed and configured
- [x] Environment variables configured
- [x] Database connections tested

### Phase 2: Enhanced Session Management
- [ ] Implement SessionManager class
- [ ] Add MongoDB session persistence
- [ ] Enhance Redis caching
- [ ] Fix AI forgetting previous messages

### Phase 3: User Context Integration
- [ ] Implement user authentication check
- [ ] Add pet data retrieval from PostgreSQL
- [ ] Create data replication from PostgreSQL to MongoDB
- [ ] Implement pet context in AI conversations

### Phase 4: Dataset Integration
- [ ] Load CSV datasets into MongoDB
- [ ] Process image datasets with metadata
- [ ] Implement symptom matching algorithms
- [ ] Add dataset-backed recommendations

### Phase 5: Multi-Modal Processing
- [ ] Enhance image processing capabilities
- [ ] Add speech-to-text integration
- [ ] Implement multi-modal Gemini integration
- [ ] Add emergency detection

### Phase 6: Vet Recommendation System
- [ ] Add geolocation fields to users table
- [ ] Implement distance calculation algorithms
- [ ] Integrate Google Places API
- [ ] Create vet recommendation endpoints
- [ ] Implement recommendation caching
- [ ] Add vet performance metrics

### Phase 7: Production Deployment
- [ ] Upgrade Redis to 7.x using Docker
- [ ] Implement Docker Compose for all services
- [ ] Production environment configuration
- [ ] Performance optimization and monitoring

---

## 🛠️ Development Commands

### Database Testing
```bash
# Test MongoDB connection
mongod --version
mongo --eval "db.runCommand('ping')"

# Test Redis connection
redis-server --version
redis-cli ping

# Test PostgreSQL connection (if running)
psql -h localhost -U postgres -d zoodo
```

### AI Service Development
```bash
cd ai-service
pip install -r requirements.txt
python start_conversational_ai.py
```

### Dataset Management
```bash
cd ai-service
# Load CSV datasets into MongoDB
python load_datasets.py

# Process image datasets
python process_image_datasets.py

# Test dataset integration
python test_dataset_integration.py
```

### AI Model Training
```bash
cd ai-service
# Train custom veterinary AI model
python demo_ai_training.py

# Fine-tune Gemini AI with custom dataset
python quick_training_demo.py

# Test conversational AI
python demo_conversational_ai.py
```

---

## 📋 Environment Configuration

### AI Service .env
```bash
# AI Provider Configuration
AI_PROVIDER=google
GOOGLE_API_KEY=your_google_api_key_here
AI_MODEL_NAME=gemini-pro

# Service Configuration
BACKEND_URL=http://localhost:8080
API_HOST=0.0.0.0
API_PORT=8000
API_DEBUG=true

# Database Configuration (PostgreSQL for user data)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=zoodo
DB_USER=postgres
DB_PASSWORD=root

# MongoDB Configuration (AI Service Only)
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=zoodo_ai

# Redis Configuration (AI Service Only)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# Security Configuration
JWT_SECRET_KEY=your_jwt_secret_key_here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Rate Limiting
RATE_LIMIT_REQUESTS_PER_HOUR=30
RATE_LIMIT_BURST=10

# Logging
LOG_LEVEL=INFO
LOG_FILE=ai_service.log
```

---

## 🎯 Next Steps

### Immediate Tasks
1. **Fix AI Memory Issue**: Implement persistent session management
2. **Load Datasets**: Import CSV datasets into MongoDB
3. **User Context**: Implement pet data integration
4. **Test AI Service**: Ensure all features work with both databases

### Production Considerations
- **MongoDB 8.0.12**: Excellent choice, keep as is
- **Redis**: Upgrade to 7.x for production using Docker
- **Docker Implementation**: Full containerization for production deployment

### Redis Upgrade Plan (Production)
```bash
# Development: Redis 3.0.504 (Current)
redis-server --version  # v=3.0.504

# Production: Redis 7.x with Docker
docker run -d --name redis -p 6379:6379 redis:7-alpine
docker exec -it redis redis-server --version  # v=7.x
```

**Benefits of Redis 7.x:**
- ✅ Latest security patches
- ✅ Better performance and memory management
- ✅ New features (streams, modules, improved clustering)
- ✅ Better compatibility with modern applications
- ✅ Long-term support and updates

---

## 📊 Current Status

### ✅ Completed
- Database setup (MongoDB 8.0.12, Redis 3.0.504)
- Environment configuration
- Basic AI service functionality
- Dataset collection and organization

### 🔄 In Progress
- Enhanced session management
- User context integration
- Dataset loading and processing

### 📋 Planned
- Multi-modal processing enhancement
- Advanced symptom matching
- Emergency detection system
- Treatment recommendation engine
- Redis 7.x upgrade for production
- Docker containerization

---

**Made with ❤️ for AI-powered pet healthcare**
