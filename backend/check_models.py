"""
Quick script to check if image models are loading correctly
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

print("="*60)
print("Checking Image Models Loading")
print("="*60)

try:
    from utils.predictions import ImagePredictor, USE_REAL_MODELS
    
    print(f"\nUSE_REAL_MODELS = {USE_REAL_MODELS}")
    
    if USE_REAL_MODELS:
        print("\nInitializing ImagePredictor...")
        predictor = ImagePredictor()
        
        print(f"\nModels loaded: {list(predictor.models.keys())}")
        print(f"Total models: {len(predictor.models)}")
        print(f"Expected: ['Vision Transformer', 'Magnification Aware']")
        
        if len(predictor.models) == 0:
            print("\n❌ ERROR: No models loaded!")
            print("Check:")
            print("1. Model files exist in backend/models/image/")
            print("2. Check backend terminal for loading errors")
        elif set(predictor.models.keys()) == {'Vision Transformer', 'Magnification Aware'}:
            print("\n✅ SUCCESS: Both models loaded correctly!")
        else:
            print(f"\n⚠️  WARNING: Unexpected models loaded: {list(predictor.models.keys())}")
            print("Should only have: Vision Transformer, Magnification Aware")
    else:
        print("\n❌ ERROR: USE_REAL_MODELS is False!")
        print("Set USE_REAL_MODELS = True in utils/predictions.py")
        
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()

print("="*60)

