# PromptQuality

PromptQuality는 사용자가 입력한 질문의 품질을 0~100점으로 평가하고, 신호등 결과와 3개 지표 점수를 보여주는 웹서비스 MVP입니다.

## 구성

- `frontend`: Next.js, TypeScript, Tailwind CSS
- `backend`: FastAPI, Python, Pydantic, OpenAI API
- `packages/shared`: 공통 타입과 점수 기준
- `infra/supabase`: Supabase SQL migration
- `.github/workflows`: 기본 CI

## 로컬 실행

### 1. 환경변수

루트의 `.env.example`을 참고해 필요한 값을 설정합니다. OpenAI 키가 없어도 백엔드는 규칙 기반 mock scoring으로 동작합니다.

```bash
cp .env.example .env
```

프론트엔드에서 백엔드 주소는 기본값 `http://localhost:8000`입니다.

### 2. 백엔드

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Windows PowerShell에서는 다음처럼 활성화합니다.

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

헬스 체크:

```bash
curl http://localhost:8000/health
```

점수 API:

```bash
curl -X POST http://localhost:8000/v1/score \
  -H "Content-Type: application/json" \
  -d '{"question":"B2B SaaS 무료 체험 전환율을 높이는 온보딩 개선안을 표로 정리해줘.","context":"대상은 제품 매니저이고 2주 안에 실행 가능한 실험이 필요해."}'
```

### 3. 프론트엔드

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 환경변수

- `OPENAI_API_KEY`: OpenAI API 키. 비어 있으면 mock scoring 사용
- `OPENAI_MODEL`: 평가 모델. 기본값 `gpt-4.1-mini`
- `SUPABASE_URL`: Supabase 프로젝트 URL
- `SUPABASE_ANON_KEY`: Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: 서버 전용 service role key
- `NEXT_PUBLIC_API_BASE_URL`: 프론트엔드에서 호출할 API 주소
- `NEXT_PUBLIC_SUPABASE_URL`: 브라우저용 Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: 브라우저용 Supabase anon key

## API

`POST /v1/score`

요청:

```json
{
  "question": "string",
  "context": "string optional"
}
```

응답:

```json
{
  "id": "string",
  "total_score": 82,
  "signal": "green",
  "scores": {
    "specificity": 86,
    "context": 78,
    "output_format": 82
  },
  "summary": "맥락과 출력 형식이 명확해 답변 품질이 높을 가능성이 큽니다.",
  "locked_improvement_preview": "Pro에서는 부족한 지표를 기준으로 질문을 다시 작성하고, 85점 이상을 목표로 개선안을 제공합니다."
}
```

## Supabase

초기 schema는 `infra/supabase/migrations/202607010001_initial_schema.sql`에 있습니다.

포함 테이블:

- `profiles`
- `teams`
- `team_members`
- `questions`
- `score_results`
- `usage_events`
- `share_links`

## 품질 확인

프론트엔드:

```bash
npm run lint
npm run build
```

백엔드:

```bash
cd backend
ruff check .
mypy app
pytest
```

## GitHub

원격 저장소는 `git@github.com:codeby-eunam/PromptQuality.git`를 사용합니다.

현재 작업 브랜치는 `feature/mvp`입니다. push는 명시적으로 요청한 뒤 실행합니다.
