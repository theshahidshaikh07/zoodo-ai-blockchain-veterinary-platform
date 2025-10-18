#!/usr/bin/env python3
"""
Test script for Nutrition AI Assistant
"""

import sys
import os
sys.path.append('app/utils')

from nutrition_ai_assistant import NutritionAIAssistant
import asyncio
import json

async def test_nutrition_ai():
    print('🧪 Testing Nutrition AI Assistant...')
    
    # Initialize assistant
    assistant = NutritionAIAssistant()
    
    # Test case 1: Labrador with obesity
    print('\n📊 Test Case 1: Labrador Retriever with Obesity')
    pet_info = {
        'breed': 'Labrador Retriever',
        'age': 3,
        'weight': 40,  # Overweight
        'animal_type': 'Dog'
    }
    
    nutrition_plan = await assistant.get_personalized_nutrition_plan(
        pet_info=pet_info,
        health_conditions=['obesity'],
        preferences={'budget': 'moderate', 'food_type': 'dry'}
    )
    
    print(f'Daily Calories: {nutrition_plan["adjusted_nutrition"]["daily_calories"]:.0f}')
    print(f'Portion Size: {nutrition_plan["adjusted_nutrition"]["portion_size_grams"]:.0f}g')
    print(f'Feeding Frequency: {nutrition_plan["feeding_schedule"]["feeding_frequency"]} times/day')
    print(f'Special Needs: {nutrition_plan["adjusted_nutrition"]["special_nutritional_needs"]}')
    
    # Test case 2: Senior cat with kidney disease
    print('\n📊 Test Case 2: Senior Persian Cat with Kidney Disease')
    pet_info2 = {
        'breed': 'Persian',
        'age': 12,
        'weight': 4.5,
        'animal_type': 'Cat'
    }
    
    nutrition_plan2 = await assistant.get_personalized_nutrition_plan(
        pet_info=pet_info2,
        health_conditions=['kidney_disease']
    )
    
    print(f'Daily Calories: {nutrition_plan2["adjusted_nutrition"]["daily_calories"]:.0f}')
    print(f'Protein Level: {nutrition_plan2["adjusted_nutrition"]["protein_level"]}')
    print(f'Phosphorus Level: {nutrition_plan2["adjusted_nutrition"]["phosphorus_level"]}')
    print(f'Recommended Foods: {nutrition_plan2["adjusted_nutrition"]["recommended_food_types"]}')
    
    # Test case 3: Puppy nutrition
    print('\n📊 Test Case 3: German Shepherd Puppy')
    pet_info3 = {
        'breed': 'German Shepherd',
        'age': 0.5,  # 6 months
        'weight': 15,
        'animal_type': 'Dog'
    }
    
    nutrition_plan3 = await assistant.get_personalized_nutrition_plan(pet_info=pet_info3)
    
    print(f'Life Stage: {nutrition_plan3["life_stage"]}')
    print(f'Daily Calories: {nutrition_plan3["base_nutrition"]["daily_calories"]:.0f}')
    print(f'Protein Min: {nutrition_plan3["base_nutrition"]["protein_min_percent"]}%')
    print(f'Feeding Times: {", ".join(nutrition_plan3["feeding_schedule"]["feeding_times"])}')
    
    print('\n✅ Nutrition AI Assistant testing completed!')
    print('The AI can provide personalized nutrition recommendations for any pet!')

if __name__ == "__main__":
    asyncio.run(test_nutrition_ai())
