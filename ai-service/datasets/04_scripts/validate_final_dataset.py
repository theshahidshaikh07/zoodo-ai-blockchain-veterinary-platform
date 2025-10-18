#!/usr/bin/env python3
"""
Final Dataset Validation Script
This script validates the quality and completeness of the final training dataset.
"""

import pandas as pd
import numpy as np
import json
import pickle
from typing import Dict, List

def validate_final_dataset():
    """Validate the final training dataset"""
    print("="*60)
    print("FINAL DATASET VALIDATION REPORT")
    print("="*60)
    
    # Load the final training data
    try:
        X_train = pd.read_csv('final_X_train.csv')
        y_train = pd.read_csv('final_y_train.csv')
        X_test = pd.read_csv('final_X_test.csv')
        y_test = pd.read_csv('final_y_test.csv')
        
        print("✓ Successfully loaded all training and test files")
    except Exception as e:
        print(f"✗ Error loading files: {e}")
        return False
    
    # Load metadata
    try:
        with open('dataset_metadata.json', 'r') as f:
            metadata = json.load(f)
        with open('class_weights.json', 'r') as f:
            class_weights = json.load(f)
        with open('feature_importance.json', 'r') as f:
            feature_importance = json.load(f)
        
        print("✓ Successfully loaded metadata files")
    except Exception as e:
        print(f"✗ Error loading metadata: {e}")
        return False
    
    # Validate data shapes
    print(f"\nData Shapes:")
    print(f"  X_train: {X_train.shape}")
    print(f"  y_train: {y_train.shape}")
    print(f"  X_test: {X_test.shape}")
    print(f"  y_test: {y_test.shape}")
    
    # Validate metadata consistency
    expected_train_samples = metadata['training_samples']
    expected_test_samples = metadata['test_samples']
    expected_features = metadata['features_count']
    expected_targets = metadata['targets_count']
    
    print(f"\nMetadata Validation:")
    print(f"  Expected training samples: {expected_train_samples}, Actual: {len(X_train)}")
    print(f"  Expected test samples: {expected_test_samples}, Actual: {len(X_test)}")
    print(f"  Expected features: {expected_features}, Actual: {X_train.shape[1]}")
    print(f"  Expected targets: {expected_targets}, Actual: {y_train.shape[1]}")
    
    # Check for missing values
    print(f"\nMissing Values Check:")
    train_missing = X_train.isnull().sum().sum()
    test_missing = X_test.isnull().sum().sum()
    y_train_missing = y_train.isnull().sum().sum()
    y_test_missing = y_test.isnull().sum().sum()
    
    print(f"  X_train missing values: {train_missing}")
    print(f"  X_test missing values: {test_missing}")
    print(f"  y_train missing values: {y_train_missing}")
    print(f"  y_test missing values: {y_test_missing}")
    
    if train_missing == 0 and test_missing == 0 and y_train_missing == 0 and y_test_missing == 0:
        print("  ✓ No missing values found")
    else:
        print("  ✗ Missing values detected")
    
    # Check data types
    print(f"\nData Types Check:")
    print(f"  X_train dtypes: {X_train.dtypes.value_counts().to_dict()}")
    print(f"  y_train dtypes: {y_train.dtypes.value_counts().to_dict()}")
    
    # Validate target distributions
    print(f"\nTarget Distributions:")
    for col in y_train.columns:
        if col in ['is_emergency', 'needs_immediate_attention']:
            dist = y_train[col].value_counts().to_dict()
            print(f"  {col}: {dist}")
        else:
            dist = y_train[col].value_counts().sort_index().to_dict()
            print(f"  {col}: {dist}")
    
    # Check for infinite values
    print(f"\nInfinite Values Check:")
    train_inf = np.isinf(X_train.select_dtypes(include=[np.number])).sum().sum()
    test_inf = np.isinf(X_test.select_dtypes(include=[np.number])).sum().sum()
    
    print(f"  X_train infinite values: {train_inf}")
    print(f"  X_test infinite values: {test_inf}")
    
    if train_inf == 0 and test_inf == 0:
        print("  ✓ No infinite values found")
    else:
        print("  ✗ Infinite values detected")
    
    # Validate cross-validation files
    print(f"\nCross-Validation Files Check:")
    cv_files_exist = True
    for i in range(5):
        files = [
            f'cv_train_X_fold_{i}.csv',
            f'cv_train_y_fold_{i}.csv',
            f'cv_val_X_fold_{i}.csv',
            f'cv_val_y_fold_{i}.csv'
        ]
        for file in files:
            try:
                df = pd.read_csv(file)
                if len(df) == 0:
                    print(f"  ✗ {file} is empty")
                    cv_files_exist = False
            except:
                print(f"  ✗ {file} not found or corrupted")
                cv_files_exist = False
    
    if cv_files_exist:
        print("  ✓ All cross-validation files are valid")
    
    # Check feature importance
    print(f"\nFeature Importance Check:")
    for task, importance in feature_importance.items():
        if len(importance) > 0:
            print(f"  {task}: {len(importance)} features with importance scores")
        else:
            print(f"  ✗ {task}: No feature importance scores")
    
    # Check class weights
    print(f"\nClass Weights Check:")
    for task, weights in class_weights.items():
        if len(weights) > 0:
            print(f"  {task}: {len(weights)} classes with weights")
        else:
            print(f"  ✗ {task}: No class weights")
    
    # Final validation summary
    print(f"\n" + "="*60)
    print("VALIDATION SUMMARY")
    print("="*60)
    
    all_valid = (
        train_missing == 0 and test_missing == 0 and
        y_train_missing == 0 and y_test_missing == 0 and
        train_inf == 0 and test_inf == 0 and
        cv_files_exist and
        len(feature_importance) > 0 and
        len(class_weights) > 0
    )
    
    if all_valid:
        print("✓ ALL VALIDATIONS PASSED")
        print("✓ Dataset is ready for AI model training")
    else:
        print("✗ SOME VALIDATIONS FAILED")
        print("✗ Please review the issues above")
    
    return all_valid

