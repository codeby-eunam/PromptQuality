from fastapi.testclient import TestClient

from app.config import Settings
from app.main import app
from app.models import ScoreRequest
from app.scoring import score_question, signal_from_score


def test_signal_thresholds() -> None:
    assert signal_from_score(80) == "green"
    assert signal_from_score(50) == "yellow"
    assert signal_from_score(49) == "red"


def test_mock_scoring_returns_valid_response() -> None:
    request = ScoreRequest(
        question="B2B SaaS 무료 체험 전환율을 높이는 온보딩 개선안을 표로 정리해줘.",
        context="대상은 제품 매니저이고 2주 안에 실행 가능한 실험이 필요해.",
    )
    response = score_question(request, Settings(scoring_mode="mock"))

    assert response.id
    assert 0 <= response.total_score <= 100
    assert response.signal in {"green", "yellow", "red"}
    assert response.scores.specificity >= 50
    assert response.locked_improvement_preview


def test_score_endpoint_returns_contract() -> None:
    client = TestClient(app)

    response = client.post(
        "/v1/score",
        json={
            "question": "고객 이탈률을 줄이기 위한 실험 아이디어를 표로 정리해줘.",
            "context": "대상은 초기 스타트업이고 예산은 낮아야 해.",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert set(payload) == {
        "id",
        "total_score",
        "signal",
        "scores",
        "summary",
        "locked_improvement_preview",
    }
