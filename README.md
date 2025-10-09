### ⚠️ This project is currently **in progress** and under active development. Features, structure, and documentation may change frequently. ⚠️

# 🐾 Zoodo - AI & Blockchain-Powered Veterinary Platform 

#### 🌐 Live Demo — [https://zoodo.dev](https://zoodo.dev)

A comprehensive digital ecosystem for pet healthcare that unites pet owners, veterinarians, trainers, and welfare communities under a single, intelligent system.

## 🌟 Features

### 🤖 AI-Powered Pet Care Assistant
- **Symptom Analysis**: Intelligent analysis of pet symptoms with urgency assessment using fine-tuned Gemini AI
- **Smart Provider Recommendations**: AI-driven matching with geolocation-based vet, hospital, clinic, and trainer suggestions
- **Service Type Intelligence**: Automatically detects and recommends online consultations, in-person visits, or home visits
- **Home Visit Matching**: Finds vets and trainers offering home visits within service radius for pets that can't travel
- **Training Intelligence**: AI understands behavioral issues and recommends appropriate trainers with specializations
- **Care Routines**: Personalized care and diet recommendations based on breed, age, and health conditions
- **Emergency Assessment**: Real-time emergency evaluation with immediate action recommendations
- **Conversational AI**: Advanced chatbot (Dr. Salus AI) trained on veterinary knowledge
- **Multi-modal Processing**: Text, images, and speech-to-text analysis capabilities
- **Custom Dataset Training**: AI models trained on veterinary-specific datasets
- **Continuous Learning**: AI models improve with more data and feedback

### 🔗 Blockchain Security & Digital Health Records (DHRs)
- **Immutable Medical Records**: Tamper-proof storage of medical record hashes on blockchain
- **Digital Health Records (DHRs)**: Cryptographic verification of all medical data integrity
- **Smart Contract Verification**: Automated verification of medical record authenticity
- **Transparent Audit Trail**: Public verification of medical record changes and access
- **Cost-Effective Storage**: Hybrid approach with full data in PostgreSQL and hashes on blockchain
- **Real-Time Verification**: Fast verification using Polygon network (2-3 seconds, nearly free)
- **Regulatory Compliance**: Meets healthcare data integrity and audit requirements

### 🏥 Multi-Service Platform
- **AI-Powered Appointment Scheduling**: Smart matching for clinic visits, home visits, teleconsultations, and training sessions
- **Intelligent Provider Management**: AI-recommended verified veterinarians, hospitals, clinics, and trainers with ratings
- **Geolocation-Based Matching**: Find nearby providers with distance calculation and service radius matching
- **Training Services**: Behavioral modification, obedience training, and specialized training programs
- **Community Events**: Vaccination drives, adoption camps, and wellness checkups
- **Mobile Accessibility**: Cross-platform mobile application

### 💳 Payment Integration
- **Razorpay Integration**: Secure payment processing for consultations and services
- **Multiple Payment Methods**: UPI, cards, net banking, digital wallets
- **Instant Payments**: Real-time payment verification and confirmation
- **Transaction History**: Complete payment tracking and receipts

### 🎥 Video Consultation
- **Jitsi Meet Integration**: HD video calling for teleconsultations
- **Screen Sharing**: Share medical images and documents during calls
- **Recording**: Optional consultation recording with consent
- **Mobile Optimized**: Seamless video experience on all devices


## 🏗️ System Architecture

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

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+
- Java 21+
- Python 3.11+

### Database Setup
All databases are provided via Docker containers:
- **PostgreSQL**: Main backend database (users, pets, appointments, medical records)
- **MongoDB 8.0+**: AI service database (conversations, AI recommendations, datasets)
- **Redis 7.x**: AI service caching and session management

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/zoodo-ai-blockchain-veterinary-platform.git
cd zoodo-ai-blockchain-veterinary-platform
```

### 2. Environment Setup
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

# Blockchain Configuration
# Development (Local Hardhat Network)
BLOCKCHAIN_NETWORK_URL=http://localhost:8545
BLOCKCHAIN_PRIVATE_KEY=your-private-key
BLOCKCHAIN_CONTRACT_ADDRESS=your-contract-address

# Production (Polygon Network - Nearly Free)
# BLOCKCHAIN_NETWORK_URL=https://polygon-rpc.com
# BLOCKCHAIN_PRIVATE_KEY=your-production-private-key
# BLOCKCHAIN_CONTRACT_ADDRESS=your-deployed-contract-address

# Service URLs
BACKEND_URL=http://localhost:8080
AI_SERVICE_URL=http://localhost:8000
```

