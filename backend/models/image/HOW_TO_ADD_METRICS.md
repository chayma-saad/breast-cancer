# 📊 How to Add Your Real Model Accuracy Metrics

## 🎯 Goal
Add the actual accuracy, F1 score, precision, recall, and confusion matrix from your model evaluations.

---

## 📝 Method 1: Create metrics.json File (Recommended)

1. **Copy the template:**
   ```powershell
   cd "C:\Users\Chayma\Desktop\breast cancer prj\backend\models\image"
   copy metrics.json.template metrics.json
   ```

2. **Edit `metrics.json`** and fill in your actual evaluation results:

```json
{
  "Vision Transformer": {
    "accuracy": 0.948,        // Your actual accuracy (0-1 range)
    "f1_score": 0.942,       // Your actual F1 score
    "precision": 0.938,      // Your actual precision
    "recall": 0.946,         // Your actual recall
    "auc_roc": 0.978,        // Your actual AUC-ROC
    "confusion_matrix": {
      "true_positive": 237,
      "true_negative": 424,
      "false_positive": 15,
      "false_negative": 24
    },
    "description": "Vision Transformer (ViT-B/16) fine-tuned on mammogram dataset"
  },
  "Magnification Aware": {
    "accuracy": 0.956,       // Your actual accuracy
    "f1_score": 0.951,
    "precision": 0.948,
    "recall": 0.954,
    "auc_roc": 0.982,
    "confusion_matrix": {
      "true_positive": 240,
      "true_negative": 427,
      "false_positive": 12,
      "false_negative": 21
    },
    "description": "Magnification-aware model that adapts to different image magnifications"
  }
}
```

3. **Save the file** - The backend will automatically load it!

---

## 📝 Method 2: Update metrics.py Directly

Edit `backend/utils/metrics.py` and replace the `None` values with your actual metrics:

```python
image_models = {
    'Vision Transformer': {
        'accuracy': 0.948,  # Your actual accuracy
        'f1_score': 0.942,
        # ... etc
    },
    'Magnification Aware': {
        'accuracy': 0.956,  # Your actual accuracy
        # ... etc
    }
}
```

---

## 🔍 Where to Get Your Metrics

If you have evaluation results from your training/testing:

1. **From your training script** - Look for evaluation output
2. **From test set evaluation** - Run your models on test data
3. **From validation results** - Check your training logs

---

## ✅ After Adding Metrics

1. **Restart the backend server**
2. **Refresh the Dashboard page**
3. **You'll see your real accuracy displayed!**

---

## 📌 Notes

- Accuracy values should be in **0-1 range** (e.g., 0.948 = 94.8%)
- The frontend will automatically convert to percentages
- If metrics are `None`, the dashboard will show "N/A"

