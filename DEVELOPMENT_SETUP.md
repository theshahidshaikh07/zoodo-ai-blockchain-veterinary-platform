# 🚀 Zoodo Development Setup Guide

## 📋 Prerequisites

Before starting development, ensure you have the following installed:

- **Java 21+** (for Spring Boot backend)
- **Node.js 18+** (for Next.js frontend)
- **PostgreSQL 15+** (for database)
- **Maven 3.6+** (for Java dependencies)
- **Git** (for version control)

## 🗄️ Database Setup

### 1. Install PostgreSQL
```bash
# Windows (using Chocolatey)
choco install postgresql

# macOS (using Homebrew)
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL service
# Windows: Start PostgreSQL service from Services
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### 2. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE zoodo;
CREATE USER zoodo_user WITH PASSWORD 'zoodo_password';
GRANT ALL PRIVILEGES ON DATABASE zoodo TO zoodo_user;

# Exit psql
\q
```

### 3. Initialize Database Schema
```bash
# Run the initialization script
psql -U postgres -d zoodo -f db/init.sql
```

## 🔧 Backend Setup (Spring Boot)

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Update Database Configuration
Edit `src/main/resources/application.properties`:
```properties
# Update these values to match your local setup
spring.datasource.url=jdbc:postgresql://localhost:5432/zoodo
spring.datasource.username=zoodo_user
spring.datasource.password=zoodo_password
```

### 3. Install Dependencies and Run
```bash
# Install dependencies
./mvnw clean install

# Run the application
./mvnw spring-boot:run

# Or run with Maven
mvn spring-boot:run
```

### 4. Verify Backend
- Backend API will be available at: `http://localhost:8080`
- Health check: `http://localhost:8080/actuator/health`
- API documentation: `http://localhost:8080/api/register`

## 🎨 Frontend Setup (Next.js)

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Verify Frontend
- Frontend will be available at: `http://localhost:3000`
- Registration pages:
  - Pet Owner: `http://localhost:3000/register/pet-owner`
  - Veterinarian: `http://localhost:3000/register/veterinarian`
  - Trainer: `http://localhost:3000/register/trainer`

## 🧪 Testing the Registration System

### 1. Test Pet Owner Registration
```bash
curl -X POST http://localhost:8080/api/register/pet-owner \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testowner123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "phoneNumber": "+1234567890",
    "address": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "country": "USA",
    "postalCode": "12345",
    "pets": [
      {
        "name": "Buddy",
        "species": "Dog",
        "breed": "Golden Retriever",
        "gender": "male",
        "birthday": "2020-01-15",
        "age": 4,
        "ageUnit": "Years",
        "weight": 25.5,
        "weightUnit": "Kgs",
        "microchip": "CHIP123456",
        "sterilized": "yes"
      }
    ]
  }'
```

### 2. Test Veterinarian Registration
```bash
# Create JSON file first
cat > vet_data.json << 'EOF'
{
  "username": "dr.smith123",
  "firstName": "Dr. Sarah",
  "lastName": "Smith",
  "email": "dr.smith@example.com",
  "password": "password123",
  "phoneNumber": "+1234567890",
  "address": "456 Oak Ave",
  "licenseNumber": "VET789012",
  "experience": 5,
  "specialization": ["General Veterinary Practice", "Surgery"],
  "qualifications": ["BVSc & AH", "MVSc"],
  "isAffiliated": false,
  "offerOnlineConsultation": true,
  "offerHomeVisits": true,
  "homeVisitRadius": 20
}
EOF

# Create dummy files
echo "dummy content" > license.pdf
echo "dummy content" > id.pdf
echo "dummy content" > degree.pdf
echo "dummy content" > photo.jpg

# Test registration
curl -X POST http://localhost:8080/api/register/veterinarian \
  -F "registrationData=@vet_data.json" \
  -F "licenseProof=@license.pdf" \
  -F "idProof=@id.pdf" \
  -F "degreeProof=@degree.pdf" \
  -F "profilePhoto=@photo.jpg"
```

### 3. Test Trainer Registration
```bash
# Create JSON file
cat > trainer_data.json << 'EOF'
{
  "username": "trainer.jane123",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "trainer.doe@example.com",
  "password": "password123",
  "phoneNumber": "+1234567890",
  "address": "789 Pine St",
  "experience": 3,
  "specialization": ["Basic Obedience Training", "Behavioral Modification"],
  "certifications": ["Certified Professional Dog Trainer (CPDT)"],
  "offerOnlineTraining": true,
  "offerHomeTraining": true,
  "homeTrainingRadius": 15,
  "hasAcademy": false
}
EOF

# Create dummy files
echo "dummy content" > resume.pdf
echo "dummy content" > trainer_photo.jpg

# Test registration
curl -X POST http://localhost:8080/api/register/trainer \
  -F "registrationData=@trainer_data.json" \
  -F "resume=@resume.pdf" \
  -F "profilePhoto=@trainer_photo.jpg"
```

## 🔍 Verify Database

### 1. Connect to Database
```bash
psql -U postgres -d zoodo
```

### 2. Check Tables
```sql
-- Check users
SELECT username, email, user_type, created_at FROM users ORDER BY created_at DESC;

-- Check veterinarians
SELECT v.id, u.username, v.license_number, v.experience 
FROM veterinarians v 
JOIN users u ON v.user_id = u.id;

-- Check trainers
SELECT t.id, u.username, t.experience, t.specializations 
FROM trainers t 
JOIN users u ON t.user_id = u.id;

-- Check pets
SELECT p.name, p.species, p.breed, u.username as owner 
FROM pets p 
JOIN users u ON p.owner = u.id;
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check if PostgreSQL is running
   - Verify database credentials in `application.properties`
   - Ensure database `zoodo` exists

2. **Port Already in Use**
   - Backend (8080): Change port in `application.properties`
   - Frontend (3000): Use `npm run dev -- -p 3001`

3. **Maven Build Issues**
   - Clean and rebuild: `./mvnw clean install`
   - Check Java version: `java -version`

4. **Node.js Issues**
   - Clear cache: `npm cache clean --force`
   - Delete node_modules: `rm -rf node_modules && npm install`

## 📝 Development Workflow

1. **Start Database**: Ensure PostgreSQL is running
2. **Start Backend**: `cd backend && ./mvnw spring-boot:run`
3. **Start Frontend**: `cd frontend && npm run dev`
4. **Test APIs**: Use curl commands or Postman
5. **Check Database**: Verify data persistence
6. **Make Changes**: Edit code and restart services as needed

## 🚀 Next Steps

Once development is complete, you can enable Docker by:
1. Uncommenting the services in `docker-compose.yml`
2. Running `docker-compose up -d`
3. All services will be containerized and orchestrated

---

**Happy Coding! 🎉**
