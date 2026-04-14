from pydantic import BaseModel
from typing import List

class Hazard(BaseModel):
    tree: str
    reasons: List[str]

class PredictionResponse(BaseModel):
    poles: int
    trees: int
    hazards: int
    hazard_details: List[Hazard]
    image: str