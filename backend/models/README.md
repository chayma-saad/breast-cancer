# 🧠 Model Integration Guide

## 📁 Where to Put Your Models

Place your trained model files here in the `backend/models/` folder:

```
backend/models/
├── tabular/                    # Tabular ML models (for clinical data)
│   ├── gru_svm.pkl            # GRU-SVM model
│   ├── linear_regression.pkl  # Logistic/Linear Regression
│   ├── softmax_regression.pkl # Softmax Regression
│   ├── mlp.pkl                # MLP model
│   └── neural_network.pth     # PyTorch Neural Network
│
├── image/                      # Vision models (for mammograms)
│   ├── densenet.pth           # DenseNet weights
│   ├── vit_b.pth              # Vision Transformer
│   ├── swin_transformer.pth   # Swin Transformer
│   └── efficientnet.pth       # EfficientNet
│
└── scalers/                    # Data preprocessors
    └── scaler.pkl             # StandardScaler for tabular data
```

## 📊 Dataset Location

Place your datasets in `backend/data/`:

```
backend/data/
├── wisconsin_breast_cancer.csv   # Tabular dataset
├── train/                        # Training images
│   ├── benign/
│   └── malignant/
└── test/                         # Test images
    ├── benign/
    └── malignant/
```

## 🔧 Model File Formats

### For scikit-learn models (.pkl):
```python
import joblib

# Save your model
joblib.dump(model, 'backend/models/tabular/mlp.pkl')
joblib.dump(scaler, 'backend/models/scalers/scaler.pkl')

# Load in the app
model = joblib.load('backend/models/tabular/mlp.pkl')
```

### For PyTorch models (.pth):
```python
import torch

# Save your model
torch.save(model.state_dict(), 'backend/models/image/densenet.pth')

# Load in the app
model.load_state_dict(torch.load('backend/models/image/densenet.pth'))
```

### For Keras/TensorFlow models (.h5):
```python
# Save
model.save('backend/models/image/densenet.h5')

# Load
from tensorflow.keras.models import load_model
model = load_model('backend/models/image/densenet.h5')
```

## 📝 Required Model Outputs

Your models should output:
- **Prediction**: 0 (Benign) or 1 (Malignant)
- **Probability/Confidence**: Float between 0-1

Example:
```python
prediction = model.predict(features)  # [0] or [1]
probability = model.predict_proba(features)  # [[0.15, 0.85]]
```

