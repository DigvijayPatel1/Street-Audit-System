# Road Audit System

AI-assisted road hazard auditing platform with a FastAPI backend and a React frontend.

The system accepts a road image, runs computer vision inference, and returns:
- Pole and tree counts
- Hazard detection summary
- Hazard reasons per tree
- Annotated output image

## Project Goals

- Speed up roadside safety screening
- Provide explainable hazard output (`HEIGHT`, `NEAR POLE`, `CANOPY`)
- Keep architecture simple today and scalable for production use later

## High-Level Architecture

```text
Frontend (React + Vite)
    -> POST /predict (multipart image)
Backend (FastAPI + YOLO inference)
    -> Returns JSON + annotated image (base64)
Frontend
    -> Renders hazard stats, details, and annotated image
```

## Repository Structure

```text
road audit system/
├─ backend/
│  ├─ main.py                 # FastAPI app and /predict endpoint
│  ├─ model/
│  │  ├─ predictor.py         # Inference + hazard rules
│  │  └─ config.py            # Rule thresholds/config constants
│  ├─ schema/response.py      # API response schema
│  └─ requirements.txt
├─ frontend/
│  ├─ src/
│  │  ├─ components/          # UI components
│  │  ├─ services/api.js      # API helper
│  │  └─ styles/              # UI styling
│  ├─ public/                 # Static assets (logo/icons)
│  └─ package.json
└─ README.md
```

## Tech Stack

- Backend: FastAPI, Uvicorn, OpenCV, NumPy, Ultralytics YOLO, Pydantic
- Frontend: React, Vite, Axios
- Model source: Hugging Face Hub (`HF_TOKEN` required for private/protected model access)

## API Contract

### Health Check

- `GET /`
- Response:

```json
{ "message": "API Running" }
```

### Predict

- `POST /predict`
- Content-Type: `multipart/form-data`
- Form field: `file` (image)

Response shape:

```json
{
  "poles": 1,
  "trees": 2,
  "hazards": 1,
  "hazard_details": [
    {
      "tree": "T1",
      "reasons": ["HEIGHT", "NEAR POLE"]
    }
  ],
  "image": "<base64-jpg>"
}
```

## Environment Variables

### Backend (`backend/.env`)

- `HF_TOKEN` = Hugging Face access token
- `CORS_ORIGINS` = comma-separated allowed origins (example: `http://localhost:5173`)

### Frontend (`frontend/.env`)

- `VITE_API_URL` = backend base URL (example: `http://localhost:8000`)

## Local Development

## 1) Backend setup

From `backend/`:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at `http://localhost:8000`.

## 2) Frontend setup

From `frontend/`:

```bash
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`.

## Production Build

From `frontend/`:

```bash
npm run build
npm run preview
```

## How Hazard Logic Works (Current Rules)

For each detected tree, the backend marks it hazardous if one or more conditions are met:

- `HEIGHT`: tree top is higher than the nearest target pole top
- `NEAR POLE`: tree base is too close to a target pole base
- `CANOPY`: canopy spreads across configured road-width ratios in lower frame region

Each hazardous tree appears in `hazard_details` with explicit reasons.

## Current Limitations

- Single-image prediction only (no batch/video mode yet)
- No authentication/authorization
- No persistent database or audit history
- No automated test suite committed yet

## Future Expansion Roadmap

### Short term

- Add request validation and user-friendly error responses
- Add confidence scores in response payload
- Add loading and empty-state UX polish for edge cases

### Medium term

- Persist audits to a database (history, filters, exports)
- Role-based auth for teams and reviewers
- Add model/version metadata to API response for traceability

### Long term

- Batch and video stream auditing
- Queue-based async inference (Celery/RQ/Kafka)
- Model monitoring and drift alerts
- Cloud deployment with autoscaling and object storage

## Suggested Engineering Standards for Growth

- Introduce a backend service layer (separate route, domain logic, IO)
- Version API (`/api/v1/...`) before adding new consumers
- Add linting/formatting and CI checks (frontend + backend)
- Add unit/integration tests around hazard rules and endpoint behavior
- Maintain a changelog for model updates and threshold tuning

## Contributing

1. Create a feature branch.
2. Keep commits focused and descriptive.
3. Validate frontend build and backend startup locally before opening PR.
4. Update README/API notes when behavior changes.

## License

Add your preferred license file (`LICENSE`) before public distribution.
