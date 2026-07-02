export type Signal = "green" | "yellow" | "red";

export type ScoreBreakdown = {
  specificity: number;
  context: number;
  output_format: number;
};

export type ScoreResponse = {
  id: string;
  total_score: number;
  signal: Signal;
  scores: ScoreBreakdown;
  summary: string;
  locked_improvement_preview: string;
};

export const signalLabels: Record<Signal, string> = {
  green: "좋음",
  yellow: "보완 필요",
  red: "위험",
};

export function signalFromScore(score: number): Signal {
  if (score >= 80) return "green";
  if (score >= 50) return "yellow";
  return "red";
}
