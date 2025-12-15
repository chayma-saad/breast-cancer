# 🩺 AI-Powered Breast Cancer Diagnosis Platform

A modern web application for breast cancer diagnosis using machine learning and deep learning models. The platform supports both tabular clinical data (Wisconsin Breast Cancer Dataset) and mammogram image analysis.

![Platform Preview](https://img.shields.io/badge/Status-Active-success)
![Python](https://img.shields.io/badge/Python-3.10+-blue)
![React](https://img.shields.io/badge/React-18.2-61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688)

## ✨ Features

### 🔬 Clinical Data Analysis (Tabular)
- Input 30 clinical features from the Wisconsin Breast Cancer Dataset
- Multiple ML models: GRU-SVM, SVM RBF, Random Forest, Neural Network L1, MLP, Linear Regression, Softmax Regression
- SHAP-based feature importance visualization
- Real-time prediction with confidence scores

### 🩻 Mammogram Analysis (Image)
- Drag-and-drop image upload
- Deep learning vision models: Vision Transformer (ViT) and Magnification Aware
- Ensemble predictions for improved accuracy
- Grad-CAM heatmap visualization

### 📊 Model Performance Dashboard
- Comprehensive metrics: Accuracy, F1 Score, Precision, Recall, AUC-ROC
- Interactive ROC curves comparison
- Confusion matrices for all models
- Dataset information and statistics

### 📄 Diagnosis Reports
- Professional PDF report generation
- Includes prediction results, model votes, and explanations
- Medical-style formatting with patient information

### 🎨 Modern UI/UX
- Clean, medical-themed design
- Dark mode support
- Responsive layout
- Smooth animations with Framer Motion

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+ (tested with Python 3.14)
- pip

### Installation

#### 1. Install Backend Dependencies

```powershell
cd backend
py -m pip install -r requirements.txt
```

#### 2. Install Frontend Dependencies

```powershell
cd frontend
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install
```

**Note for Windows PowerShell**: If you encounter execution policy errors, run:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### Running the Application

#### Option 1: Run Both Servers (Recommended)

**Terminal 1 - Backend:**
```powershell
cd backend
py -m uvicorn main:app --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm run dev
```

#### Option 2: Run with Background Processes

```powershell
# Start backend
cd backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "py -m uvicorn main:app --host 0.0.0.0 --port 8000"

# Start frontend (in new terminal)
cd frontend
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm run dev
```

### Access the Application

- **Frontend**: `http://localhost:3000` (or the port shown in terminal)
- **Backend API**: `http://localhost:8000`
- **API Documentation**: `http://localhost:8000/docs`

### Verify Servers Are Running

**Check if servers are running:**
```powershell
# Check backend (port 8000)
netstat -ano | findstr :8000

# Check frontend (port 3000)
netstat -ano | findstr :3000
```

**Stop servers:**
```powershell
# Stop Python processes (backend)
Get-Process -Name python -ErrorAction SilentlyContinue | Stop-Process -Force

# Stop Node processes (frontend)
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Model Files

Place your trained models in the following directories:

**Tabular Models** (`backend/models/tabular/`):
- `gru_svm_modified.pkl` - GRU-SVM model
- `svm_rbf_optimized.pkl` - SVM RBF model
- `random_forest.pkl` - Random Forest model
- `nn_l1.pkl` - Neural Network L1 model
- `mlp_model.pkl` - MLP model
- `linear_regression_model.pkl` - Linear Regression model
- `best_tuned_softmax_model.pkl` - Softmax Regression model

**Image Models** (`backend/models/image/`):
- `vit6_breast_cancer.pth` - Vision Transformer model
- `mag_aware.pkl` - Magnification Aware model

**Scaler** (`backend/models/scalers/`):
- `scaler.pkl` - StandardScaler for tabular data preprocessing

**Optional - Model Metrics** (`backend/models/image/metrics.json`):
```json
{
  "Vision Transformer": {
    "accuracy": 0.92,
    "f1_score": 0.91,
    "precision": 0.93,
    "recall": 0.90,
    "auc_roc": 0.95
  },
  "Magnification Aware": {
    "accuracy": 0.88,
    "f1_score": 0.87,
    "precision": 0.89,
    "recall": 0.86,
    "auc_roc": 0.90
  }
}
```

### Docker Deployment

```bash
docker-compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

## 📁 Project Structure

```
breast-cancer-prj/
│
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── models/              # ML/DL model files
│   ├── utils/
│   │   ├── predictions.py   # Prediction logic
│   │   ├── metrics.py       # Model metrics
│   │   └── report_generator.py  # PDF generation
│   ├── preprocess/          # Data preprocessing
│   └── weights/             # Model weights
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main application
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Dashboard
│   │   │   ├── TabularPrediction.jsx  # Clinical data form
│   │   │   ├── ImagePrediction.jsx    # Mammogram upload
│   │   │   ├── Dashboard.jsx          # Performance metrics
│   │   │   └── Glossary.jsx           # Medical terms
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   └── styles/
│   │       └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── nginx.conf
│
├── docker-compose.yml
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| POST | `/predict/tabular` | Predict from clinical data |
| POST | `/predict/image` | Predict from mammogram |
| GET | `/metrics` | Get model performance metrics |
| POST | `/report/generate` | Generate PDF report |
| GET | `/history` | Get prediction history |

### Example: Tabular Prediction

```bash
curl -X POST "http://localhost:8000/predict/tabular" \
  -H "Content-Type: application/json" \
  -d '{
    "radius_mean": 17.99,
    "texture_mean": 10.38,
    "perimeter_mean": 122.8,
    "area_mean": 1001,
    "smoothness_mean": 0.1184,
    "compactness_mean": 0.2776,
    "concavity_mean": 0.3001,
    "concave_points_mean": 0.1471,
    "symmetry_mean": 0.2419,
    "fractal_dimension_mean": 0.07871,
    ...
  }'
```

## 🧠 Models

### Tabular Models
| Model | Description |
|-------|-------------|
| GRU-SVM | GRU feature extractor + SVM classifier |
| SVM RBF | Support Vector Machine with RBF kernel |
| Random Forest | Random Forest ensemble classifier |
| Neural Network L1 | Neural Network with L1 regularization |
| MLP | Multi-Layer Perceptron |
| Linear Regression | Linear Regression classifier |
| Softmax Regression | Softmax Regression classifier |

**Note**: Model accuracy metrics are displayed in the Dashboard. Add your evaluation results to `backend/models/image/metrics.json` to show real accuracy values.

### Vision Models
| Model | Description |
|-------|-------------|
| Vision Transformer (ViT) | Vision Transformer fine-tuned on mammograms |
| Magnification Aware | Magnification-aware model for different image scales |
| Ensemble | Combines predictions from both vision models |

**Note**: Model accuracy metrics are displayed in the Dashboard. Add your evaluation results to `backend/models/image/metrics.json` to show real accuracy values.

## 🛠️ Technologies

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Framer Motion for animations
- Recharts for data visualization
- Lucide React for icons

### Backend
- FastAPI for REST API
- PyTorch for deep learning (ViT models)
- scikit-learn for ML models
- joblib for model persistence
- ReportLab for PDF generation
- NumPy & Pandas for data processing
- PIL/Pillow for image processing

## 🔧 Troubleshooting

### Backend Issues

**Models not loading:**
- Check that model files exist in `backend/models/` directories
- Verify model file names match those in `backend/utils/predictions.py`
- Check backend terminal for loading errors
- Run `py backend/check_models.py` to verify model loading

**PyTorch model loading errors:**
- Ensure PyTorch is installed: `py -m pip install torch torchvision`
- Models are loaded with `weights_only=False` for compatibility

**Port already in use:**
- Change port in uvicorn command: `--port 8001`
- Or stop the process using the port: `netstat -ano | findstr :8000`

### Frontend Issues

**npm execution policy error (Windows):**
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

**Port 3000 already in use:**
- Vite will automatically use the next available port (3001, 3002, etc.)
- Check terminal output for the actual port

**API connection errors:**
- Ensure backend is running on port 8000
- Check CORS settings in `backend/main.py`
- Verify API URL in frontend code matches backend port

## ⚠️ Disclaimer

This application is for **educational and research purposes only**. It should NOT be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical decisions.

## 📝 License

MIT License - feel free to use this project for learning and research.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please open an issue on the repository.


