"""
Dataset Service - Loads and provides access to veterinary datasets
Implements RAG (Retrieval-Augmented Generation) for enhanced responses
"""

import pandas as pd
import os
from typing import List, Dict, Optional
from pathlib import Path
import re

class DatasetService:
    def __init__(self):
        """Initialize dataset service and load all datasets"""
        self.datasets_path = Path(__file__).parent.parent.parent / "datasets" / "01_raw_data"
        self.datasets = {}
        self.load_datasets()
    
    def load_datasets(self):
        """Load all CSV datasets into memory"""
        try:
            # Load pet health symptoms dataset
            symptoms_path = self.datasets_path / "01_pet_health_symptoms.csv"
            if symptoms_path.exists():
                self.datasets['symptoms'] = pd.read_csv(symptoms_path)
                print(f"✓ Loaded symptoms dataset: {len(self.datasets['symptoms'])} records")
            
            # Load animal disease prediction dataset
            disease_path = self.datasets_path / "02_animal_disease_prediction.csv"
            if disease_path.exists():
                self.datasets['diseases'] = pd.read_csv(disease_path)
                print(f"✓ Loaded diseases dataset: {len(self.datasets['diseases'])} records")
            
            # Load general animal data
            animal_path = self.datasets_path / "03_general_animal_data.csv"
            if animal_path.exists():
                self.datasets['animals'] = pd.read_csv(animal_path)
                print(f"✓ Loaded animals dataset: {len(self.datasets['animals'])} records")
            
            # Load dog breed health data
            breed_path = self.datasets_path / "04_dog_breed_health.csv"
            if breed_path.exists():
                self.datasets['breeds'] = pd.read_csv(breed_path)
                print(f"✓ Loaded breeds dataset: {len(self.datasets['breeds'])} records")
            
            # Load veterinary clinical data
            clinical_path = self.datasets_path / "05_veterinary_clinical.csv"
            if clinical_path.exists():
                self.datasets['clinical'] = pd.read_csv(clinical_path)
                print(f"✓ Loaded clinical dataset: {len(self.datasets['clinical'])} records")
            
        except Exception as e:
            print(f"Error loading datasets: {str(e)}")
    
    def search_symptoms(self, query: str, limit: int = 5) -> List[Dict]:
        """
        Search symptom dataset for relevant information
        
        Args:
            query: Search query (symptoms, conditions)
            limit: Maximum number of results
        
        Returns:
            List of relevant symptom records
        """
        if 'symptoms' not in self.datasets:
            return []
        
        df = self.datasets['symptoms']
        query_lower = query.lower()
        
        # Search in text and condition columns
        mask = (
            df['text'].str.lower().str.contains(query_lower, na=False, regex=False) |
            df['condition'].str.lower().str.contains(query_lower, na=False, regex=False)
        )
        
        results = df[mask].head(limit)
        
        return results.to_dict('records')
    
    def search_diseases(self, query: str, limit: int = 5) -> List[Dict]:
        """Search disease dataset"""
        if 'diseases' not in self.datasets:
            return []
        
        df = self.datasets['diseases']
        query_lower = query.lower()
        
        # Search across all text columns
        mask = df.apply(lambda row: any(
            query_lower in str(val).lower() for val in row.values
        ), axis=1)
        
        results = df[mask].head(limit)
        return results.to_dict('records')
    
    def get_breed_info(self, breed: str) -> Optional[Dict]:
        """Get breed-specific health information"""
        if 'breeds' not in self.datasets:
            return None
        
        df = self.datasets['breeds']
        breed_lower = breed.lower()
        
        # Search for breed
        mask = df.apply(lambda row: any(
            breed_lower in str(val).lower() for val in row.values
        ), axis=1)
        
        results = df[mask].head(1)
        
        if len(results) > 0:
            return results.to_dict('records')[0]
        return None
    
    def search_clinical_notes(self, query: str, limit: int = 5) -> List[Dict]:
        """Search clinical notes for relevant cases"""
        if 'clinical' not in self.datasets:
            return []
        
        df = self.datasets['clinical']
        query_lower = query.lower()
        
        mask = df.apply(lambda row: any(
            query_lower in str(val).lower() for val in row.values
        ), axis=1)
        
        results = df[mask].head(limit)
        return results.to_dict('records')
    
    def get_context_for_query(self, query: str) -> str:
        """
        Get relevant context from all datasets for a query
        This is used for RAG (Retrieval-Augmented Generation)
        
        Args:
            query: User's question or symptom description
        
        Returns:
            Formatted context string to augment AI response
        """
        context_parts = []
        
        # Search symptoms
        symptoms = self.search_symptoms(query, limit=3)
        if symptoms:
            context_parts.append("**Relevant Symptom Information:**")
            for i, symptom in enumerate(symptoms, 1):
                context_parts.append(f"{i}. {symptom.get('text', '')} (Condition: {symptom.get('condition', 'Unknown')})")
        
        # Search diseases
        diseases = self.search_diseases(query, limit=2)
        if diseases:
            context_parts.append("\n**Related Disease Information:**")
            for i, disease in enumerate(diseases, 1):
                # Format disease info (structure depends on your dataset)
                disease_text = str(disease)[:200]  # Limit length
                context_parts.append(f"{i}. {disease_text}")
        
        # Search clinical notes
        clinical = self.search_clinical_notes(query, limit=2)
        if clinical:
            context_parts.append("\n**Similar Clinical Cases:**")
            for i, case in enumerate(clinical, 1):
                case_text = str(case)[:200]
                context_parts.append(f"{i}. {case_text}")
        
        if context_parts:
            return "\n".join(context_parts)
        
        return ""
    
    def get_nutrition_recommendations(self, pet_type: str, breed: str = None, age: str = None) -> str:
        """
        Get nutrition recommendations based on pet type, breed, and age
        
        Args:
            pet_type: Type of pet (dog, cat, etc.)
            breed: Breed of pet (optional)
            age: Age category (puppy, adult, senior, etc.)
        
        Returns:
            Nutrition recommendations
        """
        recommendations = []
        
        # Basic recommendations by pet type
        if pet_type.lower() in ['dog', 'puppy']:
            recommendations.append("**General Dog Nutrition:**")
            recommendations.append("- High-quality protein (chicken, beef, fish)")
            recommendations.append("- Balanced fats for energy and coat health")
            recommendations.append("- Essential vitamins and minerals")
            recommendations.append("- Avoid: chocolate, grapes, onions, garlic, xylitol")
        
        elif pet_type.lower() in ['cat', 'kitten']:
            recommendations.append("**General Cat Nutrition:**")
            recommendations.append("- High protein diet (cats are obligate carnivores)")
            recommendations.append("- Taurine is essential for heart and eye health")
            recommendations.append("- Wet food helps with hydration")
            recommendations.append("- Avoid: onions, garlic, chocolate, dairy products")
        
        # Age-specific recommendations
        if age:
            age_lower = age.lower()
            if 'puppy' in age_lower or 'kitten' in age_lower or 'young' in age_lower:
                recommendations.append("\n**For Young Pets:**")
                recommendations.append("- Higher calorie intake for growth")
                recommendations.append("- Frequent small meals (3-4 times daily)")
                recommendations.append("- Puppy/kitten-specific formulas with DHA for brain development")
            
            elif 'senior' in age_lower or 'old' in age_lower:
                recommendations.append("\n**For Senior Pets:**")
                recommendations.append("- Lower calorie, higher fiber diet")
                recommendations.append("- Joint support supplements (glucosamine, chondroitin)")
                recommendations.append("- Easily digestible proteins")
                recommendations.append("- Monitor for dental issues")
        
        # Breed-specific if available
        if breed:
            breed_info = self.get_breed_info(breed)
            if breed_info:
                recommendations.append(f"\n**Breed-Specific Notes for {breed}:**")
                # Add breed-specific nutrition info from dataset
                # This depends on your dataset structure
        
        return "\n".join(recommendations) if recommendations else "Please provide more details about your pet for personalized nutrition advice."
