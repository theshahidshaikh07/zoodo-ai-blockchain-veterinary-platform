#!/usr/bin/env python3
"""
Dataset Cleaning and Merging Script for AI Veterinary Assistant
This script cleans and merges multiple veterinary datasets into a unified training dataset.
"""

import pandas as pd
import numpy as np
import re
from typing import Dict, List, Tuple
import warnings
warnings.filterwarnings('ignore')

class VeterinaryDatasetCleaner:
    def __init__(self):
        self.cleaned_datasets = {}
        self.merged_dataset = None
        
        # Standard symptom mappings
        self.symptom_mappings = {
            # Fever variations
            'fever': 'Fever', 'high temperature': 'Fever', 'elevated temperature': 'Fever',
            'hyperthermia': 'Fever', 'pyrexia': 'Fever',
            
            # Digestive issues
            'vomiting': 'Vomiting', 'emesis': 'Vomiting', 'throwing up': 'Vomiting',
            'diarrhea': 'Diarrhea', 'loose stools': 'Diarrhea', 'watery stool': 'Diarrhea',
            'constipation': 'Constipation', 'straining': 'Constipation',
            'appetite loss': 'Appetite Loss', 'anorexia': 'Appetite Loss', 'not eating': 'Appetite Loss',
            'decreased appetite': 'Appetite Loss', 'poor appetite': 'Appetite Loss',
            
            # Respiratory issues
            'coughing': 'Coughing', 'cough': 'Coughing', 'hacking': 'Coughing',
            'labored breathing': 'Labored Breathing', 'difficulty breathing': 'Labored Breathing',
            'respiratory distress': 'Labored Breathing', 'breathing problems': 'Labored Breathing',
            'sneezing': 'Sneezing', 'nasal discharge': 'Nasal Discharge', 'runny nose': 'Nasal Discharge',
            
            # Neurological/Behavioral
            'lethargy': 'Lethargy', 'tiredness': 'Lethargy', 'weakness': 'Lethargy',
            'depression': 'Lethargy', 'listlessness': 'Lethargy', 'dullness': 'Lethargy',
            'seizures': 'Seizures', 'convulsions': 'Seizures', 'fits': 'Seizures',
            
            # Skin issues
            'skin lesions': 'Skin Lesions', 'skin problems': 'Skin Lesions', 'rashes': 'Skin Lesions',
            'skin irritation': 'Skin Lesions', 'dermatitis': 'Skin Lesions',
            
            # Mobility issues
            'lameness': 'Lameness', 'limping': 'Lameness', 'difficulty walking': 'Lameness',
            'stiffness': 'Lameness', 'joint swelling': 'Lameness',
            
            # Eye issues
            'eye discharge': 'Eye Discharge', 'watery eyes': 'Eye Discharge', 'conjunctivitis': 'Eye Discharge',
            
            # Weight issues
            'weight loss': 'Weight Loss', 'emaciation': 'Weight Loss', 'wasting': 'Weight Loss',
            'weight gain': 'Weight Gain', 'obesity': 'Weight Gain',
            
            # Pain indicators
            'pain': 'Pain', 'painful': 'Pain', 'discomfort': 'Pain', 'soreness': 'Pain'
        }
        
        # Standard animal type mappings
        self.animal_type_mappings = {
            'dog': 'Dog', 'canine': 'Dog', 'puppy': 'Dog',
            'cat': 'Cat', 'feline': 'Cat', 'kitten': 'Cat',
            'horse': 'Horse', 'equine': 'Horse', 'pony': 'Horse',
            'cow': 'Cow', 'bovine': 'Cow', 'cattle': 'Cow',
            'bird': 'Bird', 'avian': 'Bird',
            'rabbit': 'Rabbit', 'bunny': 'Rabbit',
            'ferret': 'Ferret',
            'guinea pig': 'Guinea Pig', 'cavy': 'Guinea Pig'
        }
        
        # Standard breed mappings (common variations)
        self.breed_mappings = {
            'labrador': 'Labrador Retriever', 'lab': 'Labrador Retriever',
            'german shepherd': 'German Shepherd', 'gsd': 'German Shepherd',
            'golden retriever': 'Golden Retriever', 'golden': 'Golden Retriever',
            'beagle': 'Beagle',
            'bulldog': 'Bulldog', 'english bulldog': 'Bulldog',
            'poodle': 'Poodle',
            'siamese': 'Siamese',
            'persian': 'Persian',
            'maine coon': 'Maine Coon',
            'bengal': 'Bengal',
            'ragdoll': 'Ragdoll',
            'scottish fold': 'Scottish Fold',
            'british shorthair': 'British Shorthair',
            'yorkshire terrier': 'Yorkshire Terrier', 'yorkie': 'Yorkshire Terrier',
            'chihuahua': 'Chihuahua',
            'dachshund': 'Dachshund',
            'siberian husky': 'Siberian Husky', 'husky': 'Siberian Husky',
            'boxer': 'Boxer',
            'rottweiler': 'Rottweiler',
            'doberman': 'Doberman',
            'australian shepherd': 'Australian Shepherd', 'aussie': 'Australian Shepherd'
        }

    def clean_text(self, text: str) -> str:
        """Clean and standardize text data"""
        if pd.isna(text) or text == '':
            return ''
        
        # Convert to lowercase and strip whitespace
        text = str(text).lower().strip()
        
        # Remove extra whitespace and special characters
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'[^\w\s\-\.]', '', text)
        
        return text

    def standardize_symptom(self, symptom: str) -> str:
        """Standardize symptom names using mappings"""
        if pd.isna(symptom) or symptom == '':
            return ''
        
        symptom_clean = self.clean_text(symptom)
        
        # Check for exact matches in mappings
        for key, value in self.symptom_mappings.items():
            if key in symptom_clean:
                return value
        
        # If no mapping found, capitalize first letter of each word
        return ' '.join(word.capitalize() for word in symptom_clean.split())

    def standardize_animal_type(self, animal_type: str) -> str:
        """Standardize animal type names"""
        if pd.isna(animal_type) or animal_type == '':
            return 'Unknown'
        
        animal_clean = self.clean_text(animal_type)
        
        for key, value in self.animal_type_mappings.items():
            if key in animal_clean:
                return value
        
        return animal_type.title()

    def standardize_breed(self, breed: str) -> str:
        """Standardize breed names"""
        if pd.isna(breed) or breed == '':
            return 'Mixed Breed'
        
        breed_clean = self.clean_text(breed)
        
        for key, value in self.breed_mappings.items():
            if key in breed_clean:
                return value
        
        return breed.title()

    def clean_pet_health_symptoms(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean the pet health symptoms dataset"""
        print("Cleaning Pet Health Symptoms dataset...")
        
        # Create a copy to avoid modifying original
        cleaned_df = df.copy()
        
        # Clean text descriptions
        cleaned_df['text_cleaned'] = cleaned_df['text'].apply(self.clean_text)
        
        # Standardize conditions
        cleaned_df['condition_standardized'] = cleaned_df['condition'].apply(self.standardize_symptom)
        
        # Extract symptoms from text using keyword matching
        symptoms_list = []
        for text in cleaned_df['text_cleaned']:
            found_symptoms = []
            for symptom_key in self.symptom_mappings.keys():
                if symptom_key in text:
                    found_symptoms.append(self.symptom_mappings[symptom_key])
            symptoms_list.append('; '.join(set(found_symptoms)) if found_symptoms else '')
        
        cleaned_df['extracted_symptoms'] = symptoms_list
        
        # Create standardized columns for merging
        cleaned_df['animal_type'] = 'Unknown'  # Not specified in this dataset
        cleaned_df['breed'] = 'Unknown'
        cleaned_df['age'] = np.nan
        cleaned_df['weight'] = np.nan
        cleaned_df['gender'] = 'Unknown'
        cleaned_df['primary_symptom'] = cleaned_df['condition_standardized']
        cleaned_df['secondary_symptoms'] = cleaned_df['extracted_symptoms']
        cleaned_df['record_type'] = cleaned_df['record_type']
        cleaned_df['data_source'] = 'Pet Health Symptoms'
        
        return cleaned_df

    def clean_animal_disease_prediction(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean the animal disease prediction dataset"""
        print("Cleaning Animal Disease Prediction dataset...")
        
        cleaned_df = df.copy()
        
        # Standardize animal types and breeds
        cleaned_df['animal_type'] = cleaned_df['Animal_Type'].apply(self.standardize_animal_type)
        cleaned_df['breed'] = cleaned_df['Breed'].apply(self.standardize_breed)
        
        # Clean age and weight
        cleaned_df['age'] = pd.to_numeric(cleaned_df['Age'], errors='coerce')
        cleaned_df['weight'] = pd.to_numeric(cleaned_df['Weight'], errors='coerce')
        cleaned_df['gender'] = cleaned_df['Gender'].str.title()
        
        # Standardize symptoms
        symptom_columns = ['Symptom_1', 'Symptom_2', 'Symptom_3', 'Symptom_4']
        standardized_symptoms = []
        
        for _, row in cleaned_df.iterrows():
            symptoms = []
            for col in symptom_columns:
                if pd.notna(row[col]) and row[col] != '':
                    symptoms.append(self.standardize_symptom(row[col]))
            
            standardized_symptoms.append('; '.join(symptoms))
        
        cleaned_df['primary_symptom'] = cleaned_df['Symptom_1'].apply(self.standardize_symptom)
        cleaned_df['secondary_symptoms'] = standardized_symptoms
        
        # Add boolean symptom indicators
        boolean_symptoms = ['Appetite_Loss', 'Vomiting', 'Diarrhea', 'Coughing', 
                           'Labored_Breathing', 'Lameness', 'Skin_Lesions', 
                           'Nasal_Discharge', 'Eye_Discharge']
        
        for symptom in boolean_symptoms:
            cleaned_df[f'has_{symptom.lower()}'] = cleaned_df[symptom].map({'Yes': True, 'No': False})
        
        # Clean vital signs
        cleaned_df['body_temperature'] = cleaned_df['Body_Temperature'].str.extract(r'(\d+\.?\d*)').astype(float)
        cleaned_df['heart_rate'] = pd.to_numeric(cleaned_df['Heart_Rate'], errors='coerce')
        
        # Add disease prediction
        cleaned_df['disease_prediction'] = cleaned_df['Disease_Prediction']
        cleaned_df['data_source'] = 'Animal Disease Prediction'
        
        return cleaned_df

    def clean_animal_symptoms_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean the animal symptoms data dataset"""
        print("Cleaning Animal Symptoms Data dataset...")
        
        cleaned_df = df.copy()
        
        # Standardize animal type
        cleaned_df['animal_type'] = cleaned_df['AnimalName'].apply(self.standardize_animal_type)
        cleaned_df['breed'] = 'Unknown'  # Not specified in this dataset
        
        # Standardize symptoms
        symptom_columns = ['symptoms1', 'symptoms2', 'symptoms3', 'symptoms4', 'symptoms5']
        standardized_symptoms = []
        
        for _, row in cleaned_df.iterrows():
            symptoms = []
            for col in symptom_columns:
                if pd.notna(row[col]) and row[col] != '':
                    symptoms.append(self.standardize_symptom(row[col]))
            
            standardized_symptoms.append('; '.join(symptoms))
        
        cleaned_df['primary_symptom'] = cleaned_df['symptoms1'].apply(self.standardize_symptom)
        cleaned_df['secondary_symptoms'] = standardized_symptoms
        
        # Add danger assessment
        cleaned_df['is_dangerous'] = cleaned_df['Dangerous'].map({'Yes': True, 'No': False})
        
        # Add missing columns
        cleaned_df['age'] = np.nan
        cleaned_df['weight'] = np.nan
        cleaned_df['gender'] = 'Unknown'
        cleaned_df['data_source'] = 'Animal Symptoms Data'
        
        return cleaned_df

    def clean_synthetic_dog_health_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean the synthetic dog health data dataset"""
        print("Cleaning Synthetic Dog Health Data dataset...")
        
        cleaned_df = df.copy()
        
        # Standardize animal type (all dogs in this dataset)
        cleaned_df['animal_type'] = 'Dog'
        cleaned_df['breed'] = cleaned_df['Breed'].apply(self.standardize_breed)
        
        # Clean demographics
        cleaned_df['age'] = pd.to_numeric(cleaned_df['Age'], errors='coerce')
        cleaned_df['weight'] = pd.to_numeric(cleaned_df['Weight (lbs)'], errors='coerce') * 0.453592  # Convert to kg
        cleaned_df['gender'] = cleaned_df['Sex'].str.title()
        
        # Create health indicators based on available data
        health_indicators = []
        for _, row in cleaned_df.iterrows():
            indicators = []
            
            # Check for health issues based on available data
            if pd.notna(row['Seizures']) and row['Seizures'] == 'Yes':
                indicators.append('Seizures')
            if pd.notna(row['Medications']) and row['Medications'] == 'Yes':
                indicators.append('On Medications')
            if pd.notna(row['Healthy']) and row['Healthy'] == 'No':
                indicators.append('Unhealthy')
            
            health_indicators.append('; '.join(indicators) if indicators else 'Healthy')
        
        cleaned_df['primary_symptom'] = health_indicators
        cleaned_df['secondary_symptoms'] = ''
        
        # Add lifestyle factors
        cleaned_df['activity_level'] = cleaned_df['Daily Activity Level']
        cleaned_df['diet_type'] = cleaned_df['Diet']
        cleaned_df['is_healthy'] = cleaned_df['Healthy'].map({'Yes': True, 'No': False})
        
        # Add missing columns
        cleaned_df['data_source'] = 'Synthetic Dog Health Data'
        
        return cleaned_df

    def clean_veterinary_clinical_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean the veterinary clinical data dataset"""
        print("Cleaning Veterinary Clinical Data dataset...")
        
        cleaned_df = df.copy()
        
        # Standardize animal type and breed
        cleaned_df['animal_type'] = cleaned_df['AnimalName'].apply(self.standardize_animal_type)
        cleaned_df['breed'] = cleaned_df['Breed'].apply(self.standardize_breed)
        
        # Clean demographics
        cleaned_df['age'] = pd.to_numeric(cleaned_df['Age'], errors='coerce')
        cleaned_df['weight'] = pd.to_numeric(cleaned_df['Weight_kg'], errors='coerce')
        cleaned_df['gender'] = 'Unknown'  # Not specified in this dataset
        
        # Standardize symptoms
        symptom_columns = ['Symptom_1', 'Symptom_2', 'Symptom_3', 'Symptom_4', 'Symptom_5']
        standardized_symptoms = []
        
        for _, row in cleaned_df.iterrows():
            symptoms = []
            for col in symptom_columns:
                if pd.notna(row[col]) and row[col] != '':
                    symptoms.append(self.standardize_symptom(row[col]))
            
            standardized_symptoms.append('; '.join(symptoms))
        
        cleaned_df['primary_symptom'] = cleaned_df['Symptom_1'].apply(self.standardize_symptom)
        cleaned_df['secondary_symptoms'] = standardized_symptoms
        
        # Add medical history
        cleaned_df['medical_history'] = cleaned_df['MedicalHistory']
        cleaned_df['data_source'] = 'Veterinary Clinical Data'
        
        return cleaned_df

    def merge_datasets(self) -> pd.DataFrame:
        """Merge all cleaned datasets into a unified dataset"""
        print("Merging all datasets...")
        
        # Define common columns for merging
        common_columns = [
            'animal_type', 'breed', 'age', 'weight', 'gender',
            'primary_symptom', 'secondary_symptoms', 'data_source'
        ]
        
        merged_data = []
        
        for dataset_name, df in self.cleaned_datasets.items():
            # Select only common columns that exist in the dataset
            available_columns = [col for col in common_columns if col in df.columns]
            subset_df = df[available_columns].copy()
            
            # Add missing columns with default values
            for col in common_columns:
                if col not in subset_df.columns:
                    if col in ['age', 'weight']:
                        subset_df[col] = np.nan
                    else:
                        subset_df[col] = 'Unknown'
            
            # Reorder columns to match common_columns
            subset_df = subset_df[common_columns]
            merged_data.append(subset_df)
        
        # Combine all datasets
        self.merged_dataset = pd.concat(merged_data, ignore_index=True)
        
        # Remove duplicates based on key fields
        self.merged_dataset = self.merged_dataset.drop_duplicates(
            subset=['animal_type', 'breed', 'primary_symptom', 'secondary_symptoms'],
            keep='first'
        )
        
        print(f"Merged dataset shape: {self.merged_dataset.shape}")
        return self.merged_dataset

    def add_derived_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add derived features to the merged dataset"""
        print("Adding derived features...")
        
        # Age categories
        df['age_category'] = pd.cut(df['age'], 
                                   bins=[0, 1, 3, 7, 15, 100], 
                                   labels=['Puppy/Kitten', 'Young', 'Adult', 'Senior', 'Geriatric'],
                                   include_lowest=True)
        
        # Weight categories (in kg)
        df['weight_category'] = pd.cut(df['weight'],
                                      bins=[0, 5, 15, 30, 50, 1000],
                                      labels=['Small', 'Medium', 'Large', 'XLarge', 'Giant'],
                                      include_lowest=True)
        
        # Symptom count
        df['symptom_count'] = df['secondary_symptoms'].apply(
            lambda x: len([s for s in str(x).split(';') if s.strip()]) if pd.notna(x) else 0
        )
        
        # Common symptom flags
        common_symptoms = ['Fever', 'Vomiting', 'Diarrhea', 'Lethargy', 'Coughing', 
                          'Appetite Loss', 'Skin Lesions', 'Lameness']
        
        for symptom in common_symptoms:
            df[f'has_{symptom.lower().replace(" ", "_")}'] = (
                df['primary_symptom'].str.contains(symptom, case=False, na=False) |
                df['secondary_symptoms'].str.contains(symptom, case=False, na=False)
            )
        
        return df

    def clean_and_merge_all(self) -> pd.DataFrame:
        """Main method to clean and merge all datasets"""
        print("Starting dataset cleaning and merging process...")
        
        # Load all datasets
        datasets = {
            'pet_health_symptoms': pd.read_csv('archive/pet-health-symptoms-dataset.csv'),
            'animal_disease_prediction': pd.read_csv('archive (1)/cleaned_animal_disease_prediction.csv'),
            'animal_symptoms_data': pd.read_csv('archive (2)/data.csv'),
            'synthetic_dog_health_data': pd.read_csv('archive (3)/synthetic_dog_breed_health_data.csv'),
            'veterinary_clinical_data': pd.read_csv('veterinary clinic/veterinary_clinical_data.csv')
        }
        
        # Clean each dataset
        self.cleaned_datasets['pet_health_symptoms'] = self.clean_pet_health_symptoms(datasets['pet_health_symptoms'])
        self.cleaned_datasets['animal_disease_prediction'] = self.clean_animal_disease_prediction(datasets['animal_disease_prediction'])
        self.cleaned_datasets['animal_symptoms_data'] = self.clean_animal_symptoms_data(datasets['animal_symptoms_data'])
        self.cleaned_datasets['synthetic_dog_health_data'] = self.clean_synthetic_dog_health_data(datasets['synthetic_dog_health_data'])
        self.cleaned_datasets['veterinary_clinical_data'] = self.clean_veterinary_clinical_data(datasets['veterinary_clinical_data'])
        
        # Merge datasets
        merged_df = self.merge_datasets()
        
        # Add derived features
        final_df = self.add_derived_features(merged_df)
        
        # Save the merged dataset
        final_df.to_csv('merged_veterinary_dataset.csv', index=False)
        print(f"Final merged dataset saved as 'merged_veterinary_dataset.csv'")
        print(f"Final dataset shape: {final_df.shape}")
        
        # Generate summary statistics
        self.generate_summary_report(final_df)
        
        return final_df

    def generate_summary_report(self, df: pd.DataFrame):
        """Generate a summary report of the merged dataset"""
        print("\n" + "="*50)
        print("MERGED DATASET SUMMARY REPORT")
        print("="*50)
        
        print(f"Total records: {len(df)}")
        print(f"Total columns: {len(df.columns)}")
        
        print(f"\nAnimal Type Distribution:")
        print(df['animal_type'].value_counts())
        
        print(f"\nData Source Distribution:")
        print(df['data_source'].value_counts())
        
        print(f"\nPrimary Symptom Distribution (Top 10):")
        print(df['primary_symptom'].value_counts().head(10))
        
        print(f"\nMissing Values:")
        missing_data = df.isnull().sum()
        print(missing_data[missing_data > 0])
        
        print(f"\nAge Statistics:")
        print(df['age'].describe())
        
        print(f"\nWeight Statistics (kg):")
        print(df['weight'].describe())
        
        print(f"\nSymptom Count Statistics:")
        print(df['symptom_count'].describe())

def main():
    """Main execution function"""
    cleaner = VeterinaryDatasetCleaner()
    merged_dataset = cleaner.clean_and_merge_all()
    
    print("\nDataset cleaning and merging completed successfully!")
    print("The merged dataset is ready for AI model training.")

if __name__ == "__main__":
    main()
