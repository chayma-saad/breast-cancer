"""
Breast Cancer Diagnosis API
FastAPI backend for tabular and image-based predictions
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Optional
import numpy as np
import uuid
from datetime import datetime
import os
import io
import base64

# Import custom modules
from utils.predictions import TabularPredictor, ImagePredictor
from utils.report_generator import generate_pdf_report
from utils.metrics import get_model_metrics
from trust_safety.trust_center import AITrustSafetyCenter, ModelPrediction
from chatbot import router as chatbot_router

app = FastAPI(
    title="Breast Cancer Diagnosis API",
    description="AI-Powered Breast Cancer Diagnosis Platform using ML and DL models",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize predictors
tabular_predictor = TabularPredictor()
image_predictor = ImagePredictor()
trust_center = AITrustSafetyCenter()

# Store prediction history
prediction_history = []

# Include chatbot routes
app.include_router(chatbot_router, prefix="/chatbot", tags=["chatbot"])


class TabularInput(BaseModel):
    """Input schema for tabular predictions"""
    radius_mean: float
    texture_mean: float
    perimeter_mean: float
    area_mean: float
    smoothness_mean: float
    compactness_mean: float
    concavity_mean: float
    concave_points_mean: float
    symmetry_mean: float
    fractal_dimension_mean: float
    radius_se: float
    texture_se: float
    perimeter_se: float
    area_se: float
    smoothness_se: float
    compactness_se: float
    concavity_se: float
    concave_points_se: float
    symmetry_se: float
    fractal_dimension_se: float
    radius_worst: float
    texture_worst: float
    perimeter_worst: float
    area_worst: float
    smoothness_worst: float
    compactness_worst: float
    concavity_worst: float
    concave_points_worst: float
    symmetry_worst: float
    fractal_dimension_worst: float


class PredictionResponse(BaseModel):
    """Response schema for predictions"""
    prediction_id: str
    final_prediction: str
    confidence: float
    model_predictions: List[Dict]
    feature_importance: Optional[Dict] = None
    trust_report: Optional[Dict] = None
    timestamp: str


class ImagePredictionResponse(BaseModel):
    """Response schema for image predictions"""
    prediction_id: str
    final_prediction: str
    confidence: float
    model_predictions: List[Dict]
    heatmap_base64: Optional[str] = None
    explanation: str
    trust_report: Optional[Dict] = None
    timestamp: str


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Breast Cancer Diagnosis API",
        "version": "1.0.0",
        "endpoints": {
            "tabular": "/predict/tabular",
            "image": "/predict/image",
            "metrics": "/metrics",
            "report": "/report/generate"
        }
    }


@app.post("/predict/tabular", response_model=PredictionResponse)
async def predict_tabular(data: TabularInput):
    """
    Predict breast cancer from clinical tabular data
    Uses multiple models: GRU-SVM, Linear Regression, Softmax Regression, MLP, NN
    """
    try:
        # Convert input to array
        features = np.array([
            data.radius_mean, data.texture_mean, data.perimeter_mean, data.area_mean,
            data.smoothness_mean, data.compactness_mean, data.concavity_mean,
            data.concave_points_mean, data.symmetry_mean, data.fractal_dimension_mean,
            data.radius_se, data.texture_se, data.perimeter_se, data.area_se,
            data.smoothness_se, data.compactness_se, data.concavity_se,
            data.concave_points_se, data.symmetry_se, data.fractal_dimension_se,
            data.radius_worst, data.texture_worst, data.perimeter_worst, data.area_worst,
            data.smoothness_worst, data.compactness_worst, data.concavity_worst,
            data.concave_points_worst, data.symmetry_worst, data.fractal_dimension_worst
        ]).reshape(1, -1)
        
        # Get predictions from all models
        predictions = tabular_predictor.predict(features)
        trust_report = None
        
        # Generate prediction ID
        prediction_id = str(uuid.uuid4())[:8]
        timestamp = datetime.now().isoformat()
        
        # Calculate ensemble prediction
        # Filter out error predictions
        valid_predictions = [p for p in predictions if p['prediction'] != 'Error']
        
        if valid_predictions:
            malignant_votes = sum(1 for p in valid_predictions if p['prediction'] == 'Malignant')
            final_prediction = 'Malignant' if malignant_votes > len(valid_predictions) / 2 else 'Benign'
            # Confidence is already in percentage (0-100), don't multiply by 100 again!
            avg_confidence = np.mean([p['confidence'] for p in valid_predictions])
            # Cap confidence at 100%
            avg_confidence = min(100.0, max(0.0, avg_confidence))
        else:
            final_prediction = 'Unknown'
            avg_confidence = 0.0
        
        # Get feature importance
        feature_names = [
            'radius_mean', 'texture_mean', 'perimeter_mean', 'area_mean',
            'smoothness_mean', 'compactness_mean', 'concavity_mean',
            'concave_points_mean', 'symmetry_mean', 'fractal_dimension_mean',
            'radius_se', 'texture_se', 'perimeter_se', 'area_se',
            'smoothness_se', 'compactness_se', 'concavity_se',
            'concave_points_se', 'symmetry_se', 'fractal_dimension_se',
            'radius_worst', 'texture_worst', 'perimeter_worst', 'area_worst',
            'smoothness_worst', 'compactness_worst', 'concavity_worst',
            'concave_points_worst', 'symmetry_worst', 'fractal_dimension_worst'
        ]
        feature_importance = tabular_predictor.get_feature_importance(features, feature_names)

        # Trust & Safety analysis
        try:
            trust_preds = [
                ModelPrediction(
                    model_name=p['model'],
                    prediction=p['prediction'].lower(),
                    confidence=float(p.get('confidence', 0)) / 100.0
                )
                for p in valid_predictions
            ]
            if trust_preds:
                trust_report = trust_center.complete_analysis(trust_preds)
        except Exception as te:
            print(f"[WARN] Trust analysis (tabular) failed: {te}")
        
        response = {
            "prediction_id": prediction_id,
            "final_prediction": final_prediction,
            "confidence": round(avg_confidence, 2),  # Already in percentage (0-100)
            "model_predictions": predictions,
            "feature_importance": feature_importance,
            "trust_report": trust_report,
            "timestamp": timestamp
        }
        
        # Store in history
        prediction_history.append({
            "type": "tabular",
            **response
        })
        
        return response
        
    except Exception as e:
        import traceback
        error_detail = str(e)
        print(f"[ERROR] Image prediction failed: {error_detail}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction error: {error_detail}")


@app.post("/predict/image", response_model=ImagePredictionResponse)
async def predict_image(file: UploadFile = File(...)):
    """
    Predict breast cancer from mammogram image
    Uses Vision Transformer (ViT) and Magnification Aware models
    """
    try:
        # Read image
        contents = await file.read()
        
        # Get predictions from all vision models
        predictions, heatmap_base64 = image_predictor.predict(contents)
        trust_report = None
        
        # Generate prediction ID
        prediction_id = str(uuid.uuid4())[:8]
        timestamp = datetime.now().isoformat()
        
        # Filter out errors and only use valid predictions
        valid_predictions = [p for p in predictions if p['prediction'] != 'Error' and p.get('confidence', 0) > 0]
        
        if not valid_predictions:
            final_prediction = 'Error'
            confidence = 0.0
        else:
            # Calculate ensemble prediction from valid models only
            malignant_votes = sum(1 for p in valid_predictions if p['prediction'] == 'Malignant')
            final_prediction = 'Malignant' if malignant_votes > len(valid_predictions) / 2 else 'Benign'
            
            # Get ensemble confidence (prefer Ensemble model, otherwise average)
            ensemble_pred = next((p for p in valid_predictions if p['model'] == 'Ensemble'), None)
            if ensemble_pred:
                confidence = ensemble_pred['confidence']
            else:
                confidence = np.mean([p['confidence'] for p in valid_predictions])

            # Trust & Safety analysis (image)
            try:
                trust_preds = [
                    ModelPrediction(
                        model_name=p['model'],
                        prediction=p['prediction'].lower(),
                        confidence=float(p.get('confidence', 0)) / 100.0
                    )
                    for p in valid_predictions
                ]
                if trust_preds:
                    trust_report = trust_center.complete_analysis(trust_preds)
            except Exception as te:
                print(f"[WARN] Trust analysis (image) failed: {te}")
        
        explanation = "Highlighted red regions indicate areas most correlated with malignancy. " \
                     "The ensemble model combines predictions from Vision Transformer and Magnification Aware models for improved accuracy."
        
        response = {
            "prediction_id": prediction_id,
            "final_prediction": final_prediction,
            "confidence": round(confidence, 2),
            "model_predictions": predictions,
            "heatmap_base64": heatmap_base64,
            "explanation": explanation,
            "trust_report": trust_report,
            "timestamp": timestamp
        }
        
        # Store in history
        prediction_history.append({
            "type": "image",
            **response
        })
        
        return response
        
    except Exception as e:
        import traceback
        error_detail = str(e)
        print(f"[ERROR] Image prediction failed: {error_detail}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction error: {error_detail}")


@app.get("/metrics")
async def get_metrics():
    """
    Get performance metrics for all models
    Returns accuracy, F1 score, ROC curves, and confusion matrices
    """
    try:
        metrics = get_model_metrics()
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/models/status")
async def get_models_status():
    """
    Get status of which models are currently loaded
    """
    try:
        tabular_loaded = list(tabular_predictor.models.keys()) if hasattr(tabular_predictor, 'models') else []
        image_loaded = list(image_predictor.models.keys()) if hasattr(image_predictor, 'models') else []
        
        return {
            "tabular_models": tabular_loaded,
            "image_models": image_loaded,
            "tabular_count": len(tabular_loaded),
            "image_count": len(image_loaded)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/report/generate")
async def generate_report(
    prediction_id: str,
    patient_id: Optional[str] = None
):
    """
    Generate a PDF diagnostic report for a prediction
    """
    try:
        # Find prediction in history
        prediction = next(
            (p for p in prediction_history if p['prediction_id'] == prediction_id),
            None
        )
        
        if not prediction:
            raise HTTPException(status_code=404, detail="Prediction not found")
        
        # Generate patient ID if not provided
        if not patient_id:
            patient_id = f"PT-{uuid.uuid4().hex[:6].upper()}"
        
        # Generate PDF
        pdf_path = generate_pdf_report(prediction, patient_id)
        
        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename=f"diagnosis_report_{prediction_id}.pdf"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/history")
async def get_history():
    """Get prediction history"""
    return {"predictions": prediction_history}


@app.delete("/history")
async def clear_history():
    """Clear prediction history"""
    prediction_history.clear()
    return {"message": "History cleared"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

