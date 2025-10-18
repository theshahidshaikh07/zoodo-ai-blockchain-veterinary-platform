# 🏥 Zoodo AI Veterinary Datasets

## 📁 Clean Directory Structure

This directory contains the essential datasets for the Dr. Salus AI veterinary assistant, organized in a clean, professional structure.

### 📂 Directory Overview

```
datasets/
├── 01_raw_data/           # Original, unprocessed datasets
├── 02_processed_data/     # Cleaned and processed datasets
├── 03_training_data/      # ML training datasets and models
├── 04_scripts/           # Essential data processing scripts
├── 05_analysis/          # Analysis results and charts
└── 06_documentation/     # Main documentation
```

## 📊 Essential Dataset Categories

### 01_raw_data/ (5 Core Datasets)
- **01_pet_health_symptoms.csv** - Pet health symptoms dataset
- **02_animal_disease_prediction.csv** - Animal disease prediction data
- **03_general_animal_data.csv** - General animal health data
- **04_dog_breed_health.csv** - Dog breed-specific health data
- **05_veterinary_clinical.csv** - Veterinary clinical records

### 02_processed_data/ (Essential Processed Data)
- **processed_breed_nutrition_dataset.csv** - Breed-specific nutrition data
- **processed_comprehensive_nutrition_dataset.csv** - Comprehensive nutrition data
- **processed_feeding_schedule_dataset.csv** - Feeding schedule data
- **processed_health_condition_nutrition_dataset.csv** - Health condition nutrition data
- **processed_enhanced_veterinary_dataset.csv** - Enhanced veterinary dataset
- **processed_merged_veterinary_dataset.csv** - Merged veterinary dataset
- **class_weights.json** - Class weights for ML models
- **dataset_metadata.json** - Dataset metadata
- **feature_importance.json** - Feature importance data
- **top_features.json** - Top features for models

### 03_training_data/ (ML Training Data)
- **features_train.csv** - Training features
- **features_test.csv** - Test features
- **labels_train.csv** - Training labels
- **labels_test.csv** - Test labels
- **final_X_train.csv** - Final training features
- **final_X_test.csv** - Final test features
- **final_y_train.csv** - Final training labels
- **final_y_test.csv** - Final test labels
- **crossval_*.csv** - Cross-validation datasets (20 files)
- **scalers.pkl** - Data scalers

### 04_scripts/ (Essential Scripts Only)
- **clean_and_merge_datasets.py** - Dataset cleaning and merging
- **create_final_ieee_charts.py** - IEEE research charts creation
- **create_final_training_dataset.py** - Training dataset creation
- **create_nutrition_dataset.py** - Nutrition dataset creation
- **enhance_dataset_for_ai_training.py** - AI training enhancement
- **validate_final_dataset.py** - Dataset validation

### 05_analysis/ (Analysis Results)
- **ai_assistant_analysis/** - AI assistant analysis plots (3 files)
  - `01_ai_assistant_overview.png` - AI assistant overview
  - `02_all_tasks_performance.png` - All tasks performance
  - `03_feature_importance_analysis.png` - Feature importance analysis
- **ieee_research_charts/** - IEEE research charts (13 files)
  - `01_model_performance_comparison.png` - Model performance comparison
  - `02_cross_validation_results.png` - Cross validation results
  - `03_animal_type_distribution.png` - Animal type distribution
  - `04_dog_breed_distribution.png` - Dog breed distribution
  - `05_symptom_severity_distribution.png` - Symptom severity distribution
  - `06_emergency_cases_distribution.png` - Emergency cases distribution
  - `07_roc_curves_emergency_detection.png` - ROC curves for emergency detection
  - `08_roc_curves_immediate_attention.png` - ROC curves for immediate attention
  - `09_confusion_matrix_emergency_detection.png` - Confusion matrix for emergency detection
  - `10_confusion_matrix_severity_classification.png` - Confusion matrix for severity classification
  - `11_confusion_matrix_immediate_attention.png` - Confusion matrix for immediate attention
  - `12_feature_importance_analysis.png` - Feature importance analysis
  - `13_dataset_statistics_overview.png` - Dataset statistics overview

### 06_documentation/ (Main Documentation)
- **README.md** - This main documentation file

## 🎯 Key Features

### ✅ Clean & Professional
- **Descriptive file names** - Clear, professional naming convention
- **Essential content only** - No testing or intermediate files
- **Research-ready structure** - IEEE-compliant organization
- **Professional documentation** - Clear, comprehensive guides

### 🔄 Streamlined Data Pipeline
1. **Raw Data** → 5 core veterinary datasets
2. **Processing** → 6 essential processed datasets
3. **Training** → ML-ready datasets and models
4. **Analysis** → Professional research charts and AI analysis
5. **Documentation** → Main README only

### 📈 Research Ready
- **IEEE-compliant** research charts
- **Professional naming** - No "final_final" or confusing names
- **Essential statistics** for research papers
- **Clean structure** for publication

## 🚀 Usage

### For Data Scientists
```bash
# Access raw data
cd 01_raw_data/

# Use processed data
cd 02_processed_data/

# Load training data
cd 03_training_data/
```

### For AI Training
```bash
# Run essential scripts
cd 04_scripts/
python clean_and_merge_datasets.py
python create_final_training_dataset.py
python validate_final_dataset.py
```

### For Research
```bash
# View IEEE research charts
cd 05_analysis/ieee_research_charts/

# View AI assistant analysis
cd 05_analysis/ai_assistant_analysis/
```

## 📋 Clean Dataset Statistics

- **Total Files**: 78 essential files
- **Raw Datasets**: 5 core veterinary datasets
- **Processed Datasets**: 6 essential processed datasets
- **Training Sets**: 25+ ML-ready datasets
- **Analysis Results**: 16 professional charts and plots
- **Essential Scripts**: 6 core processing scripts
- **Documentation**: 1 comprehensive README

## 🔧 Maintenance

### Adding New Datasets
1. Place raw data in `01_raw_data/`
2. Process using essential scripts in `04_scripts/`
3. Store processed data in `02_processed_data/`
4. Update main README.md

### File Naming Convention
- **Raw Data**: `01_descriptive_name.csv`
- **Processed Data**: `processed_descriptive_name.csv`
- **Training Data**: `features_/labels_descriptive_name.csv`
- **Scripts**: `action_descriptive_name.py`
- **Analysis**: `descriptive_name.png` (no "final_final")

## 📞 Support

For questions about datasets or structure:
- Check main README.md in `06_documentation/`
- Review analysis in `05_analysis/`
- Examine essential scripts in `04_scripts/`

---

**Dr. Salus AI** - Professional veterinary datasets with clean, descriptive naming! 🐾