# Backend Setup Instructions

## Prerequisites
- Java 24.0.1 or later
- Maven (included with the project)
- PostgreSQL database

## Database Setup

1. **Install PostgreSQL** (if not already installed)
   - Download from: https://www.postgresql.org/download/
   - Create a database named `zoodo`

2. **Initialize Database**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE zoodo;
   
   # Connect to the database
   \c zoodo
   
   # Run the initialization script
   \i db/init.sql
   ```

## Running the Backend

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Start the Spring Boot application**
   ```bash
   # Using Maven wrapper (recommended)
   ./mvnw spring-boot:run
   
   # Or using Maven directly
   mvn spring-boot:run
   ```

3. **Verify the backend is running**
   - Open http://localhost:8080/ in your browser
   - You should see: `{"success": true, "message": "Zoodo Backend API", "data": "Welcome to Zoodo Backend API"}`
   - Health check: http://localhost:8080/health

## API Endpoints

### Health Check
- `GET /health` - Backend health status

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Pets
- `GET /api/pets` - Get all pets
- `GET /api/pets/{id}` - Get pet by ID
- `POST /api/pets` - Create new pet
- `PUT /api/pets/{id}` - Update pet
- `DELETE /api/pets/{id}` - Delete pet

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/{id}` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/{id}` - Update appointment
- `DELETE /api/appointments/{id}` - Delete appointment

## Configuration

The backend configuration is in `backend/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/zoodo
spring.datasource.username=postgres
spring.datasource.password=root

# Server
server.port=8080

# CORS (for frontend integration)
spring.web.cors.allowed-origins=http://localhost:3000
```

## Troubleshooting

1. **Port 8080 already in use**
   - Change `server.port` in `application.properties`
   - Update frontend API_BASE_URL accordingly

2. **Database connection failed**
   - Verify PostgreSQL is running
   - Check database credentials in `application.properties`
   - Ensure database `zoodo` exists

3. **CORS errors from frontend**
   - Verify CORS configuration in `application.properties`
   - Check that frontend is running on http://localhost:3000

## Development Tips

- The backend uses Spring Boot 3.5.4 with Java 24
- JPA/Hibernate for database operations
- Spring Security for authentication (currently disabled for development)
- Lombok for reducing boilerplate code
- UUIDs for all entity IDs 