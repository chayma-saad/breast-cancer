"""
Quick test script to verify image models are loaded correctly
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from utils.predictions import ImagePredictor
import numpy as np
from PIL import Image
import io

# Create a dummy image for testing
def create_test_image():
    """Create a test mammogram image"""
    img = Image.new('RGB', (224, 224), color='white')
    # Add some noise to make it look like a real image
    pixels = np.array(img)
    noise = np.random.randint(0, 50, pixels.shape, dtype=np.uint8)
    pixels = pixels - noise
    pixels = np.clip(pixels, 0, 255).astype(np.uint8)
    return Image.fromarray(pixels)

print("="*60)
print("Testing Image Model Loading and Prediction")
print("="*60)

# Initialize predictor
print("\n1. Initializing ImagePredictor...")
predictor = ImagePredictor()

print(f"\n2. Models loaded: {list(predictor.models.keys())}")
print(f"   Total models: {len(predictor.models)}")
print(f"   Use real models: {predictor.use_real_models}")

# Test prediction
print("\n3. Testing prediction with dummy image...")
test_image = create_test_image()
img_bytes = io.BytesIO()
test_image.save(img_bytes, format='PNG')
img_bytes.seek(0)

try:
    predictions, heatmap = predictor.predict(img_bytes.getvalue())
    print(f"\n4. Predictions received:")
    for pred in predictions:
        print(f"   - {pred['model']}: {pred['prediction']} ({pred['confidence']}%)")
    
    print("\n✅ All tests passed!")
except Exception as e:
    print(f"\n❌ Error during prediction: {e}")
    import traceback
    traceback.print_exc()

print("="*60)

