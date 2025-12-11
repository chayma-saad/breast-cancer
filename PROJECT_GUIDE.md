# 📚 Complete Project Guide - Breast Cancer Diagnosis Platform

## 🗂️ Project Structure Explained

```
breast-cancer-prj/
│
├── 🔧 backend/                      # Python FastAPI Server
│   ├── main.py                      # API entry point & routes
│   ├── requirements.txt             # Python dependencies
│   │
│   ├── models/                      # 🧠 PUT YOUR MODELS HERE
│   │   ├── tabular/                 # ML models for clinical data
│   │   │   ├── gru_svm.pkl
│   │   │   ├── mlp.pkl
│   │   │   └── ...
│   │   ├── image/                   # Deep learning vision models
│   │   │   ├── densenet.pth
│   │   │   ├── efficientnet.pth
│   │   │   └── ...
│   │   └── scalers/                 # Data preprocessors
│   │       └── scaler.pkl
│   │
│   ├── data/                        # 📊 PUT YOUR DATASETS HERE
│   │   ├── wisconsin_breast_cancer.csv
│   │   └── images/
│   │
│   ├── utils/                       # Helper modules
│   │   ├── predictions.py           # ⭐ MODEL INTEGRATION CODE
│   │   ├── metrics.py               # Model performance data
│   │   └── report_generator.py      # PDF generation
│   │
│   └── weights/                     # Alternative weights folder
│
├── 🎨 frontend/                     # React Web Application
│   ├── src/
│   │   ├── pages/                   # Web pages
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── TabularPrediction.jsx # Clinical data form
│   │   │   ├── ImagePrediction.jsx   # Image upload
│   │   │   ├── Dashboard.jsx         # Model metrics
│   │   │   └── Glossary.jsx          # Medical terms
│   │   └── components/              # Reusable UI components
│   │
│   └── package.json                 # Node.js dependencies
│
└── docker/                          # Deployment configs
```

---

## 📁 What Each File Does

### Backend Files

| File | Purpose |
|------|---------|
| `main.py` | **API Server** - Defines all HTTP endpoints (`/predict/tabular`, `/predict/image`, etc.) |
| `utils/predictions.py` | **🌟 MAIN FILE** - Contains `TabularPredictor` and `ImagePredictor` classes. **MODIFY THIS TO ADD YOUR MODELS** |
| `utils/metrics.py` | Returns hardcoded model metrics (accuracy, F1, etc.) for the dashboard |
| `utils/report_generator.py` | Generates PDF diagnosis reports using ReportLab |
| `requirements.txt` | Python packages to install |

### Frontend Files

| File | Purpose |
|------|---------|
| `pages/Home.jsx` | Welcome page with overview and navigation buttons |
| `pages/TabularPrediction.jsx` | Form with 30 input fields for Wisconsin dataset features |
| `pages/ImagePrediction.jsx` | Drag-and-drop image upload with heatmap display |
| `pages/Dashboard.jsx` | Charts showing model accuracy, ROC curves, confusion matrices |
| `pages/Glossary.jsx` | Dictionary of medical and ML terms |
| `components/Sidebar.jsx` | Left navigation menu |
| `components/Navbar.jsx` | Top bar with dark mode toggle |

---

## 🔌 API Endpoints Explained

| Endpoint | Method | What It Does |
|----------|--------|--------------|
| `/` | GET | Returns API info |
| `/predict/tabular` | POST | Takes 30 clinical features → Returns diagnosis |
| `/predict/image` | POST | Takes mammogram image → Returns diagnosis + heatmap |
| `/metrics` | GET | Returns all model performance metrics |
| `/report/generate` | POST | Generates PDF report for a prediction |
| `/history` | GET | Returns past predictions |

---

## 🧠 How to Add Your Models

### Step 1: Save Your Trained Models

```python
# For scikit-learn models (MLP, SVM, Logistic Regression, etc.)
import joblib
joblib.dump(your_model, 'backend/models/tabular/mlp.pkl')
joblib.dump(your_scaler, 'backend/models/scalers/scaler.pkl')

# For PyTorch models (DenseNet, ViT, etc.)
import torch
torch.save(model.state_dict(), 'backend/models/image/densenet.pth')
```

### Step 2: Edit `backend/utils/predictions.py`

1. **Set the flag to True:**
```python
USE_REAL_MODELS = True  # Line 24
```

2. **Uncomment the model loading code** in `_load_real_models()` method

3. **Update paths** in `MODEL_PATHS` dictionary if needed

### Step 3: Restart the Backend

```bash
cd backend
python main.py
```

---

## 📊 Where to Put Your Dataset

### For Tabular Data (Wisconsin Dataset):
```
backend/data/wisconsin_breast_cancer.csv
```

