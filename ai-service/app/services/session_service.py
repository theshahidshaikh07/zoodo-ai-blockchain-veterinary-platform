"""
Session Service - Redis-based session management for Dr. Salus AI
Provides fast, scalable session storage with automatic expiration
"""

import redis
import json
import os
from typing import Dict, List, Optional
from datetime import datetime, timedelta

class SessionService:
    def __init__(self):
        """Initialize Redis-based session service"""
        # Get Redis configuration from environment
        redis_host = os.getenv("REDIS_HOST", "localhost")
        redis_port = int(os.getenv("REDIS_PORT", "6379"))
        redis_password = os.getenv("REDIS_PASSWORD", None)
        redis_db = int(os.getenv("REDIS_DB", "0"))
        
        # Session expiration time (24 hours by default)
        self.session_ttl = int(os.getenv("SESSION_TTL", "86400"))  # 24 hours in seconds
        
        try:
            # Connect to Redis
            self.redis_client = redis.Redis(
                host=redis_host,
                port=redis_port,
                password=redis_password,
                db=redis_db,
                decode_responses=True,  # Automatically decode responses to strings
                socket_connect_timeout=5,
                socket_timeout=5
            )
            
            # Test connection
            self.redis_client.ping()
            print(f"✓ Connected to Redis at {redis_host}:{redis_port}")
            self.redis_available = True
            
        except (redis.ConnectionError, redis.TimeoutError) as e:
            print(f"⚠️  Redis connection failed: {str(e)}")
            print("⚠️  Falling back to in-memory session storage")
            self.redis_available = False
            self.fallback_sessions: Dict[str, Dict] = {}
    
    def _get_session_key(self, session_id: str) -> str:
        """Generate Redis key for session"""
        return f"session:{session_id}"
    
    def create_session(self, session_id: str) -> Dict:
        """Create a new conversation session"""
        session_data = {
            "session_id": session_id,
            "created_at": datetime.now().isoformat(),
            "last_activity": datetime.now().isoformat(),
            "conversation_history": [],
            "pet_context": {},
            "emergency_detected": False,
            "message_count": 0
        }
        
        if self.redis_available:
            # Store in Redis with TTL
            key = self._get_session_key(session_id)
            self.redis_client.setex(
                key,
                self.session_ttl,
                json.dumps(session_data)
            )
        else:
            # Fallback to in-memory
            self.fallback_sessions[session_id] = session_data
        
        return session_data
    
    def get_session(self, session_id: str) -> Optional[Dict]:
        """Get existing session or create new one"""
        if self.redis_available:
            key = self._get_session_key(session_id)
            session_json = self.redis_client.get(key)
            
            if session_json:
                # Session exists, refresh TTL
                self.redis_client.expire(key, self.session_ttl)
                return json.loads(session_json)
            else:
                # Create new session
                return self.create_session(session_id)
        else:
            # Fallback to in-memory
            if session_id not in self.fallback_sessions:
                return self.create_session(session_id)
            return self.fallback_sessions[session_id]
    
    def update_session(self, session_id: str, updates: Dict):
        """Update session data"""
        session = self.get_session(session_id)
        if session:
            session.update(updates)
            session["last_activity"] = datetime.now().isoformat()
            
            if self.redis_available:
                key = self._get_session_key(session_id)
                self.redis_client.setex(
                    key,
                    self.session_ttl,
                    json.dumps(session)
                )
            else:
                self.fallback_sessions[session_id] = session
    
    def add_message(self, session_id: str, role: str, content: str):
        """Add a message to conversation history"""
        session = self.get_session(session_id)
        
        message = {
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat()
        }
        
        session["conversation_history"].append(message)
        session["message_count"] += 1
        session["last_activity"] = datetime.now().isoformat()
        
        # Save updated session
        if self.redis_available:
            key = self._get_session_key(session_id)
            self.redis_client.setex(
                key,
                self.session_ttl,
                json.dumps(session)
            )
        else:
            self.fallback_sessions[session_id] = session
    
    def get_conversation_history(self, session_id: str, limit: int = 10) -> List[Dict]:
        """Get conversation history for a session"""
        session = self.get_session(session_id)
        history = session.get("conversation_history", [])
        return history[-limit:] if limit else history
    
    def update_pet_context(self, session_id: str, pet_info: Dict):
        """Update pet context information"""
        session = self.get_session(session_id)
        if "pet_context" not in session:
            session["pet_context"] = {}
        session["pet_context"].update(pet_info)
        
        # Save updated session
        if self.redis_available:
            key = self._get_session_key(session_id)
            self.redis_client.setex(
                key,
                self.session_ttl,
                json.dumps(session)
            )
        else:
            self.fallback_sessions[session_id] = session
    
    def get_pet_context(self, session_id: str) -> Dict:
        """Get pet context for a session"""
        session = self.get_session(session_id)
        return session.get("pet_context", {})
    
    def mark_emergency(self, session_id: str):
        """Mark session as having detected an emergency"""
        session = self.get_session(session_id)
        session["emergency_detected"] = True
        
        # Save updated session
        if self.redis_available:
            key = self._get_session_key(session_id)
            self.redis_client.setex(
                key,
                self.session_ttl,
                json.dumps(session)
            )
        else:
            self.fallback_sessions[session_id] = session
    
    def clear_session(self, session_id: str):
        """Clear a session"""
        if self.redis_available:
            key = self._get_session_key(session_id)
            self.redis_client.delete(key)
        else:
            if session_id in self.fallback_sessions:
                del self.fallback_sessions[session_id]
    
    def get_all_sessions(self) -> List[str]:
        """Get all active session IDs"""
        if self.redis_available:
            # Get all session keys
            keys = self.redis_client.keys("session:*")
            # Extract session IDs from keys
            return [key.replace("session:", "") for key in keys]
        else:
            return list(self.fallback_sessions.keys())
    
    def get_session_stats(self) -> Dict:
        """Get statistics about active sessions"""
        if self.redis_available:
            total_sessions = len(self.redis_client.keys("session:*"))
            redis_info = self.redis_client.info("memory")
            
            return {
                "total_sessions": total_sessions,
                "storage_type": "redis",
                "redis_memory_used": redis_info.get("used_memory_human", "N/A"),
                "session_ttl": self.session_ttl
            }
        else:
            return {
                "total_sessions": len(self.fallback_sessions),
                "storage_type": "in-memory (fallback)",
                "session_ttl": self.session_ttl
            }
