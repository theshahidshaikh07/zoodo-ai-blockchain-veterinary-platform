# 🐳 Docker Activation Guide

## 📋 When to Enable Docker

Docker should be enabled **AFTER** completing the following development milestones:

- ✅ **Backend API Development Complete**
  - All registration endpoints working
  - Database integration tested
  - File upload functionality working
  - Authentication system implemented

- ✅ **Frontend Development Complete**
  - All registration forms functional
  - API integration working
  - User interface polished
  - Error handling implemented

- ✅ **Database Schema Finalized**
  - All tables created and tested
  - Data relationships working
  - Indexes optimized
  - Sample data populated

- ✅ **Testing Complete**
  - Unit tests passing
  - Integration tests working
  - Manual testing completed
  - Performance testing done

## 🚀 How to Activate Docker

### Step 1: Uncomment Docker Compose
```bash
# Edit docker-compose.yml
# Remove the # comments from all services
# The file is currently commented out for development
```

### Step 2: Update Configuration
```bash
# Update backend application.properties for Docker
# Change database URL to use Docker service names
spring.datasource.url=jdbc:postgresql://postgres:5432/zoodo
spring.datasource.username=postgres
spring.datasource.password=password
```

### Step 3: Build and Start Services
```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# Check service status
docker-compose ps
```

### Step 4: Verify Services
```bash
# Check service health
docker-compose ps

# View logs
docker-compose logs -f

# Test endpoints
curl http://localhost:8080/actuator/health
curl http://localhost:3000
```

## 🔧 Docker Services Overview

When activated, Docker will provide:

| Service | Port | Description |
|---------|------|-------------|
| **Frontend** | 3000 | Next.js React application |
| **Backend** | 8080 | Spring Boot REST API |
| **Database** | 5432 | PostgreSQL database |
| **AI Service** | 8000 | Python FastAPI service |
| **Blockchain** | 8545 | Hardhat Ethereum network |
| **Redis** | 6379 | Caching service |
| **MongoDB** | 27017 | AI service database |
| **Nginx** | 80/443 | Reverse proxy |

## 📊 Monitoring and Management

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Stop Services
```bash
# Stop services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

### Update Services
```bash
# Rebuild and restart
docker-compose up --build -d

# Pull latest images
docker-compose pull
```

## 🔍 Health Checks

Docker services include health checks:

```bash
# Check health status
docker-compose ps

# Should show "healthy" for all services
```

## 🚨 Important Notes

### Before Enabling Docker:
1. **Backup your local database** if you have important data
2. **Test all functionality** in development mode
3. **Update environment variables** for production
4. **Review security settings** for production deployment

### After Enabling Docker:
1. **Monitor resource usage** (CPU, memory, disk)
2. **Set up log rotation** for production
3. **Configure backup strategies** for databases
4. **Set up monitoring** (Prometheus, Grafana)

## 🎯 Quick Activation Commands

```bash
# 1. Uncomment docker-compose.yml
# 2. Start services
docker-compose up -d

# 3. Check status
docker-compose ps

# 4. View logs
docker-compose logs -f

# 5. Test endpoints
curl http://localhost:8080/actuator/health
curl http://localhost:3000
```

## 📝 Development vs Production

### Development Mode (Current)
- Local PostgreSQL database
- Manual service startup
- Direct port access
- Development configurations

### Production Mode (Docker)
- Containerized services
- Orchestrated startup
- Load balancing
- Production configurations
- Health monitoring
- Auto-restart on failure

---

**Ready to containerize? Follow the steps above when development is complete! 🚀**
