import type { ScoreResponse } from "@promptquality/shared";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

export type ScoreRequest = {
  question: string;
  context?: string;
};

export async function scoreQuestion(payload: ScoreRequest): Promise<ScoreResponse> {
  const response = await fetch(`${API_BASE_URL}/v1/score`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "질문 점수를 계산하지 못했습니다.");
  }

  return (await response.json()) as ScoreResponse;
}
