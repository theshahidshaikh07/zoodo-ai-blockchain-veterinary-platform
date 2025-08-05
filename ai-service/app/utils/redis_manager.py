import os
import json
import asyncio
from typing import Dict, Any, Optional, List, Union
from datetime import datetime, timedelta
import redis.asyncio as redis
from redis.asyncio import Redis
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class RedisManager:
    def __init__(self):
        self.redis_client = None
        self.is_connected = False
        
        # Redis configuration
        self.redis_host = os.getenv("REDIS_HOST", "localhost")
        self.redis_port = int(os.getenv("REDIS_PORT", "6379"))
        self.redis_db = int(os.getenv("REDIS_DB", "0"))
        self.redis_password = os.getenv("REDIS_PASSWORD", None)
        
        # Key prefixes for organization
        self.key_prefixes = {
            "ai_cache": "ai:cache:",
            "user_session": "user:session:",
            "user_interaction": "user:interaction:",
            "model_result": "model:result:",
            "emergency_queue": "emergency:queue:",
            "analytics": "analytics:",
            "rate_limit": "rate:limit:",
            "real_time": "realtime:"
        }

    async def initialize(self):
        """Initialize Redis connection"""
        try:
            self.redis_client = redis.Redis(
                host=self.redis_host,
                port=self.redis_port,
                db=self.redis_db,
                password=self.redis_password,
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5
            )
            
            # Test connection
            await self.redis_client.ping()
            self.is_connected = True
            
            print("Redis connection established successfully")
            
        except Exception as e:
            print(f"Error connecting to Redis: {str(e)}")
            self.is_connected = False

    async def is_connected(self) -> bool:
        """Check if Redis is connected"""
        if not self.redis_client:
            return False
        
        try:
            await self.redis_client.ping()
            return True
        except:
            return False

    async def cache_ai_result(
        self,
        cache_key: str,
        result: Dict[str, Any],
        ttl_seconds: int = 3600
    ) -> bool:
        """Cache AI model result"""
        try:
            if not self.is_connected:
                return False
            
            key = f"{self.key_prefixes['ai_cache']}{cache_key}"
            await self.redis_client.setex(
                key,
                ttl_seconds,
                json.dumps(result)
            )
            return True
            
        except Exception as e:
            print(f"Error caching AI result: {str(e)}")
            return False

    async def get_cached_ai_result(
        self,
        cache_key: str
    ) -> Optional[Dict[str, Any]]:
        """Get cached AI model result"""
        try:
            if not self.is_connected:
                return None
            
            key = f"{self.key_prefixes['ai_cache']}{cache_key}"
            result = await self.redis_client.get(key)
            
            if result:
                return json.loads(result)
            
            return None
            
        except Exception as e:
            print(f"Error getting cached AI result: {str(e)}")
            return None

    async def store_user_session(
        self,
        user_id: str,
        session_data: Dict[str, Any],
        ttl_seconds: int = 86400  # 24 hours
    ) -> bool:
        """Store user session data"""
        try:
            if not self.is_connected:
                return False
            
            key = f"{self.key_prefixes['user_session']}{user_id}"
            await self.redis_client.setex(
                key,
                ttl_seconds,
                json.dumps(session_data)
            )
            return True
            
        except Exception as e:
            print(f"Error storing user session: {str(e)}")
            return False

    async def get_user_session(
        self,
        user_id: str
    ) -> Optional[Dict[str, Any]]:
        """Get user session data"""
        try:
            if not self.is_connected:
                return None
            
            key = f"{self.key_prefixes['user_session']}{user_id}"
            session_data = await self.redis_client.get(key)
            
            if session_data:
                return json.loads(session_data)
            
            return None
            
        except Exception as e:
            print(f"Error getting user session: {str(e)}")
            return None

    async def store_user_interaction(
        self,
        user_id: str,
        interaction_type: str,
        interaction_data: Dict[str, Any]
    ) -> bool:
        """Store user interaction for real-time analytics"""
        try:
            if not self.is_connected:
                return False
            
            timestamp = datetime.utcnow().isoformat()
            key = f"{self.key_prefixes['user_interaction']}{user_id}:{timestamp}"
            
            interaction_record = {
                "user_id": user_id,
                "interaction_type": interaction_type,
                "interaction_data": interaction_data,
                "timestamp": timestamp
            }
            
            await self.redis_client.setex(
                key,
                86400,  # 24 hours TTL
                json.dumps(interaction_record)
            )
            
            # Also store in a list for recent interactions
            list_key = f"{self.key_prefixes['user_interaction']}recent:{user_id}"
            await self.redis_client.lpush(list_key, json.dumps(interaction_record))
            await self.redis_client.ltrim(list_key, 0, 99)  # Keep only last 100 interactions
            
            return True
            
        except Exception as e:
            print(f"Error storing user interaction: {str(e)}")
            return False

    async def get_recent_user_interactions(
        self,
        user_id: str,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get recent user interactions"""
        try:
            if not self.is_connected:
                return []
            
            list_key = f"{self.key_prefixes['user_interaction']}recent:{user_id}"
            interactions = await self.redis_client.lrange(list_key, 0, limit - 1)
            
            return [json.loads(interaction) for interaction in interactions]
            
        except Exception as e:
            print(f"Error getting recent user interactions: {str(e)}")
            return []

    async def store_model_result(
        self,
        model_name: str,
        input_hash: str,
        result: Dict[str, Any],
        ttl_seconds: int = 7200  # 2 hours
    ) -> bool:
        """Store AI model result with input hash"""
        try:
            if not self.is_connected:
                return False
            
            key = f"{self.key_prefixes['model_result']}{model_name}:{input_hash}"
            await self.redis_client.setex(
                key,
                ttl_seconds,
                json.dumps(result)
            )
            return True
            
        except Exception as e:
            print(f"Error storing model result: {str(e)}")
            return False

    async def get_model_result(
        self,
        model_name: str,
        input_hash: str
    ) -> Optional[Dict[str, Any]]:
        """Get AI model result by input hash"""
        try:
            if not self.is_connected:
                return None
            
            key = f"{self.key_prefixes['model_result']}{model_name}:{input_hash}"
            result = await self.redis_client.get(key)
            
            if result:
                return json.loads(result)
            
            return None
            
        except Exception as e:
            print(f"Error getting model result: {str(e)}")
            return None

    async def add_to_emergency_queue(
        self,
        emergency_data: Dict[str, Any]
    ) -> bool:
        """Add emergency case to priority queue"""
        try:
            if not self.is_connected:
                return False
            
            queue_key = f"{self.key_prefixes['emergency_queue']}cases"
            emergency_data["timestamp"] = datetime.utcnow().isoformat()
            
            await self.redis_client.lpush(queue_key, json.dumps(emergency_data))
            return True
            
        except Exception as e:
            print(f"Error adding to emergency queue: {str(e)}")
            return False

    async def get_emergency_queue(
        self,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get emergency cases from queue"""
        try:
            if not self.is_connected:
                return []
            
            queue_key = f"{self.key_prefixes['emergency_queue']}cases"
            cases = await self.redis_client.lrange(queue_key, 0, limit - 1)
            
            return [json.loads(case) for case in cases]
            
        except Exception as e:
            print(f"Error getting emergency queue: {str(e)}")
            return []

    async def increment_analytics_counter(
        self,
        metric_name: str,
        value: int = 1
    ) -> bool:
        """Increment analytics counter"""
        try:
            if not self.is_connected:
                return False
            
            date_key = datetime.utcnow().strftime("%Y-%m-%d")
            key = f"{self.key_prefixes['analytics']}{metric_name}:{date_key}"
            
            await self.redis_client.incrby(key, value)
            await self.redis_client.expire(key, 86400 * 30)  # 30 days TTL
            
            return True
            
        except Exception as e:
            print(f"Error incrementing analytics counter: {str(e)}")
            return False

    async def get_analytics_counter(
        self,
        metric_name: str,
        date: str = None
    ) -> int:
        """Get analytics counter value"""
        try:
            if not self.is_connected:
                return 0
            
            if not date:
                date = datetime.utcnow().strftime("%Y-%m-%d")
            
            key = f"{self.key_prefixes['analytics']}{metric_name}:{date}"
            value = await self.redis_client.get(key)
            
            return int(value) if value else 0
            
        except Exception as e:
            print(f"Error getting analytics counter: {str(e)}")
            return 0

    async def set_rate_limit(
        self,
        identifier: str,
        limit: int,
        window_seconds: int
    ) -> bool:
        """Set rate limit for API calls"""
        try:
            if not self.is_connected:
                return False
            
            key = f"{self.key_prefixes['rate_limit']}{identifier}"
            current_count = await self.redis_client.incr(key)
            
            if current_count == 1:
                await self.redis_client.expire(key, window_seconds)
            
            return current_count <= limit
            
        except Exception as e:
            print(f"Error setting rate limit: {str(e)}")
            return False

    async def check_rate_limit(
        self,
        identifier: str,
        limit: int,
        window_seconds: int
    ) -> bool:
        """Check if rate limit is exceeded"""
        try:
            if not self.is_connected:
                return True  # Allow if Redis is down
            
            key = f"{self.key_prefixes['rate_limit']}{identifier}"
            current_count = await self.redis_client.get(key)
            
            if not current_count:
                return True
            
            return int(current_count) < limit
            
        except Exception as e:
            print(f"Error checking rate limit: {str(e)}")
            return True

    async def publish_real_time_event(
        self,
        channel: str,
        event_data: Dict[str, Any]
    ) -> bool:
        """Publish real-time event to Redis pub/sub"""
        try:
            if not self.is_connected:
                return False
            
            await self.redis_client.publish(
                f"{self.key_prefixes['real_time']}{channel}",
                json.dumps(event_data)
            )
            return True
            
        except Exception as e:
            print(f"Error publishing real-time event: {str(e)}")
            return False

    async def subscribe_to_channel(
        self,
        channel: str
    ) -> Optional[redis.client.PubSub]:
        """Subscribe to Redis channel for real-time events"""
        try:
            if not self.is_connected:
                return None
            
            pubsub = self.redis_client.pubsub()
            await pubsub.subscribe(f"{self.key_prefixes['real_time']}{channel}")
            return pubsub
            
        except Exception as e:
            print(f"Error subscribing to channel: {str(e)}")
            return None

    async def close(self):
        """Close Redis connection"""
        if self.redis_client:
            await self.redis_client.close()
            self.is_connected = False 