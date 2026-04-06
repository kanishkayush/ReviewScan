# Multilingual Fake Review Detector

A full-stack application built for detecting fake reviews using an XLM-RoBERTa based multilingual encoder.

## Tech Stack
- **Frontend**: React + TypeScript, Vite, TailwindCSS, Recharts, React Query, i18next
- **Backend**: FastAPI, Celery, Redis, SQLAlchemy
- **ML**: HuggingFace transformers, torch, SHAP, langdetect

## Running Locally

1. Set up backend ML pipeline:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

2. Set up frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Docker
Run via compose:
```bash
docker-compose up --build
```
