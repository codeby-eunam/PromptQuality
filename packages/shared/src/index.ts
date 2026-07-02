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
  green: "Good",
  yellow: "Needs work",
  red: "Risky"
};

export function signalFromScore(score: number): Signal {
  if (score >= 80) return "green";
  if (score >= 50) return "yellow";
  return "red";
}
