import numpy as np
from dataclasses import dataclass
from typing import List, Dict, Tuple, Optional
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

@dataclass
class ModelPrediction:
    """Represents a single model's prediction"""
    model_name: str
    prediction: str  # 'benign' or 'malignant'
    confidence: float  # 0-1
    heatmap: Optional[np.ndarray] = None  # Grad-CAM heatmap
    feature_importance: Optional[Dict[str, float]] = None  # For tabular models

@dataclass
class ImageQuality:
    """Image quality metrics"""
    resolution: Tuple[int, int]
    contrast: float  # 0-1
    noise_level: float  # 0-1
    sharpness: float  # 0-1

@dataclass
class PredictionAudit:
    """Audit log entry"""
    timestamp: datetime
    prediction: str
    trust_score: float
    model_agreement: float
    flags: List[str]

class AITrustSafetyCenter:
    """
    AI Trust & Safety Center for Breast Cancer Detection
    Evaluates reliability, transparency, and limitations of AI predictions
    """
    
    def __init__(self):
        self.audit_log: List[PredictionAudit] = []
        
    def compute_trust_score(self, 
                           predictions: List[ModelPrediction],
                           image_quality: Optional[ImageQuality] = None) -> Dict:
        """
        Computes the main AI Trust Score (0-1)
        
        Args:
            predictions: List of model predictions
            image_quality: Optional image quality metrics
            
        Returns:
            Dictionary containing trust analysis
        """
        # 1. Model Agreement Score
        agreement_score = self._compute_model_agreement(predictions)
        
        # 2. Confidence Stability
        confidence_stability = self._compute_confidence_stability(predictions)
        
        # 3. Explainability Consistency
        explainability_score = self._compute_explainability_consistency(predictions)
        
        # 4. Input Quality Score
        quality_score = self._compute_quality_score(image_quality) if image_quality else 0.85
        
        # Weighted average for final trust score
        weights = {
            'agreement': 0.35,
            'confidence': 0.25,
            'explainability': 0.25,
            'quality': 0.15
        }
        
        trust_score = (
            agreement_score * weights['agreement'] +
            confidence_stability * weights['confidence'] +
            explainability_score * weights['explainability'] +
            quality_score * weights['quality']
        )
        
        return {
            'trust_score': trust_score,
            'agreement_score': agreement_score,
            'confidence_stability': confidence_stability,
            'explainability_score': explainability_score,
            'quality_score': quality_score,
            'trust_level': self._get_trust_level(trust_score)
        }
    
    def _compute_model_agreement(self, predictions: List[ModelPrediction]) -> float:
        """Calculate percentage of models agreeing on prediction"""
        if not predictions:
            return 0.0
        
        pred_counts = {}
        for pred in predictions:
            pred_counts[pred.prediction] = pred_counts.get(pred.prediction, 0) + 1
        
        max_agreement = max(pred_counts.values())
        agreement_score = max_agreement / len(predictions)
        
        return agreement_score
    
    def _compute_confidence_stability(self, predictions: List[ModelPrediction]) -> float:
        """Calculate stability of confidence scores across models"""
        if not predictions:
            return 0.0
        
        confidences = [p.confidence for p in predictions]
        avg_confidence = np.mean(confidences)
        std_confidence = np.std(confidences)
        
        # High average confidence + low standard deviation = high stability
        stability = avg_confidence * (1 - min(std_confidence, 0.3) / 0.3)
        
        return stability
    
    def _compute_explainability_consistency(self, predictions: List[ModelPrediction]) -> float:
        """Calculate overlap between Grad-CAM heatmaps"""
        heatmaps = [p.heatmap for p in predictions if p.heatmap is not None]
        
        if len(heatmaps) < 2:
            return 0.85  # Default if not enough heatmaps
        
        # Normalize and compute pairwise IoU
        overlaps = []
        for i in range(len(heatmaps)):
            for j in range(i + 1, len(heatmaps)):
                overlap = self._compute_heatmap_overlap(heatmaps[i], heatmaps[j])
                overlaps.append(overlap)
        
        return np.mean(overlaps) if overlaps else 0.85
    
    def _compute_heatmap_overlap(self, heatmap1: np.ndarray, heatmap2: np.ndarray) -> float:
        """Compute IoU-like overlap between two heatmaps"""
        # Normalize heatmaps
        h1_norm = (heatmap1 - heatmap1.min()) / (heatmap1.max() - heatmap1.min() + 1e-8)
        h2_norm = (heatmap2 - heatmap2.min()) / (heatmap2.max() - heatmap2.min() + 1e-8)
        
        # Threshold to get binary masks (top 30% activations)
        threshold = 0.7
        mask1 = h1_norm > threshold
        mask2 = h2_norm > threshold
        
        # Compute IoU
        intersection = np.logical_and(mask1, mask2).sum()
        union = np.logical_or(mask1, mask2).sum()
        
        iou = intersection / (union + 1e-8)
        return iou
    
    def _compute_quality_score(self, quality: ImageQuality) -> float:
        """Compute overall image quality score"""
        # Penalize low resolution
        min_resolution = 224
        resolution_score = min(min(quality.resolution) / min_resolution, 1.0)
        
        # Combine all quality metrics
        quality_score = (
            resolution_score * 0.25 +
            quality.contrast * 0.35 +
            (1 - quality.noise_level) * 0.25 +
            quality.sharpness * 0.15
        )
        
        return quality_score
    
    def _get_trust_level(self, score: float) -> str:
        """Convert numeric score to categorical trust level"""
        if score >= 0.8:
            return "High Trust"
        elif score >= 0.6:
            return "Medium Trust"
        else:
            return "Low Trust"
    
    def analyze_model_agreement(self, predictions: List[ModelPrediction]) -> Dict:
        """
        Analyzes model agreement and generates recommendations
        """
        pred_counts = {}
        for pred in predictions:
            pred_counts[pred.prediction] = pred_counts.get(pred.prediction, 0) + 1
        
        total_models = len(predictions)
        max_agreement = max(pred_counts.values())
        majority_prediction = max(pred_counts, key=pred_counts.get)
        
        agreement_ratio = max_agreement / total_models
        
        # Generate recommendation
        if agreement_ratio == 1.0:
            recommendation = "All models agree - High reliability"
            status = "✓ Consensus Reached"
        elif agreement_ratio >= 0.67:
            recommendation = "Majority agreement - Moderate reliability"
            status = "⚠ Minor Disagreement"
        else:
            recommendation = "Significant disagreement - Expert review required"
            status = "⚠ Expert Review Recommended"
        
        return {
            'agreement_ratio': agreement_ratio,
            'models_agreeing': max_agreement,
            'total_models': total_models,
            'majority_prediction': majority_prediction,
            'prediction_distribution': pred_counts,
            'recommendation': recommendation,
            'status': status
        }
    
    def generate_self_critique(self, 
                              predictions: List[ModelPrediction],
                              trust_analysis: Dict,
                              image_quality: Optional[ImageQuality] = None) -> Dict:
        """
        AI Self-Critique: Explicitly states why prediction might be uncertain
        """
        uncertainties = []
        risk_level = "Low"
        
        # Check model agreement
        agreement = trust_analysis['agreement_score']
        if agreement < 1.0:
            uncertainties.append(f"Model disagreement detected ({agreement*100:.0f}% agreement)")
            risk_level = "Medium" if agreement >= 0.67 else "High"
        
        # Check confidence stability
        confidences = [p.confidence for p in predictions]
        std_conf = np.std(confidences)
        if std_conf > 0.15:
            uncertainties.append(f"Inconsistent confidence across models (std: {std_conf:.2f})")
            risk_level = "Medium"
        
        # Check average confidence
        avg_conf = np.mean(confidences)
        if avg_conf < 0.75:
            uncertainties.append(f"Low average confidence ({avg_conf*100:.0f}%)")
            risk_level = "High"
        
        # Check explainability
        if trust_analysis['explainability_score'] < 0.6:
            uncertainties.append("Models focus on different image regions")
            risk_level = "Medium"
        
        # Check image quality
        if image_quality:
            if image_quality.contrast < 0.5:
                uncertainties.append("Low image contrast detected")
            if image_quality.noise_level > 0.5:
                uncertainties.append("High noise level in image")
            if min(image_quality.resolution) < 224:
                uncertainties.append("Low image resolution")
        
        # Generate critique message
        if not uncertainties:
            critique_message = "Prediction appears reliable. All quality checks passed."
        else:
            critique_message = "This prediction may be uncertain due to: " + "; ".join(uncertainties)
            critique_message += ". Expert verification is recommended."
        
        return {
            'uncertainties': uncertainties,
            'risk_level': risk_level,
            'critique_message': critique_message,
            'uncertainty_count': len(uncertainties)
        }
    
    def generate_safety_alerts(self, 
                              trust_score: float,
                              agreement_analysis: Dict,
                              critique: Dict) -> List[str]:
        """
        Generate automatic safety alerts and flags
        """
        alerts = []
        
        if trust_score < 0.6:
            alerts.append("⚠ LOW TRUST SCORE - Use with caution")
        
        if agreement_analysis['agreement_ratio'] < 0.67:
            alerts.append("⚠ MODEL DISAGREEMENT - Expert review required")
        
        if critique['risk_level'] == "High":
            alerts.append("⚠ HIGH UNCERTAINTY - Do not use alone for diagnosis")
        
        if critique['uncertainty_count'] >= 3:
            alerts.append("⚠ MULTIPLE RISK FACTORS - Comprehensive review needed")
        
        if not alerts:
            alerts.append("✓ No critical safety concerns detected")
        
        return alerts
    
    def add_to_audit_log(self, 
                        prediction: str,
                        trust_score: float,
                        agreement_ratio: float,
                        flags: List[str]):
        """Add entry to audit log"""
        audit_entry = PredictionAudit(
            timestamp=datetime.now(),
            prediction=prediction,
            trust_score=trust_score,
            model_agreement=agreement_ratio,
            flags=flags
        )
        self.audit_log.append(audit_entry)
    
    def get_audit_summary(self) -> Dict:
        """Get summary statistics from audit log"""
        if not self.audit_log:
            return {"message": "No audit entries yet"}
        
        avg_trust = np.mean([entry.trust_score for entry in self.audit_log])
        avg_agreement = np.mean([entry.model_agreement for entry in self.audit_log])
        
        return {
            'total_predictions': len(self.audit_log),
            'average_trust_score': avg_trust,
            'average_agreement': avg_agreement,
            'recent_entries': self.audit_log[-5:]  # Last 5 entries
        }
    
    def complete_analysis(self, 
                         predictions: List[ModelPrediction],
                         image_quality: Optional[ImageQuality] = None) -> Dict:
        """
        Run complete Trust & Safety analysis
        
        Returns comprehensive analysis report
        """
        # 1. Compute trust score
        trust_analysis = self.compute_trust_score(predictions, image_quality)
        
        # 2. Analyze model agreement
        agreement_analysis = self.analyze_model_agreement(predictions)
        
        # 3. Generate self-critique
        critique = self.generate_self_critique(predictions, trust_analysis, image_quality)
        
        # 4. Generate safety alerts
        alerts = self.generate_safety_alerts(
            trust_analysis['trust_score'],
            agreement_analysis,
            critique
        )
        
        # 5. Add to audit log
        self.add_to_audit_log(
            agreement_analysis['majority_prediction'],
            trust_analysis['trust_score'],
            agreement_analysis['agreement_ratio'],
            alerts
        )
        
        # Get final prediction summary
        avg_confidence = np.mean([p.confidence for p in predictions])
        
        return {
            'prediction_summary': {
                'prediction': agreement_analysis['majority_prediction'],
                'average_confidence': avg_confidence,
                'models_agreeing': f"{agreement_analysis['models_agreeing']}/{agreement_analysis['total_models']}"
            },
            'trust_analysis': trust_analysis,
            'agreement_analysis': agreement_analysis,
            'self_critique': critique,
            'safety_alerts': alerts,
            'recommendation': self._generate_final_recommendation(
                trust_analysis['trust_score'],
                agreement_analysis['agreement_ratio'],
                critique['risk_level']
            )
        }
    
    def _generate_final_recommendation(self, trust_score: float, 
                                      agreement_ratio: float,
                                      risk_level: str) -> str:
        """Generate final clinical recommendation"""
        if trust_score >= 0.8 and agreement_ratio >= 0.67:
            return "AI prediction is reliable. Can be used to support clinical decision-making."
        elif trust_score >= 0.6:
            return "AI prediction is moderately reliable. Consider as supplementary information."
        else:
            return "AI prediction has low reliability. Expert radiologist review is essential."
    
    def print_report(self, analysis: Dict):
        """Print formatted analysis report"""
        print("\n" + "="*60)
        print("AI TRUST & SAFETY CENTER - ANALYSIS REPORT")
        print("="*60)
        
        # Prediction Summary
        print("\n📊 PREDICTION SUMMARY")
        print("-" * 60)
        ps = analysis['prediction_summary']
        print(f"Prediction: {ps['prediction'].upper()}")
        print(f"Average Confidence: {ps['average_confidence']*100:.1f}%")
        print(f"Model Agreement: {ps['models_agreeing']} models")
        
        # Trust Score
        print("\n🎯 AI TRUST SCORE")
        print("-" * 60)
        ta = analysis['trust_analysis']
        print(f"Trust Score: {ta['trust_score']:.2f} ({ta['trust_level']})")
        print(f"  • Model Agreement: {ta['agreement_score']*100:.0f}%")
        print(f"  • Confidence Stability: {ta['confidence_stability']*100:.0f}%")
        print(f"  • Explainability Consistency: {ta['explainability_score']*100:.0f}%")
        print(f"  • Input Quality: {ta['quality_score']*100:.0f}%")
        
        # Agreement Analysis
        print("\n🤝 MODEL AGREEMENT ANALYSIS")
        print("-" * 60)
        aa = analysis['agreement_analysis']
        print(f"Status: {aa['status']}")
        print(f"Agreement Ratio: {aa['agreement_ratio']*100:.0f}%")
        print(f"Recommendation: {aa['recommendation']}")
        
        # Self-Critique
        print("\n🔍 AI SELF-CRITIQUE")
        print("-" * 60)
        sc = analysis['self_critique']
        print(f"Risk Level: {sc['risk_level']}")
        print(f"Message: {sc['critique_message']}")
        
        # Safety Alerts
        print("\n⚠️  SAFETY ALERTS")
        print("-" * 60)
        for alert in analysis['safety_alerts']:
            print(f"  {alert}")
        
        # Final Recommendation
        print("\n💡 FINAL RECOMMENDATION")
        print("-" * 60)
        print(analysis['recommendation'])
        
        print("\n" + "="*60)
        print("⚕️  This system supports medical professionals.")
        print("   It does NOT replace clinical diagnosis.")
        print("="*60 + "\n")


