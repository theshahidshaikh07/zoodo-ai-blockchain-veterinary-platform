# Zoodo AI Blockchain Veterinary Platform - Project Structure

## 📁 Project Overview
This is a comprehensive veterinary platform with AI assistance, blockchain integration, and multi-user dashboards.

## 🏗️ Directory Structure

```
zoodo-ai-blockchain-veterinary-platform/
├── 📁 ai-service/                    # AI/ML Service
│   ├── 📁 app/                      # Main application code
│   ├── 📁 datasets/                 # Training datasets
│   ├── 📄 requirements.txt          # Python dependencies
│   ├── 📄 Dockerfile               # AI service container
│   └── 📄 README.md                # AI service documentation
│
├── 📁 backend/                      # Spring Boot Backend
│   ├── 📁 src/main/java/           # Java source code
│   │   └── 📁 com/zoodo/backend/
│   │       ├── 📁 config/          # Configuration classes
│   │       ├── 📁 controller/      # REST controllers
│   │       ├── 📁 dto/             # Data Transfer Objects
│   │       ├── 📁 model/           # JPA entities
│   │       ├── 📁 repository/      # Data repositories
│   │       ├── 📁 service/         # Business logic
│   │       └── 📁 util/            # Utility classes
│   ├── 📁 src/main/resources/      # Configuration files
│   ├── 📁 uploads/                 # File upload storage
│   ├── 📄 pom.xml                  # Maven configuration
│   ├── 📄 Dockerfile              # Backend container
│   └── 📄 test-*.ps1              # Test scripts
│
├── 📁 blockchain/                   # Blockchain Integration
│   ├── 📁 contracts/               # Smart contracts
│   ├── 📄 hardhat.config.js        # Hardhat configuration
│   ├── 📄 Dockerfile              # Blockchain container
│   └── 📄 README.md               # Blockchain documentation
│
├── 📁 db/                          # Database Schema
│   ├── 📄 schema.sql              # Main database schema
│   └── 📄 README.md               # Database documentation
│
├── 📁 docs/                        # Documentation
│   ├── 📁 guides/                 # Setup and usage guides
│   ├── 📄 api-docs.md             # API documentation
│   ├── 📄 architecture.md         # System architecture
│   └── 📄 PROJECT_STRUCTURE.md    # This file
│
├── 📁 devops/                      # DevOps Configuration
│   ├── 📄 Dockerfile              # DevOps container
│   ├── 📄 nginx.conf              # Nginx configuration
│   └── 📄 README.md               # DevOps documentation
│
├── 📁 frontend/                    # Next.js Frontend
│   ├── 📁 src/
│   │   ├── 📁 app/                # Next.js app router
│   │   ├── 📁 components/         # React components
│   │   │   ├── 📁 auth/           # Authentication components
│   │   │   ├── 📁 shared/         # Shared components
│   │   │   ├── 📁 pet-owner/      # Pet owner components
│   │   │   ├── 📁 veterinarian/   # Veterinarian components
│   │   │   ├── 📁 trainer/        # Trainer components
│   │   │   └── 📁 hospital/       # Hospital components
│   │   ├── 📁 contexts/           # React contexts
│   │   ├── 📁 hooks/              # Custom hooks
│   │   ├── 📁 lib/                # Utility libraries
│   │   └── 📁 types/              # TypeScript types
│   ├── 📁 public/                 # Static assets
│   ├── 📄 package.json            # Node.js dependencies
│   ├── 📄 Dockerfile             # Frontend container
│   └── 📄 README.md              # Frontend documentation
│
├── 📁 mobile-app/                  # Mobile Application
│   ├── 📄 App.js                  # Main mobile app
│   └── 📄 package.json            # Mobile dependencies
│
├── 📄 docker-compose.yml          # Docker orchestration
├── 📄 README.md                   # Main project documentation
└── 📄 LICENSE                     # Project license
```

## 🎯 Key Components

### 🔐 Authentication System
- **Backend**: JWT-based authentication with Spring Security
- **Frontend**: React context-based auth state management
- **Features**: Login/logout, profile management, password changes

### 👥 User Types & Dashboards
1. **Pet Owners**: Pet management, appointment booking
2. **Veterinarians**: Professional profile, document management
3. **Trainers**: Training services, academy management
4. **Hospitals/Clinics**: Business management, compliance

### 🤖 AI Service
- **Conversational AI**: Veterinary assistant chatbot
- **Training**: Custom veterinary dataset training
- **Integration**: REST API for AI responses

### ⛓️ Blockchain Integration
- **Smart Contracts**: Medical records on blockchain
- **Security**: Immutable record storage
- **Transparency**: Decentralized data access

### 🗄️ Database
- **PostgreSQL**: Main database
- **Schema**: Clean, normalized structure
- **Features**: User management, appointments, medical records

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (for frontend development)
- Java 17+ (for backend development)
- Python 3.8+ (for AI service development)

### Quick Start
1. Clone the repository
2. Run `docker-compose up` to start all services
3. Access the application at `http://localhost:3000`

### Development Setup
See individual README files in each service directory for detailed setup instructions.

## 📚 Documentation
- **API Documentation**: `docs/api-docs.md`
- **Architecture**: `docs/architecture.md`
- **Setup Guides**: `docs/guides/`
- **Project Structure**: `docs/PROJECT_STRUCTURE.md` (this file)

## 🔧 Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Database**: PostgreSQL
- **Security**: Spring Security + JWT
- **Build Tool**: Maven

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components

### AI Service
- **Language**: Python
- **Framework**: FastAPI
- **ML**: Custom veterinary AI models
- **Database**: MongoDB (for AI data)

### Blockchain
- **Platform**: Ethereum
- **Framework**: Hardhat
- **Language**: Solidity

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Web Server**: Nginx
- **CI/CD**: GitHub Actions (planned)

## 📝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
