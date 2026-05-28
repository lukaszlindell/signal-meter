import { getSignalLabel } from "@/lib/scoring";

type ScoreMeterProps = {
  score: number;
};

export function ScoreMeter({ score }: ScoreMeterProps) {
  const safeScore = Math.max(0, Math.min(100, score));
  const label = getSignalLabel(safeScore);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Overall score</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-5xl font-semibold tracking-normal text-ink">
              {safeScore}
            </span>
            <span className="text-sm font-semibold text-slate-500">/ 100</span>
          </div>
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-700">
          {label}
        </span>
      </div>

      <div
        aria-label={`Signal score ${safeScore} out of 100`}
        className="h-4 overflow-hidden rounded-full bg-slate-200"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeScore}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 transition-all duration-500"
          style={{ width: `${safeScore}%` }}
        />
      </div>

      <div className="grid grid-cols-5 text-[11px] font-medium text-slate-500">
        <span>0</span>
        <span className="text-center">25</span>
        <span className="text-center">50</span>
        <span className="text-center">75</span>
        <span className="text-right">100</span>
      </div>
    </div>
  );
}
