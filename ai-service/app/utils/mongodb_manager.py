import os
import json
import asyncio
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING, DESCENDING
from bson import ObjectId
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class MongoDBManager:
    def __init__(self):
        self.client = None
        self.db = None
        self.is_connected = False
        
        # MongoDB configuration
        self.mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
        self.db_name = os.getenv("MONGO_DB_NAME", "zoodo_ai")
        
        # Collection names
        self.collections = {
            "ai_recommendations": "ai_recommendations",
            "user_interactions": "user_interactions",
            "symptom_analyses": "symptom_analyses",
            "provider_recommendations": "provider_recommendations",
            "care_routines": "care_routines",
            "emergency_assessments": "emergency_assessments",
            "ai_models_cache": "ai_models_cache",
            "analytics": "analytics",
            "chat_sessions": "chat_sessions",
            "chat_messages": "chat_messages",
            "user_sessions": "user_sessions"
        }

    async def initialize(self):
        """Initialize MongoDB connection"""
        try:
            self.client = AsyncIOMotorClient(self.mongo_uri)
            self.db = self.client[self.db_name]
            
            # Test connection
            await self.client.admin.command('ping')
            self.is_connected = True
            
            # Create indexes
            await self._create_indexes()
            
            print("MongoDB connection established successfully")
            
        except Exception as e:
            print(f"Error connecting to MongoDB: {str(e)}")
            self.is_connected = False

    async def _create_indexes(self):
        """Create necessary indexes for performance"""
        try:
            # AI Recommendations indexes
            await self.db[self.collections["ai_recommendations"]].create_index([
                ("user_id", ASCENDING),
                ("created_at", DESCENDING)
            ])
            await self.db[self.collections["ai_recommendations"]].create_index([
                ("pet_id", ASCENDING),
                ("created_at", DESCENDING)
            ])
            await self.db[self.collections["ai_recommendations"]].create_index([
                ("recommendation_type", ASCENDING)
            ])

            # User Interactions indexes
            await self.db[self.collections["user_interactions"]].create_index([
                ("user_id", ASCENDING),
                ("timestamp", DESCENDING)
            ])
            await self.db[self.collections["user_interactions"]].create_index([
                ("interaction_type", ASCENDING)
            ])

            # Symptom Analyses indexes
            await self.db[self.collections["symptom_analyses"]].create_index([
                ("user_id", ASCENDING),
                ("created_at", DESCENDING)
            ])
            await self.db[self.collections["symptom_analyses"]].create_index([
                ("urgency_level", ASCENDING)
            ])

            # Provider Recommendations indexes
            await self.db[self.collections["provider_recommendations"]].create_index([
                ("user_id", ASCENDING),
                ("created_at", DESCENDING)
            ])
            await self.db[self.collections["provider_recommendations"]].create_index([
                ("service_type", ASCENDING)
            ])

            # Analytics indexes
            await self.db[self.collections["analytics"]].create_index([
                ("date", ASCENDING),
                ("metric_type", ASCENDING)
            ])

            # Chat Sessions indexes
            await self.db[self.collections["chat_sessions"]].create_index([
                ("user_id", ASCENDING),
                ("created_at", DESCENDING)
            ])
            await self.db[self.collections["chat_sessions"]].create_index([
                ("session_id", ASCENDING)
            ])
            await self.db[self.collections["chat_sessions"]].create_index([
                ("is_active", ASCENDING),
                ("last_activity", DESCENDING)
            ])

            # Chat Messages indexes
            await self.db[self.collections["chat_messages"]].create_index([
                ("session_id", ASCENDING),
                ("timestamp", ASCENDING)
            ])
            await self.db[self.collections["chat_messages"]].create_index([
                ("user_id", ASCENDING),
                ("timestamp", DESCENDING)
            ])
            await self.db[self.collections["chat_messages"]].create_index([
                ("message_type", ASCENDING)
            ])

            # User Sessions indexes
            await self.db[self.collections["user_sessions"]].create_index([
                ("user_id", ASCENDING),
                ("created_at", DESCENDING)
            ])
            await self.db[self.collections["user_sessions"]].create_index([
                ("session_key", ASCENDING)
            ])

            print("MongoDB indexes created successfully")
            
        except Exception as e:
            print(f"Error creating indexes: {str(e)}")

    async def is_connected(self) -> bool:
        """Check if MongoDB is connected"""
        if not self.client:
            return False
        
        try:
            await self.client.admin.command('ping')
            return True
        except:
            return False

    async def store_ai_recommendation(
        self,
        user_id: str,
        pet_id: Optional[str],
        recommendation_type: str,
        symptoms: Optional[str] = None,
        analysis_result: Optional[str] = None,
        urgency_level: Optional[str] = None,
        confidence_score: Optional[float] = None,
        recommended_providers: Optional[List[str]] = None,
        care_instructions: Optional[str] = None,
        diet_recommendations: Optional[str] = None
    ) -> Dict[str, Any]:
        """Store AI recommendation in MongoDB"""
        try:
            if not self.is_connected:
                return {"success": False, "error": "MongoDB not connected"}
            
            document = {
                "user_id": user_id,
                "pet_id": pet_id,
                "recommendation_type": recommendation_type,
                "symptoms": symptoms,
                "analysis_result": analysis_result,
                "urgency_level": urgency_level,
                "confidence_score": confidence_score,
                "recommended_providers": recommended_providers,
                "care_instructions": care_instructions,
                "diet_recommendations": diet_recommendations,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            result = await self.db[self.collections["ai_recommendations"]].insert_one(document)
            
            return {
                "success": True,
                "recommendation_id": str(result.inserted_id)
            }
            
        except Exception as e:
            print(f"Error storing AI recommendation: {str(e)}")
            return {"success": False, "error": str(e)}

    async def get_user_recommendations(
        self,
        user_id: str,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get AI recommendations for a user"""
        try:
            if not self.is_connected:
                return []
            
            cursor = self.db[self.collections["ai_recommendations"]].find(
                {"user_id": user_id}
            ).sort("created_at", DESCENDING).limit(limit)
            
            results = await cursor.to_list(length=limit)
            
            # Convert ObjectId to string for JSON serialization
            for result in results:
                result["_id"] = str(result["_id"])
            
            return results
            
        except Exception as e:
            print(f"Error getting user recommendations: {str(e)}")
            return []

    async def get_pet_recommendations(
        self,
        pet_id: str,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get AI recommendations for a specific pet"""
        try:
            if not self.is_connected:
                return []
            
            cursor = self.db[self.collections["ai_recommendations"]].find(
                {"pet_id": pet_id}
            ).sort("created_at", DESCENDING).limit(limit)
            
            results = await cursor.to_list(length=limit)
            
            # Convert ObjectId to string for JSON serialization
            for result in results:
                result["_id"] = str(result["_id"])
            
            return results
            
        except Exception as e:
            print(f"Error getting pet recommendations: {str(e)}")
            return []

    async def store_symptom_analysis(
        self,
        user_id: str,
        pet_id: str,
        symptoms: List[str],
        analysis_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Store symptom analysis result"""
        try:
            if not self.is_connected:
                return {"success": False, "error": "MongoDB not connected"}
            
            document = {
                "user_id": user_id,
                "pet_id": pet_id,
                "symptoms": symptoms,
                "analysis_result": analysis_result,
                "created_at": datetime.utcnow()
            }
            
            result = await self.db[self.collections["symptom_analyses"]].insert_one(document)
            
            return {
                "success": True,
                "analysis_id": str(result.inserted_id)
            }
            
        except Exception as e:
            print(f"Error storing symptom analysis: {str(e)}")
            return {"success": False, "error": str(e)}

    async def store_provider_recommendation(
        self,
        user_id: str,
        pet_id: str,
        recommendation_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Store provider recommendation"""
        try:
            if not self.is_connected:
                return {"success": False, "error": "MongoDB not connected"}
            
            document = {
                "user_id": user_id,
                "pet_id": pet_id,
                "recommendation_data": recommendation_data,
                "created_at": datetime.utcnow()
            }
            
            result = await self.db[self.collections["provider_recommendations"]].insert_one(document)
            
            return {
                "success": True,
                "recommendation_id": str(result.inserted_id)
            }
            
        except Exception as e:
            print(f"Error storing provider recommendation: {str(e)}")
            return {"success": False, "error": str(e)}

    async def store_care_routine(
        self,
        user_id: str,
        pet_id: str,
        care_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Store care routine recommendation"""
        try:
            if not self.is_connected:
                return {"success": False, "error": "MongoDB not connected"}
            
            document = {
                "user_id": user_id,
                "pet_id": pet_id,
                "care_data": care_data,
                "created_at": datetime.utcnow()
            }
            
            result = await self.db[self.collections["care_routines"]].insert_one(document)
            
            return {
                "success": True,
                "routine_id": str(result.inserted_id)
            }
            
        except Exception as e:
            print(f"Error storing care routine: {str(e)}")
            return {"success": False, "error": str(e)}

    async def store_user_interaction(
        self,
        user_id: str,
        interaction_type: str,
        interaction_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Store user interaction for analytics"""
        try:
            if not self.is_connected:
                return {"success": False, "error": "MongoDB not connected"}
            
            document = {
                "user_id": user_id,
                "interaction_type": interaction_type,
                "interaction_data": interaction_data,
                "timestamp": datetime.utcnow()
            }
            
            result = await self.db[self.collections["user_interactions"]].insert_one(document)
            
            return {
                "success": True,
                "interaction_id": str(result.inserted_id)
            }
            
        except Exception as e:
            print(f"Error storing user interaction: {str(e)}")
            return {"success": False, "error": str(e)}

    async def store_emergency_assessment(
        self,
        user_id: str,
        pet_id: str,
        assessment_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Store emergency assessment"""
        try:
            if not self.is_connected:
                return {"success": False, "error": "MongoDB not connected"}
            
            document = {
                "user_id": user_id,
                "pet_id": pet_id,
                "assessment_data": assessment_data,
                "created_at": datetime.utcnow()
            }
            
            result = await self.db[self.collections["emergency_assessments"]].insert_one(document)
            
            return {
                "success": True,
                "assessment_id": str(result.inserted_id)
            }
            
        except Exception as e:
            print(f"Error storing emergency assessment: {str(e)}")
            return {"success": False, "error": str(e)}

    async def cache_ai_model_result(
        self,
        model_name: str,
        input_data: Dict[str, Any],
        result: Dict[str, Any],
        ttl_hours: int = 24
    ) -> Dict[str, Any]:
        """Cache AI model results"""
        try:
            if not self.is_connected:
                return {"success": False, "error": "MongoDB not connected"}
            
            document = {
                "model_name": model_name,
                "input_hash": hash(json.dumps(input_data, sort_keys=True)),
                "input_data": input_data,
                "result": result,
                "created_at": datetime.utcnow(),
                "expires_at": datetime.utcnow() + timedelta(hours=ttl_hours)
            }
            
            result = await self.db[self.collections["ai_models_cache"]].insert_one(document)
            
            return {
                "success": True,
                "cache_id": str(result.inserted_id)
            }
            
        except Exception as e:
            print(f"Error caching AI model result: {str(e)}")
            return {"success": False, "error": str(e)}

    async def get_cached_ai_result(
        self,
        model_name: str,
        input_data: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Get cached AI model result"""
        try:
            if not self.is_connected:
                return None
            
            input_hash = hash(json.dumps(input_data, sort_keys=True))
            
            document = await self.db[self.collections["ai_models_cache"]].find_one({
                "model_name": model_name,
                "input_hash": input_hash,
                "expires_at": {"$gt": datetime.utcnow()}
            })
            
            if document:
                document["_id"] = str(document["_id"])
                return document
            
            return None
            
        except Exception as e:
            print(f"Error getting cached AI result: {str(e)}")
            return None

    async def get_analytics(
        self,
        metric_type: str,
        start_date: datetime,
        end_date: datetime
    ) -> List[Dict[str, Any]]:
        """Get analytics data"""
        try:
            if not self.is_connected:
                return []
            
            cursor = self.db[self.collections["analytics"]].find({
                "metric_type": metric_type,
                "date": {"$gte": start_date, "$lte": end_date}
            }).sort("date", ASCENDING)
            
            results = await cursor.to_list(length=None)
            
            # Convert ObjectId to string for JSON serialization
            for result in results:
                result["_id"] = str(result["_id"])
            
            return results
            
        except Exception as e:
            print(f"Error getting analytics: {str(e)}")
            return []

    async def create_chat_session(
        self,
        user_id: str,
        session_id: str,
        pet_profile: Dict[str, Any] = None,
        location: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Create a new chat session"""
        try:
            if not self.is_connected:
                return {"success": False, "error": "MongoDB not connected"}
            
            document = {
                "user_id": user_id,
                "session_id": session_id,
                "pet_profile": pet_profile or {},
                "location": location or {},
                "is_active": True,
                "created_at": datetime.utcnow(),
                "last_activity": datetime.utcnow(),
                "message_count": 0
            }
            
            result = await self.db[self.collections["chat_sessions"]].insert_one(document)
            
            return {
                "success": True,
                "session_id": session_id,
                "mongo_id": str(result.inserted_id)
            }
            
        except Exception as e:
            print(f"Error creating chat session: {str(e)}")
            return {"success": False, "error": str(e)}

    async def get_chat_session(
        self,
        user_id: str,
        session_id: str
    ) -> Optional[Dict[str, Any]]:
        """Get chat session by user_id and session_id"""
        try:
            if not self.is_connected:
                return None
            
            document = await self.db[self.collections["chat_sessions"]].find_one({
                "user_id": user_id,
                "session_id": session_id
            })
            
            if document:
                document["_id"] = str(document["_id"])
                return document
            
            return None
            
        except Exception as e:
            print(f"Error getting chat session: {str(e)}")
            return None

    async def update_chat_session(
        self,
        user_id: str,
        session_id: str,
        update_data: Dict[str, Any]
    ) -> bool:
        """Update chat session"""
        try:
            if not self.is_connected:
                return False
            
            update_data["last_activity"] = datetime.utcnow()
            
            result = await self.db[self.collections["chat_sessions"]].update_one(
                {"user_id": user_id, "session_id": session_id},
                {"$set": update_data}
            )
            
            return result.modified_count > 0
            
        except Exception as e:
            print(f"Error updating chat session: {str(e)}")
            return False

    async def store_chat_message(
        self,
        session_id: str,
        user_id: str,
        message: str,
        message_type: str,  # "user" or "assistant"
        metadata: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Store a chat message"""
        try:
            if not self.is_connected:
                return {"success": False, "error": "MongoDB not connected"}
            
            document = {
                "session_id": session_id,
                "user_id": user_id,
                "message": message,
                "message_type": message_type,
                "metadata": metadata or {},
                "timestamp": datetime.utcnow()
            }
            
            result = await self.db[self.collections["chat_messages"]].insert_one(document)
            
            # Update session message count
            await self.db[self.collections["chat_sessions"]].update_one(
                {"session_id": session_id},
                {
                    "$inc": {"message_count": 1},
                    "$set": {"last_activity": datetime.utcnow()}
                }
            )
            
            return {
                "success": True,
                "message_id": str(result.inserted_id)
            }
            
        except Exception as e:
            print(f"Error storing chat message: {str(e)}")
            return {"success": False, "error": str(e)}

    async def get_chat_messages(
        self,
        session_id: str,
        limit: int = 50,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        """Get chat messages for a session"""
        try:
            if not self.is_connected:
                return []
            
            cursor = self.db[self.collections["chat_messages"]].find(
                {"session_id": session_id}
            ).sort("timestamp", ASCENDING).skip(offset).limit(limit)
            
            results = await cursor.to_list(length=limit)
            
            # Convert ObjectId to string for JSON serialization
            for result in results:
                result["_id"] = str(result["_id"])
            
            return results
            
        except Exception as e:
            print(f"Error getting chat messages: {str(e)}")
            return []

    async def get_user_chat_sessions(
        self,
        user_id: str,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get user's chat sessions"""
        try:
            if not self.is_connected:
                return []
            
            cursor = self.db[self.collections["chat_sessions"]].find(
                {"user_id": user_id}
            ).sort("last_activity", DESCENDING).limit(limit)
            
            results = await cursor.to_list(length=limit)
            
            # Convert ObjectId to string for JSON serialization
            for result in results:
                result["_id"] = str(result["_id"])
            
            return results
            
        except Exception as e:
            print(f"Error getting user chat sessions: {str(e)}")
            return []

    async def deactivate_chat_session(
        self,
        user_id: str,
        session_id: str
    ) -> bool:
        """Deactivate a chat session"""
        try:
            if not self.is_connected:
                return False
            
            result = await self.db[self.collections["chat_sessions"]].update_one(
                {"user_id": user_id, "session_id": session_id},
                {
                    "$set": {
                        "is_active": False,
                        "ended_at": datetime.utcnow()
                    }
                }
            )
            
            return result.modified_count > 0
            
        except Exception as e:
            print(f"Error deactivating chat session: {str(e)}")
            return False

    async def cleanup_old_sessions(
        self,
        days_old: int = 30
    ) -> int:
        """Clean up old inactive sessions"""
        try:
            if not self.is_connected:
                return 0
            
            cutoff_date = datetime.utcnow() - timedelta(days=days_old)
            
            # Deactivate old sessions
            result = await self.db[self.collections["chat_sessions"]].update_many(
                {
                    "is_active": True,
                    "last_activity": {"$lt": cutoff_date}
                },
                {
                    "$set": {
                        "is_active": False,
                        "ended_at": datetime.utcnow()
                    }
                }
            )
            
            return result.modified_count
            
        except Exception as e:
            print(f"Error cleaning up old sessions: {str(e)}")
            return 0

    async def store_user_session_data(
        self,
        user_id: str,
        session_key: str,
        session_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Store user session data for persistence"""
        try:
            if not self.is_connected:
                return {"success": False, "error": "MongoDB not connected"}
            
            document = {
                "user_id": user_id,
                "session_key": session_key,
                "session_data": session_data,
                "created_at": datetime.utcnow(),
                "last_updated": datetime.utcnow()
            }
            
            # Upsert - update if exists, insert if not
            result = await self.db[self.collections["user_sessions"]].replace_one(
                {"user_id": user_id, "session_key": session_key},
                document,
                upsert=True
            )
            
            return {
                "success": True,
                "upserted_id": str(result.upserted_id) if result.upserted_id else None,
                "modified_count": result.modified_count
            }
            
        except Exception as e:
            print(f"Error storing user session data: {str(e)}")
            return {"success": False, "error": str(e)}

    async def get_user_session_data(
        self,
        user_id: str,
        session_key: str
    ) -> Optional[Dict[str, Any]]:
        """Get user session data"""
        try:
            if not self.is_connected:
                return None
            
            document = await self.db[self.collections["user_sessions"]].find_one({
                "user_id": user_id,
                "session_key": session_key
            })
            
            if document:
                document["_id"] = str(document["_id"])
                return document
            
            return None
            
        except Exception as e:
            print(f"Error getting user session data: {str(e)}")
            return None

    async def close(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            self.is_connected = False 