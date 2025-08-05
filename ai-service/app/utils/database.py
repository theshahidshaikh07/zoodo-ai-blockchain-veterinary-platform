import os
import json
import asyncio
from typing import Dict, Any, Optional, List
import psycopg2
from psycopg2.extras import RealDictCursor
import asyncpg

class DatabaseManager:
    def __init__(self):
        self.connection = None
        self.is_connected = False
        
        # Database configuration
        self.db_host = os.getenv("DB_HOST", "localhost")
        self.db_port = os.getenv("DB_PORT", "5432")
        self.db_name = os.getenv("DB_NAME", "zoodo")
        self.db_user = os.getenv("DB_USER", "postgres")
        self.db_password = os.getenv("DB_PASSWORD", "password")

    async def initialize(self):
        """Initialize database connection"""
        try:
            # Create async connection
            self.connection = await asyncpg.connect(
                host=self.db_host,
                port=self.db_port,
                database=self.db_name,
                user=self.db_user,
                password=self.db_password
            )
            
            self.is_connected = True
            print("Database connection established successfully")
            
        except Exception as e:
            print(f"Error connecting to database: {str(e)}")
            self.is_connected = False

    async def is_connected(self) -> bool:
        """Check if database is connected"""
        if not self.connection:
            return False
        
        try:
            await self.connection.execute("SELECT 1")
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
        """Store AI recommendation in database"""
        try:
            if not self.is_connected:
                return {"success": False, "error": "Database not connected"}
            
            query = """
                INSERT INTO ai_recommendations (
                    user_id, pet_id, recommendation_type, symptoms, 
                    analysis_result, urgency_level, confidence_score,
                    recommended_providers, care_instructions, diet_recommendations
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING id
            """
            
            result = await self.connection.fetchrow(
                query,
                user_id,
                pet_id,
                recommendation_type,
                symptoms,
                analysis_result,
                urgency_level,
                confidence_score,
                recommended_providers,
                care_instructions,
                diet_recommendations
            )
            
            return {
                "success": True,
                "recommendation_id": result["id"] if result else None
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
            
            query = """
                SELECT * FROM ai_recommendations 
                WHERE user_id = $1 
                ORDER BY created_at DESC 
                LIMIT $2
            """
            
            results = await self.connection.fetch(query, user_id, limit)
            
            return [dict(row) for row in results]
            
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
            
            query = """
                SELECT * FROM ai_recommendations 
                WHERE pet_id = $1 
                ORDER BY created_at DESC 
                LIMIT $2
            """
            
            results = await self.connection.fetch(query, pet_id, limit)
            
            return [dict(row) for row in results]
            
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
                return {"success": False, "error": "Database not connected"}
            
            # Store in ai_recommendations table
            return await self.store_ai_recommendation(
                user_id=user_id,
                pet_id=pet_id,
                recommendation_type="symptom_analysis",
                symptoms=json.dumps(symptoms),
                analysis_result=analysis_result.get("analysis"),
                urgency_level=analysis_result.get("urgency_level"),
                confidence_score=analysis_result.get("confidence_score")
            )
            
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
                return {"success": False, "error": "Database not connected"}
            
            return await self.store_ai_recommendation(
                user_id=user_id,
                pet_id=pet_id,
                recommendation_type="provider_recommendation",
                recommended_providers=recommendation_data.get("providers", []),
                confidence_score=recommendation_data.get("confidence_score"),
                analysis_result=recommendation_data.get("reasoning")
            )
            
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
                return {"success": False, "error": "Database not connected"}
            
            return await self.store_ai_recommendation(
                user_id=user_id,
                pet_id=pet_id,
                recommendation_type="care_routine",
                care_instructions=json.dumps(care_data.get("daily_routine", {})),
                diet_recommendations=json.dumps(care_data.get("diet_recommendations", {}))
            )
            
        except Exception as e:
            print(f"Error storing care routine: {str(e)}")
            return {"success": False, "error": str(e)}

    async def get_emergency_clinics(
        self,
        latitude: float,
        longitude: float,
        radius_km: float = 50.0
    ) -> List[Dict[str, Any]]:
        """Get emergency clinics within radius"""
        try:
            if not self.is_connected:
                return []
            
            # Simple distance calculation (in production, use proper geospatial queries)
            query = """
                SELECT * FROM users 
                WHERE user_type = 'veterinarian' 
                AND is_verified = true 
                AND is_active = true
                AND latitude IS NOT NULL 
                AND longitude IS NOT NULL
                ORDER BY 
                    SQRT(POWER(latitude - $1, 2) + POWER(longitude - $2, 2))
                LIMIT 10
            """
            
            results = await self.connection.fetch(query, latitude, longitude)
            
            return [dict(row) for row in results]
            
        except Exception as e:
            print(f"Error getting emergency clinics: {str(e)}")
            return []

    async def get_community_events(
        self,
        location: str,
        event_type: Optional[str] = None,
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """Get community events"""
        try:
            if not self.is_connected:
                return []
            
            if event_type:
                query = """
                    SELECT * FROM community_events 
                    WHERE is_active = true 
                    AND event_type = $1
                    ORDER BY start_date ASC 
                    LIMIT $2
                """
                results = await self.connection.fetch(query, event_type, limit)
            else:
                query = """
                    SELECT * FROM community_events 
                    WHERE is_active = true 
                    ORDER BY start_date ASC 
                    LIMIT $1
                """
                results = await self.connection.fetch(query, limit)
            
            return [dict(row) for row in results]
            
        except Exception as e:
            print(f"Error getting community events: {str(e)}")
            return []

    async def get_provider_recommendations(
        self,
        user_location: Dict[str, float],
        service_type: str,
        max_distance: float = 50.0
    ) -> List[Dict[str, Any]]:
        """Get provider recommendations from database"""
        try:
            if not self.is_connected:
                return []
            
            query = """
                SELECT * FROM users 
                WHERE user_type = $1 
                AND is_verified = true 
                AND is_active = true
                AND latitude IS NOT NULL 
                AND longitude IS NOT NULL
                ORDER BY rating DESC, 
                    SQRT(POWER(latitude - $2, 2) + POWER(longitude - $3, 2))
                LIMIT 20
            """
            
            user_type = "veterinarian" if service_type == "veterinary" else "trainer"
            results = await self.connection.fetch(
                query, 
                user_type, 
                user_location["lat"], 
                user_location["lng"]
            )
            
            return [dict(row) for row in results]
            
        except Exception as e:
            print(f"Error getting provider recommendations: {str(e)}")
            return []

    async def close(self):
        """Close database connection"""
        if self.connection:
            await self.connection.close()
            self.is_connected = False 