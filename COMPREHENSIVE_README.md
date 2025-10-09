# 🐾 Zoodo AI Blockchain Veterinary Platform - Complete Project Documentation

### ⚠️ This project is currently **in progress** and under active development. Features, structure, and documentation may change frequently. ⚠️

#### 🌐 Live Demo — [https://zoodo.dev](https://zoodo.dev)

A comprehensive digital ecosystem for pet healthcare that unites pet owners, veterinarians, trainers, and welfare communities under a single, intelligent system.

---

## 🌟 **Project Overview**

**Zoodo** is a revolutionary, AI-powered veterinary platform that transforms pet healthcare by combining cutting-edge technologies including AI, blockchain, and modern web development. It's designed as a complete ecosystem connecting pet owners, veterinarians, trainers, and veterinary facilities worldwide.

### **Mission Statement**
Zoodo aims to revolutionize pet healthcare by making professional veterinary care accessible to pet owners worldwide through AI-powered assistance, blockchain-secured medical records, and a comprehensive ecosystem of veterinary professionals.

---

## 🏗️ **System Architecture**

The platform follows a **comprehensive microservices architecture** with blockchain integration for Digital Health Records (DHRs):

### **Microservices Architecture with Blockchain Integration**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL ACTORS                                  │
│  Pet Owners    Veterinarians    Admin    External Services                 │
└─────────────────┬─────────────────┬─────────────────────────────────────────┘
                  │                 │
┌─────────────────▼─────────────────▼─────────────────────────────────────────┐
│                        PRESENTATION LAYER                                  │
│              Frontend (Next.js 15 + TypeScript)                            │
│              Hosted on Vercel with CDN and Edge Functions                  │
└─────────────────┬───────────────────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                                   │
│  Backend API (Spring Boot 3.4.5)    AI Service (FastAPI + Python 3.12)   │
│  • User Management                 • Dr. Salus AI Assistant               │
│  • Medical Records                 • Google Gemini AI Integration         │
│  • Payment Processing              • Multi-modal Processing               │
│  • Video Call Management           • Conversational AI                    │
│  • Blockchain Integration          • Real-time Chat Processing            │
└─────────────────┬─────────────────┬─────────────────────────────────────────┘
                  │                 │
