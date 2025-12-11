"""
Model performance metrics for YOUR trained models
"""

import numpy as np
from typing import Dict, List


def get_model_metrics() -> Dict:
    """
    Return performance metrics for your models
    Update these values with your actual model performance!
    """
    
    # YOUR TABULAR MODELS
    tabular_models = {
        'GRU-SVM': {
            'accuracy': 0.967,
            'f1_score': 0.962,
            'precision': 0.958,
            'recall': 0.966,
            'auc_roc': 0.989,
            'confusion_matrix': {
                'true_positive': 193,
                'true_negative': 357,
                'false_positive': 7,
                'false_negative': 12
            },
            'description': 'GRU feature extractor + SVM classifier hybrid model'
        },
        'SVM RBF': {
            'accuracy': 0.954,
            'f1_score': 0.948,
            'precision': 0.944,
            'recall': 0.952,
            'auc_roc': 0.981,
            'confusion_matrix': {
                'true_positive': 190,
                'true_negative': 353,
                'false_positive': 11,
                'false_negative': 15
            },
            'description': 'Support Vector Machine with optimized RBF kernel'
        },
        'Random Forest': {
            'accuracy': 0.948,
            'f1_score': 0.941,
            'precision': 0.936,
            'recall': 0.946,
            'auc_roc': 0.976,
            'confusion_matrix': {
                'true_positive': 188,
                'true_negative': 351,
                'false_positive': 13,
                'false_negative': 17
            },
            'description': 'Random Forest ensemble classifier'
        },
        'Neural Network L1': {
            'accuracy': 0.938,
            'f1_score': 0.931,
            'precision': 0.928,
            'recall': 0.934,
            'auc_roc': 0.968,
            'confusion_matrix': {
                'true_positive': 185,
                'true_negative': 348,
                'false_positive': 16,
                'false_negative': 20
            },
            'description': 'Neural Network with L1 regularization for sparsity'
        }
    }
    
    # IMAGE MODELS (Demo - add your own if you have them)
    image_models = {
        'DenseNet': {
            'accuracy': 0.938,
            'f1_score': 0.931,
            'precision': 0.928,
            'recall': 0.934,
            'auc_roc': 0.972,
            'confusion_matrix': {
                'true_positive': 234,
                'true_negative': 421,
                'false_positive': 18,
                'false_negative': 27
            },
            'description': 'DenseNet-121 pretrained on ImageNet, fine-tuned on mammograms'
        },
        'ViT-B': {
            'accuracy': 0.926,
            'f1_score': 0.918,
            'precision': 0.912,
            'recall': 0.924,
            'auc_roc': 0.964,
            'confusion_matrix': {
                'true_positive': 230,
                'true_negative': 417,
                'false_positive': 22,
                'false_negative': 31
            },
            'description': 'Vision Transformer Base model with patch size 16x16'
        },
        'Swin Transformer': {
            'accuracy': 0.919,
            'f1_score': 0.908,
            'precision': 0.902,
            'recall': 0.914,
            'auc_roc': 0.958,
            'confusion_matrix': {
                'true_positive': 227,
                'true_negative': 416,
                'false_positive': 23,
                'false_negative': 34
            },
            'description': 'Swin Transformer with shifted window attention'
        },
        'EfficientNet': {
            'accuracy': 0.941,
            'f1_score': 0.935,
            'precision': 0.931,
            'recall': 0.939,
            'auc_roc': 0.975,
            'confusion_matrix': {
                'true_positive': 236,
                'true_negative': 422,
                'false_positive': 17,
                'false_negative': 25
            },
            'description': 'EfficientNet-B4 with compound scaling'
        },
        'Ensemble': {
            'accuracy': 0.956,
            'f1_score': 0.951,
            'precision': 0.948,
            'recall': 0.954,
            'auc_roc': 0.984,
            'confusion_matrix': {
                'true_positive': 241,
                'true_negative': 428,
                'false_positive': 11,
                'false_negative': 20
            },
            'description': 'Weighted ensemble of all vision models'
        }
    }
    
    # Generate ROC curve data
    def generate_roc_curve(auc: float) -> List[Dict]:
        n_points = 50
        fpr = np.linspace(0, 1, n_points)
        power = 1 / (auc ** 2)
        tpr = 1 - (1 - fpr) ** power
        noise = np.random.normal(0, 0.02, n_points)
        tpr = np.clip(tpr + noise, 0, 1)
        tpr = np.sort(tpr)
        return [{'fpr': round(f, 4), 'tpr': round(t, 4)} for f, t in zip(fpr.tolist(), tpr.tolist())]
    
    # Add ROC curves
    for model_name, metrics in tabular_models.items():
        metrics['roc_curve'] = generate_roc_curve(metrics['auc_roc'])
    
    for model_name, metrics in image_models.items():
        metrics['roc_curve'] = generate_roc_curve(metrics['auc_roc'])
    
    # Comparison summary
    comparison = {
        'tabular': {
            'best_model': 'GRU-SVM',
            'best_accuracy': 0.967,
            'models': list(tabular_models.keys()),
            'accuracies': [m['accuracy'] for m in tabular_models.values()],
            'f1_scores': [m['f1_score'] for m in tabular_models.values()]
        },
        'image': {
            'best_model': 'Ensemble',
            'best_accuracy': 0.956,
            'models': list(image_models.keys()),
            'accuracies': [m['accuracy'] for m in image_models.values()],
            'f1_scores': [m['f1_score'] for m in image_models.values()]
        }
    }
    
    return {
        'tabular_models': tabular_models,
        'image_models': image_models,
        'comparison': comparison,
        'dataset_info': {
            'tabular': {
                'name': 'Wisconsin Breast Cancer Dataset',
                'samples': 569,
                'features': 30,
                'classes': ['Benign', 'Malignant'],
                'class_distribution': {'Benign': 357, 'Malignant': 212}
            },
            'image': {
                'name': 'Mammogram Image Dataset',
                'samples': 700,
                'resolution': '224x224',
                'classes': ['Benign', 'Malignant'],
                'class_distribution': {'Benign': 439, 'Malignant': 261}
            }
        }
    }
