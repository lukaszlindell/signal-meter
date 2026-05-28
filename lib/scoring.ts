import type { AnalysisResult, CategoryScores, SignalLabel } from "@/lib/types";

export const categoryLabels: Record<keyof CategoryScores, string> = {
  specificity: "Specificity",
  substance: "Substance",
  originality: "Originality",
  evidence: "Evidence",
  humanTone: "Human tone",
  corporateFluff: "Corporate fluff",
  aiLikePatterns: "AI-like writing patterns"
};

export const categoryHelp: Record<keyof CategoryScores, string> = {
  specificity: "Concrete details, examples, names, numbers, and lived context.",
  substance: "Clear point of view, useful insight, and practical depth.",
  originality: "Fresh observations instead of familiar professional truisms.",
  evidence: "Signals that claims are grounded in proof, experience, or examples.",
  humanTone: "Natural voice, specificity of perspective, and low performative polish.",
  corporateFluff: "Generic business phrasing, abstractions, and buzzword padding.",
  aiLikePatterns:
    "Over-neat structure, predictable transitions, and generic motivational phrasing."
};

export function clampScore(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

export function getSignalLabel(score: number): SignalLabel {
  if (score <= 20) return "Very low signal";
  if (score <= 40) return "Weak signal";
  if (score <= 60) return "Mixed signal";
  if (score <= 80) return "Strong signal";
  return "Very strong signal";
}

export function calculateOverallScore(scores: CategoryScores): number {
  const positive =
    scores.specificity * 0.2 +
    scores.substance * 0.22 +
    scores.originality * 0.15 +
    scores.evidence * 0.16 +
    scores.humanTone * 0.17;
  const penalties =
    scores.corporateFluff * 0.06 + scores.aiLikePatterns * 0.04;

  return clampScore(positive - penalties);
}

export function normalizeAnalysis(raw: Partial<AnalysisResult>): AnalysisResult {
  const scores: CategoryScores = {
    specificity: clampScore(raw.scores?.specificity),
    substance: clampScore(raw.scores?.substance),
    originality: clampScore(raw.scores?.originality),
    evidence: clampScore(raw.scores?.evidence),
    humanTone: clampScore(raw.scores?.humanTone),
    corporateFluff: clampScore(raw.scores?.corporateFluff),
    aiLikePatterns: clampScore(raw.scores?.aiLikePatterns)
  };
  const overallScore = clampScore(
    typeof raw.overallScore === "number"
      ? raw.overallScore
      : calculateOverallScore(scores)
  );

  return {
    overallScore,
    label: getSignalLabel(overallScore),
    summary:
      typeof raw.summary === "string" && raw.summary.trim()
        ? raw.summary.trim()
        : "This post has been assessed for specificity, substance, credibility, and common generic writing patterns.",
    scores,
    issues: normalizeList(raw.issues),
    suggestions: normalizeList(raw.suggestions),
    rewrite:
      typeof raw.rewrite === "string" && raw.rewrite.trim()
        ? raw.rewrite.trim()
        : undefined
  };
}

function normalizeList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);
}
