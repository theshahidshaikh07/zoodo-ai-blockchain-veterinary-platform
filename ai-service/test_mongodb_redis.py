#!/usr/bin/env python3
"""
Test script for MongoDB and Redis connections in AI Service
"""

import asyncio
import os
import sys
from datetime import datetime

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.utils.mongodb_manager import MongoDBManager
from app.utils.redis_manager import RedisManager

async def test_mongodb():
    """Test MongoDB connection and operations"""
    print("Testing MongoDB connection...")
    
    mongo_manager = MongoDBManager()
    
    try:
        await mongo_manager.initialize()
        
        if await mongo_manager.is_connected():
            print("✅ MongoDB connection successful")
            
            # Test storing AI recommendation
            test_result = await mongo_manager.store_ai_recommendation(
                user_id="test_user_123",
                pet_id="test_pet_456",
                recommendation_type="symptom_analysis",
                symptoms="Test symptoms",
                analysis_result="Test analysis",
                urgency_level="low",
                confidence_score=0.85
            )
            
            if test_result["success"]:
                print("✅ MongoDB store operation successful")
                print(f"   Recommendation ID: {test_result['recommendation_id']}")
            else:
                print("❌ MongoDB store operation failed")
                print(f"   Error: {test_result.get('error', 'Unknown error')}")
            
            # Test retrieving recommendations
            recommendations = await mongo_manager.get_user_recommendations(
                user_id="test_user_123",
                limit=5
            )
            
            print(f"✅ Retrieved {len(recommendations)} recommendations from MongoDB")
            
        else:
            print("❌ MongoDB connection failed")
            
    except Exception as e:
        print(f"❌ MongoDB test failed: {str(e)}")
    
    finally:
        await mongo_manager.close()

async def test_redis():
    """Test Redis connection and operations"""
    print("\nTesting Redis connection...")
    
    redis_manager = RedisManager()
    
    try:
        await redis_manager.initialize()
        
        if await redis_manager.is_connected():
            print("✅ Redis connection successful")
            
            # Test caching
            test_data = {
                "test_key": "test_value",
                "timestamp": datetime.utcnow().isoformat()
            }
            
            cache_success = await redis_manager.cache_ai_result(
                cache_key="test_cache_key",
                result=test_data,
                ttl_seconds=60
            )
            
            if cache_success:
                print("✅ Redis cache operation successful")
                
                # Test retrieving cached data
                cached_data = await redis_manager.get_cached_ai_result("test_cache_key")
                
                if cached_data:
                    print("✅ Redis cache retrieval successful")
                    print(f"   Cached data: {cached_data}")
                else:
                    print("❌ Redis cache retrieval failed")
            else:
                print("❌ Redis cache operation failed")
            
            # Test user interaction storage
            interaction_success = await redis_manager.store_user_interaction(
                user_id="test_user_123",
                interaction_type="test_interaction",
                interaction_data={"test": "data"}
            )
            
            if interaction_success:
                print("✅ Redis user interaction storage successful")
                
                # Test retrieving interactions
                interactions = await redis_manager.get_recent_user_interactions(
                    user_id="test_user_123",
                    limit=5
                )
                
                print(f"✅ Retrieved {len(interactions)} interactions from Redis")
            else:
                print("❌ Redis user interaction storage failed")
            
            # Test analytics counter
            analytics_success = await redis_manager.increment_analytics_counter(
                metric_name="test_metric"
            )
            
            if analytics_success:
                print("✅ Redis analytics counter increment successful")
                
                counter_value = await redis_manager.get_analytics_counter("test_metric")
                print(f"   Counter value: {counter_value}")
            else:
                print("❌ Redis analytics counter increment failed")
            
        else:
            print("❌ Redis connection failed")
            
    except Exception as e:
        print(f"❌ Redis test failed: {str(e)}")
    
    finally:
        await redis_manager.close()

async def test_integration():
    """Test integration between MongoDB and Redis"""
    print("\nTesting MongoDB-Redis integration...")
    
    mongo_manager = MongoDBManager()
    redis_manager = RedisManager()
    
    try:
        await mongo_manager.initialize()
        await redis_manager.initialize()
        
        if await mongo_manager.is_connected() and await redis_manager.is_connected():
            print("✅ Both MongoDB and Redis connected")
            
            # Simulate AI analysis workflow
            user_id = "integration_test_user"
            pet_id = "integration_test_pet"
            
            # Store in MongoDB
            mongo_result = await mongo_manager.store_symptom_analysis(
                user_id=user_id,
                pet_id=pet_id,
                symptoms=["lethargy", "loss of appetite"],
                analysis_result={
                    "analysis": "Possible mild illness",
                    "urgency_level": "low",
                    "confidence_score": 0.75
                }
            )
            
            if mongo_result["success"]:
                print("✅ MongoDB symptom analysis storage successful")
                
                # Cache in Redis
                cache_success = await redis_manager.cache_ai_result(
                    cache_key=f"symptom_analysis:{user_id}:{pet_id}",
                    result=mongo_result,
                    ttl_seconds=3600
                )
                
                if cache_success:
                    print("✅ Redis caching of MongoDB result successful")
                    
                    # Store user interaction
                    await redis_manager.store_user_interaction(
                        user_id=user_id,
                        interaction_type="symptom_analysis",
                        interaction_data={"pet_id": pet_id, "source": "integration_test"}
                    )
                    
                    print("✅ Integration test completed successfully")
                else:
                    print("❌ Redis caching failed")
            else:
                print("❌ MongoDB symptom analysis storage failed")
        else:
            print("❌ One or both databases not connected")
            
    except Exception as e:
        print(f"❌ Integration test failed: {str(e)}")
    
    finally:
        await mongo_manager.close()
        await redis_manager.close()

async def main():
    """Run all tests"""
    print("🧪 Testing MongoDB and Redis Setup for AI Service")
    print("=" * 50)
    
    await test_mongodb()
    await test_redis()
    await test_integration()
    
    print("\n" + "=" * 50)
    print("✅ All tests completed!")

if __name__ == "__main__":
    asyncio.run(main()) 