# ==============================================================================
# EXAMPLE USAGE
# ==============================================================================

if __name__ == "__main__":
    # Initialize the Trust & Safety Center
    center = AITrustSafetyCenter()
    
    # Example 1: High Trust Scenario (All models agree)
    print("\n🔬 EXAMPLE 1: High Trust Scenario")
    print("="*60)
    
    predictions1 = [
        ModelPrediction("CNN_Model_1", "malignant", 0.92, np.random.rand(224, 224)),
        ModelPrediction("ResNet_Model", "malignant", 0.89, np.random.rand(224, 224)),
        ModelPrediction("VGG_Model", "malignant", 0.94, np.random.rand(224, 224))
    ]
    
    quality1 = ImageQuality(
        resolution=(512, 512),
        contrast=0.85,
        noise_level=0.15,
        sharpness=0.90
    )
    
    analysis1 = center.complete_analysis(predictions1, quality1)
    center.print_report(analysis1)
    
    # Example 2: Low Trust Scenario (Models disagree)
    print("\n🔬 EXAMPLE 2: Low Trust Scenario (Model Disagreement)")
    print("="*60)
    
    predictions2 = [
        ModelPrediction("CNN_Model_1", "malignant", 0.68, np.random.rand(224, 224)),
        ModelPrediction("ResNet_Model", "benign", 0.72, np.random.rand(224, 224)),
        ModelPrediction("VGG_Model", "malignant", 0.65, np.random.rand(224, 224))
    ]
    
    quality2 = ImageQuality(
        resolution=(180, 180),
        contrast=0.45,
        noise_level=0.60,
        sharpness=0.50
    )
    
    analysis2 = center.complete_analysis(predictions2, quality2)
    center.print_report(analysis2)
    
    # Show audit summary
    print("\n📋 AUDIT LOG SUMMARY")
    print("="*60)
    audit_summary = center.get_audit_summary()
    print(f"Total Predictions Analyzed: {audit_summary['total_predictions']}")
    print(f"Average Trust Score: {audit_summary['average_trust_score']:.2f}")
    print(f"Average Model Agreement: {audit_summary['average_agreement']*100:.0f}%")

    
__all__ = [
    'ModelPrediction',
    'ImageQuality', 
    'PredictionAudit',
    'AITrustSafetyCenter'
]