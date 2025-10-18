# Chat History Implementation Guide

## Overview

This document describes the comprehensive chat history implementation for the Zoodo AI Veterinary Assistant. The system now supports persistent chat history that remembers conversations across sessions, similar to ChatGPT's behavior when not logged in.

## Architecture

### Database Strategy
- **MongoDB**: Long-term storage for chat sessions and messages
- **Redis**: Fast caching and session state management
- **Hybrid Approach**: Redis for fast access, MongoDB for persistence

### Key Features
- ✅ Persistent chat history across sessions
- ✅ Session management with TTL
- ✅ Automatic cleanup of old sessions
- ✅ Fast message retrieval from Redis
- ✅ Fallback to MongoDB for complete history
- ✅ Emergency detection and logging
- ✅ Pet profile persistence
- ✅ Location and consultation state tracking

## Database Schema

### MongoDB Collections

#### 1. chat_sessions
```json
{
  "_id": "ObjectId",
  "user_id": "string",
  "session_id": "string",
  "pet_profile": {
    "species": "string",
    "breed": "string",
    "age": "string",
    "weight": "string",
    "gender": "string",
    "name": "string",
    "medical_history": ["array"],
    "current_symptoms": ["array"],
    "medications": ["array"]
  },
  "location": {
    "city": "string",
    "country": "string",
    "location_set": "boolean"
  },
  "is_active": "boolean",
  "created_at": "datetime",
  "last_activity": "datetime",
  "ended_at": "datetime",
  "message_count": "number"
}
```

#### 2. chat_messages
```json
{
  "_id": "ObjectId",
  "session_id": "string",
  "user_id": "string",
  "message": "string",
  "message_type": "string", // "user" or "assistant"
  "metadata": {
    "timestamp": "string",
    "pet_profile": "object",
    "emergency_detected": "boolean",
    "test_message": "boolean"
  },
  "timestamp": "datetime"
}
```

#### 3. user_sessions
```json
{
  "_id": "ObjectId",
  "user_id": "string",
  "session_key": "string",
  "session_data": "object",
  "created_at": "datetime",
  "last_updated": "datetime"
}
```

### Redis Keys

#### Session State
- `session:state:{user_id}_{session_id}` - Complete session state
- TTL: 24 hours

#### Chat Messages
- `chat:messages:{session_id}` - List of messages for session
- TTL: 7 days
- Limit: 100 messages per session

#### Chat History
- `chat:history:{user_id}:{session_id}` - Complete chat history
- TTL: 24 hours

## API Endpoints

### Chat History Management

#### GET /chat/history
Get chat history for a session
```bash
curl -X GET "http://localhost:8000/chat/history?session_id=test_session_123&limit=50" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### GET /chat/sessions
Get user's chat sessions
```bash
curl -X GET "http://localhost:8000/chat/sessions?limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### POST /chat/session/end
End a chat session
```bash
curl -X POST "http://localhost:8000/chat/session/end?session_id=test_session_123" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### POST /chat/session/extend
Extend session TTL
```bash
curl -X POST "http://localhost:8000/chat/session/extend?session_id=test_session_123" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### GET /chat/session/{session_id}/messages
Get messages for a specific session
```bash
curl -X GET "http://localhost:8000/chat/session/test_session_123/messages?limit=50&offset=0" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Admin Endpoints

#### POST /admin/cleanup/sessions
Clean up old sessions (Admin only)
```bash
curl -X POST "http://localhost:8000/admin/cleanup/sessions?days_old=30" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### GET /admin/stats/sessions
Get session statistics (Admin only)
```bash
curl -X GET "http://localhost:8000/admin/stats/sessions" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Usage Examples

### Basic Chat with History
```python
from utils.conversational_ai_vet import ConversationalAIVet
from utils.mongodb_manager import MongoDBManager
from utils.redis_manager import RedisManager

# Initialize
mongo_manager = MongoDBManager()
redis_manager = RedisManager()
await mongo_manager.initialize()
await redis_manager.initialize()

ai_vet = ConversationalAIVet(mongo_manager, redis_manager)
await ai_vet.initialize()

# Create session
user_id = "user_123"
session_id = "session_456"
await ai_vet.create_persistent_session(user_id, session_id)

