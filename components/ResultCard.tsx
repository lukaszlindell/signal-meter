import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { ScoreMeter } from "@/components/ScoreMeter";
import type { AnalysisResult } from "@/lib/types";

type ResultCardProps = {
  result: AnalysisResult;
};

export function ResultCard({ result }: ResultCardProps) {
  return (
    <section className="space-y-6 rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
      <ScoreMeter score={result.overallScore} />

      <div className="rounded-lg bg-slate-50 p-4">
        <h2 className="text-lg font-semibold text-ink">{result.label}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {result.summary}
        </p>
      </div>

      <CategoryBreakdown scores={result.scores} />

      <FeedbackList title="Detected issues" items={result.issues} />
      <FeedbackList title="Suggested improvements" items={result.suggestions} />

      {result.rewrite ? (
        <div className="rounded-lg border border-slate-200 bg-slate-950 p-4 text-white">
          <h2 className="text-lg font-semibold">Improved rewrite</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-100">
            {result.rewrite}
          </p>
        </div>
      ) : null}
    </section>
  );
}

function FeedbackList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      {items.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600"
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-slate-500">
          No major items returned for this section.
        </p>
      )}
    </div>
  );
}
