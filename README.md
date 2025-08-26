# 🐾 Zoodo - AI & Blockchain-Powered Veterinary Platform 
## 🚧 This project is currently **in progress** and under active development. Features, structure, and documentation may change frequently.

A comprehensive digital ecosystem for pet healthcare that unites pet owners, veterinarians, trainers, and welfare communities under a single, intelligent system.

## 🌟 Features

### 🤖 AI-Powered Pet Care Assistant
- **Symptom Analysis**: Intelligent analysis of pet symptoms with urgency assessment
- **Provider Recommendations**: AI-driven matching of pets with suitable veterinarians and trainers
- **Care Routines**: Personalized care and diet recommendations based on breed, age, and health conditions
- **Emergency Assessment**: Real-time emergency evaluation with immediate action recommendations

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

# OpenAI API (for AI features)
OPENAI_API_KEY=your-openai-api-key

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

```
zoodo-ai-blockchain-veterinary-platform/
├── frontend/                 # Next.js + TypeScript frontend
│   ├── src/
│   │   ├── app/             # Next.js app router
│   │   ├── components/      # Reusable UI components
│   │   ├── features/        # Feature-specific components
│   │   └── lib/             # Utilities and configurations
│   └── package.json
├── backend/                  # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/zoodo/backend/
│   │       ├── controller/  # REST API controllers
│   │       ├── service/     # Business logic
│   │       ├── model/       # Data models
│   │       └── repository/  # Data access layer
│   └── pom.xml
├── ai_service/              # Python FastAPI AI service
│   ├── app/
│   │   ├── main.py         # FastAPI application
│   │   ├── models/         # Pydantic models
│   │   ├── routers/        # API routes
│   │   └── utils/          # AI engine, blockchain client
│   └── requirements.txt
├── blockchain/              # Smart contracts
│   ├── contracts/           # Solidity smart contracts
│   ├── scripts/             # Deployment scripts
│   └── hardhat.config.js
├── db/                      # Database
│   ├── init.sql            # Database schema
│   ├── migrations/         # Database migrations
│   └── seeders/            # Sample data
├── devops/                  # Infrastructure
│   ├── nginx.conf          # Nginx configuration
│   └── scripts/            # Deployment scripts
└── docker-compose.yml       # Service orchestration
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

# Test AI service
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
- `OPENAI_API_KEY`: OpenAI API key for AI features
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

## 🆘 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-username/zoodo-ai-blockchain-veterinary-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/zoodo-ai-blockchain-veterinary-platform/discussions)

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- Ethereum Foundation for blockchain technology
- Spring Boot team for the backend framework
- Next.js team for the frontend framework
- All contributors and supporters

---

**Made with ❤️ for pets and their humans**
