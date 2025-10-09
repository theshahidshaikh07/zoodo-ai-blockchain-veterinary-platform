### ⚠️ This project is currently **in progress** and under active development. Features, structure, and documentation may change frequently. ⚠️

# 🐾 Zoodo - AI & Blockchain-Powered Veterinary Platform 

#### 🌐 Live Demo — [https://zoodo.dev](https://zoodo.dev)

A comprehensive digital ecosystem for pet healthcare that unites pet owners, veterinarians, trainers, and welfare communities under a single, intelligent system.

## 🌟 Features

### 🤖 AI-Powered Pet Care Assistant
- **Symptom Analysis**: Intelligent analysis of pet symptoms with urgency assessment using fine-tuned Gemini AI
- **Provider Recommendations**: AI-driven matching of pets with suitable veterinarians and trainers
- **Care Routines**: Personalized care and diet recommendations based on breed, age, and health conditions
- **Emergency Assessment**: Real-time emergency evaluation with immediate action recommendations
- **Custom Training**: Fine-tuned AI models trained on veterinary datasets for specialized pet care

### 🔗 Blockchain Security
- **Medical Records**: Immutable storage of medical records on blockchain
- **Appointment Verification**: Secure appointment records with tamper-proof verification
- **Data Integrity**: Cryptographic verification of all medical data
- **Transparency**: Public verification of medical record authenticity

### 🏥 Multi-Service Platform
- **Appointment Scheduling**: Clinic visits, home visits, and teleconsultations
- **Provider Management**: Verified veterinarians and trainers with ratings and reviews
- **Community Events**: Vaccination drives, adoption camps, and wellness checkups
- **Mobile Accessibility**: Cross-platform mobile application

### 🧠 AI Training & Fine-tuning
- **Custom Dataset Training**: Train AI models on veterinary-specific datasets
- **Gemini Fine-tuning**: Fine-tune Google Gemini AI for specialized pet care
- **Conversational AI**: Advanced chatbot trained on veterinary knowledge
- **Continuous Learning**: AI models improve with more data and feedback

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Service    │
│   (Next.js)     │◄──►│   (Spring Boot) │◄──►│   (FastAPI)     │
│   TypeScript    │    │   Java          │    │   Python        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │   Redis Cache   │    │   Blockchain    │
│   Database      │    │   (Session)     │    │   (Hardhat)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Java 21+ (for local development)
- Python 3.11+ (for local development)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/zoodo-ai-blockchain-veterinary-platform.git
cd zoodo-ai-blockchain-veterinary-platform
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=zoodo
DB_USER=postgres
DB_PASSWORD=password

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Google Gemini AI (for AI features)
GOOGLE_GEMINI_API_KEY=your-gemini-api-key

# Blockchain
BLOCKCHAIN_NETWORK_URL=http://localhost:8545
BLOCKCHAIN_PRIVATE_KEY=your-private-key
BLOCKCHAIN_CONTRACT_ADDRESS=your-contract-address

# Backend URLs
BACKEND_URL=http://localhost:8080
AI_SERVICE_URL=http://localhost:8000
```

### 3. Start All Services
```bash
# Start all services with Docker Compose
docker-compose up -d

# Or start specific services
docker-compose up -d postgres redis
docker-compose up -d backend ai_service
docker-compose up -d frontend blockchain
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **AI Service**: http://localhost:8000
- **Blockchain**: http://localhost:8545
- **Database**: localhost:5432
- **Monitoring**: http://localhost:9090 (Prometheus), http://localhost:3001 (Grafana)

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
cd ai_service
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### AI Model Training & Fine-tuning
```bash
cd ai_service
# Train custom veterinary AI model
python demo_ai_training.py

# Fine-tune Gemini AI with custom dataset
python quick_training_demo.py

# Test conversational AI
python demo_conversational_ai.py
```

### Blockchain Development
```bash
cd blockchain
npm install
npx hardhat node
npx hardhat compile
npx hardhat deploy
```

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

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for owners, vets, trainers
- **Rate Limiting**: API rate limiting to prevent abuse
- **Data Encryption**: Sensitive data encrypted at rest and in transit
- **Blockchain Verification**: Immutable medical records with cryptographic proof

## 🚀 Deployment

### Production Deployment
```bash
# Build and deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Or deploy to cloud platforms
# AWS, Google Cloud, Azure configurations available
```

### Environment Variables
Set these environment variables for production:
- `JWT_SECRET`: Strong secret key for JWT tokens
- `GOOGLE_GEMINI_API_KEY`: Google Gemini API key for AI features
- `DB_PASSWORD`: Strong database password
- `BLOCKCHAIN_PRIVATE_KEY`: Private key for blockchain operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---

**Made with ❤️ for pets and their humans**