# Chat
response = await ai_vet.chat("My dog is not eating")
print(response)

# Save messages
await ai_vet.save_chat_message_to_databases(
    user_id=user_id,
    session_id=session_id,
    message="My dog is not eating",
    message_type="user"
)

await ai_vet.save_chat_message_to_databases(
    user_id=user_id,
    session_id=session_id,
    message=response,
    message_type="assistant"
)

# Get chat history
messages = await ai_vet.get_chat_history_from_databases(session_id)
print(f"Retrieved {len(messages)} messages")
```

### Session Management
```python
# Get user sessions
sessions = await ai_vet.get_user_sessions(user_id, limit=10)

# End session
await ai_vet.end_session(user_id, session_id)

# Extend session TTL
await ai_vet.extend_session_ttl(user_id, session_id)
```

## Configuration

### Environment Variables
```bash
# MongoDB
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=zoodo_ai

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=your_password

# Session TTL (seconds)
SESSION_TTL=86400  # 24 hours
MESSAGE_TTL=604800  # 7 days
```

### Data Retention Policies
- **Active Sessions**: 24 hours TTL in Redis
- **Chat Messages**: 7 days TTL in Redis, permanent in MongoDB
- **Session Cleanup**: Automatic cleanup of sessions older than 7 days
- **Background Cleanup**: Runs every hour

## Testing

### Run Test Script
```bash
cd ai-service
python test_chat_history.py
```

### Test Coverage
- ✅ Session creation and management
- ✅ Message storage in MongoDB and Redis
- ✅ Chat history retrieval
- ✅ Session state persistence
- ✅ Session cleanup
- ✅ API endpoint functionality

## Performance Considerations

### Redis Optimization
- Messages limited to 100 per session
- TTL-based automatic cleanup
- Efficient key naming conventions
- Connection pooling

### MongoDB Optimization
- Proper indexing on frequently queried fields
- Compound indexes for complex queries
- Efficient data structure design
- Connection pooling

### Memory Management
- Background cleanup tasks
- Configurable TTL values
- Session state compression
- Efficient data serialization

## Security Considerations

### Data Protection
- JWT token authentication required
- User isolation (sessions are user-specific)
- Input validation and sanitization
- Rate limiting on API endpoints

### Privacy
- No personal data stored in chat messages
- Pet information anonymized where possible
- Configurable data retention periods
- Secure session management

## Monitoring and Analytics

### Metrics Tracked
- Active session count
- Message volume per session
- Session duration
- Emergency detection frequency
- Cleanup operation statistics

### Health Checks
- Database connection status
- Redis memory usage
- Session TTL monitoring
- Background task status

## Troubleshooting

### Common Issues

#### Session Not Persisting
- Check Redis connection
- Verify TTL settings
- Check session key format

#### Messages Not Saving
- Verify MongoDB connection
- Check collection permissions
- Validate message format

#### Performance Issues
- Monitor Redis memory usage
- Check MongoDB query performance
- Review index usage

### Debug Commands
```bash
# Check Redis keys
redis-cli keys "chat:*"

# Check MongoDB collections
mongo zoodo_ai --eval "db.chat_sessions.count()"

# Check session stats
curl -X GET "http://localhost:8000/admin/stats/sessions" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Future Enhancements

### Planned Features
- [ ] Message search functionality
- [ ] Conversation export (PDF/JSON)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Voice message support
- [ ] Image attachment history
- [ ] Conversation sharing
- [ ] Advanced filtering options

### Scalability Improvements
- [ ] Redis clustering support
- [ ] MongoDB sharding
- [ ] Message archiving to cold storage
- [ ] CDN integration for file attachments
- [ ] Load balancing for high availability

## Conclusion

The chat history implementation provides a robust, scalable solution for persistent conversations in the Zoodo AI Veterinary Assistant. The hybrid MongoDB/Redis approach ensures both performance and reliability, while the comprehensive API allows for flexible integration with frontend applications.

The system is designed to handle high-volume usage while maintaining data integrity and user privacy. Regular cleanup tasks and configurable retention policies ensure optimal resource utilization.

For questions or issues, please refer to the test script and API documentation, or contact the development team.