Expected CSV format:
```csv
radius_mean,texture_mean,perimeter_mean,area_mean,...,diagnosis
17.99,10.38,122.8,1001,...,M
13.54,14.36,87.46,566.3,...,B
```

### For Image Data (Mammograms):
```
backend/data/
├── train/
│   ├── benign/
│   │   ├── image001.png
│   │   └── ...
│   └── malignant/
│       ├── image001.png
│       └── ...
└── test/
    ├── benign/
    └── malignant/
```

---

## 🔄 Data Flow Explained

### Tabular Prediction Flow:
```
User enters 30 features in form
        ↓
Frontend sends POST to /predict/tabular
        ↓
Backend receives features as JSON
        ↓
TabularPredictor.preprocess() - scales data
        ↓
TabularPredictor.predict() - runs all models
        ↓
Returns predictions + feature importance
        ↓
Frontend displays results table
```

### Image Prediction Flow:
```
User uploads mammogram image
        ↓
Frontend sends POST to /predict/image (multipart form)
        ↓
Backend receives image bytes
        ↓
ImagePredictor.preprocess_image() - resize to 224x224
        ↓
ImagePredictor.predict() - runs vision models
        ↓
Generate Grad-CAM heatmap
        ↓
Returns predictions + base64 heatmap
        ↓
Frontend displays results + heatmap overlay
```

---

## 🎨 Frontend Components Explained

### Home Page (`Home.jsx`)
- **Hero section**: Title, description, animated illustration
- **Stats cards**: Accuracy, number of models, etc.
- **Feature cards**: Explains ML, DL, Ensemble approaches
- **Quick action buttons**: Navigate to prediction pages

### Tabular Prediction (`TabularPrediction.jsx`)
- **Left column**: Form with 30 input fields organized in 3 groups (Mean, SE, Worst)
- **Right column**: Results display
- **Feature importance chart**: Bar chart using Recharts library
- **Model predictions table**: Shows each model's prediction

### Image Prediction (`ImagePrediction.jsx`)
- **Drop zone**: Drag-and-drop area for image upload
- **Preview**: Shows original image
- **Heatmap**: Shows Grad-CAM attention overlay
- **Results table**: Vision model predictions

### Dashboard (`Dashboard.jsx`)
- **Tab selector**: Switch between tabular and vision models
- **Stats overview**: Best accuracy, F1, etc.
- **Bar chart**: Compares all models
- **ROC curves**: Line chart of all models
- **Model cards**: Click to see confusion matrix

### Glossary (`Glossary.jsx`)
- **Search bar**: Filter terms
- **Expandable categories**: Medical, Features, ML, DL terms
- **Related terms**: Click to search related

---

## 📝 Model Input/Output Specifications

### Tabular Models

**Input:** 30 features (numpy array shape: `(1, 30)`)
```
[radius_mean, texture_mean, perimeter_mean, area_mean, 
 smoothness_mean, compactness_mean, concavity_mean, 
 concave_points_mean, symmetry_mean, fractal_dimension_mean,
 radius_se, texture_se, perimeter_se, area_se, 
 smoothness_se, compactness_se, concavity_se, 
 concave_points_se, symmetry_se, fractal_dimension_se,
 radius_worst, texture_worst, perimeter_worst, area_worst, 
 smoothness_worst, compactness_worst, concavity_worst, 
 concave_points_worst, symmetry_worst, fractal_dimension_worst]
```

**Output:** 
- `prediction`: 0 (Benign) or 1 (Malignant)
- `probability`: Float [0, 1]

### Vision Models

**Input:** Image tensor shape `(1, 3, 224, 224)` (batch, channels, height, width)

**Output:**
- `prediction`: 0 (Benign) or 1 (Malignant)  
- `probability`: Float [0, 1]

---

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Frontend:**
```powershell
cd frontend
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install
npm run dev
```
→ Opens at http://localhost:3000

**Terminal 2 - Backend:**
```powershell
cd backend
pip install -r requirements.txt
python main.py
```
→ API at http://localhost:8000

### Production (Docker):
```bash
docker-compose up --build
```

---

## ❓ FAQ

**Q: The predictions look random, not using my models?**
A: Set `USE_REAL_MODELS = True` in `predictions.py` and uncomment the loading code.

**Q: Where do I put my .pkl model files?**
A: In `backend/models/tabular/` folder

**Q: How do I update the accuracy numbers on the dashboard?**
A: Edit `backend/utils/metrics.py` with your actual model metrics

**Q: Can I add more models?**
A: Yes! Add them to `MODEL_PATHS` dict and load them in `_load_real_models()`

**Q: The heatmap doesn't look accurate?**
A: The demo uses a simulated heatmap. Implement real Grad-CAM in `_generate_gradcam()` method

---

## 📧 Support

If you have questions, check:
1. This guide
2. Comments in `predictions.py`
3. `backend/models/README.md`


