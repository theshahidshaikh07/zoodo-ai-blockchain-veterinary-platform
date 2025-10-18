#!/usr/bin/env python3
"""
Enhanced Dataset Preparation for AI Veterinary Assistant Training
This script creates additional features and prepares the dataset for machine learning.
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
import re
from typing import Dict, List, Tuple
import warnings
warnings.filterwarnings('ignore')

class VeterinaryDatasetEnhancer:
    def __init__(self):
        self.label_encoders = {}
        self.scalers = {}
        
        # Define symptom severity levels
        self.severity_mapping = {
            'Fever': 'High',
            'Seizures': 'Critical',
            'Labored Breathing': 'Critical',
            'Sudden Death': 'Critical',
            'Vomiting': 'Medium',
            'Diarrhea': 'Medium',
            'Lethargy': 'Medium',
            'Coughing': 'Low',
            'Sneezing': 'Low',
            'Appetite Loss': 'Medium',
            'Weight Loss': 'High',
            'Pain': 'High',
            'Skin Lesions': 'Medium',
            'Lameness': 'Medium',
            'Nasal Discharge': 'Low',
            'Eye Discharge': 'Low'
        }
        
        # Define emergency symptoms
        self.emergency_symptoms = {
            'Seizures', 'Labored Breathing', 'Sudden Death', 'Unconsciousness',
            'Severe Bleeding', 'Difficulty Breathing', 'Choking', 'Shock'
        }
        
        # Define chronic conditions
        self.chronic_conditions = {
            'Diabetes', 'Kidney Disease', 'Heart Disease', 'Arthritis',
            'Cancer', 'Chronic Pain', 'Allergies', 'Epilepsy'
        }

    def add_symptom_severity(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add symptom severity classification"""
        print("Adding symptom severity classification...")
        
        def get_severity(symptom):
            if pd.isna(symptom) or symptom == '':
                return 'Unknown'
            return self.severity_mapping.get(symptom, 'Low')
        
        df['symptom_severity'] = df['primary_symptom'].apply(get_severity)
        
        # Add emergency flag
        df['is_emergency'] = df['primary_symptom'].isin(self.emergency_symptoms)
        
        # Add chronic condition flag
        df['is_chronic'] = df['primary_symptom'].isin(self.chronic_conditions)
        
        return df

    def add_breed_characteristics(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add breed-specific characteristics"""
        print("Adding breed characteristics...")
        
        # Define breed size categories
        breed_sizes = {
            'Chihuahua': 'Toy', 'Yorkshire Terrier': 'Toy', 'Pomeranian': 'Toy',
            'Beagle': 'Small', 'Dachshund': 'Small', 'Poodle': 'Small',
            'Labrador Retriever': 'Large', 'Golden Retriever': 'Large', 
            'German Shepherd': 'Large', 'Rottweiler': 'Large',
            'Great Dane': 'Giant', 'Mastiff': 'Giant', 'Saint Bernard': 'Giant'
        }
        
        # Define breed health predispositions
        breed_health_risks = {
            'Bulldog': 'Respiratory', 'Pug': 'Respiratory', 'Boxer': 'Cardiac',
            'German Shepherd': 'Hip Dysplasia', 'Labrador Retriever': 'Obesity',
            'Golden Retriever': 'Cancer', 'Beagle': 'Epilepsy',
            'Dachshund': 'Back Problems', 'Poodle': 'Skin Issues'
        }
        
        df['breed_size'] = df['breed'].map(breed_sizes).fillna('Unknown')
        df['breed_health_risk'] = df['breed'].map(breed_health_risks).fillna('Low Risk')
        
        return df

    def add_age_life_stage_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add age-related features"""
        print("Adding age and life stage features...")
        
        # Define life stages based on animal type and age
        def get_life_stage(row):
            animal_type = row['animal_type']
            age = row['age']
            
            if pd.isna(age):
                return 'Unknown'
            
            if animal_type == 'Dog':
                if age < 1:
                    return 'Puppy'
                elif age < 3:
                    return 'Young Adult'
                elif age < 7:
                    return 'Adult'
                elif age < 10:
                    return 'Senior'
                else:
                    return 'Geriatric'
            elif animal_type == 'Cat':
                if age < 1:
                    return 'Kitten'
                elif age < 3:
                    return 'Young Adult'
                elif age < 7:
                    return 'Adult'
                elif age < 10:
                    return 'Senior'
                else:
                    return 'Geriatric'
            else:
                if age < 2:
                    return 'Juvenile'
                elif age < 5:
                    return 'Adult'
                else:
                    return 'Senior'
        
        df['life_stage'] = df.apply(get_life_stage, axis=1)
        
        # Add age-related health risk factors
        df['is_young'] = df['age'] < 2
        df['is_senior'] = df['age'] > 7
        
        return df

    def add_weight_health_indicators(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add weight-related health indicators"""
        print("Adding weight health indicators...")
        
        # Calculate BMI-like indicator (weight/age ratio for animals)
        df['weight_age_ratio'] = df['weight'] / (df['age'] + 1)  # +1 to avoid division by zero
        
        # Define weight categories based on animal type
        def get_weight_status(row):
            animal_type = row['animal_type']
            weight = row['weight']
            age = row['age']
            
            if pd.isna(weight) or pd.isna(age):
                return 'Unknown'
            
            if animal_type == 'Dog':
                if weight < 5:
                    return 'Underweight'
                elif weight > 50:
                    return 'Overweight'
                else:
                    return 'Normal'
            elif animal_type == 'Cat':
                if weight < 2:
                    return 'Underweight'
                elif weight > 8:
                    return 'Overweight'
                else:
                    return 'Normal'
            else:
                return 'Unknown'
        
        df['weight_status'] = df.apply(get_weight_status, axis=1)
        
        return df

    def add_symptom_combinations(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add common symptom combination patterns"""
        print("Adding symptom combination patterns...")
        
        # Define common symptom patterns
        def get_symptom_pattern(row):
            primary = str(row['primary_symptom']).lower()
            secondary = str(row['secondary_symptoms']).lower()
            all_symptoms = f"{primary} {secondary}"
            
            patterns = []
            
            # Gastrointestinal pattern
            if any(s in all_symptoms for s in ['vomiting', 'diarrhea', 'appetite loss']):
                patterns.append('Gastrointestinal')
            
            # Respiratory pattern
            if any(s in all_symptoms for s in ['coughing', 'sneezing', 'nasal discharge', 'labored breathing']):
                patterns.append('Respiratory')
            
            # Neurological pattern
            if any(s in all_symptoms for s in ['lethargy', 'seizures', 'weakness']):
                patterns.append('Neurological')
            
            # Dermatological pattern
            if any(s in all_symptoms for s in ['skin lesions', 'itching', 'hair loss']):
                patterns.append('Dermatological')
            
            # Musculoskeletal pattern
            if any(s in all_symptoms for s in ['lameness', 'stiffness', 'pain']):
                patterns.append('Musculoskeletal')
            
            return '; '.join(patterns) if patterns else 'General'
        
        df['symptom_pattern'] = df.apply(get_symptom_pattern, axis=1)
        
        return df

    def add_temporal_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add temporal and seasonal features"""
        print("Adding temporal features...")
        
        # Add synthetic temporal features (since we don't have actual dates)
        np.random.seed(42)  # For reproducibility
        df['season'] = np.random.choice(['Spring', 'Summer', 'Fall', 'Winter'], size=len(df))
        df['time_of_day'] = np.random.choice(['Morning', 'Afternoon', 'Evening', 'Night'], size=len(df))
        
        # Add urgency indicators based on symptoms
        df['urgency_level'] = df['symptom_severity'].map({
            'Critical': 4,
            'High': 3,
            'Medium': 2,
            'Low': 1,
            'Unknown': 0
        })
        
        return df

    def encode_categorical_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Encode categorical features for machine learning"""
        print("Encoding categorical features...")
        
        categorical_columns = [
            'animal_type', 'breed', 'gender', 'primary_symptom', 'symptom_severity',
            'breed_size', 'breed_health_risk', 'life_stage', 'weight_status',
            'symptom_pattern', 'season', 'time_of_day', 'data_source'
        ]
        
        df_encoded = df.copy()
        
        for col in categorical_columns:
            if col in df_encoded.columns:
                le = LabelEncoder()
                df_encoded[f'{col}_encoded'] = le.fit_transform(df_encoded[col].astype(str))
                self.label_encoders[col] = le
        
        return df_encoded

    def create_training_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create final training features"""
        print("Creating training features...")
        
        # Select features for training
        feature_columns = [
            'age', 'weight', 'symptom_count', 'weight_age_ratio',
            'is_young', 'is_senior', 'is_emergency', 'is_chronic',
            'urgency_level'
        ]
        
        # Add encoded categorical features
        encoded_columns = [col for col in df.columns if col.endswith('_encoded')]
        feature_columns.extend(encoded_columns)
        
        # Add boolean symptom flags
        boolean_columns = [col for col in df.columns if col.startswith('has_')]
        feature_columns.extend(boolean_columns)
        
        # Create feature matrix
        training_features = df[feature_columns].copy()
        
        # Handle missing values
        training_features = training_features.fillna(0)
        
        return training_features

    def create_target_variables(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create target variables for different prediction tasks"""
        print("Creating target variables...")
        
        targets = pd.DataFrame(index=df.index)
        
        # Binary classification: Is this an emergency?
        targets['is_emergency'] = df['is_emergency'].astype(int)
        
        # Multi-class: Symptom severity
        targets['severity_class'] = df['symptom_severity'].map({
            'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3, 'Unknown': 4
        })
        
        # Multi-class: Primary symptom prediction
        le_symptom = LabelEncoder()
        targets['symptom_class'] = le_symptom.fit_transform(df['primary_symptom'])
        self.label_encoders['primary_symptom_target'] = le_symptom
        
        # Binary: Does animal need immediate attention?
        targets['needs_immediate_attention'] = (
            (df['is_emergency']) | 
            (df['symptom_severity'] == 'High') |
            (df['age'] < 1)  # Young animals need more attention
        ).astype(int)
        
        return targets

    def split_data(self, features: pd.DataFrame, targets: pd.DataFrame, test_size: float = 0.2) -> Tuple:
        """Split data into training and testing sets"""
        print("Splitting data into training and testing sets...")
        
        X_train, X_test, y_train, y_test = train_test_split(
            features, targets, test_size=test_size, random_state=42, stratify=targets['severity_class']
        )
        
        return X_train, X_test, y_train, y_test

    def enhance_dataset(self, input_file: str = 'merged_veterinary_dataset.csv') -> pd.DataFrame:
        """Main method to enhance the dataset"""
        print("Starting dataset enhancement process...")
        
        # Load the merged dataset
        df = pd.read_csv(input_file)
        print(f"Loaded dataset with shape: {df.shape}")
        
        # Apply all enhancements
        df = self.add_symptom_severity(df)
        df = self.add_breed_characteristics(df)
        df = self.add_age_life_stage_features(df)
        df = self.add_weight_health_indicators(df)
        df = self.add_symptom_combinations(df)
        df = self.add_temporal_features(df)
        df = self.encode_categorical_features(df)
        
        # Create training features and targets
        training_features = self.create_training_features(df)
        targets = self.create_target_variables(df)
        
        # Split data
        X_train, X_test, y_train, y_test = self.split_data(training_features, targets)
        
        # Save enhanced dataset
        enhanced_df = df.copy()
        enhanced_df.to_csv('enhanced_veterinary_dataset.csv', index=False)
        
        # Save training data
        X_train.to_csv('X_train.csv', index=False)
        X_test.to_csv('X_test.csv', index=False)
        y_train.to_csv('y_train.csv', index=False)
        y_test.to_csv('y_test.csv', index=False)
        
        # Save feature names for later use
        feature_names = list(training_features.columns)
        with open('feature_names.txt', 'w') as f:
            f.write('\n'.join(feature_names))
        
        print(f"Enhanced dataset saved with shape: {enhanced_df.shape}")
        print(f"Training features shape: {X_train.shape}")
        print(f"Training targets shape: {y_train.shape}")
        
        # Generate enhancement report
        self.generate_enhancement_report(enhanced_df, targets)
        
        return enhanced_df, training_features, targets

    def generate_enhancement_report(self, df: pd.DataFrame, targets: pd.DataFrame):
        """Generate a report of the enhancement process"""
        print("\n" + "="*60)
        print("DATASET ENHANCEMENT REPORT")
        print("="*60)
        
        print(f"Enhanced dataset shape: {df.shape}")
        print(f"Total features created: {len(df.columns)}")
        
        print(f"\nSymptom Severity Distribution:")
        print(df['symptom_severity'].value_counts())
        
        print(f"\nEmergency Cases: {df['is_emergency'].sum()} ({df['is_emergency'].mean()*100:.1f}%)")
        print(f"Chronic Conditions: {df['is_chronic'].sum()} ({df['is_chronic'].mean()*100:.1f}%)")
        
        print(f"\nLife Stage Distribution:")
        print(df['life_stage'].value_counts())
        
        print(f"\nBreed Size Distribution:")
        print(df['breed_size'].value_counts())
        
        print(f"\nSymptom Pattern Distribution:")
        print(df['symptom_pattern'].value_counts())
        
        print(f"\nTarget Variable Distributions:")
        print(f"Emergency cases: {targets['is_emergency'].sum()}")
        print(f"Needs immediate attention: {targets['needs_immediate_attention'].sum()}")
        print(f"Severity classes: {targets['severity_class'].value_counts().sort_index()}")

def main():
    """Main execution function"""
    enhancer = VeterinaryDatasetEnhancer()
    enhanced_df, features, targets = enhancer.enhance_dataset()
    
    print("\nDataset enhancement completed successfully!")
    print("The enhanced dataset is ready for AI model training.")
    print("\nFiles created:")
    print("- enhanced_veterinary_dataset.csv (full enhanced dataset)")
    print("- X_train.csv, X_test.csv (training features)")
    print("- y_train.csv, y_test.csv (training targets)")
    print("- feature_names.txt (feature names for reference)")

if __name__ == "__main__":
    main()
