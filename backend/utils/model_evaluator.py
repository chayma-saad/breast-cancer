"""
Model Evaluator - Calculate real accuracy from your models
"""

import os
import numpy as np
from typing import Dict, Optional
import joblib

BASE_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def evaluate_image_models(test_data_path: Optional[str] = None) -> Dict:
    """
    Evaluate image models on test data to get real accuracy metrics
    
    Args:
        test_data_path: Path to test dataset (images folder with benign/malignant subfolders)
    
    Returns:
        Dictionary with real metrics for each model
    """
    
    metrics = {
        'Vision Transformer': {
            'accuracy': None,
            'f1_score': None,
            'precision': None,
            'recall': None,
            'auc_roc': None,
            'confusion_matrix': {
                'true_positive': None,
                'true_negative': None,
                'false_positive': None,
                'false_negative': None
            }
        },
        'Magnification Aware': {
            'accuracy': None,
            'f1_score': None,
            'precision': None,
            'recall': None,
            'auc_roc': None,
            'confusion_matrix': {
                'true_positive': None,
                'true_negative': None,
                'false_positive': None,
                'false_negative': None
            }
        }
    }
    
    # If test data path is provided, evaluate models
    if test_data_path and os.path.exists(test_data_path):
        try:
            from utils.predictions import ImagePredictor
            from PIL import Image
            import glob
            
            predictor = ImagePredictor()
            
            # Load test images
            benign_path = os.path.join(test_data_path, 'benign', '*')
            malignant_path = os.path.join(test_data_path, 'malignant', '*')
            
            benign_images = glob.glob(benign_path)
            malignant_images = glob.glob(malignant_path)
            
            # Evaluate each model
            for model_name in ['Vision Transformer', 'Magnification Aware']:
                if model_name in predictor.models:
                    # Run evaluation
                    # ... evaluation code here ...
                    pass
        except Exception as e:
            print(f"Error evaluating models: {e}")
    
    return metrics


def load_model_metrics_from_file() -> Optional[Dict]:
    """
    Load pre-calculated metrics from a saved file
    Expected file: backend/models/image/metrics.json or metrics.pkl
    """
    metrics_file_json = os.path.join(BASE_PATH, 'models', 'image', 'metrics.json')
    metrics_file_pkl = os.path.join(BASE_PATH, 'models', 'image', 'metrics.pkl')
    
    # Try JSON first
    if os.path.exists(metrics_file_json):
        try:
            import json
            with open(metrics_file_json, 'r') as f:
                return json.load(f)
        except:
            pass
    
    # Try pickle
    if os.path.exists(metrics_file_pkl):
        try:
            return joblib.load(metrics_file_pkl)
        except:
            pass
    
    return None

