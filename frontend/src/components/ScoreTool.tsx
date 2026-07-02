"use client";

import { useMemo, useState } from "react";
import type { ScoreResponse, Signal } from "@promptquality/shared";
import { signalLabels } from "@promptquality/shared";
import { scoreQuestion } from "@/lib/api";

const signalStyles: Record<Signal, string> = {
  green: "bg-leaf text-white ring-leaf/20",
  yellow: "bg-amber text-white ring-amber/20",
  red: "bg-clay text-white ring-clay/20"
};

const lightStyles: Record<Signal, string> = {
  green: "bg-leaf shadow-[0_0_28px_rgba(47,125,82,0.45)]",
  yellow: "bg-amber shadow-[0_0_28px_rgba(183,121,31,0.38)]",
  red: "bg-clay shadow-[0_0_28px_rgba(180,72,61,0.38)]"
};

const metricLabels = {
  specificity: "구체성",
  context: "맥락",
  output_format: "출력 형식"
} as const;

export function ScoreTool() {
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [result, setResult] = useState<ScoreResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = question.trim().length >= 5 && !isLoading;

  const sharePath = useMemo(() => {
    if (!result) return null;
    return `/share/${result.id}`;
  }, [result]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await scoreQuestion({
        question: question.trim(),
        context: context.trim() || undefined
      });
      setResult(response);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "잠시 후 다시 시도해 주세요."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="rounded-lg border border-line bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-leaf">PromptQuality</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-normal text-ink sm:text-3xl">
                질문 품질 점검
              </h1>
            </div>
            <p className="max-w-sm text-sm leading-6 text-ink/65">
              질문을 입력하면 총점, 신호등, 3개 지표를 바로 확인합니다.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink">
                질문
              </span>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                className="min-h-56 w-full resize-y rounded-md border border-line bg-panel p-4 text-base leading-7 outline-none transition focus:border-leaf focus:ring-4 focus:ring-leaf/10"
                placeholder="예: 우리 B2B SaaS의 무료 체험 전환율을 높이기 위한 온보딩 개선안을 표로 정리해줘."
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink">
                추가 맥락
                <span className="ml-2 font-normal text-ink/50">선택</span>
              </span>
              <textarea
                value={context}
                onChange={(event) => setContext(event.target.value)}
                className="min-h-24 w-full resize-y rounded-md border border-line bg-white p-3 text-sm leading-6 outline-none transition focus:border-leaf focus:ring-4 focus:ring-leaf/10"
                placeholder="목표, 대상 사용자, 제약조건, 원하는 톤 등을 적어도 좋습니다."
              />
            </label>

            {error ? (
              <div className="rounded-md border border-clay/30 bg-clay/10 px-4 py-3 text-sm text-clay">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-md bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:bg-ink/35 sm:w-auto"
            >
              {isLoading ? "점수 계산 중..." : "질문 점수 확인하기"}
            </button>
          </form>
        </section>

        <aside className="space-y-5">
          <div className="rounded-lg border border-dashed border-line bg-white p-5 text-center text-sm text-ink/55">
            광고 슬롯
            <div className="mt-2 text-xs text-ink/40">MVP 배너 영역</div>
          </div>

          <ResultCard result={result} sharePath={sharePath} />
        </aside>
      </div>
    </main>
  );
}

function ResultCard({
  result,
  sharePath
}: {
  result: ScoreResponse | null;
  sharePath: string | null;
}) {
  if (!result) {
    return (
      <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold text-ink">결과</div>
        <p className="mt-3 text-sm leading-6 text-ink/60">
          질문을 제출하면 이곳에 신호등과 세부 점수가 표시됩니다.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-ink">결과</div>
          <div
            className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ring-4 ${signalStyles[result.signal]}`}
          >
            {signalLabels[result.signal]}
          </div>
        </div>
        <TrafficLight active={result.signal} />
      </div>

      <div className="mt-5 flex items-end gap-2">
        <span className="text-5xl font-semibold text-ink">
          {result.total_score}
        </span>
        <span className="pb-2 text-sm text-ink/55">/ 100</span>
      </div>

      <div className="mt-5 space-y-3">
        {Object.entries(metricLabels).map(([key, label]) => {
          const score = result.scores[key as keyof typeof metricLabels];
          return <MetricBar key={key} label={label} score={score} />;
        })}
      </div>

      <p className="mt-5 rounded-md bg-panel p-4 text-sm leading-6 text-ink/75">
        {result.summary}
      </p>

      <div className="mt-4 rounded-md border border-line bg-white p-4">
        <div className="text-xs font-semibold uppercase text-ink/45">
          공유 페이지
        </div>
        <div className="mt-1 break-all text-sm text-ink/70">
          {sharePath ?? "/share/:id"}
        </div>
      </div>

      <button
        type="button"
        className="mt-4 w-full rounded-md border border-ink/15 bg-ink/5 px-4 py-3 text-sm font-semibold text-ink"
        aria-disabled="true"
      >
        이 질문을 85점 이상으로 개선하기 - Pro 잠금
      </button>
      <p className="mt-2 text-xs leading-5 text-ink/50">
        {result.locked_improvement_preview}
      </p>
    </section>
  );
}

function TrafficLight({ active }: { active: Signal }) {
  const signals: Signal[] = ["red", "yellow", "green"];

  return (
    <div className="grid gap-1 rounded-full border border-line bg-ink p-2">
      {signals.map((signal) => (
        <div
          key={signal}
          className={`h-5 w-5 rounded-full ${
            active === signal ? lightStyles[signal] : "bg-white/20"
          }`}
        />
      ))}
    </div>
  );
}

function MetricBar({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="text-ink/60">{score}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-leaf"
          style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
        />
      </div>
    </div>
  );
}
