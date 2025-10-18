#!/usr/bin/env python3
"""
Nutrition AI Assistant - Personalized Diet and Care Recommendations
This module integrates nutrition datasets with Google API for personalized recommendations
"""

import os
import json
import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class NutritionAIAssistant:
    """
    AI Nutrition Assistant for Personalized Pet Care
    
    Features:
    - Breed-specific nutrition recommendations
    - Health condition-specific diets
    - Age-based feeding schedules
    - Personalized care plans
    - Integration with Google API for real-time advice
    """
    
    def __init__(self):
        self.name = "Dr. Salus Nutrition AI"
        self.llm = None
        self.nutrition_datasets = {}
        
        # Load nutrition datasets
        self._load_nutrition_datasets()
        
        # Initialize Google API
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        if self.google_api_key:
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-pro",
                google_api_key=self.google_api_key,
                temperature=0.7,
                max_output_tokens=1500
            )
    
    def _load_nutrition_datasets(self):
        """Load nutrition datasets"""
        try:
        self.nutrition_datasets = {
            'breed_nutrition': pd.read_csv('../datasets/02_processed_data/processed_breed_nutrition_dataset.csv'),
            'health_nutrition': pd.read_csv('../datasets/02_processed_data/processed_health_condition_nutrition_dataset.csv'),
            'feeding_schedules': pd.read_csv('../datasets/02_processed_data/processed_feeding_schedule_dataset.csv'),
            'comprehensive_nutrition': pd.read_csv('../datasets/02_processed_data/processed_comprehensive_nutrition_dataset.csv')
        }
            print("✅ Nutrition datasets loaded successfully")
        except Exception as e:
            print(f"⚠️  Error loading nutrition datasets: {e}")
            self.nutrition_datasets = {}
    
    async def get_personalized_nutrition_plan(
        self,
        pet_info: Dict[str, Any],
        health_conditions: Optional[List[str]] = None,
        preferences: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Get personalized nutrition plan for a pet
        
        Args:
            pet_info: Pet information (breed, age, weight, etc.)
            health_conditions: List of health conditions
            preferences: Owner preferences (budget, food type, etc.)
        """
        
        # Extract pet information
        breed = pet_info.get('breed', 'Mixed Breed')
        age = pet_info.get('age', 1)
        weight = pet_info.get('weight', 10)
        animal_type = pet_info.get('animal_type', 'Dog')
        
        # Determine life stage
        life_stage = self._determine_life_stage(age, animal_type)
        
        # Get base nutrition requirements
        base_nutrition = self._get_base_nutrition_requirements(breed, life_stage, weight, animal_type)
        
        # Adjust for health conditions
        if health_conditions:
            adjusted_nutrition = self._adjust_for_health_conditions(base_nutrition, health_conditions, weight, animal_type)
        else:
            adjusted_nutrition = base_nutrition
        
        # Get feeding schedule
        feeding_schedule = self._get_feeding_schedule(life_stage, weight, animal_type)
        
        # Generate AI-powered recommendations
        ai_recommendations = await self._generate_ai_nutrition_advice(
            pet_info, health_conditions, adjusted_nutrition, feeding_schedule, preferences
        )
        
        return {
            'pet_info': pet_info,
            'life_stage': life_stage,
            'base_nutrition': base_nutrition,
            'adjusted_nutrition': adjusted_nutrition,
            'feeding_schedule': feeding_schedule,
            'ai_recommendations': ai_recommendations,
            'health_considerations': health_conditions or [],
            'generated_at': datetime.utcnow().isoformat()
        }
    
    def _determine_life_stage(self, age: float, animal_type: str) -> str:
        """Determine life stage based on age and animal type"""
        if animal_type == 'Dog':
            if age < 1:
                return 'puppy_kitten'
            elif age < 7:
                return 'adult'
            else:
                return 'senior'
        elif animal_type == 'Cat':
            if age < 1:
                return 'puppy_kitten'
            elif age < 7:
                return 'adult'
            else:
                return 'senior'
        else:
            if age < 2:
                return 'puppy_kitten'
            elif age < 5:
                return 'adult'
            else:
                return 'senior'
    
    def _get_base_nutrition_requirements(
        self, breed: str, life_stage: str, weight: float, animal_type: str
    ) -> Dict[str, Any]:
        """Get base nutrition requirements from dataset"""
        
        # Find matching record in breed nutrition dataset
        breed_data = self.nutrition_datasets.get('breed_nutrition', pd.DataFrame())
        
        if not breed_data.empty:
            # Try to find exact match first
            match = breed_data[
                (breed_data['breed'] == breed) & 
                (breed_data['life_stage'] == life_stage) & 
                (breed_data['animal_type'] == animal_type) &
                (breed_data['weight_kg'] == weight)
            ]
            
            if not match.empty:
                record = match.iloc[0]
                return {
                    'daily_calories': record['daily_calories'],
                    'protein_min_percent': record['protein_min_percent'],
                    'fat_min_percent': record['fat_min_percent'],
                    'special_nutritional_needs': record['special_nutritional_needs'],
                    'recommended_food_types': record['recommended_food_types'],
                    'portion_size_grams': record['portion_size_grams'],
                    'water_intake_ml': record['water_intake_ml'],
                    'feeding_frequency': record['feeding_frequency']
                }
        
        # Fallback to general recommendations
        return self._get_fallback_nutrition(weight, animal_type, life_stage)
    
    def _get_fallback_nutrition(self, weight: float, animal_type: str, life_stage: str) -> Dict[str, Any]:
        """Get fallback nutrition recommendations when breed data not available"""
        
        # Base calorie calculations
        if animal_type == 'Dog':
            base_calories = weight * 60
            protein_min = 18
            fat_min = 5
        else:  # Cat
            base_calories = weight * 70
            protein_min = 26
            fat_min = 9
        
        # Adjust for life stage
        if life_stage == 'puppy_kitten':
            base_calories *= 2.0
            protein_min = max(protein_min, 28)
            fat_min = max(fat_min, 12)
        elif life_stage == 'senior':
            base_calories *= 0.8
            protein_min = max(protein_min, 20)
            fat_min = max(fat_min, 8)
        
        return {
            'daily_calories': base_calories,
            'protein_min_percent': protein_min,
            'fat_min_percent': fat_min,
            'special_nutritional_needs': 'general_maintenance',
            'recommended_food_types': 'adult_maintenance',
            'portion_size_grams': base_calories / 3.5,  # Assuming 3.5 kcal/g
            'water_intake_ml': weight * 50,
            'feeding_frequency': 2
        }
    
    def _adjust_for_health_conditions(
        self, base_nutrition: Dict[str, Any], health_conditions: List[str], 
        weight: float, animal_type: str
    ) -> Dict[str, Any]:
        """Adjust nutrition requirements for health conditions"""
        
        adjusted = base_nutrition.copy()
        health_data = self.nutrition_datasets.get('health_nutrition', pd.DataFrame())
        
        for condition in health_conditions:
            # Find matching health condition data
            condition_data = health_data[
                (health_data['health_condition'] == condition) &
                (health_data['animal_type'] == animal_type) &
                (health_data['weight_kg'] == weight)
            ]
            
            if not condition_data.empty:
                record = condition_data.iloc[0]
                
                # Adjust calories
                adjusted['daily_calories'] = record['daily_calories']
                
                # Add health-specific recommendations
                adjusted['health_condition'] = condition
                adjusted['protein_level'] = record['protein_level']
                adjusted['fat_level'] = record['fat_level']
                adjusted['carbohydrate_level'] = record['carbohydrate_level']
                adjusted['fiber_level'] = record['fiber_level']
                adjusted['recommended_food_types'] = record['recommended_food_types']
                adjusted['foods_to_avoid'] = record['foods_to_avoid']
                adjusted['special_considerations'] = record['special_considerations']
                adjusted['monitoring_requirements'] = record['monitoring_requirements']
        
        return adjusted
    
    def _get_feeding_schedule(self, life_stage: str, weight: float, animal_type: str) -> Dict[str, Any]:
        """Get feeding schedule recommendations"""
        
        schedule_data = self.nutrition_datasets.get('feeding_schedules', pd.DataFrame())
        
        if not schedule_data.empty:
            # Find matching schedule
            match = schedule_data[
                (schedule_data['schedule_type'] == life_stage) &
                (schedule_data['animal_type'] == animal_type) &
                (schedule_data['weight_kg'] == weight)
            ]
            
            if not match.empty:
                record = match.iloc[0]
                return {
                    'feeding_frequency': record['feeding_frequency'],
                    'feeding_times': record['feeding_times'].split('; '),
                    'portion_splits': [float(x) for x in record['portion_splits'].split('; ')],
                    'morning_portion_grams': record['morning_portion_grams'],
                    'evening_portion_grams': record['evening_portion_grams'],
                    'water_availability': record['water_availability'],
                    'treat_allowance_percent': record['treat_allowance_percent'],
                    'special_instructions': record['special_instructions']
                }
        
        # Fallback schedule
        return self._get_fallback_schedule(life_stage)
    
    def _get_fallback_schedule(self, life_stage: str) -> Dict[str, Any]:
        """Get fallback feeding schedule"""
        
        if life_stage == 'puppy_kitten':
            return {
                'feeding_frequency': 3,
                'feeding_times': ['7:00 AM', '1:00 PM', '7:00 PM'],
                'portion_splits': [0.4, 0.3, 0.3],
                'morning_portion_grams': 0,
                'evening_portion_grams': 0,
                'water_availability': '24/7',
                'treat_allowance_percent': 10,
                'special_instructions': 'Soak dry food for young animals'
            }
        else:
            return {
                'feeding_frequency': 2,
                'feeding_times': ['7:00 AM', '7:00 PM'],
                'portion_splits': [0.5, 0.5],
                'morning_portion_grams': 0,
                'evening_portion_grams': 0,
                'water_availability': '24/7',
                'treat_allowance_percent': 10,
                'special_instructions': 'Monitor appetite and weight regularly'
            }
    
    async def _generate_ai_nutrition_advice(
        self,
        pet_info: Dict[str, Any],
        health_conditions: Optional[List[str]],
        nutrition_requirements: Dict[str, Any],
        feeding_schedule: Dict[str, Any],
        preferences: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Generate AI-powered nutrition advice using Google API"""
        
        if not self.llm:
            return self._get_fallback_advice(nutrition_requirements, feeding_schedule)
        
        # Create prompt for AI
        prompt = self._create_nutrition_prompt(
            pet_info, health_conditions, nutrition_requirements, feeding_schedule, preferences
        )
        
        try:
            response = await self.llm.ainvoke(prompt)
            ai_advice = self._parse_ai_response(response.content)
            return ai_advice
        except Exception as e:
            print(f"Error getting AI advice: {e}")
            return self._get_fallback_advice(nutrition_requirements, feeding_schedule)
    
    def _create_nutrition_prompt(
        self,
        pet_info: Dict[str, Any],
        health_conditions: Optional[List[str]],
        nutrition_requirements: Dict[str, Any],
        feeding_schedule: Dict[str, Any],
        preferences: Optional[Dict[str, Any]]
    ) -> str:
        """Create prompt for AI nutrition advice"""
        
        prompt = f"""
        You are Dr. Salus, an expert veterinary nutritionist. Provide personalized nutrition advice for this pet:
        
        Pet Information:
        - Breed: {pet_info.get('breed', 'Unknown')}
        - Age: {pet_info.get('age', 'Unknown')} years
        - Weight: {pet_info.get('weight', 'Unknown')} kg
        - Animal Type: {pet_info.get('animal_type', 'Unknown')}
        
        Health Conditions: {health_conditions or 'None'}
        
        Current Nutrition Requirements:
        - Daily Calories: {nutrition_requirements.get('daily_calories', 'Unknown')}
        - Protein: {nutrition_requirements.get('protein_min_percent', 'Unknown')}%
        - Fat: {nutrition_requirements.get('fat_min_percent', 'Unknown')}%
        - Special Needs: {nutrition_requirements.get('special_nutritional_needs', 'None')}
        
        Feeding Schedule:
        - Frequency: {feeding_schedule.get('feeding_frequency', 'Unknown')} times per day
        - Times: {', '.join(feeding_schedule.get('feeding_times', []))}
        
        Owner Preferences: {preferences or 'None specified'}
        
        Please provide:
        1. Specific food brand recommendations
        2. Portion size guidance
        3. Feeding tips and best practices
        4. Foods to avoid
        5. Monitoring recommendations
        6. When to consult a veterinarian
        
        Format your response as a structured JSON with these keys:
        - food_recommendations
        - portion_guidance
        - feeding_tips
        - foods_to_avoid
        - monitoring_tips
        - vet_consultation_advice
        """
        
        return prompt
    
    def _parse_ai_response(self, response: str) -> Dict[str, Any]:
        """Parse AI response into structured format"""
        try:
            # Try to extract JSON from response
            import re
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
        except:
            pass
        
        # Fallback: return response as text
        return {
            'ai_advice': response,
            'food_recommendations': 'See AI advice above',
            'portion_guidance': 'See AI advice above',
            'feeding_tips': 'See AI advice above',
            'foods_to_avoid': 'See AI advice above',
            'monitoring_tips': 'See AI advice above',
            'vet_consultation_advice': 'See AI advice above'
        }
    
    def _get_fallback_advice(
        self, nutrition_requirements: Dict[str, Any], feeding_schedule: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Get fallback advice when AI is not available"""
        
        return {
            'food_recommendations': [
                'High-quality commercial pet food',
                'Look for AAFCO approved formulas',
                'Consider breed-specific formulas'
            ],
            'portion_guidance': f"Feed {nutrition_requirements.get('portion_size_grams', 0):.0f} grams per day",
            'feeding_tips': [
                'Feed at consistent times',
                'Provide fresh water at all times',
                'Monitor weight regularly',
                'Avoid table scraps'
            ],
            'foods_to_avoid': [
                'Chocolate',
                'Grapes and raisins',
                'Onions and garlic',
                'Xylitol',
                'Alcohol'
            ],
            'monitoring_tips': [
                'Weigh your pet monthly',
                'Monitor appetite and energy levels',
                'Check body condition score',
                'Watch for digestive issues'
            ],
            'vet_consultation_advice': 'Consult your veterinarian for any dietary changes or health concerns'
        }
    
    async def get_breed_specific_care_plan(self, breed: str, age: float, weight: float) -> Dict[str, Any]:
        """Get breed-specific care plan including nutrition, exercise, and grooming"""
        
        # Get nutrition plan
        pet_info = {
            'breed': breed,
            'age': age,
            'weight': weight,
            'animal_type': 'Dog' if breed in ['Labrador Retriever', 'Golden Retriever', 'German Shepherd', 'Chihuahua', 'Yorkshire Terrier'] else 'Cat'
        }
        
        nutrition_plan = await self.get_personalized_nutrition_plan(pet_info)
        
        # Add breed-specific care recommendations
        care_recommendations = self._get_breed_care_recommendations(breed, age)
        
        return {
            'nutrition_plan': nutrition_plan,
            'exercise_recommendations': care_recommendations['exercise'],
            'grooming_recommendations': care_recommendations['grooming'],
            'health_monitoring': care_recommendations['health_monitoring'],
            'special_considerations': care_recommendations['special_considerations']
        }
    
    def _get_breed_care_recommendations(self, breed: str, age: float) -> Dict[str, Any]:
        """Get breed-specific care recommendations"""
        
        breed_care = {
            'Labrador Retriever': {
                'exercise': ['60-90 minutes daily', 'Swimming if possible', 'Fetch and retrieving games'],
                'grooming': ['Weekly brushing', 'Regular nail trimming', 'Ear cleaning'],
                'health_monitoring': ['Weight management', 'Hip and elbow screening', 'Eye exams'],
                'special_considerations': ['Prone to obesity', 'Joint health important', 'High energy needs']
            },
            'Golden Retriever': {
                'exercise': ['60-90 minutes daily', 'Swimming', 'Interactive play'],
                'grooming': ['Daily brushing', 'Regular bathing', 'Nail trimming'],
                'health_monitoring': ['Cancer screening', 'Hip dysplasia monitoring', 'Heart health'],
                'special_considerations': ['Cancer predisposition', 'Joint health', 'Skin care']
            },
            'German Shepherd': {
                'exercise': ['90+ minutes daily', 'Mental stimulation', 'Agility training'],
                'grooming': ['Weekly brushing', 'Seasonal shedding care', 'Nail maintenance'],
                'health_monitoring': ['Hip dysplasia screening', 'Digestive health', 'Back health'],
                'special_considerations': ['Hip dysplasia risk', 'Digestive sensitivity', 'High intelligence needs']
            },
            'Chihuahua': {
                'exercise': ['20-30 minutes daily', 'Indoor play', 'Short walks'],
                'grooming': ['Weekly brushing', 'Dental care', 'Nail trimming'],
                'health_monitoring': ['Dental health', 'Weight monitoring', 'Heart health'],
                'special_considerations': ['Dental issues', 'Fragile bones', 'Cold sensitivity']
            },
            'Persian': {
                'exercise': ['15-30 minutes daily', 'Interactive toys', 'Climbing structures'],
                'grooming': ['Daily brushing', 'Eye cleaning', 'Regular bathing'],
                'health_monitoring': ['Respiratory health', 'Eye health', 'Kidney function'],
                'special_considerations': ['Hairball prevention', 'Breathing issues', 'Eye problems']
            }
        }
        
        return breed_care.get(breed, {
            'exercise': ['30-60 minutes daily', 'Regular walks', 'Interactive play'],
            'grooming': ['Weekly brushing', 'Regular nail trimming', 'Basic hygiene'],
            'health_monitoring': ['Regular vet checkups', 'Weight monitoring', 'General health'],
            'special_considerations': ['Standard care requirements', 'Regular veterinary care']
        })

# Example usage function
async def example_usage():
    """Example of how to use the Nutrition AI Assistant"""
    
    assistant = NutritionAIAssistant()
    
    # Example pet information
    pet_info = {
        'breed': 'Labrador Retriever',
        'age': 3,
        'weight': 30,
        'animal_type': 'Dog'
    }
    
    # Get personalized nutrition plan
    nutrition_plan = await assistant.get_personalized_nutrition_plan(
        pet_info=pet_info,
        health_conditions=['obesity'],
        preferences={'budget': 'moderate', 'food_type': 'dry'}
    )
    
    print("Personalized Nutrition Plan:")
    print(json.dumps(nutrition_plan, indent=2))
    
    # Get breed-specific care plan
    care_plan = await assistant.get_breed_specific_care_plan(
        breed='Labrador Retriever',
        age=3,
        weight=30
    )
    
    print("\nBreed-Specific Care Plan:")
    print(json.dumps(care_plan, indent=2))

if __name__ == "__main__":
    import asyncio
    asyncio.run(example_usage())