def show_dataset_statistics():
    """Show comprehensive dataset statistics"""
    print("\n" + "="*60)
    print("DATASET STATISTICS")
    print("="*60)
    
    # Load data
    X_train = pd.read_csv('final_X_train.csv')
    y_train = pd.read_csv('final_y_train.csv')
    X_test = pd.read_csv('final_X_test.csv')
    y_test = pd.read_csv('final_y_test.csv')
    
    # Feature statistics
    print(f"\nFeature Statistics (Training Set):")
    numerical_features = X_train.select_dtypes(include=[np.number]).columns
    for feature in numerical_features:
        stats = X_train[feature].describe()
        print(f"  {feature}:")
        print(f"    Mean: {stats['mean']:.4f}, Std: {stats['std']:.4f}")
        print(f"    Min: {stats['min']:.4f}, Max: {stats['max']:.4f}")
    
    # Target statistics
    print(f"\nTarget Statistics:")
    for col in y_train.columns:
        if col in ['is_emergency', 'needs_immediate_attention']:
            positive_rate = y_train[col].mean()
            print(f"  {col}: {positive_rate:.1%} positive cases")
        else:
            unique_values = y_train[col].nunique()
            print(f"  {col}: {unique_values} unique values")
    
    # Data balance
    print(f"\nData Balance:")
    emergency_rate = y_train['is_emergency'].mean()
    attention_rate = y_train['needs_immediate_attention'].mean()
    print(f"  Emergency cases: {emergency_rate:.1%}")
    print(f"  Immediate attention cases: {attention_rate:.1%}")

if __name__ == "__main__":
    # Run validation
    is_valid = validate_final_dataset()
    
    # Show statistics
    show_dataset_statistics()
    
    print(f"\n" + "="*60)
    if is_valid:
        print("🎉 DATASET VALIDATION COMPLETED SUCCESSFULLY!")
        print("The dataset is ready for AI model training.")
    else:
        print("⚠️  DATASET VALIDATION COMPLETED WITH ISSUES")
        print("Please review and fix the issues before training models.")
    print("="*60)
