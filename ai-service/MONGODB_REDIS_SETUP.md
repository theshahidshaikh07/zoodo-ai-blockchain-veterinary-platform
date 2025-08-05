# MongoDB and Redis Setup for AI Service

This document describes the MongoDB and Redis configuration for the Zoodo AI Service.

## Overview

The AI Service now uses:
- **MongoDB**: For storing AI recommendations, user interactions, and analytics data
- **Redis**: For caching, session management, and real-time data

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Service    │    │    MongoDB      │    │     Redis       │
│   (FastAPI)     │◄──►│   (Document DB) │    │   (Cache/Queue) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
   ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
   │ AI Analysis │       │ AI Results  │       │ User Sessions│
   │ Symptom     │       │ User Data   │       │ Cache        │
   │ Provider    │       │ Analytics   │       │ Rate Limits  │
   │ Care        │       │ Interactions│       │ Real-time    │
   └─────────────┘       └─────────────┘       └─────────────┘
```

## MongoDB Collections

### 1. `ai_recommendations`
Stores AI-generated recommendations and analyses.

**Fields:**
- `user_id`: User identifier
- `pet_id`: Pet identifier (optional)
- `recommendation_type`: Type of recommendation
- `symptoms`: Reported symptoms
- `analysis_result`: AI analysis result
- `urgency_level`: Urgency assessment
- `confidence_score`: AI confidence level
- `recommended_providers`: List of recommended providers
- `care_instructions`: Care instructions
- `diet_recommendations`: Diet recommendations
- `created_at`: Timestamp
- `updated_at`: Last update timestamp

### 2. `user_interactions`
Tracks user interactions with the AI service.

**Fields:**
- `user_id`: User identifier
- `interaction_type`: Type of interaction
- `interaction_data`: Interaction details
- `timestamp`: Interaction timestamp

### 3. `symptom_analyses`
Stores detailed symptom analysis results.

**Fields:**
- `user_id`: User identifier
- `pet_id`: Pet identifier
- `symptoms`: Array of symptoms
- `analysis_result`: Complete analysis result
- `created_at`: Timestamp

### 4. `provider_recommendations`
Stores provider recommendation data.

**Fields:**
- `user_id`: User identifier
- `pet_id`: Pet identifier
- `recommendation_data`: Complete recommendation data
- `created_at`: Timestamp

### 5. `care_routines`
Stores personalized care routine recommendations.

**Fields:**
- `user_id`: User identifier
- `pet_id`: Pet identifier
- `care_data`: Complete care routine data
- `created_at`: Timestamp

### 6. `emergency_assessments`
Stores emergency assessment data.

**Fields:**
- `user_id`: User identifier
- `pet_id`: Pet identifier
- `assessment_data`: Emergency assessment data
- `created_at`: Timestamp

### 7. `ai_models_cache`
Caches AI model results for performance.

**Fields:**
- `model_name`: AI model name
- `input_hash`: Hash of input data
- `input_data`: Original input data
- `result`: Model result
- `created_at`: Timestamp
- `expires_at`: Expiration timestamp

### 8. `analytics`
Stores analytics and metrics data.

**Fields:**
- `metric_type`: Type of metric
- `date`: Date of metric
- `value`: Metric value
- `created_at`: Timestamp

## Redis Key Structure

### 1. AI Cache (`ai:cache:`)
```
ai:cache:{cache_key}
```

### 2. User Sessions (`user:session:`)
```
user:session:{user_id}
```

### 3. User Interactions (`user:interaction:`)
```
user:interaction:{user_id}:{timestamp}
user:interaction:recent:{user_id}  # List of recent interactions
```

### 4. Model Results (`model:result:`)
```
model:result:{model_name}:{input_hash}
```

### 5. Emergency Queue (`emergency:queue:`)
```
emergency:queue:cases  # List of emergency cases
```

### 6. Analytics (`analytics:`)
```
analytics:{metric_name}:{date}
```

### 7. Rate Limits (`rate:limit:`)
```
rate:limit:{identifier}
```

### 8. Real-time Events (`realtime:`)
```
realtime:{channel}
```

## Environment Variables

### MongoDB Configuration
```bash
MONGO_URI=mongodb://admin:password@mongodb:27017/zoodo_ai?authSource=admin
MONGO_DB_NAME=zoodo_ai
```

### Redis Configuration
```bash
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=  # Optional
```

## Docker Setup

The services are configured in `docker-compose.yml`:

```yaml
# MongoDB
mongodb:
  image: mongo:7.0
  environment:
    MONGO_INITDB_ROOT_USERNAME: admin
    MONGO_INITDB_ROOT_PASSWORD: password
    MONGO_INITDB_DATABASE: zoodo_ai

# Redis
redis:
  image: redis:7-alpine
```

## API Endpoints

### New Endpoints

1. **GET /user/recommendations**
   - Get AI recommendations for authenticated user
   - Returns recommendations from MongoDB

2. **GET /user/interactions**
   - Get recent user interactions
   - Returns interactions from Redis

3. **GET /analytics/daily**
   - Get daily analytics data
   - Returns metrics from Redis

## Performance Features

### 1. Caching Strategy
- **AI Results**: Cached in Redis for 1-2 hours
- **User Sessions**: Cached for 24 hours
- **Provider Recommendations**: Cached for 30 minutes
- **Community Events**: Cached for 30 minutes

### 2. Rate Limiting
- **Symptom Analysis**: 10 requests per hour
- **Provider Recommendations**: 20 requests per hour
- **Care Routines**: 5 requests per hour
- **Emergency Assessments**: 50 requests per hour

### 3. Indexes
MongoDB collections have optimized indexes for:
- User-based queries
- Time-based sorting
- Recommendation types
- Emergency assessments

## Testing

Run the test script to verify the setup:

```bash
cd ai_service
python test_mongodb_redis.py
```

## Monitoring

### Health Check Endpoint
```
GET /health
```

Returns:
```json
{
  "status": "healthy",
  "ai_engine": true,
  "blockchain": true,
  "mongodb": true,
  "redis": true
}
```

### Metrics to Monitor
1. **MongoDB**
   - Connection status
   - Query performance
   - Storage usage

2. **Redis**
   - Memory usage
   - Cache hit rate
   - Connection count

## Security Considerations

1. **Authentication**: MongoDB uses username/password authentication
2. **Network**: Services communicate over internal Docker network
3. **Data Encryption**: Consider enabling TLS for production
4. **Access Control**: Implement proper role-based access control

## Backup Strategy

### MongoDB
- Regular database dumps
- Point-in-time recovery
- Replica set for high availability

### Redis
- RDB snapshots
- AOF persistence
- Redis Cluster for scaling

## Scaling Considerations

### MongoDB
- Sharding for horizontal scaling
- Read replicas for read-heavy workloads
- Connection pooling

### Redis
- Redis Cluster for horizontal scaling
- Sentinel for high availability
- Memory optimization

## Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Check network connectivity
   - Verify service health
   - Check credentials

2. **Memory Issues**
   - Monitor Redis memory usage
   - Adjust cache TTL settings
   - Implement eviction policies

3. **Performance Issues**
   - Check MongoDB indexes
   - Monitor query performance
   - Optimize cache strategies

### Logs
- MongoDB logs: `docker logs zoodo_mongodb`
- Redis logs: `docker logs zoodo_redis`
- AI Service logs: `docker logs zoodo_ai_service` 