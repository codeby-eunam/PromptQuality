from typing import Literal

from pydantic import BaseModel, Field

Signal = Literal["green", "yellow", "red"]
Locale = Literal["ko", "en"]


class ScoreRequest(BaseModel):
    question: str = Field(..., min_length=5, max_length=8000)
    context: str | None = Field(default=None, max_length=8000)
    locale: Locale = "en"


class ScoreBreakdown(BaseModel):
    specificity: int = Field(..., ge=0, le=100)
    context: int = Field(..., ge=0, le=100)
    output_format: int = Field(..., ge=0, le=100)


class ScoreResponse(BaseModel):
    id: str
    total_score: int = Field(..., ge=0, le=100)
    signal: Signal
    scores: ScoreBreakdown
    summary: str
    locked_improvement_preview: str


class ModelScorePayload(BaseModel):
    specificity: int = Field(..., ge=0, le=100)
    context: int = Field(..., ge=0, le=100)
    output_format: int = Field(..., ge=0, le=100)
    summary: str = Field(..., min_length=1, max_length=500)
