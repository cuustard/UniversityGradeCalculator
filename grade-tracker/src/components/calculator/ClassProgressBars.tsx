import { ClassificationBoundary, RequiredGradeResult } from '@/lib/types';

interface Props {
  targets: ClassificationBoundary[];
  reqs: (RequiredGradeResult | null)[];
  currentAgg: number;
}

export default function ClassProgressBars({ targets, reqs, currentAgg }: Props) {
  return (
    <div className="space-y-3">
      {targets.map((t, i) => {
        const req = reqs[i];
        if (!req) return null;
        const progress = Math.min(100, (currentAgg / t.agg) * 100);
        let statusText: string, statusColor: string;
        if (req.status === 'achieved') { statusText = '✓ Achieved'; statusColor = 'var(--green)'; }
        else if (req.status === 'impossible') { statusText = 'Not achievable'; statusColor = 'var(--red)'; }
        else { statusText = `Need ${req.pct}%`; statusColor = req.status === 'tight' ? 'var(--amber)' : 'var(--text)'; }

        return (
          <div key={t.cls} className="grid items-center gap-3" style={{ gridTemplateColumns: '120px 1fr 90px' }}>
            <div>
              <span
                className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                style={{ background: t.color + '20', color: t.color }}
              >
                {t.short}
              </span>
              <div className="text-[10px] mt-0.5" style={{ color: 'var(--text3)' }}>≥{t.agg} agg</div>
            </div>
            <div className="h-2 rounded-full" style={{ background: 'var(--bg3)' }}>
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: `${progress.toFixed(1)}%`, background: t.color + '88' }}
              />
            </div>
            <div className="text-[12px] font-medium text-right" style={{ color: statusColor, whiteSpace: 'nowrap' }}>
              {statusText}
            </div>
          </div>
        );
      })}
    </div>
  );
}
