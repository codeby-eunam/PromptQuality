from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.models import ScoreRequest, ScoreResponse
from app.scoring import score_question

settings = get_settings()

app = FastAPI(title="PromptQuality API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/v1/score", response_model=ScoreResponse)
def create_score(payload: ScoreRequest) -> ScoreResponse:
    return score_question(payload, settings)
