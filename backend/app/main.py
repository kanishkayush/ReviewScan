import re
from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import math

app = FastAPI(title="Fake Review Detector API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReviewRequest(BaseModel):
    text: str
    language: str | None = None
    metadata: dict | None = None

class PredictionResponse(BaseModel):
    fake_probability: float
    label: str
    confidence: float
    detected_language: str
    explanation: list[dict]

@app.post("/predict", response_model=PredictionResponse)
async def predict_review(req: ReviewRequest):
    text = req.text
    
    # Smarter Heuristic "Model" while waiting for trained XLM-RoBERTa
    length_score = 0.3 if len(text) < 50 else 0.0
    caps_ratio = sum(1 for c in text if c.isupper()) / max(len(text), 1)
    caps_score = 0.3 if caps_ratio > 0.15 else 0.0
    
    exclamation_count = text.count('!')
    exclamation_score = min(exclamation_count * 0.15, 0.4)
    
    spam_words = ["guarantee", "buy now", "free", "click here", "best ever", "instant", "100%", "amazing", "miracle", "wow", "must buy", "fake", "scam", "perfect", "highly recommend", "love it"]
    spam_matches = sum(text.lower().count(w.lower()) for w in spam_words)
    spam_score = min(spam_matches * 0.25, 0.6)
    
    repeat_score = 0.3 if re.search(r'(.)\1{3,}', text) else 0.0
    
    # Calculate baseline fake probability
    fake_prob = min(length_score + caps_score + exclamation_score + spam_score + repeat_score, 0.98)
    
    # If it seems very normal, reduce probability
    if fake_prob == 0.0:
        fake_prob = round(0.12, 2)
        
    # Lowered threshold: if anything is slightly suspicious, flag it as fake
    label = "FAKE" if fake_prob >= 0.35 else "GENUINE"
    
    # Generating SHAP-like explanations for UI
    explanation = [
        {"feature": "Spam Keywords", "value": spam_score},
        {"feature": "Capitalization Ratio", "value": caps_score},
        {"feature": "Exclamation Metric", "value": exclamation_score},
        {"feature": "Text Length Anomaly", "value": length_score},
        {"feature": "Character Repetition", "value": repeat_score},
    ]
    
    # Sort by impact
    explanation = sorted(explanation, key=lambda x: x["value"], reverse=True)
    
    return PredictionResponse(
        fake_probability=fake_prob,
        label=label,
        confidence=fake_prob if label == "FAKE" else 1 - fake_prob,
        detected_language=req.language or "en",
        explanation=explanation
    )