┌─────────────────▼─────────────────▼─────────────────────────────────────────┐
│                          DATA LAYER                                       │
│  PostgreSQL        Redis Cache      MongoDB        Blockchain Network     │
│  (User Data)       (Sessions)      (AI Data)      (DHR Hashes)           │
│  • Medical Records • Caching       • Chat History • Immutable Proofs      │
│  • Appointments    • Rate Limiting • AI Insights  • Tamper-Proof Audit    │
│  • User Accounts   • Sessions      • Embeddings   • Smart Contracts       │
└─────────────────┬───────────────────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES LAYER                              │
│  Razorpay Payment    Jitsi Meet Video    Google Gemini AI                 │
│  • UPI, Cards        • WebRTC Calls      • Multi-modal AI Model           │
│  • Net Banking       • Screen Sharing    • Conversational AI              │
│  • Webhooks          • Recording         • Image Analysis                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **Blockchain Architecture for Digital Health Records (DHRs)**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HYBRID DATA STORAGE APPROACH                           │
│                                                                             │
│  ┌─────────────────┐              ┌─────────────────┐                      │
│  │   PostgreSQL    │              │  Blockchain     │                      │
│  │   (Full Data)   │              │  (Hashes Only)  │                      │
│  │                 │              │                 │                      │
│  │ • Medical Record│              │ • Record Hash   │                      │
│  │ • Pet Info      │              │ • Timestamp     │                      │
│  │ • Diagnosis     │              │ • Vet Signature │                      │
│  │ • Treatment     │              │ • Tamper Proof  │                      │
│  │ • Fast Access   │              │ • Immutable     │                      │
│  └─────────────────┘              └─────────────────┘                      │
│           │                                │                               │
│           └──────── Backend API ───────────┘                               │
│                    (Manages Connection)                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **Blockchain Network Deployment**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BLOCKCHAIN NETWORKS                                │
│                                                                             │
│  Development:  Local Hardhat Network (Free)                                │
│  Testing:      Polygon Testnet (Free)                                      │
│  Production:   Polygon Mainnet (Nearly Free - $0.001-0.01 per transaction)│
│                                                                             │
│  Benefits:                                                                  │
│  • Fast Transactions (2-3 seconds)                                         │
│  • Low Cost (Nearly free)                                                  │
│  • Ethereum Compatible                                                     │
│  • Real-time Verification                                                  │
│  • Immutable Medical Records                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **Production Architecture (Render + Vercel + Blockchain)**

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Platform                         │
├─────────────────────────────────────────────────────────────┤
│ • Frontend (Next.js) - https://zoodo.dev                  │
│ • CDN & Edge Functions                                     │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Render Platform                          │
├─────────────────────────────────────────────────────────────┤
│ • Backend (Spring Boot) - https://zoodo-backend.onrender.com │
│ • AI Service (FastAPI) - https://zoodo-ai-service.onrender.com │
│ • PostgreSQL Database (Medical Records)                    │
│ • MongoDB Database (AI Data)                               │
│ • Redis Cache (Sessions)                                   │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                        │
├─────────────────────────────────────────────────────────────┤
│ • Razorpay (Payment Processing)                            │
│ • Jitsi Meet (Video Consultations)                         │
│ • Google Gemini AI (AI Model Provider)                     │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                Blockchain Network (Polygon)                │
├─────────────────────────────────────────────────────────────┤
│ • Smart Contracts (Digital Health Records)                 │
│ • Immutable Medical Record Hashes                          │
│ • Tamper-Proof Audit Trail                                 │
│ • Real-time Verification (2-3 seconds)                     │
│ • Cost-Effective ($0.001-0.01 per transaction)            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 **Core Features & Capabilities**

### 🤖 **AI-Powered Pet Care Assistant (Dr. Salus AI)**

**Revolutionary Conversational AI** that provides natural, step-by-step veterinary consultations:

#### **Universal Animal Support**
- **Companion Animals**: Dogs, Cats, Rabbits, Guinea Pigs, Hamsters, Gerbils, Ferrets, Hedgehogs
- **Birds**: Parrots, Parakeets, Cockatiels, Budgies, Finches, Canaries, Chickens, Ducks
- **Reptiles**: Turtles, Tortoises, Snakes, Lizards, Geckos, Iguanas, Bearded Dragons
- **Equines**: Horses, Ponies, Donkeys, Mules
- **Livestock**: Cattle, Goats, Sheep, Pigs
- **Exotic**: Chinchillas, Sugar Gliders, Llamas, Alpacas
- **Aquatic**: Fish, Amphibians
- **+ ANY OTHER ANIMAL SPECIES**

#### **Key AI Features**
- **Natural Conversation Flow**: Step-by-step information gathering like real vet consultations
- **Emergency Detection**: Automatic identification of critical situations requiring immediate attention
- **Global Location Support**: Provides worldwide veterinary recommendations
- **Multi-modal Processing**: Supports text, images, and speech-to-text analysis
- **Persistent Memory**: Maintains conversation context and pet profiles across sessions
- **Smart Provider Matching**: AI-driven recommendations for vets, hospitals, clinics, and trainers
- **Service Type Intelligence**: Automatically detects online consultations, in-person visits, or home visits
- **Home Visit Matching**: Finds providers offering home services within service radius
- **Training Intelligence**: Matches behavioral issues with appropriate trainers
- **Emergency Assessment**: Real-time emergency evaluation with immediate action recommendations

#### **Conversation Methodology**
```
STAGE 1: Initial Triage → Acknowledge concern, check for emergencies
STAGE 2: Age & Type → Ask for species, age, breed
STAGE 3: Symptom Details → Duration and severity assessment
STAGE 4: Behavioral Changes → Eating, drinking, activity levels
STAGE 5: Context → Recent changes, medical history
STAGE 6: Assessment → Provide recommendations and urgency level
STAGE 7: Local Resources → Location-based vet recommendations
```

