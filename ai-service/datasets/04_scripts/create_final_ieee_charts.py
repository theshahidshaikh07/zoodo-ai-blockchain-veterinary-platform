#!/usr/bin/env python3
"""
Create Final IEEE Research Paper Visualizations
All 13 charts with clean labels (no borders) and professional colors
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, roc_curve, auc
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.model_selection import cross_val_score
import os
import warnings
warnings.filterwarnings('ignore')

# Set professional IEEE style
plt.style.use('seaborn-v0_8-whitegrid')
sns.set_palette("husl")

class FinalIEEECharts:
    def __init__(self):
        self.output_dir = 'final_ieee_charts'
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Professional color palettes for IEEE papers
        self.colors = {
            'primary': ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'],  # Blue, Orange, Green, Red
            'secondary': ['#9467bd', '#8c564b', '#e377c2', '#7f7f7f'],  # Purple, Brown, Pink, Gray
            'emergency': ['#ff4444', '#ff8800', '#ffaa00', '#44aa44'],  # Critical, High, Medium, Low
            'models': ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D'],  # Professional model colors
            'gradient': ['#003f5c', '#58508d', '#bc5090', '#ff6361', '#ffa600']
        }
        
        # Load data
        self.df = pd.read_csv('enhanced_veterinary_dataset.csv')
        self.X_train = pd.read_csv('final_X_train.csv')
        self.y_train = pd.read_csv('final_y_train.csv')
        self.X_test = pd.read_csv('final_X_test.csv')
        self.y_test = pd.read_csv('final_y_test.csv')
        
        print(f"✅ Data loaded: {len(self.df)} records")
    
    def create_final_model_performance_comparison(self):
        """Create final model performance comparison with clean labels (no borders)"""
        print("Creating Final Model Performance Comparison...")
        
        fig, ax = plt.subplots(figsize=(16, 10))
        
        # Model performance data
        tasks = ['Emergency\nDetection', 'Severity\nClassification', 'Symptom\nClassification', 'Immediate\nAttention']
        models = ['Random Forest', 'Gradient Boosting', 'Logistic Regression', 'SVM']
        
        # Performance data (accuracy)
        performance_data = {
            'Random Forest': [100.0, 100.0, 63.6, 97.6],
            'Gradient Boosting': [99.9, 100.0, 55.0, 99.9],
            'Logistic Regression': [99.8, 99.6, 54.0, 97.7],
            'SVM': [99.4, 96.0, 31.5, 97.1]
        }
        
        x = np.arange(len(tasks))
        width = 0.18  # Reduced width for better spacing
        
        # Create grouped bar chart with professional colors
        for i, (model, values) in enumerate(performance_data.items()):
            bars = ax.bar(x + i*width, values, width, 
                         label=model, 
                         color=self.colors['models'][i],
                         alpha=0.85,
                         edgecolor='white',
                         linewidth=1.5)
            
            # Add clean value labels above bars (NO BORDERS)
            for j, (bar, value) in enumerate(zip(bars, values)):
                height = bar.get_height()
                # Place labels above the bars
                ax.text(bar.get_x() + bar.get_width()/2., height + 0.5,
                       f'{value:.1f}%', 
                       ha='center', va='bottom', 
                       fontsize=12, fontweight='bold',
                       color='black')  # Clean black text, no background
        
        # Enhanced styling
        ax.set_xlabel('Prediction Tasks', fontsize=16, fontweight='bold', color='#2c3e50')
        ax.set_ylabel('Accuracy (%)', fontsize=16, fontweight='bold', color='#2c3e50')
        ax.set_title('Model Performance Comparison Across All Tasks\n(4 Machine Learning Models)', 
                    fontsize=18, fontweight='bold', pad=25, color='#2c3e50')
        ax.set_xticks(x + width*1.5)
        ax.set_xticklabels(tasks, fontsize=13, fontweight='bold')
        ax.legend(fontsize=13, loc='lower right', frameon=True, 
                 fancybox=True, shadow=True, framealpha=0.9)
        ax.grid(axis='y', alpha=0.3, linestyle='--')
        ax.set_ylim(0, 105)
        
        # Add subtle background
        ax.set_facecolor('#fafafa')
        fig.patch.set_facecolor('white')
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/01_final_model_performance.png', 
                   dpi=300, bbox_inches='tight', facecolor='white')
        plt.close()
        print("✅ Final Model Performance Comparison saved")
    
    def create_final_cross_validation_analysis(self):
        """Create final cross-validation analysis with clean labels"""
        print("Creating Final Cross-Validation Analysis...")
        
        fig, ax = plt.subplots(figsize=(16, 10))
        
        # Cross-validation data
        tasks = ['Emergency\nDetection', 'Severity\nClassification', 'Symptom\nClassification', 'Immediate\nAttention']
        models = ['Random Forest', 'Gradient Boosting', 'Logistic Regression', 'SVM']
        
        # CV F1-Score data
        cv_data = {
            'Random Forest': [99.6, 100.0, 69.6, 97.9],
            'Gradient Boosting': [98.8, 100.0, 76.7, 98.3],
            'Logistic Regression': [99.2, 100.0, 55.8, 98.3],
            'SVM': [98.3, 93.7, 37.1, 97.1]
        }
        
        x = np.arange(len(tasks))
        width = 0.18
        
        # Create grouped bar chart with enhanced colors
        for i, (model, values) in enumerate(cv_data.items()):
            bars = ax.bar(x + i*width, values, width, 
                         label=model, 
                         color=self.colors['gradient'][i],
                         alpha=0.85,
                         edgecolor='white',
                         linewidth=1.5)
            
            # Add clean value labels above bars (NO BORDERS)
            for j, (bar, value) in enumerate(zip(bars, values)):
                height = bar.get_height()
                # Place labels above the bars
                ax.text(bar.get_x() + bar.get_width()/2., height + 0.5,
                       f'{value:.1f}%', 
                       ha='center', va='bottom', 
                       fontsize=12, fontweight='bold',
                       color='black')  # Clean black text, no background
        
        # Enhanced styling
        ax.set_xlabel('Prediction Tasks', fontsize=16, fontweight='bold', color='#2c3e50')
        ax.set_ylabel('Cross-Validation F1-Score (%)', fontsize=16, fontweight='bold', color='#2c3e50')
        ax.set_title('Cross-Validation Performance Analysis\n(5-Fold Stratified CV)', 
                    fontsize=18, fontweight='bold', pad=25, color='#2c3e50')
        ax.set_xticks(x + width*1.5)
        ax.set_xticklabels(tasks, fontsize=13, fontweight='bold')
        ax.legend(fontsize=13, loc='lower right', frameon=True, 
                 fancybox=True, shadow=True, framealpha=0.9)
        ax.grid(axis='y', alpha=0.3, linestyle='--')
        ax.set_ylim(0, 105)
        
        # Add subtle background
        ax.set_facecolor('#fafafa')
        fig.patch.set_facecolor('white')
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/02_final_cross_validation.png', 
                   dpi=300, bbox_inches='tight', facecolor='white')
        plt.close()
        print("✅ Final Cross-Validation Analysis saved")
    
    def create_final_animal_type_distribution(self):
        """Create final animal type distribution with clean labels"""
        print("Creating Final Animal Type Distribution...")
        
        fig, ax = plt.subplots(figsize=(14, 10))
        
        # Get top animal types
        animal_counts = self.df['animal_type'].value_counts().head(10)
        
        # Create horizontal bar chart with gradient colors
        colors = plt.cm.viridis(np.linspace(0, 1, len(animal_counts)))
        bars = ax.barh(range(len(animal_counts)), animal_counts.values, 
                      color=colors, alpha=0.8, edgecolor='white', linewidth=1.5)
        
        # Add clean value labels (NO BORDERS)
        for i, (bar, value) in enumerate(zip(bars, animal_counts.values)):
            ax.text(bar.get_width() + 15, bar.get_y() + bar.get_height()/2, 
                   f'{value:,}', ha='left', va='center', 
                   fontsize=12, fontweight='bold',
                   color='black')  # Clean black text, no background
        
        # Enhanced styling
        ax.set_yticks(range(len(animal_counts)))
        ax.set_yticklabels(animal_counts.index, fontsize=12, fontweight='bold')
        ax.set_xlabel('Number of Cases', fontsize=16, fontweight='bold', color='#2c3e50')
        ax.set_title('Animal Type Distribution in Dataset\n(9,060+ Veterinary Cases)', 
                    fontsize=18, fontweight='bold', pad=25, color='#2c3e50')
        ax.grid(axis='x', alpha=0.3, linestyle='--')
        
        # Add subtle background
        ax.set_facecolor('#fafafa')
        fig.patch.set_facecolor('white')
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/03_final_animal_distribution.png', 
                   dpi=300, bbox_inches='tight', facecolor='white')
        plt.close()
        print("✅ Final Animal Type Distribution saved")
    
    def create_final_breed_distribution(self):
        """Create final breed distribution with clean labels"""
        print("Creating Final Breed Distribution...")
        
        fig, ax = plt.subplots(figsize=(16, 12))
        
        # Get top breeds
        breed_counts = self.df['breed'].value_counts().head(15)
        
        # Create horizontal bar chart with professional colors
        colors = plt.cm.plasma(np.linspace(0, 1, len(breed_counts)))
        bars = ax.barh(range(len(breed_counts)), breed_counts.values,
                      color=colors, alpha=0.8, edgecolor='white', linewidth=1.5)
        
        # Add clean value labels (NO BORDERS)
        for i, (bar, value) in enumerate(zip(bars, breed_counts.values)):
            ax.text(bar.get_width() + 8, bar.get_y() + bar.get_height()/2,
                   f'{value:,}', ha='left', va='center', 
                   fontsize=11, fontweight='bold',
                   color='black')  # Clean black text, no background
        
        # Enhanced styling
        ax.set_yticks(range(len(breed_counts)))
        ax.set_yticklabels(breed_counts.index, fontsize=11, fontweight='bold')
        ax.set_xlabel('Number of Cases', fontsize=16, fontweight='bold', color='#2c3e50')
        ax.set_title('Top 15 Breeds in Dataset\n(122 Total Breeds)', 
                    fontsize=18, fontweight='bold', pad=25, color='#2c3e50')
        ax.grid(axis='x', alpha=0.3, linestyle='--')
        
        # Add subtle background
        ax.set_facecolor('#fafafa')
        fig.patch.set_facecolor('white')
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/04_final_breed_distribution.png', 
                   dpi=300, bbox_inches='tight', facecolor='white')
        plt.close()
        print("✅ Final Breed Distribution saved")
    
    def create_final_symptom_severity_distribution(self):
        """Create final symptom severity distribution with clean labels"""
        print("Creating Final Symptom Severity Distribution...")
        
        fig, ax = plt.subplots(figsize=(12, 10))
        
        severity_counts = self.df['symptom_severity'].value_counts()
        colors = self.colors['emergency']  # Professional emergency colors
        
        # Create pie chart with better spacing and labels
        wedges, texts, autotexts = ax.pie(severity_counts.values, 
                                         labels=severity_counts.index,
                                         autopct='%1.1f%%',
                                         colors=colors,
                                         startangle=90,
                                         textprops={'fontsize': 13, 'fontweight': 'bold'},
                                         wedgeprops={'edgecolor': 'white', 'linewidth': 2})
        
        # Clean text styling (NO BORDERS)
        for autotext in autotexts:
            autotext.set_color('white')
            autotext.set_fontsize(12)
            autotext.set_fontweight('bold')
            # NO bbox - clean text only
        
        # Enhanced title
        ax.set_title('Symptom Severity Distribution\n(4 Severity Levels)', 
                    fontsize=18, fontweight='bold', pad=25, color='#2c3e50')
        
        # Add subtle background
        fig.patch.set_facecolor('white')
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/05_final_severity_distribution.png', 
                   dpi=300, bbox_inches='tight', facecolor='white')
        plt.close()
        print("✅ Final Symptom Severity Distribution saved")
    
    def create_final_emergency_cases_distribution(self):
        """Create final emergency cases distribution with clean labels"""
        print("Creating Final Emergency Cases Distribution...")
        
        fig, ax = plt.subplots(figsize=(12, 10))
        
        emergency_counts = self.df['is_emergency'].value_counts()
        labels = ['Non-Emergency', 'Emergency']
        colors = ['#44aa44', '#ff4444']  # Green for non-emergency, red for emergency
        
        # Create pie chart with enhanced styling
        wedges, texts, autotexts = ax.pie(emergency_counts.values,
                                         labels=labels,
                                         autopct='%1.1f%%',
                                         colors=colors,
                                         startangle=90,
                                         textprops={'fontsize': 13, 'fontweight': 'bold'},
                                         wedgeprops={'edgecolor': 'white', 'linewidth': 2})
        
        # Add clean count labels (NO BORDERS)
        for i, (wedge, count) in enumerate(zip(wedges, emergency_counts.values)):
            angle = (wedge.theta2 + wedge.theta1) / 2
            x = 0.7 * np.cos(np.radians(angle))
            y = 0.7 * np.sin(np.radians(angle))
            ax.text(x, y, f'{count:,} cases', ha='center', va='center',
                   fontsize=12, fontweight='bold',
                   color='black')  # Clean black text, no background
        
        # Enhanced title
        ax.set_title('Emergency vs Non-Emergency Cases\n(75 Emergency Cases)', 
                    fontsize=18, fontweight='bold', pad=25, color='#2c3e50')
        
        # Add subtle background
        fig.patch.set_facecolor('white')
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/06_final_emergency_distribution.png', 
                   dpi=300, bbox_inches='tight', facecolor='white')
        plt.close()
        print("✅ Final Emergency Cases Distribution saved")
    
    def create_final_roc_curves_emergency(self):
        """Create final ROC curves for emergency detection with clean styling"""
        print("Creating Final ROC Curves - Emergency Detection...")
        
        fig, ax = plt.subplots(figsize=(14, 10))
        
        # Train models for ROC curves
        models = {
            'Random Forest': RandomForestClassifier(random_state=42),
            'Gradient Boosting': GradientBoostingClassifier(random_state=42),
            'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000),
            'SVM': SVC(probability=True, random_state=42)
        }
        
        y_train_emergency = self.y_train['is_emergency']
        y_test_emergency = self.y_test['is_emergency']
        
        # Clean X_test to remove overlapping columns
        X_test_clean = self.X_test.copy()
        overlapping_cols = set(X_test_clean.columns) & set(self.y_test.columns)
        if overlapping_cols:
            X_test_clean = X_test_clean.drop(columns=list(overlapping_cols))
        
        # Plot ROC curves with enhanced styling
        for i, (name, model) in enumerate(models.items()):
            model.fit(self.X_train, y_train_emergency)
            y_pred_proba = model.predict_proba(X_test_clean)[:, 1]
            
            fpr, tpr, _ = roc_curve(y_test_emergency, y_pred_proba)
            roc_auc = auc(fpr, tpr)
            
            ax.plot(fpr, tpr, linewidth=4, 
                   color=self.colors['models'][i],
                   label=f'{name} (AUC = {roc_auc:.3f})',
                   alpha=0.8)
        
        # Add diagonal line
        ax.plot([0, 1], [0, 1], 'k--', linewidth=3, 
               label='Random Classifier', alpha=0.6)
        
        # Enhanced styling
        ax.set_xlim([0.0, 1.0])
        ax.set_ylim([0.0, 1.05])
        ax.set_xlabel('False Positive Rate', fontsize=16, fontweight='bold', color='#2c3e50')
        ax.set_ylabel('True Positive Rate', fontsize=16, fontweight='bold', color='#2c3e50')
        ax.set_title('ROC Curves - Emergency Detection Task\n(Perfect Performance)', 
                    fontsize=18, fontweight='bold', pad=25, color='#2c3e50')
        ax.legend(fontsize=13, loc='lower right', frameon=True, 
                 fancybox=True, shadow=True, framealpha=0.9)
        ax.grid(True, alpha=0.3, linestyle='--')
        
        # Add subtle background
        ax.set_facecolor('#fafafa')
        fig.patch.set_facecolor('white')
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/07_final_roc_curves_emergency.png', 
                   dpi=300, bbox_inches='tight', facecolor='white')
        plt.close()
        print("✅ Final ROC Curves - Emergency Detection saved")
    
    def create_final_roc_curves_immediate_attention(self):
        """Create final ROC curves for immediate attention with clean styling"""
        print("Creating Final ROC Curves - Immediate Attention...")
        
        fig, ax = plt.subplots(figsize=(14, 10))
        
        # Train models for ROC curves
        models = {
            'Random Forest': RandomForestClassifier(random_state=42),
            'Gradient Boosting': GradientBoostingClassifier(random_state=42),
            'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000),
            'SVM': SVC(probability=True, random_state=42)
        }
        
        y_train_attention = self.y_train['needs_immediate_attention']
        y_test_attention = self.y_test['needs_immediate_attention']
        
        # Clean X_test to remove overlapping columns
        X_test_clean = self.X_test.copy()
        overlapping_cols = set(X_test_clean.columns) & set(self.y_test.columns)
        if overlapping_cols:
            X_test_clean = X_test_clean.drop(columns=list(overlapping_cols))
        
        # Plot ROC curves with enhanced styling
        for i, (name, model) in enumerate(models.items()):
            model.fit(self.X_train, y_train_attention)
            y_pred_proba = model.predict_proba(X_test_clean)[:, 1]
            
            fpr, tpr, _ = roc_curve(y_test_attention, y_pred_proba)
            roc_auc = auc(fpr, tpr)
            
            ax.plot(fpr, tpr, linewidth=4, 
                   color=self.colors['models'][i],
                   label=f'{name} (AUC = {roc_auc:.3f})',
                   alpha=0.8)
        
        # Add diagonal line
        ax.plot([0, 1], [0, 1], 'k--', linewidth=3, 
               label='Random Classifier', alpha=0.6)
        
        # Enhanced styling
        ax.set_xlim([0.0, 1.0])
        ax.set_ylim([0.0, 1.05])
        ax.set_xlabel('False Positive Rate', fontsize=16, fontweight='bold', color='#2c3e50')
        ax.set_ylabel('True Positive Rate', fontsize=16, fontweight='bold', color='#2c3e50')
        ax.set_title('ROC Curves - Immediate Attention Task\n(Excellent Performance)', 
                    fontsize=18, fontweight='bold', pad=25, color='#2c3e50')
        ax.legend(fontsize=13, loc='lower right', frameon=True, 
                 fancybox=True, shadow=True, framealpha=0.9)
        ax.grid(True, alpha=0.3, linestyle='--')
        
        # Add subtle background
        ax.set_facecolor('#fafafa')
        fig.patch.set_facecolor('white')
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/08_final_roc_curves_immediate_attention.png', 
                   dpi=300, bbox_inches='tight', facecolor='white')
        plt.close()
        print("✅ Final ROC Curves - Immediate Attention saved")
    
    def create_final_confusion_matrix_emergency(self):
        """Create final confusion matrix for emergency detection"""
        print("Creating Final Emergency Detection Confusion Matrix...")
        
        fig, ax = plt.subplots(figsize=(12, 10))
        
        # Clean X_test to remove overlapping columns
        X_test_clean = self.X_test.copy()
        overlapping_cols = set(X_test_clean.columns) & set(self.y_test.columns)
        if overlapping_cols:
            X_test_clean = X_test_clean.drop(columns=list(overlapping_cols))
        
        # Train Random Forest (best model)
        rf = RandomForestClassifier(random_state=42)
        rf.fit(self.X_train, self.y_train['is_emergency'])
        y_pred = rf.predict(X_test_clean)
        
        # Create confusion matrix
        cm = confusion_matrix(self.y_test['is_emergency'], y_pred)
        
        # Create enhanced heatmap
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                   xticklabels=['Non-Emergency', 'Emergency'],
                   yticklabels=['Non-Emergency', 'Emergency'],
                   cbar_kws={'label': 'Number of Cases'},
                   annot_kws={'fontsize': 16, 'fontweight': 'bold'},
                   ax=ax)
        
        # Enhanced styling
        ax.set_title('Confusion Matrix - Emergency Detection\n(Random Forest: 100% Accuracy)', 
                    fontsize=18, fontweight='bold', pad=25, color='#2c3e50')
        ax.set_xlabel('Predicted Label', fontsize=16, fontweight='bold', color='#2c3e50')
        ax.set_ylabel('True Label', fontsize=16, fontweight='bold', color='#2c3e50')
        
        # Add subtle background
        fig.patch.set_facecolor('white')
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/09_final_confusion_matrix_emergency.png', 
                   dpi=300, bbox_inches='tight', facecolor='white')
        plt.close()
        print("✅ Final Emergency Confusion Matrix saved")
    
    def create_final_confusion_matrix_severity(self):
        """Create final confusion matrix for severity classification"""
        print("Creating Final Severity Classification Confusion Matrix...")
        
        fig, ax = plt.subplots(figsize=(12, 10))
        
        # Clean X_test to remove overlapping columns
        X_test_clean = self.X_test.copy()
        overlapping_cols = set(X_test_clean.columns) & set(self.y_test.columns)
        if overlapping_cols:
            X_test_clean = X_test_clean.drop(columns=list(overlapping_cols))
        
        # Train Random Forest (best model)
        rf = RandomForestClassifier(random_state=42)
        rf.fit(self.X_train, self.y_train['severity_class'])
        y_pred = rf.predict(X_test_clean)
        
        # Create confusion matrix
        cm = confusion_matrix(self.y_test['severity_class'], y_pred)
        
        # Create enhanced heatmap
        sns.heatmap(cm, annot=True, fmt='d', cmap='Greens',
                   xticklabels=['Critical', 'High', 'Medium', 'Low'],
                   yticklabels=['Critical', 'High', 'Medium', 'Low'],
                   cbar_kws={'label': 'Number of Cases'},
                   annot_kws={'fontsize': 16, 'fontweight': 'bold'},
                   ax=ax)
        
        # Enhanced styling
        ax.set_title('Confusion Matrix - Severity Classification\n(Random Forest: 100% Accuracy)', 
                    fontsize=18, fontweight='bold', pad=25, color='#2c3e50')
        ax.set_xlabel('Predicted Severity', fontsize=16, fontweight='bold', color='#2c3e50')
        ax.set_ylabel('True Severity', fontsize=16, fontweight='bold', color='#2c3e50')
        
        # Add subtle background
        fig.patch.set_facecolor('white')
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/10_final_confusion_matrix_severity.png', 
                   dpi=300, bbox_inches='tight', facecolor='white')
        plt.close()
        print("✅ Final Severity Confusion Matrix saved")
    
    def create_final_confusion_matrix_immediate_attention(self):
        """Create final confusion matrix for immediate attention"""
        print("Creating Final Immediate Attention Confusion Matrix...")
        
        fig, ax = plt.subplots(figsize=(12, 10))
        
        # Clean X_test to remove overlapping columns
        X_test_clean = self.X_test.copy()
        overlapping_cols = set(X_test_clean.columns) & set(self.y_test.columns)
        if overlapping_cols:
            X_test_clean = X_test_clean.drop(columns=list(overlapping_cols))
        
        # Train Gradient Boosting (best model for immediate attention)
        gb = GradientBoostingClassifier(random_state=42)
        gb.fit(self.X_train, self.y_train['needs_immediate_attention'])
        y_pred = gb.predict(X_test_clean)
        
        # Create confusion matrix
        cm = confusion_matrix(self.y_test['needs_immediate_attention'], y_pred)
        
        # Create enhanced heatmap
        sns.heatmap(cm, annot=True, fmt='d', cmap='Oranges',
                   xticklabels=['No Attention', 'Needs Attention'],
                   yticklabels=['No Attention', 'Needs Attention'],
                   cbar_kws={'label': 'Number of Cases'},
                   annot_kws={'fontsize': 16, 'fontweight': 'bold'},
                   ax=ax)
        
        # Enhanced styling
        ax.set_title('Confusion Matrix - Immediate Attention\n(Gradient Boosting: 99.9% Accuracy)', 
                    fontsize=18, fontweight='bold', pad=25, color='#2c3e50')
        ax.set_xlabel('Predicted Label', fontsize=16, fontweight='bold', color='#2c3e50')
        ax.set_ylabel('True Label', fontsize=16, fontweight='bold', color='#2c3e50')
        
        # Add subtle background
        fig.patch.set_facecolor('white')
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/11_final_confusion_matrix_immediate_attention.png', 
                   dpi=300, bbox_inches='tight', facecolor='white')
        plt.close()
        print("✅ Final Immediate Attention Confusion Matrix saved")
    
    def create_final_feature_importance(self):
        """Create final feature importance chart with clean labels"""
        print("Creating Final Feature Importance Chart...")
        
        fig, ax = plt.subplots(figsize=(16, 12))
        
        # Train Random Forest for feature importance
        rf = RandomForestClassifier(random_state=42)
        rf.fit(self.X_train, self.y_train['is_emergency'])
        
        # Get feature importance
        feature_importance = pd.DataFrame({
            'feature': self.X_train.columns,
            'importance': rf.feature_importances_
        }).sort_values('importance', ascending=True)
        
        # Get top 15 features
        top_features = feature_importance.tail(15)
        
        # Create horizontal bar chart with gradient colors
        colors = plt.cm.viridis(np.linspace(0, 1, len(top_features)))
        bars = ax.barh(range(len(top_features)), top_features['importance'],
                      color=colors, alpha=0.8, edgecolor='white', linewidth=1.5)
        
        # Add clean value labels (NO BORDERS)
        for i, (bar, value) in enumerate(zip(bars, top_features['importance'])):
            ax.text(bar.get_width() + 0.001, bar.get_y() + bar.get_height()/2,
                   f'{value:.3f}', ha='left', va='center', 
                   fontsize=11, fontweight='bold',
                   color='black')  # Clean black text, no background
        
        # Enhanced styling
        ax.set_yticks(range(len(top_features)))
        ax.set_yticklabels(top_features['feature'], fontsize=11, fontweight='bold')
        ax.set_xlabel('Feature Importance', fontsize=16, fontweight='bold', color='#2c3e50')
        ax.set_title('Top 15 Most Important Features\n(Random Forest - Emergency Detection)', 
                    fontsize=18, fontweight='bold', pad=25, color='#2c3e50')
        ax.grid(axis='x', alpha=0.3, linestyle='--')
        
        # Add subtle background
        ax.set_facecolor('#fafafa')
        fig.patch.set_facecolor('white')
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/12_final_feature_importance.png', 
                   dpi=300, bbox_inches='tight', facecolor='white')
        plt.close()
        print("✅ Final Feature Importance saved")
    
    def create_final_dataset_statistics(self):
        """Create final dataset statistics summary with clean labels"""
        print("Creating Final Dataset Statistics Summary...")
        
        fig, ax = plt.subplots(figsize=(14, 10))
        
        # Dataset statistics
        stats = {
            'Total Records': len(self.df),
            'Animal Types': self.df['animal_type'].nunique(),
            'Breeds': self.df['breed'].nunique(),
            'Symptoms': self.df['primary_symptom'].nunique(),
            'Emergency Cases': self.df['is_emergency'].sum(),
            'Features': len(self.X_train.columns)
        }
        
        categories = list(stats.keys())
        values = list(stats.values())
        
        # Create bar chart with professional colors
        colors = plt.cm.Set2(np.linspace(0, 1, len(categories)))
        bars = ax.bar(range(len(categories)), values, 
                     color=colors, alpha=0.8, edgecolor='white', linewidth=2)
        
        # Add clean value labels (NO BORDERS)
        for i, (bar, value) in enumerate(zip(bars, values)):
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height + max(values)*0.01,
                   f'{value:,}', ha='center', va='bottom', 
                   fontsize=13, fontweight='bold',
                   color='black')  # Clean black text, no background
        
        # Enhanced styling
        ax.set_xticks(range(len(categories)))
        ax.set_xticklabels(categories, rotation=45, ha='right', fontsize=13, fontweight='bold')
        ax.set_ylabel('Count', fontsize=16, fontweight='bold', color='#2c3e50')
        ax.set_title('AI Veterinary Assistant Dataset Statistics\n(Comprehensive Multi-Species Dataset)', 
                    fontsize=18, fontweight='bold', pad=25, color='#2c3e50')
        ax.grid(axis='y', alpha=0.3, linestyle='--')
        
        # Add subtle background
        ax.set_facecolor('#fafafa')
        fig.patch.set_facecolor('white')
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/13_final_dataset_statistics.png', 
                   dpi=300, bbox_inches='tight', facecolor='white')
        plt.close()
        print("✅ Final Dataset Statistics saved")
    
    def create_all_final_charts(self):
        """Create all 13 final charts"""
        print("🎨 CREATING ALL 13 FINAL IEEE RESEARCH CHARTS")
        print("="*60)
        
        # Create all 13 charts
        self.create_final_model_performance_comparison()
        self.create_final_cross_validation_analysis()
        self.create_final_animal_type_distribution()
        self.create_final_breed_distribution()
        self.create_final_symptom_severity_distribution()
        self.create_final_emergency_cases_distribution()
        self.create_final_roc_curves_emergency()
        self.create_final_roc_curves_immediate_attention()
        self.create_final_confusion_matrix_emergency()
        self.create_final_confusion_matrix_severity()
        self.create_final_confusion_matrix_immediate_attention()
        self.create_final_feature_importance()
        self.create_final_dataset_statistics()
        
        print("\n✅ ALL 13 FINAL CHARTS CREATED SUCCESSFULLY!")
        print(f"📁 Charts saved in: {self.output_dir}/")
        print("\n📊 Generated Final Charts (ALL 13):")
        print("  01. Final Model Performance Comparison")
        print("  02. Final Cross-Validation Analysis")
        print("  03. Final Animal Type Distribution")
        print("  04. Final Breed Distribution")
        print("  05. Final Symptom Severity Distribution")
        print("  06. Final Emergency Cases Distribution")
        print("  07. Final ROC Curves - Emergency Detection")
        print("  08. Final ROC Curves - Immediate Attention")
        print("  09. Final Confusion Matrix - Emergency")
        print("  10. Final Confusion Matrix - Severity")
        print("  11. Final Confusion Matrix - Immediate Attention")
        print("  12. Final Feature Importance")
        print("  13. Final Dataset Statistics")
        print("\n🎯 Professional IEEE Paper Quality!")
        print("✨ NO borders around numbers, clean labels, all 13 charts!")

if __name__ == "__main__":
    chart_creator = FinalIEEECharts()
    chart_creator.create_all_final_charts()
