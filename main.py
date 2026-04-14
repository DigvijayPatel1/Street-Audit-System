import cv2
import numpy as np
import base64
import os

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from model.predictor import run_audit
from schema.response import PredictionResponse

app = FastAPI()

origins = os.getenv("CORS_ORIGINS", "")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins.split(",") if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "API Running"}

@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    contents = await file.read()

    img = cv2.imdecode(np.frombuffer(contents, np.uint8), cv2.IMREAD_COLOR)

    annotated, info = run_audit(img)

    _, buffer = cv2.imencode(".jpg", annotated)
    img_base64 = base64.b64encode(buffer).decode("utf-8")

    return {
        "poles": info["poles"],
        "trees": info["trees"],
        "hazards": info["hazards"],
        "hazard_details": info["hazards_log"],
        "image": img_base64
    }