#### **Emergency Detection System**
**Universal Emergencies (All Animals):**
- Difficulty breathing, choking, gasping for air
- Uncontrolled bleeding or deep wounds
- Suspected poisoning
- Seizures, collapse, or loss of consciousness
- Severe trauma from accident or attack
- Unable to move or stand

**Species-Specific Emergencies:**
- **Mammals**: Bloated belly, can't urinate, heatstroke, pale gums
- **Birds**: Difficulty breathing, fluffed up, blood in droppings
- **Reptiles**: Not moving, cold temperature, prolapsed organs
- **Horses/Livestock**: Colic symptoms, laminitis, down and can't get up

### 🔗 **Blockchain Security & Digital Health Records (DHRs)**

**Revolutionary blockchain integration** for tamper-proof medical record management:

#### **Digital Health Records (DHRs) Architecture**
- **Hybrid Storage Approach**: Full medical data in PostgreSQL, cryptographic hashes on blockchain
- **Immutable Medical Records**: Tamper-proof storage of medical record hashes on blockchain
- **Real-Time Verification**: Fast verification using Polygon network (2-3 seconds)
- **Cost-Effective**: Nearly free transactions ($0.001-0.01 per verification)
- **Smart Contract Security**: Automated verification of record authenticity
- **Transparent Audit Trail**: Public verification of medical record changes and access
- **Regulatory Compliance**: Meets healthcare data integrity and audit requirements

#### **Smart Contract: DigitalHealthRecords.sol**
- **Medical Records Storage**: Tamper-proof storage of medical record hashes
- **Appointment Verification**: Secure appointment records with cryptographic verification
- **Data Integrity**: Cryptographic proof of all medical data authenticity
- **Provider Authorization**: Role-based access control for medical professionals
- **Audit Trail**: Complete history of all medical record modifications
- **Emergency Controls**: Pausable contract for emergency situations

#### **Blockchain Network Benefits**
- **Polygon Network**: Fast, cheap, Ethereum-compatible blockchain
- **Development**: Local Hardhat network (free)
- **Testing**: Polygon testnet (free)
- **Production**: Polygon mainnet (nearly free)
- **Decentralized Security**: No single point of failure for medical record verification

#### **Key Features**
- **Immutable Storage**: Medical record hashes stored with cryptographic proof
- **Access Control**: Role-based authorization for medical providers
- **Hash Verification**: Cryptographic proof of record integrity
- **Event Logging**: Complete audit trail of all operations
- **Real-Time Verification**: Fast blockchain verification for medical records

### 🏥 **Multi-Service Platform**

**Comprehensive Veterinary Ecosystem**:

#### **6 User Types with Specialized Dashboards**
1. **Pet Owners**: Pet management, appointment booking, AI chat
2. **Veterinarians**: Professional profile, appointment management, medical records
3. **Trainers**: Training services, academy management, client tracking
4. **Hospitals**: Business management, compliance tracking, staff management
5. **Clinics**: Facility management, service offerings, appointment scheduling
6. **Admins**: Platform management, user verification, analytics

#### **Service Features**
- **AI-Powered Appointment Scheduling**: Smart matching for all service types
- **Geolocation-Based Matching**: Find nearby providers with distance calculation
- **Training Services**: Behavioral modification and specialized training programs
- **Community Events**: Vaccination drives, adoption camps, wellness checkups
- **Mobile Accessibility**: Cross-platform mobile application

### 💳 **Payment Integration**

**Secure Payment Processing** with Razorpay:

- **Multiple Payment Methods**: UPI, cards, net banking, digital wallets
- **Instant Payments**: Real-time payment verification and confirmation
- **Transaction History**: Complete payment tracking and receipts
- **PCI Compliance**: Secure handling of payment data
- **EMI Options**: No-cost EMI for expensive treatments

