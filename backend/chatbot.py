from fastapi import APIRouter
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
from typing import List, Optional

# Load environment variables
load_dotenv()

router = APIRouter()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# =========================
# Request schema
# =========================
class ChatRequest(BaseModel):
    user_message: str
    user_role: str  # patient | clinician | judge

    # AI context (optional, for explainability)
    prediction: Optional[str] = None
    avg_confidence: Optional[float] = None
    trust_score: Optional[float] = None
    model_agreement: Optional[str] = None
    explainability_score: Optional[float] = None
    uncertainty_reasons: Optional[List[str]] = []


# =========================
# Chat endpoint
# =========================
@router.post("/chat")
def chat(req: ChatRequest):
    system_prompt = f"""
You are a Clinical AI Companion for a breast cancer AI platform.

ROLE AWARENESS:
- Current user role: {req.user_role}

SAFETY RULES:
- You DO NOT give medical diagnoses.
- You DO NOT recommend treatments.
- You DO NOT override clinicians.
- You explain AI outputs, uncertainty, and limitations.
- Always encourage consulting qualified medical professionals.

AI CONTEXT (if provided):
- Prediction: {req.prediction}
- Average confidence: {req.avg_confidence}
- Trust score: {req.trust_score}
- Model agreement: {req.model_agreement}
- Explainability score: {req.explainability_score}
- Uncertainty reasons: {req.uncertainty_reasons}

COMMUNICATION STYLE:
- Patient → simple, reassuring, non-technical
- Clinician → technical, structured, cautious
- Judge/Leader → governance, trust, risk, ethics
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.3,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": req.user_message}
        ]
    )

    return {
        "reply": response.choices[0].message.content
    }
