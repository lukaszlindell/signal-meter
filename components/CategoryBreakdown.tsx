import { categoryHelp, categoryLabels } from "@/lib/scoring";
import type { CategoryScores } from "@/lib/types";

type CategoryBreakdownProps = {
  scores: CategoryScores;
};

const categories = [
  "specificity",
  "substance",
  "originality",
  "evidence",
  "humanTone",
  "corporateFluff",
  "aiLikePatterns"
] as const;

export function CategoryBreakdown({ scores }: CategoryBreakdownProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-ink">Category scores</h2>
        <p className="mt-1 text-sm text-slate-500">
          Higher is better for the first five. Higher corporate fluff and
          AI-like pattern scores indicate more drag on the final score.
        </p>
      </div>

      <div className="space-y-3">
        {categories.map((category) => {
          const value = scores[category];
          const isPenalty =
            category === "corporateFluff" || category === "aiLikePatterns";

          return (
            <div key={category} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {categoryLabels[category]}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {categoryHelp[category]}
                  </p>
                </div>
                <span
                  className={
                    isPenalty
                      ? "text-sm font-bold text-rose-600"
                      : "text-sm font-bold text-signal"
                  }
                >
                  {value}
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={
                    isPenalty
                      ? "h-full rounded-full bg-rose-400"
                      : "h-full rounded-full bg-signal"
                  }
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