### 🎥 **Video Consultation**

**HD Video Calling** with Jitsi Meet integration:

- **Screen Sharing**: Share medical images and documents during calls
- **Recording**: Optional consultation recording with consent
- **Mobile Optimized**: Seamless video experience on all devices
- **Real-time Chat**: Messaging during video consultations
- **HD Quality**: 720p/1080p support

---

## 🛠️ **Technology Stack**

### **Frontend Layer**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom Components
- **State Management**: React Context + TanStack Query
- **Video Calling**: Jitsi Meet SDK
- **Payment**: Razorpay SDK

### **Backend Layer**
- **Framework**: Spring Boot 3.4.5
- **Language**: Java 21
- **Security**: Spring Security + JWT
- **Database**: JPA/Hibernate with PostgreSQL
- **Caching**: Redis
- **Payment**: Razorpay Java SDK
- **File Upload**: Multipart file handling

### **AI Service Layer**
- **Framework**: FastAPI
- **Language**: Python 3.12
- **AI Models**: Google Gemini AI
- **Database**: MongoDB (for AI data)
- **Caching**: Redis
- **ML Libraries**: Custom veterinary models

### **Blockchain Layer**
- **Platform**: Ethereum
- **Framework**: Hardhat
- **Language**: Solidity
- **Network**: Local development + Mainnet ready

### **Infrastructure Layer**
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx (reverse proxy)
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **File Storage**: Local + AWS S3 ready

---

## 📊 **Database Architecture**

### **Multi-Database Strategy**
- **PostgreSQL**: Main backend database (users, pets, appointments, medical records)
- **MongoDB**: AI service database (conversations, AI recommendations, datasets)
- **Redis**: AI service caching and session management

### **Core Database Tables**
- `users` - Base user information for all user types
- `pet_owners` - Pet owner specific data
- `pets` - Pet information with detailed profiles
- `veterinarians` - Professional vet data with specializations and services
- `trainers` - Trainer professional data with certifications and training types
- `hospitals` - Hospital/clinic business data with compliance information
- `appointments` - Appointment scheduling with status tracking
- `medical_records` - Medical history with file attachments
- `reviews` - Provider ratings and feedback system

### **Advanced Database Features**
- **Geolocation Support**: Latitude/longitude fields for distance-based matching
- **Service Type Detection**: JSON fields for different service offerings
- **Home Visit Radius**: Distance-based matching for home services
- **Availability Scheduling**: JSON-based availability management
- **File Upload System**: Secure document and image storage
- **UUID Primary Keys**: Secure, non-sequential identifiers
- **Audit Triggers**: Automatic timestamp updates

---

## 🤖 **AI Service Deep Dive**

### **Dr. Salus AI - Conversational Veterinary Assistant**

**Revolutionary AI Implementation** that provides natural, human-like veterinary consultations:

#### **AI Models & Training**
- **Primary Model**: Google Gemini Pro
- **Custom Datasets**: 5 CSV datasets + 1,700+ images for veterinary training
- **Multi-modal Processing**: Text, images, and speech-to-text analysis
- **Continuous Learning**: Models improve with more data and feedback

#### **Available Datasets**
- `pet-health-symptoms-dataset.csv` - Pet health symptoms data
- `cleaned_animal_disease_prediction.csv` - Animal disease prediction
- `veterinary_clinical_data.csv` - Clinical veterinary data
- `synthetic_dog_breed_health_data.csv` - Dog breed health data
- `ImageDataset/` - 1,700+ images categorized by disease

#### **Smart Provider Recommendation System**
- **Intelligent Provider Detection**: AI understands whether user needs vet, hospital, clinic, or trainer
- **Service Type Recognition**: Distinguishes between online, in-person, and home visits
- **Geolocation-Based Matching**: Distance calculation with radius-based home visits
- **Specialization Matching**: Matches pet needs with provider specializations
- **Google Places Integration**: External provider suggestions when platform providers unavailable

