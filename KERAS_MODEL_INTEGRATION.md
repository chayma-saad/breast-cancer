# Magnification Aware .keras Model Integration

## Changes Made

### 1. Updated Model Path
- Changed from `mag_aware.pkl` to `mag_aware.keras` in `backend/utils/predictions.py`
- The system now looks for the `.keras` format file

### 2. Added .keras File Loading Support
- Added detection for `.keras` file extension
- Implemented Keras 3 loading (tries `keras` first, then `tensorflow.keras`)
- Proper error handling if Keras/TensorFlow is not installed

### 3. Added Keras Model Prediction Support
- Updated prediction code to handle Keras models
- Preprocesses images correctly for Keras models (resize to 224x224, normalize to 0-1)
- Handles Keras model predictions with proper output processing

## Current Status

The code is now configured to load `mag_aware.keras`. However, **Keras/TensorFlow is required** to load `.keras` files.

## Requirements

To use the `.keras` model, you need:

1. **TensorFlow/Keras installed**:
   ```powershell
   py -m pip install tensorflow
   ```

2. **Python 3.11 or 3.12** (recommended):
   - TensorFlow may not work with Python 3.14
   - Use Python 3.11 or 3.12 for best compatibility

## Testing

1. **Check if model loads**:
   ```powershell
   cd backend
   py test_model_loading.py
   ```

2. **Expected output if Keras is installed**:
   ```
   [OK] Loaded Magnification Aware model (Keras 3): ...\mag_aware.keras
   [OK] Successfully loaded 2 model(s): ['Vision Transformer', 'Magnification Aware']
   ```

3. **Expected output if Keras is NOT installed**:
   ```
   [X] Keras/TensorFlow not installed. Cannot load .keras file.
   [OK] Successfully loaded 1 model(s): ['Vision Transformer']
   ```

## Next Steps

1. **If you have Python 3.11/3.12**:
   - Install TensorFlow: `py -3.11 -m pip install tensorflow`
   - Restart backend
   - Both models should load

2. **If you only have Python 3.14**:
   - The system will use Vision Transformer only
   - To use both models, install Python 3.11/3.12

3. **Restart the backend** to test:
   ```powershell
   cd backend
   py -m uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## Model Loading Order

The system now:
1. Checks file extension (`.keras`, `.pkl`, `.pth`)
2. For `.keras` files: Uses Keras/TensorFlow loader
3. For `.pkl`/`.pth` files: Tries PyTorch, then joblib
4. Provides clear error messages if dependencies are missing

## Prediction Behavior

- **If both models load**: You'll see predictions from both Vision Transformer and Magnification Aware, plus an ensemble
- **If only Vision Transformer loads**: You'll see predictions from Vision Transformer only
- **Keras models**: Automatically preprocess images correctly (224x224, normalized 0-1)

The integration is complete! The backend will now try to load `mag_aware.keras` when it starts.