### 3. Start Services
```bash
# Start all services with Docker Compose (includes all databases)
docker-compose up -d

# Or start specific services
docker-compose up -d postgres mongodb redis
docker-compose up -d backend ai_service
docker-compose up -d frontend blockchain
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **AI Service**: http://localhost:8000
- **Blockchain**: http://localhost:8545
- **PostgreSQL**: localhost:5432
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379
- **Monitoring**: http://localhost:9090 (Prometheus), http://localhost:3001 (Grafana)

## 🌐 Deployment

For production deployment instructions, see:
- [Deployment Guide](docs/guides/RENDER_DEPLOYMENT_GUIDE.md)
- [Environment Setup Guide](docs/guides/ENVIRONMENT_SETUP_GUIDE.md)
- [AI Service Enhancement Plan](ai-service/README_AI_ENHANCEMENT.md)

## 📁 Project Structure

For detailed project structure, see [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)

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

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
./mvnw spring-boot:run
```

### AI Service Development
```bash
cd ai-service
pip install -r requirements.txt
python start_conversational_ai.py
```

#### AI Service Features
- **Dr. Salus AI**: Conversational AI assistant for pet health with intelligent provider recommendations
- **Smart Provider Matching**: AI-powered geolocation-based vet, hospital, clinic, and trainer recommendations
- **Service Type Intelligence**: Automatic detection of online consultations, in-person visits, and home visits
- **Training Intelligence**: AI understands behavioral issues and matches pets with appropriate trainers
- **MongoDB Integration**: Database for AI data storage, conversations, and provider recommendations
- **Redis Caching**: Session management, response caching, and recommendation caching
- **Dataset Integration**: Veterinary datasets for symptom analysis and treatment recommendations

📋 **For detailed AI enhancement plan**: See [ai-service/README_AI_ENHANCEMENT.md](ai-service/README_AI_ENHANCEMENT.md)

### AI Model Training & Fine-tuning
```bash
cd ai-service
# Train custom veterinary AI model
python demo_ai_training.py

# Fine-tune Gemini AI with custom dataset
python quick_training_demo.py

# Test conversational AI
python demo_conversational_ai.py
```

#### Available Datasets
- **CSV Datasets**: 5 veterinary datasets for symptom analysis
- **Image Dataset**: 1,700+ images categorized by disease
- **Training Data**: Ready for AI model fine-tuning

### Blockchain Development

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

## 🧪 Testing

### Run All Tests
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

### API Testing
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

## 📊 API Documentation

### Backend API
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI Spec**: http://localhost:8080/v3/api-docs

### AI Service API
- **FastAPI Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔐 Security Features

### **Authentication & Authorization**
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for owners, vets, trainers
- **Rate Limiting**: API rate limiting to prevent abuse
- **Data Encryption**: Sensitive data encrypted at rest and in transit

### **Blockchain Security & Digital Health Records (DHRs)**
- **Immutable Medical Records**: Tamper-proof storage using blockchain hashes
- **Cryptographic Verification**: SHA-256 hashing for medical record integrity
- **Smart Contract Security**: Automated verification of record authenticity
- **Transparent Audit Trail**: Public verification of medical record changes
- **Regulatory Compliance**: Meets healthcare data integrity requirements
- **Cost-Effective**: Hybrid approach with full data in PostgreSQL, hashes on blockchain
- **Real-Time Verification**: Fast verification using Polygon network (2-3 seconds)
- **Decentralized Security**: No single point of failure for medical record verification

## 📊 System Features

### ✅ **IMPLEMENTED**
- **Database Architecture**: PostgreSQL, MongoDB 8.0+, Redis 7.x
- **AI Service**: Dr. Salus conversational AI with multi-modal support
- **Smart Provider Recommendations**: AI-powered geolocation-based vet, hospital, clinic, and trainer matching
- **Service Type Intelligence**: Automatic detection of online, in-person, and home visit services
- **Training Intelligence**: AI-powered trainer recommendations with behavioral specialization matching
- **Dataset Integration**: 5 CSV datasets + 1,700+ images for AI training
- **Blockchain Integration**: Smart contracts for Digital Health Records (DHRs)
- **Hybrid Data Storage**: PostgreSQL for full data, blockchain for immutable hashes
- **Environment Configuration**: Production-ready configuration with blockchain support
- **Documentation**: Comprehensive setup and enhancement guides

### 🚀 **ENHANCED FEATURES**
- **Persistent Session Management**: MongoDB + Redis caching
- **User Context Integration**: Pet data and authentication integration
- **Dataset Processing**: AI-powered symptom analysis and recommendations
- **Multi-modal Processing**: Advanced image and speech processing
- **Blockchain Verification**: Real-time medical record authenticity verification
- **Smart Contract Integration**: Automated DHR storage and verification

### 🎯 **PRODUCTION READY**
- **Docker Deployment**: Full containerization with Redis 7.x
- **Advanced AI Features**: Emergency detection, treatment recommendations
- **Performance Optimization**: Caching and response time improvements
- **Blockchain Production**: Polygon network deployment for cost-effective DHRs
- **Hybrid Architecture**: Optimized data storage with blockchain security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---

**Made with ❤️ for pets and their humans**