#### **API Endpoints**
- `POST /chat` - Main conversational chat interface
- `POST /location` - Set user location for vet recommendations
- `GET /profile` - Get current pet profile information
- `GET /find-vet` - Find veterinarians near user location
- `GET /find-specialist` - Find specialist vets for exotic animals
- `POST /reminder` - Set follow-up reminder
- `GET /reminders` - Get active reminders
- `GET /summary` - Get consultation summary

---

## ⛓️ **Blockchain Integration**

### **Smart Contract: DigitalHealthRecords.sol**

**Comprehensive blockchain solution** for Digital Health Records (DHRs) security:

#### **Data Structures**
- `MedicalRecord`: Pet ID, record type, timestamp, hash, creator
- `PetRecord`: Aggregated records for each pet
- `AppointmentRecord`: Appointment verification and tracking
- `ProviderAuthorization`: Access control for medical professionals
- `DHRHash`: Cryptographic hash of medical record for verification

#### **Key Functions**
- `storeDHR()` - Store medical record hash on blockchain
- `storeAppointmentRecord()` - Store appointment records
- `verifyDHR()` - Verify medical record authenticity
- `authorizeProvider()` - Grant provider access
- `getPetRecords()` - Retrieve all records for a pet
- `getDHRHash()` - Retrieve hash for verification

#### **Blockchain Network Deployment**
- **Development**: Local Hardhat Network (Free)
- **Testing**: Polygon Testnet (Free)
- **Production**: Polygon Mainnet (Nearly Free - $0.001-0.01 per transaction)

#### **Hybrid Data Flow**
```
1. Medical Record Created → PostgreSQL (Full Data)
2. Backend Creates Hash → Smart Contract (Hash + ID)
3. Verification Request → Compare Hashes
4. Result: Authentic/Modified → User Interface
```

#### **Security Features**
- **Ownable Contract**: Owner controls provider authorization
- **Pausable Operations**: Emergency stop functionality
- **Hash Verification**: Cryptographic proof of record integrity
- **Event Logging**: Complete audit trail of all operations
- **Real-Time Verification**: Fast blockchain verification for medical records

---

## 🚀 **Deployment Architecture**

### **Development Environment**
```bash
# Local development with Docker
docker-compose up -d

# Access services at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
# AI Service: http://localhost:8000
# Database: localhost:5432
```

### **Production Environment (Free Tier)**
- **Frontend**: Deployed on Vercel with automatic GitHub integration
- **Backend & AI**: Deployed on Render with managed databases
- **External Services**: Razorpay, Jitsi Meet, Google Gemini AI
- **Blockchain**: Ethereum mainnet ready with Hardhat deployment

### **Scaling Strategy**
#### **Free Tier (Current)**
- **Render**: 750 hours/month per service
- **Vercel**: Unlimited static hosting
- **Total Cost**: $0
- **Suitable for**: Development, testing, small production

#### **Paid Tier (Future)**
- **Horizontal Scaling**: Multiple service instances
- **Database Scaling**: Read replicas
- **CDN**: Static asset delivery
- **Load Balancing**: Automatic traffic distribution
- **Auto-scaling**: Based on demand

---

## 🔐 **Security & Authentication**

### **Multi-Layer Security Architecture**

#### **Authentication System**
- **JWT Tokens**: Stateless authentication with secure token management
- **Role-based Access Control**: 6 user types with different permissions
- **OAuth2 Integration**: Google login support
- **Password Security**: BCrypt hashing with salt

#### **Data Security**
- **Encryption**: TLS 1.3 for data in transit
- **Database Security**: Encrypted connections and secure credentials
- **File Upload Security**: Secure file validation and storage
- **Blockchain Security**: Cryptographic verification of all medical data

#### **API Security**
- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS Configuration**: Secure cross-origin resource sharing
- **Input Validation**: Comprehensive data validation and sanitization
- **Error Handling**: Secure error messages without information leakage

---

## 📱 **User Experience & Interface**

### **Frontend Architecture**

