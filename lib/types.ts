export type SignalLabel =
  | "Very low signal"
  | "Weak signal"
  | "Mixed signal"
  | "Strong signal"
  | "Very strong signal";

export type CategoryScores = {
  specificity: number;
  substance: number;
  originality: number;
  evidence: number;
  humanTone: number;
  corporateFluff: number;
  aiLikePatterns: number;
};

export type AnalysisResult = {
  overallScore: number;
  label: SignalLabel;
  summary: string;
  scores: CategoryScores;
  issues: string[];
  suggestions: string[];
  rewrite?: string;
};

export type AnalyzeRequest = {
  text: string;
};

export type AnalyzeError = {
  error: string;
};
