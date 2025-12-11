"""
PDF Report Generator for Breast Cancer Diagnosis
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
import os
import io
import base64
from datetime import datetime
from typing import Dict, Optional


def generate_pdf_report(prediction: Dict, patient_id: str) -> str:
    """
    Generate a medical-style PDF diagnosis report
    """
    # Create reports directory if it doesn't exist
    reports_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'reports')
    os.makedirs(reports_dir, exist_ok=True)
    
    # Generate filename
    filename = f"diagnosis_report_{prediction['prediction_id']}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    filepath = os.path.join(reports_dir, filename)
    
    # Create PDF document
    doc = SimpleDocTemplate(
        filepath,
        pagesize=A4,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch
    )
    
    # Styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#1a365d')
    )
    
    header_style = ParagraphStyle(
        'CustomHeader',
        parent=styles['Heading2'],
        fontSize=14,
        spaceAfter=12,
        spaceBefore=20,
        textColor=colors.HexColor('#2d3748')
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=8,
        textColor=colors.HexColor('#4a5568')
    )
    
    # Build content
    content = []
    
    # Header
    content.append(Paragraph("BREAST CANCER DIAGNOSIS REPORT", title_style))
    content.append(Spacer(1, 20))
    
    # Horizontal line
    line_data = [['']]
    line_table = Table(line_data, colWidths=[6.5*inch])
    line_table.setStyle(TableStyle([
        ('LINEBELOW', (0, 0), (-1, -1), 2, colors.HexColor('#e91e8c')),
    ]))
    content.append(line_table)
    content.append(Spacer(1, 20))
    
    # Patient Information Section
    content.append(Paragraph("PATIENT INFORMATION", header_style))
    
    patient_data = [
        ['Patient ID:', patient_id],
        ['Report ID:', prediction['prediction_id']],
        ['Date:', datetime.now().strftime('%B %d, %Y')],
        ['Time:', datetime.now().strftime('%H:%M:%S')],
        ['Analysis Type:', prediction.get('type', 'Unknown').title()]
    ]
    
    patient_table = Table(patient_data, colWidths=[2*inch, 4*inch])
    patient_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#2d3748')),
        ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#4a5568')),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
    ]))
    content.append(patient_table)
    content.append(Spacer(1, 20))
    
    # Diagnosis Result Section
    content.append(Paragraph("DIAGNOSIS RESULT", header_style))
    
    # Main result box
    result_color = colors.HexColor('#c53030') if prediction['final_prediction'] == 'Malignant' else colors.HexColor('#2f855a')
    result_bg = colors.HexColor('#fed7d7') if prediction['final_prediction'] == 'Malignant' else colors.HexColor('#c6f6d5')
    
    result_data = [[
        f"Final Diagnosis: {prediction['final_prediction']}",
        f"Confidence: {prediction['confidence']}%"
    ]]
    
    result_table = Table(result_data, colWidths=[3.25*inch, 3.25*inch])
    result_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 14),
        ('TEXTCOLOR', (0, 0), (-1, -1), result_color),
        ('BACKGROUND', (0, 0), (-1, -1), result_bg),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 15),
        ('TOPPADDING', (0, 0), (-1, -1), 15),
        ('BOX', (0, 0), (-1, -1), 2, result_color),
    ]))
    content.append(result_table)
    content.append(Spacer(1, 20))
    
    # Model Predictions Section
    content.append(Paragraph("MODEL PREDICTIONS", header_style))
    
    model_header = ['Model', 'Prediction', 'Confidence']
    model_data = [model_header]
    
    for pred in prediction.get('model_predictions', []):
        model_data.append([
            pred['model'],
            pred['prediction'],
            f"{pred['confidence']}%"
        ])
    
    model_table = Table(model_data, colWidths=[2.5*inch, 2*inch, 2*inch])
    model_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e91e8c')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f7fafc')]),
    ]))
    content.append(model_table)
    content.append(Spacer(1, 20))
    
    # Feature Importance (for tabular predictions)
    if prediction.get('type') == 'tabular' and prediction.get('feature_importance'):
        content.append(Paragraph("FEATURE IMPORTANCE ANALYSIS", header_style))
        
        fi = prediction['feature_importance']
        content.append(Paragraph(fi.get('summary', ''), normal_style))
        content.append(Spacer(1, 10))
        
        # Top features table
        fi_header = ['Feature', 'Importance Score']
        fi_data = [fi_header]
        
        for feature, score in list(fi.get('values', {}).items())[:10]:
            fi_data.append([feature.replace('_', ' ').title(), f"{score:.4f}"])
        
        fi_table = Table(fi_data, colWidths=[4*inch, 2.5*inch])
        fi_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4299e1')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (1, 0), (1, -1), 'CENTER'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#ebf8ff')]),
        ]))
        content.append(fi_table)
        content.append(Spacer(1, 20))
    
    # Explanation (for image predictions)
    if prediction.get('type') == 'image' and prediction.get('explanation'):
        content.append(Paragraph("AI EXPLANATION", header_style))
        content.append(Paragraph(prediction['explanation'], normal_style))
        content.append(Spacer(1, 20))
    
    # Disclaimer
    content.append(Spacer(1, 30))
    
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.HexColor('#718096'),
        alignment=TA_CENTER
    )
    
    disclaimer_text = """
    <b>DISCLAIMER</b><br/>
    This report is generated by an AI-powered diagnostic system and is intended for informational purposes only.
    It should not be used as a substitute for professional medical advice, diagnosis, or treatment.
    Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical condition.
    """
    content.append(Paragraph(disclaimer_text, disclaimer_style))
    
    # Footer
    content.append(Spacer(1, 20))
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.HexColor('#a0aec0'),
        alignment=TA_CENTER
    )
    content.append(Paragraph(
        f"AI-Powered Breast Cancer Diagnosis Platform | Report Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        footer_style
    ))
    
    # Build PDF
    doc.build(content)
    
    return filepath


