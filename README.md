# 🩺 AI-Powered Breast Cancer Diagnosis Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-chayma--saad.github.io-ec4899?style=for-the-badge&logo=githubpages&logoColor=white)](https://chayma-saad.github.io/breast-cancer/)
[![API](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://breast-cancer-api-r8x7.onrender.com/docs)

> 🌐 **Try it live:** https://chayma-saad.github.io/breast-cancer/
> The backend runs on Render's free tier — the first prediction after a period of inactivity can take ~50 s while the server wakes up.


A modern web application for breast cancer diagnosis using machine learning and deep learning models. The platform supports both tabular clinical data (Wisconsin Breast Cancer Dataset) and mammogram image analysis.

![Platform Preview](https://img.shields.io/badge/Status-Active-success)
![Python](https://img.shields.io/badge/Python-3.10+-blue)
![React](https://img.shields.io/badge/React-18.2-61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688)

## ✨ Features

### 🔬 Clinical Data Analysis (Tabular)
- Input 30 clinical features from the Wisconsin Breast Cancer Dataset
- Multiple ML models: GRU-SVM, Linear Regression, Softmax Regression, MLP, Neural Network
- SHAP-based feature importance visualization
- Real-time prediction with confidence scores

### 🩻 Mammogram Analysis (Image)
- Drag-and-drop image upload
- Deep learning vision models: DenseNet, ViT-B, Swin Transformer, EfficientNet
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
- Python 3.10+
- pip

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

Or with uvicorn:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

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
| Model | Accuracy | F1 Score | AUC-ROC |
|-------|----------|----------|---------|
| GRU-SVM | 96.7% | 96.2% | 98.9% |
| MLP | 95.4% | 94.8% | 98.1% |
| Neural Network | 94.8% | 94.1% | 97.6% |
| Softmax Regression | 92.4% | 91.2% | 95.8% |
| Linear Regression | 91.2% | 89.8% | 94.3% |

### Vision Models
| Model | Accuracy | F1 Score | AUC-ROC |
|-------|----------|----------|---------|
| Ensemble | 95.6% | 95.1% | 98.4% |
| EfficientNet | 94.1% | 93.5% | 97.5% |
| DenseNet | 93.8% | 93.1% | 97.2% |
| ViT-B | 92.6% | 91.8% | 96.4% |
| Swin Transformer | 91.9% | 90.8% | 95.8% |

## 🛠️ Technologies

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Framer Motion for animations
- Recharts for data visualization
- Lucide React for icons

### Backend
- FastAPI for REST API
- PyTorch for deep learning
- scikit-learn for ML models
- ReportLab for PDF generation
- NumPy & Pandas for data processing

## ⚠️ Disclaimer

This application is for **educational and research purposes only**. It should NOT be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical decisions.

## 📝 License

MIT License - feel free to use this project for learning and research.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please open an issue on the repository.


