from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import random

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
    # Dummy ML logic for initial testing phase
    fake_prob = random.uniform(0.0, 1.0)
    label = "FAKE" if fake_prob > 0.5 else "GENUINE"
    
    # Mocking shap explanation
    explanation = [
        {"feature": "avg_word_length", "value": round(random.uniform(0, 1), 2)},
        {"feature": "exclamation_ratio", "value": round(random.uniform(0, 1), 2)},
        {"feature": "capital_letter_ratio", "value": round(random.uniform(0, 1), 2)},
    ]
    
    return PredictionResponse(
        fake_probability=fake_prob,
        label=label,
        confidence=fake_prob if label == "FAKE" else 1 - fake_prob,
        detected_language=req.language or "en",
        explanation=explanation
    )