#### **Modern React Implementation**
- **Next.js 15**: Latest version with App Router
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first styling with custom components
- **Radix UI**: Accessible, unstyled UI components
- **Framer Motion**: Smooth animations and transitions

#### **User Dashboards**
1. **Pet Owner Dashboard**: Pet management, appointment booking, AI chat
2. **Veterinarian Dashboard**: Professional profile, appointment management, medical records
3. **Trainer Dashboard**: Training services, academy management, client tracking
4. **Hospital Dashboard**: Business management, compliance tracking, staff management
5. **Admin Dashboard**: Platform management, user verification, analytics

#### **Key Features**
- **Responsive Design**: Mobile-first approach with cross-platform compatibility
- **Real-time Updates**: Live notifications and status updates
- **File Upload System**: Secure document and image uploads
- **Video Integration**: Seamless Jitsi Meet integration
- **Payment Integration**: Smooth Razorpay payment flow

---

## 🔄 **Data Flow & Integration**

### **User Registration Flow**
```
User → Frontend → Backend → Database → JWT Token → Frontend
```

### **AI Consultation Flow**
```
User → Frontend → AI Service → Gemini AI → MongoDB/Redis → Response → Frontend
```

### **Payment Flow**
```
User → Frontend → Razorpay → Backend → Database → Appointment Creation
```

### **Video Consultation Flow**
```
User → Payment → Jitsi Room → Video Call → Medical Record → Blockchain
```

### **Blockchain Integration Flow (Digital Health Records)**
```
Medical Record → PostgreSQL (Full Data) → Backend → Hash Creation → Smart Contract → Polygon Network → Verification
```

---

## 📊 **Analytics & Monitoring**

### **Real-time Analytics**
- **User Interaction Tracking**: Comprehensive user behavior analysis
- **AI Performance Metrics**: Response times, accuracy, user satisfaction
- **Payment Analytics**: Transaction monitoring and success rates
- **Video Quality Metrics**: Call quality and connection stability
- **Emergency Case Tracking**: Critical situation monitoring and response times

### **Business Intelligence**
- **Provider Performance**: Ratings, response times, appointment completion
- **User Engagement**: Feature usage, session duration, retention rates
- **Revenue Analytics**: Payment processing, subscription tracking
- **Geographic Analytics**: Location-based usage patterns and provider distribution

---

## 🎯 **Current Status & Development**

### **✅ Completed Features**
- **Database Architecture**: PostgreSQL, MongoDB, Redis fully configured
- **AI Service**: Dr. Salus conversational AI with multi-modal support
- **Smart Provider Recommendations**: AI-powered geolocation-based matching
- **Service Type Intelligence**: Automatic detection of service needs
- **Training Intelligence**: AI-powered trainer recommendations
- **Dataset Integration**: 5 CSV datasets + 1,700+ images for AI training
- **Environment Configuration**: Production-ready configuration
- **Comprehensive Documentation**: Setup and enhancement guides

### **🔄 In Development**
- **Enhanced Session Management**: MongoDB + Redis persistent sessions
- **User Context Integration**: Pet data and authentication integration
- **Dataset Processing**: AI-powered symptom analysis and recommendations
- **Multi-modal Processing**: Advanced image and speech processing

### **🚀 Production Ready**
- **Docker Deployment**: Full containerization with Redis 7.x
- **Advanced AI Features**: Emergency detection, treatment recommendations
- **Performance Optimization**: Caching and response time improvements
- **Security Implementation**: Comprehensive security measures

---

## 🚀 **Quick Start Guide**

### **Prerequisites**
- Docker and Docker Compose
- Node.js 22 (LTS)
- Java 21 (LTS)
- Python 3.12

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/zoodo-ai-blockchain-veterinary-platform.git
cd zoodo-ai-blockchain-veterinary-platform
```

### **2. Environment Setup**
Create a `.env` file in the root directory:
```bash
# Database Configuration (Docker containers)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=zoodo
DB_USER=postgres
DB_PASSWORD=password

# MongoDB Configuration (AI Service - Docker)
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=zoodo_ai

