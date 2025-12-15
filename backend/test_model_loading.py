"""
Test script to diagnose model loading issues
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

print("="*60)
print("Model Loading Diagnostic")
print("="*60)

# Check if model files exist
print("\n1. Checking model files...")
vit_path = os.path.join('models', 'image', 'vit6_breast_cancer.pth')
mag_path = os.path.join('models', 'image', 'mag_aware.pkl')

print(f"   Vision Transformer: {vit_path}")
if os.path.exists(vit_path):
    size = os.path.getsize(vit_path) / (1024*1024)  # MB
    print(f"   [OK] Exists ({size:.2f} MB)")
else:
    print(f"   [X] NOT FOUND")

print(f"   Magnification Aware: {mag_path}")
if os.path.exists(mag_path):
    size = os.path.getsize(mag_path) / (1024*1024)  # MB
    print(f"   [OK] Exists ({size:.2f} MB)")
else:
    print(f"   [X] NOT FOUND")

# Try importing required libraries
print("\n2. Checking dependencies...")
try:
    import torch
    print(f"   [OK] PyTorch {torch.__version__}")
except ImportError:
    print("   [X] PyTorch not installed")

try:
    import torchvision
    print(f"   [OK] torchvision {torchvision.__version__}")
except ImportError:
    print("   [X] torchvision not installed")

try:
    import joblib
    print(f"   [OK] joblib")
except ImportError:
    print("   [X] joblib not installed")

try:
    from transformers import ViTForImageClassification
    print(f"   [OK] transformers (for ViT models)")
except ImportError:
    print("   [!] transformers not installed (may be needed for ViT)")

# Try loading models
print("\n3. Attempting to load models...")
try:
    from utils.predictions import ImagePredictor
    predictor = ImagePredictor()
    
    print(f"\n   Models loaded: {list(predictor.models.keys())}")
    print(f"   Total: {len(predictor.models)}")
    
    if len(predictor.models) == 0:
        print("\n   [X] ERROR: No models loaded!")
        print("   Check the error messages above.")
    elif len(predictor.models) == 1:
        print(f"\n   [!] WARNING: Only 1 model loaded ({list(predictor.models.keys())[0]})")
        print("   Predictions will work but with reduced accuracy.")
    else:
        print("\n   [OK] SUCCESS: All models loaded!")
        
except Exception as e:
    print(f"\n   [X] ERROR initializing predictor: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "="*60)

