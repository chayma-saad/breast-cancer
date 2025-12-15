# Troubleshooting: "Prediction failed" Error

## Quick Fixes

### 1. Backend Not Running
**Symptom**: "Prediction failed:" error with no details

**Solution**:
```powershell
cd backend
py -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Check if backend is running:
```powershell
netstat -ano | findstr ":8000"
```

### 2. Models Not Loading
**Symptom**: Backend starts but predictions fail

**Check backend logs for**:
- `[OK] Successfully loaded X model(s): [...]`
- `[ERROR] No models loaded!`
- `[X] Error loading...`

**Solution**:
- Ensure model files exist in `backend/models/image/`:
  - `vit6_breast_cancer.pth` (Vision Transformer)
  - `mag_aware.keras` (Magnification Aware)
- Check file paths are correct
- Install required dependencies:
  ```powershell
  py -m pip install torch torchvision
  # For Magnification Aware (if using .keras):
  py -m pip install tensorflow
  ```

### 3. Check Backend Status

Run the test script:
```powershell
cd backend
py test_api.py
```

Or manually test:
```powershell
curl http://localhost:8000/
```

### 4. Common Errors

**"No models loaded"**:
- Model files missing or wrong path
- Models failed to load (check backend terminal)

**"Keras/TensorFlow required"**:
- Magnification Aware needs TensorFlow
- Install: `py -m pip install tensorflow`
- Or use Python 3.11/3.12

**"Connection refused"**:
- Backend not running
- Start backend first

**"Prediction error: ..."**:
- Check backend terminal for full error
- Usually model loading or prediction code issue

## Debug Steps

1. **Check backend is running**:
   ```powershell
   netstat -ano | findstr ":8000"
   ```

2. **Check backend logs**:
   - Look for model loading messages
   - Look for error messages
   - Check for Python exceptions

3. **Test API directly**:
   ```powershell
   curl http://localhost:8000/metrics
   ```

4. **Check model files**:
   ```powershell
   dir backend\models\image\
   ```

5. **Check frontend console**:
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for API calls

## Still Not Working?

1. **Restart everything**:
   - Stop backend (Ctrl+C or kill process)
   - Restart backend
   - Refresh frontend (Ctrl+F5)

2. **Check Python version**:
   ```powershell
   py --version
   ```
   - Python 3.11 or 3.12 recommended
   - Python 3.14 may have issues with TensorFlow

3. **Reinstall dependencies**:
   ```powershell
   cd backend
   py -m pip install -r requirements.txt --upgrade
   ```

4. **Check for port conflicts**:
   ```powershell
   netstat -ano | findstr ":8000"
   ```
   - If port is in use, change port in uvicorn command

