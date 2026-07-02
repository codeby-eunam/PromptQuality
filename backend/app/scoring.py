import json
import re
from uuid import uuid4

from openai import OpenAI
from pydantic import ValidationError

from app.config import Settings
from app.models import ModelScorePayload, ScoreBreakdown, ScoreRequest, ScoreResponse, Signal

ACTION_WORDS = (
    "작성",
    "정리",
    "분석",
    "추천",
    "비교",
    "설명",
    "요약",
    "만들",
    "알려",
    "제안",
    "write",
    "summarize",
    "analyze",
    "compare",
    "recommend",
    "explain",
    "create",
)

FORMAT_WORDS = (
    "표",
    "목록",
    "json",
    "마크다운",
    "단계",
    "예시",
    "템플릿",
    "bullet",
    "table",
    "format",
    "schema",
)

CONTEXT_WORDS = (
    "대상",
    "목표",
    "배경",
    "상황",
    "제약",
    "톤",
    "사용자",
    "기간",
    "예산",
    "audience",
    "goal",
    "context",
    "constraint",
    "tone",
)

SUMMARY_BY_LOCALE = {
    "ko": {
        "specificity": "요청은 이해되지만 작업 범위와 성공 기준을 더 구체화하면 좋아요.",
        "context": "목표, 대상, 제약조건 같은 맥락을 추가하면 답변 품질이 올라갑니다.",
        "output_format": "원하는 답변 형식이나 예시를 지정하면 결과를 더 통제할 수 있어요.",
    },
    "en": {
        "specificity": (
            "The request is understandable, but the scope and success criteria need more detail."
        ),
        "context": (
            "Add goals, audience, constraints, or background so the answer can be more useful."
        ),
        "output_format": (
            "Specify the desired format or include an example to make the output easier to control."
        ),
    },
}

LOCKED_PREVIEW_BY_LOCALE = {
    "ko": (
        "Pro에서는 부족한 지표를 기준으로 질문을 다시 작성하고, "
        "85점 이상을 목표로 개선안을 제공합니다."
    ),
    "en": (
        "Pro will rewrite the question around the weakest metrics and aim for an improved "
        "85+ point version."
    ),
}


def signal_from_score(score: int) -> Signal:
    if score >= 80:
        return "green"
    if score >= 50:
        return "yellow"
    return "red"


def clamp(value: int) -> int:
    return max(0, min(100, value))


def weighted_total(scores: ScoreBreakdown) -> int:
    return round(scores.specificity * 0.4 + scores.context * 0.3 + scores.output_format * 0.3)


def score_with_rules(request: ScoreRequest) -> ModelScorePayload:
    question = request.question.strip()
    context = (request.context or "").strip()
    combined = f"{question}\n{context}".lower()
    word_count = len(re.findall(r"\w+", combined))

    has_action = any(word in combined for word in ACTION_WORDS)
    has_format = any(word in combined for word in FORMAT_WORDS)
    context_hits = sum(1 for word in CONTEXT_WORDS if word in combined)
    has_constraints = bool(re.search(r"\d|까지|이내|이상|less than|more than", combined))

    specificity = 35 + min(word_count * 2, 35) + (15 if has_action else 0) + (
        10 if has_constraints else 0
    )
    context_score = 25 + min(len(context) // 4, 30) + min(context_hits * 12, 30) + (
        10 if word_count >= 25 else 0
    )
    output_format = 35 + (45 if has_format else 0) + (10 if "?" in question else 0)

    scores = {
        "specificity": clamp(specificity),
        "context": clamp(context_score),
        "output_format": clamp(output_format),
    }
    weakest = min(scores, key=lambda key: scores[key])
    summary = SUMMARY_BY_LOCALE[request.locale][weakest]
    return ModelScorePayload(**scores, summary=summary)


def build_prompt(request: ScoreRequest) -> str:
    summary_language = "Korean" if request.locale == "ko" else "English"
    return (
        "Evaluate the quality of this user question for getting useful AI output. "
        "Return only JSON with integer fields specificity, context, output_format "
        f"from 0 to 100 and a short {summary_language} summary under 180 characters.\n\n"
        f"Question:\n{request.question}\n\n"
        f"Additional context:\n{request.context or ''}"
    )


def score_with_openai(request: ScoreRequest, settings: Settings) -> ModelScorePayload:
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is not configured")

    client = OpenAI(api_key=settings.openai_api_key)
    completion = client.chat.completions.create(
        model=settings.openai_model,
        messages=[
            {
                "role": "system",
                "content": "You are a strict prompt quality evaluator. Return valid JSON only.",
            },
            {"role": "user", "content": build_prompt(request)},
        ],
        response_format={"type": "json_object"},
        temperature=0.2,
    )
    content = completion.choices[0].message.content or "{}"
    try:
        return ModelScorePayload.model_validate(json.loads(content))
    except (json.JSONDecodeError, ValidationError) as exc:
        raise RuntimeError("Model returned invalid scoring JSON") from exc


def score_question(request: ScoreRequest, settings: Settings) -> ScoreResponse:
    use_mock = settings.scoring_mode == "mock" or not settings.openai_api_key

    if use_mock:
        model_score = score_with_rules(request)
    else:
        try:
            model_score = score_with_openai(request, settings)
        except Exception:
            model_score = score_with_rules(request)

    scores = ScoreBreakdown(
        specificity=model_score.specificity,
        context=model_score.context,
        output_format=model_score.output_format,
    )
    total = weighted_total(scores)

    return ScoreResponse(
        id=str(uuid4()),
        total_score=total,
        signal=signal_from_score(total),
        scores=scores,
        summary=model_score.summary,
        locked_improvement_preview=LOCKED_PREVIEW_BY_LOCALE[request.locale],
    )
