#!/usr/bin/env python3
"""
Final Training Dataset Creation for AI Veterinary Assistant
This script creates the final, production-ready training dataset with comprehensive preprocessing.
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, RobustScaler
from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.utils.class_weight import compute_class_weight
import json
import pickle
from typing import Dict, List, Tuple
import warnings
warnings.filterwarnings('ignore')

class FinalTrainingDatasetCreator:
    def __init__(self):
        self.scalers = {}
        self.class_weights = {}
        self.feature_importance = {}
        
    def load_enhanced_data(self) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
        """Load the enhanced dataset and training data"""
        print("Loading enhanced dataset...")
        
        # Load enhanced dataset
        enhanced_df = pd.read_csv('enhanced_veterinary_dataset.csv')
        
        # Load training data
        X_train = pd.read_csv('X_train.csv')
        X_test = pd.read_csv('X_test.csv')
        y_train = pd.read_csv('y_train.csv')
        y_test = pd.read_csv('y_test.csv')
        
        print(f"Enhanced dataset shape: {enhanced_df.shape}")
        print(f"Training features shape: {X_train.shape}")
        print(f"Training targets shape: {y_train.shape}")
        
        return enhanced_df, X_train, X_test, y_train, y_test

    def create_balanced_dataset(self, X: pd.DataFrame, y: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """Create a more balanced dataset using various techniques"""
        print("Creating balanced dataset...")
        
        # Reset indices to avoid issues
        X_reset = X.reset_index(drop=True)
        y_reset = y.reset_index(drop=True)
        
        # Remove overlapping columns from X (keep them in y)
        overlapping_cols = set(X_reset.columns) & set(y_reset.columns)
        if overlapping_cols:
            print(f"Removing overlapping columns from features: {overlapping_cols}")
            X_reset = X_reset.drop(columns=list(overlapping_cols))
        
        # Combine features and targets
        combined = pd.concat([X_reset, y_reset], axis=1)
        
        # Separate by target classes for emergency prediction
        emergency_cases = combined[combined['is_emergency'] == 1]
        non_emergency_cases = combined[combined['is_emergency'] == 0]
        
        print(f"Emergency cases: {len(emergency_cases)}")
        print(f"Non-emergency cases: {len(non_emergency_cases)}")
        
        # For emergency cases, we'll use all of them
        # For non-emergency cases, we'll sample to create better balance
        if len(emergency_cases) > 0:
            # Sample non-emergency cases to be 3x the emergency cases
            sample_size = min(len(non_emergency_cases), len(emergency_cases) * 3)
            non_emergency_sampled = non_emergency_cases.sample(n=sample_size, random_state=42)
            
            # Combine balanced dataset
            balanced_df = pd.concat([emergency_cases, non_emergency_sampled], ignore_index=True)
        else:
            balanced_df = combined
        
        # Shuffle the dataset
        balanced_df = balanced_df.sample(frac=1, random_state=42).reset_index(drop=True)
        
        # Split back into features and targets
        target_columns = ['is_emergency', 'severity_class', 'symptom_class', 'needs_immediate_attention']
        feature_columns = [col for col in balanced_df.columns if col not in target_columns]
        
        X_balanced = balanced_df[feature_columns]
        y_balanced = balanced_df[target_columns]
        
        print(f"Balanced dataset shape: {X_balanced.shape}")
        print(f"Emergency cases in balanced set: {y_balanced['is_emergency'].sum()}")
        
        return X_balanced, y_balanced

    def scale_features(self, X_train: pd.DataFrame, X_test: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """Scale features using appropriate scaling methods"""
        print("Scaling features...")
        
        # Identify numerical columns
        numerical_columns = X_train.select_dtypes(include=[np.number]).columns
        
        # Use RobustScaler for numerical features (less sensitive to outliers)
        scaler = RobustScaler()
        
        X_train_scaled = X_train.copy()
        X_test_scaled = X_test.copy()
        
        # Scale numerical features
        X_train_scaled[numerical_columns] = scaler.fit_transform(X_train[numerical_columns])
        X_test_scaled[numerical_columns] = scaler.transform(X_test[numerical_columns])
        
        # Save scaler for later use
        self.scalers['robust_scaler'] = scaler
        
        print(f"Scaled {len(numerical_columns)} numerical features")
        
        return X_train_scaled, X_test_scaled

    def compute_class_weights(self, y: pd.DataFrame) -> Dict:
        """Compute class weights for imbalanced datasets"""
        print("Computing class weights...")
        
        class_weights = {}
        
        # For emergency prediction (binary)
        emergency_classes = np.unique(y['is_emergency'])
        emergency_weights = compute_class_weight(
            'balanced', 
            classes=emergency_classes, 
            y=y['is_emergency']
        )
        class_weights['emergency'] = dict(zip(emergency_classes, emergency_weights))
        
        # For severity classification (multi-class)
        severity_classes = np.unique(y['severity_class'])
        severity_weights = compute_class_weight(
            'balanced',
            classes=severity_classes,
            y=y['severity_class']
        )
        class_weights['severity'] = dict(zip(severity_classes, severity_weights))
        
        # For immediate attention (binary)
        attention_classes = np.unique(y['needs_immediate_attention'])
        attention_weights = compute_class_weight(
            'balanced',
            classes=attention_classes,
            y=y['needs_immediate_attention']
        )
        class_weights['immediate_attention'] = dict(zip(attention_classes, attention_weights))
        
        self.class_weights = class_weights
        
        print("Class weights computed:")
        for task, weights in class_weights.items():
            print(f"  {task}: {weights}")
        
        return class_weights

    def create_cross_validation_splits(self, X: pd.DataFrame, y: pd.DataFrame, n_splits: int = 5) -> List:
        """Create cross-validation splits"""
        print(f"Creating {n_splits}-fold cross-validation splits...")
        
        # Use stratified k-fold based on severity class
        skf = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=42)
        
        cv_splits = []
        for train_idx, val_idx in skf.split(X, y['severity_class']):
            cv_splits.append({
                'train': (X.iloc[train_idx], y.iloc[train_idx]),
                'validation': (X.iloc[val_idx], y.iloc[val_idx])
            })
        
        print(f"Created {len(cv_splits)} cross-validation splits")
        return cv_splits

    def create_feature_importance_ranking(self, X: pd.DataFrame, y: pd.DataFrame) -> Dict:
        """Create feature importance ranking using correlation analysis"""
        print("Creating feature importance ranking...")
        
        feature_importance = {}
        
        # Calculate correlation with each target
        for target in ['is_emergency', 'severity_class', 'needs_immediate_attention']:
            if target in y.columns:
                correlations = X.corrwith(y[target]).abs().sort_values(ascending=False)
                feature_importance[target] = correlations.to_dict()
        
        self.feature_importance = feature_importance
        
        # Save top features for each target
        top_features = {}
        for target, correlations in feature_importance.items():
            top_features[target] = list(correlations.keys())[:20]  # Top 20 features
        
        return top_features

    def create_final_dataset(self) -> Dict:
        """Create the final training dataset with all preprocessing"""
        print("Creating final training dataset...")
        
        # Load data
        enhanced_df, X_train, X_test, y_train, y_test = self.load_enhanced_data()
        
        # Create balanced dataset
        X_balanced, y_balanced = self.create_balanced_dataset(X_train, y_train)
        
        # Scale features
        X_train_scaled, X_test_scaled = self.scale_features(X_balanced, X_test)
        
        # Compute class weights
        class_weights = self.compute_class_weights(y_balanced)
        
        # Create cross-validation splits
        cv_splits = self.create_cross_validation_splits(X_train_scaled, y_balanced)
        
        # Create feature importance ranking
        top_features = self.create_feature_importance_ranking(X_train_scaled, y_balanced)
        
        # Create final dataset dictionary
        final_dataset = {
            'train': {
                'X': X_train_scaled,
                'y': y_balanced
            },
            'test': {
                'X': X_test_scaled,
                'y': y_test
            },
            'cv_splits': cv_splits,
            'class_weights': class_weights,
            'feature_importance': self.feature_importance,
            'top_features': top_features,
            'scalers': self.scalers,
            'metadata': {
                'total_samples': len(enhanced_df),
                'training_samples': len(X_train_scaled),
                'test_samples': len(X_test_scaled),
                'features_count': X_train_scaled.shape[1],
                'targets_count': y_balanced.shape[1],
                'cv_folds': len(cv_splits)
            }
        }
        
        return final_dataset

    def save_final_dataset(self, final_dataset: Dict):
        """Save the final dataset and all related files"""
        print("Saving final dataset...")
        
        # Save training and test data
        final_dataset['train']['X'].to_csv('final_X_train.csv', index=False)
        final_dataset['train']['y'].to_csv('final_y_train.csv', index=False)
        final_dataset['test']['X'].to_csv('final_X_test.csv', index=False)
        final_dataset['test']['y'].to_csv('final_y_test.csv', index=False)
        
        # Save cross-validation splits
        for i, split in enumerate(final_dataset['cv_splits']):
            split['train'][0].to_csv(f'cv_train_X_fold_{i}.csv', index=False)
            split['train'][1].to_csv(f'cv_train_y_fold_{i}.csv', index=False)
            split['validation'][0].to_csv(f'cv_val_X_fold_{i}.csv', index=False)
            split['validation'][1].to_csv(f'cv_val_y_fold_{i}.csv', index=False)
        
        # Save class weights (convert numpy types to Python types)
        class_weights_serializable = {}
        for task, weights in final_dataset['class_weights'].items():
            class_weights_serializable[task] = {str(k): float(v) for k, v in weights.items()}
        
        with open('class_weights.json', 'w') as f:
            json.dump(class_weights_serializable, f, indent=2)
        
        # Save feature importance (convert numpy types to Python types)
        feature_importance_serializable = {}
        for task, importance in final_dataset['feature_importance'].items():
            feature_importance_serializable[task] = {str(k): float(v) for k, v in importance.items()}
        
        with open('feature_importance.json', 'w') as f:
            json.dump(feature_importance_serializable, f, indent=2)
        
        # Save top features
        with open('top_features.json', 'w') as f:
            json.dump(final_dataset['top_features'], f, indent=2)
        
        # Save scalers
        with open('scalers.pkl', 'wb') as f:
            pickle.dump(final_dataset['scalers'], f)
        
        # Save metadata
        with open('dataset_metadata.json', 'w') as f:
            json.dump(final_dataset['metadata'], f, indent=2)
        
        # Save feature names
        feature_names = list(final_dataset['train']['X'].columns)
        with open('final_feature_names.txt', 'w') as f:
            f.write('\n'.join(feature_names))
        
        print("Final dataset saved successfully!")

    def generate_final_report(self, final_dataset: Dict):
        """Generate a comprehensive final report"""
        print("\n" + "="*70)
        print("FINAL TRAINING DATASET REPORT")
        print("="*70)
        
        metadata = final_dataset['metadata']
        print(f"Total samples in original dataset: {metadata['total_samples']}")
        print(f"Training samples: {metadata['training_samples']}")
        print(f"Test samples: {metadata['test_samples']}")
        print(f"Number of features: {metadata['features_count']}")
        print(f"Number of targets: {metadata['targets_count']}")
        print(f"Cross-validation folds: {metadata['cv_folds']}")
        
        print(f"\nTraining Set Target Distributions:")
        y_train = final_dataset['train']['y']
        for col in y_train.columns:
            if col in ['is_emergency', 'needs_immediate_attention']:
                print(f"  {col}: {y_train[col].value_counts().to_dict()}")
            else:
                print(f"  {col}: {y_train[col].value_counts().sort_index().to_dict()}")
        
        print(f"\nTop 10 Most Important Features for Emergency Prediction:")
        emergency_features = final_dataset['top_features']['is_emergency'][:10]
        for i, feature in enumerate(emergency_features, 1):
            importance = final_dataset['feature_importance']['is_emergency'][feature]
            print(f"  {i:2d}. {feature}: {importance:.4f}")
        
        print(f"\nTop 10 Most Important Features for Severity Classification:")
        severity_features = final_dataset['top_features']['severity_class'][:10]
        for i, feature in enumerate(severity_features, 1):
            importance = final_dataset['feature_importance']['severity_class'][feature]
            print(f"  {i:2d}. {feature}: {importance:.4f}")
        
        print(f"\nClass Weights:")
        for task, weights in final_dataset['class_weights'].items():
            print(f"  {task}: {weights}")
        
        print(f"\nFiles Created:")
        print("  - final_X_train.csv, final_y_train.csv (training data)")
        print("  - final_X_test.csv, final_y_test.csv (test data)")
        print("  - cv_*_fold_*.csv (cross-validation splits)")
        print("  - class_weights.json (class weights for imbalanced learning)")
        print("  - feature_importance.json (feature importance scores)")
        print("  - top_features.json (top features for each task)")
        print("  - scalers.pkl (fitted scalers)")
        print("  - dataset_metadata.json (dataset metadata)")
        print("  - final_feature_names.txt (feature names)")

def main():
    """Main execution function"""
    creator = FinalTrainingDatasetCreator()
    
    # Create final dataset
    final_dataset = creator.create_final_dataset()
    
    # Save final dataset
    creator.save_final_dataset(final_dataset)
    
    # Generate final report
    creator.generate_final_report(final_dataset)
    
    print("\n" + "="*70)
    print("FINAL TRAINING DATASET CREATION COMPLETED SUCCESSFULLY!")
    print("="*70)
    print("The dataset is now ready for AI model training with:")
    print("✓ Balanced training data")
    print("✓ Properly scaled features")
    print("✓ Cross-validation splits")
    print("✓ Class weights for imbalanced learning")
    print("✓ Feature importance rankings")
    print("✓ Multiple prediction targets")
    print("✓ Production-ready format")

if __name__ == "__main__":
    main()
