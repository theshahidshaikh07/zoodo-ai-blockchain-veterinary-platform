#!/usr/bin/env python3
"""
Nutrition and Diet Dataset Creation for AI Veterinary Assistant
This script creates comprehensive nutrition and diet recommendations using Google API
"""

import pandas as pd
import numpy as np
import json
import asyncio
from typing import Dict, List, Any, Optional
import warnings
warnings.filterwarnings('ignore')

class NutritionDatasetCreator:
    def __init__(self):
        self.nutrition_data = []
        
        # Breed-specific nutritional requirements
        self.breed_nutrition = {
            # Large breeds
            'Labrador Retriever': {
                'calories_per_kg': 60,
                'protein_min': 22,
                'fat_min': 8,
                'special_needs': ['joint_support', 'weight_management'],
                'common_issues': ['obesity', 'hip_dysplasia']
            },
            'Golden Retriever': {
                'calories_per_kg': 55,
                'protein_min': 22,
                'fat_min': 8,
                'special_needs': ['joint_support', 'skin_health'],
                'common_issues': ['cancer', 'hip_dysplasia']
            },
            'German Shepherd': {
                'calories_per_kg': 50,
                'protein_min': 24,
                'fat_min': 10,
                'special_needs': ['joint_support', 'digestive_health'],
                'common_issues': ['hip_dysplasia', 'digestive_sensitivity']
            },
            
            # Small breeds
            'Chihuahua': {
                'calories_per_kg': 80,
                'protein_min': 25,
                'fat_min': 12,
                'special_needs': ['dental_health', 'energy_density'],
                'common_issues': ['dental_disease', 'hypoglycemia']
            },
            'Yorkshire Terrier': {
                'calories_per_kg': 75,
                'protein_min': 25,
                'fat_min': 12,
                'special_needs': ['dental_health', 'coat_health'],
                'common_issues': ['dental_disease', 'skin_allergies']
            },
            
            # Cats
            'Persian': {
                'calories_per_kg': 70,
                'protein_min': 30,
                'fat_min': 9,
                'special_needs': ['hairball_control', 'urinary_health'],
                'common_issues': ['hairballs', 'urinary_tract_issues']
            },
            'Siamese': {
                'calories_per_kg': 75,
                'protein_min': 30,
                'fat_min': 9,
                'special_needs': ['high_protein', 'digestive_health'],
                'common_issues': ['digestive_sensitivity']
            }
        }
        
        # Age-based nutritional needs
        self.age_nutrition = {
            'puppy_kitten': {
                'calories_multiplier': 2.0,
                'protein_min': 28,
                'fat_min': 12,
                'special_needs': ['growth_support', 'immune_support'],
                'feeding_frequency': 3
            },
            'adult': {
                'calories_multiplier': 1.0,
                'protein_min': 18,
                'fat_min': 5,
                'special_needs': ['maintenance'],
                'feeding_frequency': 2
            },
            'senior': {
                'calories_multiplier': 0.8,
                'protein_min': 20,
                'fat_min': 8,
                'special_needs': ['joint_support', 'cognitive_support'],
                'feeding_frequency': 2
            }
        }
        
        # Health condition-specific diets
        self.health_condition_diets = {
            'kidney_disease': {
                'protein_level': 'reduced',
                'fat_level': 'moderate',
                'carbohydrate_level': 'moderate',
                'fiber_level': 'moderate',
                'sodium_level': 'low',
                'phosphorus_level': 'low',
                'recommended_foods': ['prescription_kidney_diet'],
                'avoid': ['high_protein', 'high_phosphorus']
            },
            'diabetes': {
                'protein_level': 'moderate',
                'fat_level': 'moderate',
                'carbohydrate_level': 'low',
                'fiber_level': 'high',
                'sodium_level': 'moderate',
                'phosphorus_level': 'moderate',
                'recommended_foods': ['high_fiber', 'low_carb'],
                'avoid': ['high_sugar', 'high_carb']
            },
            'obesity': {
                'protein_level': 'moderate',
                'fat_level': 'low',
                'carbohydrate_level': 'moderate',
                'fiber_level': 'high',
                'sodium_level': 'moderate',
                'phosphorus_level': 'moderate',
                'recommended_foods': ['weight_management'],
                'avoid': ['high_calorie', 'high_fat']
            },
            'allergies': {
                'protein_level': 'moderate',
                'fat_level': 'moderate',
                'carbohydrate_level': 'moderate',
                'fiber_level': 'moderate',
                'sodium_level': 'moderate',
                'phosphorus_level': 'moderate',
                'recommended_foods': ['limited_ingredient'],
                'avoid': ['common_allergens']
            }
        }

    def create_breed_nutrition_dataset(self) -> pd.DataFrame:
        """Create comprehensive breed nutrition dataset"""
        print("Creating breed nutrition dataset...")
        
        nutrition_records = []
        
        for breed, requirements in self.breed_nutrition.items():
            # Determine animal type
            animal_type = 'Cat' if breed in ['Persian', 'Siamese'] else 'Dog'
            
            # Create records for different life stages
            for life_stage, age_requirements in self.age_nutrition.items():
                # Calculate daily calorie needs for different weights
                for weight_kg in [2, 5, 10, 20, 30, 40, 50]:
                    if animal_type == 'Cat' and weight_kg > 10:
                        continue  # Cats typically don't exceed 10kg
                    
                    daily_calories = weight_kg * requirements['calories_per_kg'] * age_requirements['calories_multiplier']
                    
                    record = {
                        'animal_type': animal_type,
                        'breed': breed,
                        'life_stage': life_stage,
                        'weight_kg': weight_kg,
                        'daily_calories': daily_calories,
                        'protein_min_percent': max(requirements['protein_min'], age_requirements['protein_min']),
                        'fat_min_percent': max(requirements['fat_min'], age_requirements['fat_min']),
                        'special_nutritional_needs': '; '.join(requirements['special_needs'] + age_requirements['special_needs']),
                        'common_health_issues': '; '.join(requirements['common_issues']),
                        'feeding_frequency': age_requirements['feeding_frequency'],
                        'recommended_food_types': self._get_recommended_food_types(breed, life_stage, weight_kg),
                        'portion_size_grams': self._calculate_portion_size(weight_kg, daily_calories),
                        'water_intake_ml': weight_kg * 50  # 50ml per kg body weight
                    }
                    nutrition_records.append(record)
        
        return pd.DataFrame(nutrition_records)

    def create_health_condition_nutrition_dataset(self) -> pd.DataFrame:
        """Create health condition-specific nutrition dataset"""
        print("Creating health condition nutrition dataset...")
        
        health_records = []
        
        for condition, diet_requirements in self.health_condition_diets.items():
            # Create records for different animal types and weights
            for animal_type in ['Dog', 'Cat']:
                for weight_kg in [2, 5, 10, 20, 30, 40, 50]:
                    if animal_type == 'Cat' and weight_kg > 10:
                        continue
                    
                    # Adjust calorie needs based on condition
                    base_calories = weight_kg * 60 if animal_type == 'Dog' else weight_kg * 70
                    
                    if condition == 'obesity':
                        daily_calories = base_calories * 0.8  # 20% reduction
                    elif condition == 'kidney_disease':
                        daily_calories = base_calories * 0.9  # 10% reduction
                    else:
                        daily_calories = base_calories
                    
                    record = {
                        'animal_type': animal_type,
                        'health_condition': condition,
                        'weight_kg': weight_kg,
                        'daily_calories': daily_calories,
                        'protein_level': diet_requirements['protein_level'],
                        'fat_level': diet_requirements.get('fat_level', 'moderate'),
                        'carbohydrate_level': diet_requirements.get('carbohydrate_level', 'moderate'),
                        'fiber_level': diet_requirements.get('fiber_level', 'moderate'),
                        'sodium_level': diet_requirements.get('sodium_level', 'moderate'),
                        'phosphorus_level': diet_requirements.get('phosphorus_level', 'moderate'),
                        'recommended_food_types': '; '.join(diet_requirements['recommended_foods']),
                        'foods_to_avoid': '; '.join(diet_requirements['avoid']),
                        'special_considerations': self._get_special_considerations(condition),
                        'monitoring_requirements': self._get_monitoring_requirements(condition),
                        'vet_consultation_frequency': self._get_vet_frequency(condition)
                    }
                    health_records.append(record)
        
        return pd.DataFrame(health_records)

    def create_feeding_schedule_dataset(self) -> pd.DataFrame:
        """Create feeding schedule recommendations"""
        print("Creating feeding schedule dataset...")
        
        schedule_records = []
        
        # Different feeding schedules based on age and lifestyle
        schedules = {
            'puppy_kitten': {
                'frequency': 3,
                'times': ['7:00 AM', '1:00 PM', '7:00 PM'],
                'portion_split': [0.4, 0.3, 0.3]
            },
            'adult_active': {
                'frequency': 2,
                'times': ['7:00 AM', '7:00 PM'],
                'portion_split': [0.5, 0.5]
            },
            'adult_sedentary': {
                'frequency': 2,
                'times': ['8:00 AM', '6:00 PM'],
                'portion_split': [0.4, 0.6]
            },
            'senior': {
                'frequency': 2,
                'times': ['8:00 AM', '6:00 PM'],
                'portion_split': [0.5, 0.5]
            }
        }
        
        for schedule_type, schedule_info in schedules.items():
            for animal_type in ['Dog', 'Cat']:
                for weight_kg in [2, 5, 10, 20, 30, 40, 50]:
                    if animal_type == 'Cat' and weight_kg > 10:
                        continue
                    
                    base_calories = weight_kg * 60 if animal_type == 'Dog' else weight_kg * 70
                    
                    record = {
                        'animal_type': animal_type,
                        'schedule_type': schedule_type,
                        'weight_kg': weight_kg,
                        'daily_calories': base_calories,
                        'feeding_frequency': schedule_info['frequency'],
                        'feeding_times': '; '.join(schedule_info['times']),
                        'portion_splits': '; '.join([str(x) for x in schedule_info['portion_split']]),
                        'morning_portion_grams': self._calculate_portion_size(weight_kg, base_calories) * schedule_info['portion_split'][0],
                        'evening_portion_grams': self._calculate_portion_size(weight_kg, base_calories) * schedule_info['portion_split'][-1],
                        'water_availability': '24/7',
                        'treat_allowance_percent': 10,
                        'special_instructions': self._get_special_instructions(schedule_type)
                    }
                    schedule_records.append(record)
        
        return pd.DataFrame(schedule_records)

    def _get_recommended_food_types(self, breed: str, life_stage: str, weight_kg: float) -> str:
        """Get recommended food types based on breed, age, and weight"""
        food_types = []
        
        # Life stage considerations
        if life_stage == 'puppy_kitten':
            food_types.append('growth_formula')
        elif life_stage == 'senior':
            food_types.append('senior_formula')
        else:
            food_types.append('adult_maintenance')
        
        # Breed considerations
        if breed in ['Labrador Retriever', 'Golden Retriever']:
            food_types.append('weight_management')
        elif breed in ['German Shepherd']:
            food_types.append('digestive_support')
        elif breed in ['Chihuahua', 'Yorkshire Terrier']:
            food_types.append('small_breed_formula')
        
        # Weight considerations
        if weight_kg < 5:
            food_types.append('small_breed')
        elif weight_kg > 30:
            food_types.append('large_breed')
        
        return '; '.join(food_types)

    def _calculate_portion_size(self, weight_kg: float, daily_calories: float) -> float:
        """Calculate portion size in grams based on weight and calories"""
        # Assuming average calorie density of 3.5 kcal/g for dry food
        return daily_calories / 3.5

    def _get_special_considerations(self, condition: str) -> str:
        """Get special considerations for health conditions"""
        considerations = {
            'kidney_disease': 'Monitor water intake, regular blood work, low phosphorus',
            'diabetes': 'Consistent feeding times, monitor blood glucose, high fiber',
            'obesity': 'Gradual weight loss, increased exercise, portion control',
            'allergies': 'Elimination diet, novel protein sources, avoid triggers'
        }
        return considerations.get(condition, 'Regular monitoring recommended')

    def _get_monitoring_requirements(self, condition: str) -> str:
        """Get monitoring requirements for health conditions"""
        monitoring = {
            'kidney_disease': 'Monthly blood work, urine analysis, weight monitoring',
            'diabetes': 'Daily glucose monitoring, regular vet visits, weight tracking',
            'obesity': 'Weekly weight checks, body condition scoring, exercise tracking',
            'allergies': 'Symptom tracking, food diary, elimination testing'
        }
        return monitoring.get(condition, 'Regular vet checkups')

    def _get_vet_frequency(self, condition: str) -> str:
        """Get vet consultation frequency for health conditions"""
        frequency = {
            'kidney_disease': 'Monthly',
            'diabetes': 'Bi-weekly initially, then monthly',
            'obesity': 'Monthly',
            'allergies': 'As needed for flare-ups'
        }
        return frequency.get(condition, 'Every 6 months')

    def _get_special_instructions(self, schedule_type: str) -> str:
        """Get special feeding instructions"""
        instructions = {
            'puppy_kitten': 'Soak dry food for young puppies, monitor growth rate',
            'adult_active': 'Increase portions during high activity periods',
            'adult_sedentary': 'Monitor weight, reduce portions if gaining weight',
            'senior': 'Soften food if dental issues, monitor appetite changes'
        }
        return instructions.get(schedule_type, 'Monitor appetite and weight regularly')

    def create_comprehensive_nutrition_dataset(self) -> Dict[str, pd.DataFrame]:
        """Create comprehensive nutrition dataset"""
        print("Creating comprehensive nutrition dataset...")
        
        # Create all nutrition datasets
        breed_nutrition = self.create_breed_nutrition_dataset()
        health_nutrition = self.create_health_condition_nutrition_dataset()
        feeding_schedules = self.create_feeding_schedule_dataset()
        
        # Save datasets
        breed_nutrition.to_csv('breed_nutrition_dataset.csv', index=False)
        health_nutrition.to_csv('health_condition_nutrition_dataset.csv', index=False)
        feeding_schedules.to_csv('feeding_schedule_dataset.csv', index=False)
        
        # Create combined dataset
        combined_nutrition = pd.concat([
            breed_nutrition,
            health_nutrition,
            feeding_schedules
        ], ignore_index=True)
        
        combined_nutrition.to_csv('comprehensive_nutrition_dataset.csv', index=False)
        
        print(f"Created nutrition datasets:")
        print(f"  - Breed nutrition: {len(breed_nutrition)} records")
        print(f"  - Health condition nutrition: {len(health_nutrition)} records")
        print(f"  - Feeding schedules: {len(feeding_schedules)} records")
        print(f"  - Combined dataset: {len(combined_nutrition)} records")
        
        return {
            'breed_nutrition': breed_nutrition,
            'health_nutrition': health_nutrition,
            'feeding_schedules': feeding_schedules,
            'combined': combined_nutrition
        }

def main():
    """Main execution function"""
    creator = NutritionDatasetCreator()
    datasets = creator.create_comprehensive_nutrition_dataset()
    
    print("\n" + "="*60)
    print("NUTRITION DATASET CREATION COMPLETED!")
    print("="*60)
    print("Created comprehensive nutrition and diet datasets for:")
    print("✓ Breed-specific nutritional requirements")
    print("✓ Health condition-specific diets")
    print("✓ Feeding schedules and portion sizes")
    print("✓ Age-based nutritional needs")
    print("✓ Special dietary considerations")
    print("\nThese datasets can now be integrated with Google API")
    print("for personalized nutrition recommendations!")

if __name__ == "__main__":
    main()