# Redis Configuration (AI Service - Docker)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Google Gemini AI
GOOGLE_GEMINI_API_KEY=your-gemini-api-key

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Video Calling (Jitsi Meet)
JITSI_APP_ID=your-jitsi-app-id
JITSI_APP_SECRET=your-jitsi-app-secret

# Blockchain
BLOCKCHAIN_NETWORK_URL=http://localhost:8545
BLOCKCHAIN_PRIVATE_KEY=your-private-key
BLOCKCHAIN_CONTRACT_ADDRESS=your-contract-address

# Service URLs
BACKEND_URL=http://localhost:8080
AI_SERVICE_URL=http://localhost:8000
```

### **3. Start Services**
```bash
# Start all services with Docker Compose (includes all databases)
docker-compose up -d

# Or start specific services
docker-compose up -d postgres mongodb redis
docker-compose up -d backend ai_service
docker-compose up -d frontend blockchain
```

### **4. Access the Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **AI Service**: http://localhost:8000
- **Blockchain**: http://localhost:8545
- **PostgreSQL**: localhost:5432
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

---

## 🔧 **Development Setup**

### **Frontend Development**
```bash
cd frontend
npm install
npm run dev
```

### **Backend Development**
```bash
cd backend
./mvnw spring-boot:run
```

### **AI Service Development**
```bash
cd ai-service
pip install -r requirements.txt
python start_conversational_ai.py
```

### **AI Model Training & Fine-tuning**
```bash
cd ai-service
# Train custom veterinary AI model
python demo_ai_training.py

# Fine-tune Gemini AI with custom dataset
python quick_training_demo.py

# Test conversational AI
python demo_conversational_ai.py
```

### **Blockchain Development**

#### **Smart Contract Development**
```bash
cd blockchain
npm install

# Start local blockchain network
npx hardhat node

# Compile smart contracts
npx hardhat compile

# Deploy to local network
npx hardhat deploy --network localhost

# Deploy to Polygon testnet (free)
npx hardhat deploy --network polygon-testnet

# Deploy to Polygon mainnet (nearly free)
npx hardhat deploy --network polygon-mainnet
```

#### **Blockchain Integration**
```bash
# Test smart contract
npx hardhat test

# Verify contract on blockchain explorer
npx hardhat verify --network polygon-mainnet <CONTRACT_ADDRESS>

# Interact with deployed contract
npx hardhat console --network polygon-mainnet
```

#### **Digital Health Records (DHRs) Flow**
```
1. Medical Record Created → PostgreSQL (Full Data)
2. Backend Creates Hash → Smart Contract (Hash + ID)
3. Verification Request → Compare Hashes
4. Result: Authentic/Modified → User Interface
```

#### **Blockchain Networks**
- **Development**: Local Hardhat Network (Free)
- **Testing**: Polygon Testnet (Free)
- **Production**: Polygon Mainnet (Nearly Free - $0.001-0.01 per transaction)

---

## 🧪 **Testing**

### **Run All Tests**
```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && ./mvnw test

# AI service tests
cd ai_service && pytest

# Blockchain tests
cd blockchain && npx hardhat test
```

### **API Testing**
```bash
# Test backend API
curl http://localhost:8080/api/health

# Test AI service (Gemini-powered)
curl http://localhost:8000/health

