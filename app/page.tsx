"use client";

import { FormEvent, useMemo, useState } from "react";
import { ResultCard } from "@/components/ResultCard";
import type { AnalysisResult, AnalyzeError } from "@/lib/types";

const sampleResult: AnalysisResult = {
  overallScore: 72,
  label: "Strong signal",
  summary:
    "This post has a clear point but relies on some generic professional language and would be stronger with a concrete example.",
  scores: {
    specificity: 55,
    substance: 68,
    originality: 61,
    evidence: 42,
    humanTone: 70,
    corporateFluff: 38,
    aiLikePatterns: 45
  },
  issues: [
    "Uses broad claims without examples",
    "Several phrases feel generic",
    "The conclusion is predictable"
  ],
  suggestions: [
    "Add one concrete example",
    "Replace generic claims with a specific observation",
    "Make the final sentence more direct"
  ],
  rewrite:
    "I used to think consistency meant posting every day. What changed my mind was watching three posts with real examples outperform a month of polished advice. The lesson: people do not need more professional-sounding claims. They need a clear point, a specific moment, and a useful takeaway they can recognize."
};

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const characterCount = text.length;
  const canSubmit = useMemo(
    () => text.trim().length >= 20 && !isLoading,
    [isLoading, text]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedText = text.trim();
    if (trimmedText.length < 20) {
      setError("Paste at least 20 characters so there is enough to analyze.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: trimmedText })
      });

      const payload = (await response.json()) as AnalysisResult | AnalyzeError;

      if (!response.ok) {
        throw new Error(
          "error" in payload ? payload.error : "Analysis failed. Try again."
        );
      }

      setResult(payload as AnalysisResult);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Analysis failed. Try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function loadSample() {
    setText(
      "Over the past year, I learned that leadership is not about having all the answers. It is about creating space for your team to grow, fail, and come back stronger. The best leaders listen first, empower others, and lead with empathy. That is how we build better teams and better outcomes."
    );
    setResult(sampleResult);
    setError("");
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-signal">
              Signal Meter
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-ink sm:text-5xl">
              Signal Meter
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Check whether a LinkedIn post has substance, specificity, and a
              human voice.
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900 sm:max-w-sm">
            This tool estimates writing patterns. It cannot prove whether a
            post was written by AI.
          </div>
        </header>

        <div className="grid gap-6 py-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)]">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <div className="mb-3 flex items-center justify-between gap-4">
                  <label
                    className="text-sm font-semibold text-ink"
                    htmlFor="post-text"
                  >
                    LinkedIn post
                  </label>
                  <span className="text-xs font-medium text-slate-500">
                    {characterCount.toLocaleString()} characters
                  </span>
                </div>
                <textarea
                  className="min-h-[360px] w-full resize-y rounded-lg border border-slate-300 bg-white p-4 text-base leading-7 text-ink outline-none transition focus:border-signal focus:ring-4 focus:ring-blue-100"
                  id="post-text"
                  maxLength={12000}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="Paste a LinkedIn post here..."
                  value={text}
                />
              </div>

              {error ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-signal px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  disabled={!canSubmit}
                  type="submit"
                >
                  {isLoading ? "Analyzing..." : "Analyze post"}
                </button>
                <button
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  onClick={loadSample}
                  type="button"
                >
                  Load sample
                </button>
              </div>
            </form>
          </section>

          <div className="min-h-[400px]">
            {isLoading ? (
              <LoadingCard />
            ) : result ? (
              <ResultCard result={result} />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function LoadingCard() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
      <div className="h-3 w-28 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-5 h-12 w-36 animate-pulse rounded bg-slate-200" />
      <div className="mt-5 h-4 w-full animate-pulse rounded-full bg-slate-200" />
      <div className="mt-8 space-y-3">
        {[0, 1, 2, 3, 4].map((item) => (
          <div
            className="h-20 animate-pulse rounded-lg bg-slate-100"
            key={item}
          />
        ))}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <section className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/70 p-8 text-center">
      <div className="max-w-sm">
        <h2 className="text-xl font-semibold text-ink">Ready to analyze</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Paste a post and run the meter to see the score, breakdown, issues,
          suggestions, and rewrite.
        </p>
      </div>
    </section>
  );
}
