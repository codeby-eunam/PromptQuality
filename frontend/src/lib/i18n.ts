export type Locale = "ko" | "en";

export function normalizeLocale(language?: string | null): Locale {
  return language?.toLowerCase().startsWith("ko") ? "ko" : "en";
}

export const messages = {
  ko: {
    metaDescription: "질문의 품질을 점수와 신호등으로 확인하는 도구",
    appName: "PromptQuality",
    title: "질문 품질 점검",
    subtitle: "질문을 입력하면 총점, 신호등, 3개 지표를 바로 확인합니다.",
    questionLabel: "질문",
    questionPlaceholder:
      "예: 우리 B2B SaaS의 무료 체험 전환율을 높이기 위한 온보딩 개선안을 표로 정리해줘.",
    contextLabel: "추가 맥락",
    optional: "선택",
    contextPlaceholder:
      "목표, 대상 사용자, 제약조건, 원하는 톤 등을 적어도 좋습니다.",
    fallbackError: "잠시 후 다시 시도해 주세요.",
    submitIdle: "질문 점수 확인하기",
    submitLoading: "점수 계산 중...",
    adSlot: "광고 슬롯",
    adSlotHint: "MVP 배너 영역",
    result: "결과",
    emptyResult: "질문을 제출하면 이곳에 신호등과 세부 점수가 표시됩니다.",
    sharePage: "공유 페이지",
    proCta: "이 질문을 85점 이상으로 개선하기 - Pro 잠금",
    metrics: {
      specificity: "구체성",
      context: "맥락",
      output_format: "출력 형식"
    },
    signals: {
      green: "좋음",
      yellow: "보완 필요",
      red: "위험"
    },
    shareTitle: "공유 결과",
    shareDescription:
      "공유 가능한 결과 페이지 구조입니다. MVP 이후에는 Supabase의 share_links.slug와 score_results를 연결해 실제 결과를 렌더링합니다.",
    resultId: "결과 ID"
  },
  en: {
    metaDescription: "A tool that scores question quality with a traffic light result.",
    appName: "PromptQuality",
    title: "Question Quality Check",
    subtitle:
      "Enter a question to see a total score, traffic light result, and three quality metrics.",
    questionLabel: "Question",
    questionPlaceholder:
      "Example: Summarize onboarding improvements to increase free-trial conversion for our B2B SaaS in a table.",
    contextLabel: "Additional context",
    optional: "optional",
    contextPlaceholder:
      "Add the goal, audience, constraints, desired tone, or other context.",
    fallbackError: "Please try again in a moment.",
    submitIdle: "Check question score",
    submitLoading: "Scoring...",
    adSlot: "Ad slot",
    adSlotHint: "MVP banner area",
    result: "Result",
    emptyResult:
      "Submit a question to see the traffic light result and detailed scores here.",
    sharePage: "Share page",
    proCta: "Improve this question to 85+ - Pro locked",
    metrics: {
      specificity: "Specificity",
      context: "Context",
      output_format: "Output format"
    },
    signals: {
      green: "Good",
      yellow: "Needs work",
      red: "Risky"
    },
    shareTitle: "Shared Result",
    shareDescription:
      "This is the shareable result page structure. After the MVP, it will render real results by connecting Supabase share_links.slug and score_results.",
    resultId: "Result ID"
  }
} as const;