# Test blockchain
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:8545
```

---

## 📊 **API Documentation**

### **Backend API**
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI Spec**: http://localhost:8080/v3/api-docs

### **AI Service API**
- **FastAPI Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🌍 **Global Impact & Vision**

### **Key Innovations**
1. **Universal AI Assistant**: First conversational AI that handles ALL animal species
2. **Blockchain Digital Health Records (DHRs)**: Immutable, tamper-proof storage of pet health data using hybrid approach
3. **Cost-Effective Blockchain**: Nearly free medical record verification using Polygon network
4. **Global Provider Network**: Worldwide access to veterinary professionals
5. **Smart Service Matching**: AI-powered matching of pet needs with appropriate services
6. **Integrated Payment System**: Seamless payment processing for all services
7. **Real-Time Verification**: Fast blockchain verification (2-3 seconds) for medical records

### **Target Audience**
- **Pet Owners**: Worldwide pet owners seeking convenient, reliable veterinary care
- **Veterinarians**: Professional vets looking to expand their practice and reach
- **Trainers**: Animal trainers offering behavioral and obedience services
- **Veterinary Facilities**: Hospitals and clinics seeking digital transformation
- **Pet Care Industry**: Organizations looking to integrate AI and blockchain solutions

---

## 📚 **Documentation Structure**

### **Project Structure**
```
zoodo-ai-blockchain-veterinary-platform/
├── 📁 frontend/              # Next.js + TypeScript frontend
├── 📁 backend/               # Spring Boot backend
├── 📁 ai-service/            # Python FastAPI AI service
├── 📁 blockchain/            # Smart contracts
├── 📁 db/                    # Database schema
├── 📁 docs/                  # Documentation
├── 📁 devops/                # Infrastructure
└── 📄 docker-compose.yml     # Service orchestration
```

### **Documentation Files**
- **API Documentation**: `docs/api-docs.md`
- **Architecture**: `docs/architecture.md`
- **Setup Guides**: `docs/guides/`
- **Project Structure**: `docs/PROJECT_STRUCTURE.md`
- **AI Enhancement Plan**: `ai-service/README_AI_ENHANCANCEMENT.md`
- **Conversational AI Guide**: `ai-service/README_CONVERSATIONAL_AI.md`

---

## 🔧 **Environment Configuration**

### **Development**
```bash
# Local development with Docker
docker-compose up -d
```

### **Staging**
```bash
# Staging environment
docker-compose -f docker-compose.staging.yml up -d
```

### **Production**
```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📈 **Performance & Monitoring**

### **Application Monitoring**
- **Health Checks**: Service health monitoring
- **Performance Metrics**: Response times, throughput
- **Error Tracking**: Exception monitoring
- **User Analytics**: Usage patterns

### **Business Metrics**
- **Payment Analytics**: Transaction monitoring
- **User Engagement**: Feature usage
- **AI Performance**: Model accuracy
- **Video Quality**: Call quality metrics

---

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎉 **Conclusion**

**Zoodo** represents a groundbreaking advancement in veterinary healthcare technology, combining the power of AI, blockchain, and modern web development to create a comprehensive ecosystem for pet care. With its universal AI assistant, secure blockchain integration for Digital Health Records (DHRs), and global provider network, Zoodo is positioned to revolutionize how pet owners access and manage veterinary care worldwide.

The platform's innovative approach to conversational AI, combined with its cost-effective blockchain security measures using Polygon network and comprehensive feature set, makes it a leader in the digital transformation of veterinary services. The hybrid data storage approach (PostgreSQL + Blockchain) ensures both fast access and tamper-proof verification of medical records. Whether you're a pet owner seeking convenient care, a veterinarian looking to expand your practice, or a developer interested in cutting-edge technology integration, Zoodo offers a complete solution that addresses the evolving needs of the modern pet care industry.

---

**Made with ❤️ for pets and their humans worldwide** 🌍🐾

---

## 📞 **Support & Contact**

### **Health Check Endpoints**
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080/actuator/health
- **AI Service**: http://localhost:8000/health
- **Blockchain**: http://localhost:8545

### **Documentation Links**
- **Live Demo**: [https://zoodo.dev](https://zoodo.dev)
- **API Documentation**: [Backend Swagger](http://localhost:8080/swagger-ui.html) | [AI Service Docs](http://localhost:8000/docs)
- **Architecture Guide**: `docs/architecture.md`
- **Setup Guide**: `docs/guides/ENVIRONMENT_SETUP_GUIDE.md`

### **Getting Help**
1. Check the logs for error messages
2. Run the test suite to verify functionality
3. Ensure all dependencies are installed correctly
4. Verify your API keys and account status
5. Review the comprehensive documentation in the `docs/` folder

---

