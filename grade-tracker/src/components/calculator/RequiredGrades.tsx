'use client';

import { useStore } from '@/lib/store';
import { BOUNDARIES, calcModuleAgg, getClassification, requiredForTarget } from '@/lib/gradeUtils';
import GaugeDial from './GaugeDial';
import ClassProgressBars from './ClassProgressBars';
import NeededChart from './NeededChart';

const TARGETS = BOUNDARIES.slice(0, 4); // exclude Fail

export default function RequiredGrades() {
  const modules = useStore((s) => s.modules);
  const pending = modules.filter((m) => m.assessments.some((a) => a.grade === null));

  if (pending.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-[22px] font-semibold tracking-tight mb-1">Required Grades</h1>
        <p className="text-[13px] mb-7" style={{ color: 'var(--text2)' }}>What do you need in remaining assessments?</p>
        <div className="text-center py-16" style={{ color: 'var(--text2)' }}>
          <div className="text-[32px] mb-3">✓</div>
          <div>No pending assessments</div>
          <div className="text-[12px] mt-1.5" style={{ color: 'var(--text3)' }}>All assessments are complete — well done!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-[22px] font-semibold tracking-tight mb-1">Required Grades</h1>
      <p className="text-[13px] mb-7" style={{ color: 'var(--text2)' }}>
        What do you need in remaining assessments to hit each classification?
      </p>

      {pending.map((m) => {
        const r = calcModuleAgg(m);
        const currentAgg = r ? r.effectiveAgg : 0;
        const currentCls = getClassification(currentAgg);
        const pendingAss = m.assessments.filter((a) => a.grade === null);
        const reqs = TARGETS.map((t) => requiredForTarget(m, t.agg));

        return (
          <div
            key={m.id}
            className="rounded-[10px] p-5 mb-4"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-[16px] font-medium tracking-tight">{m.name}</h2>
                <div className="text-[12px] mt-1" style={{ color: 'var(--text2)' }}>
                  {m.credits} credits · {pendingAss.length} assessment{pendingAss.length !== 1 ? 's' : ''} remaining
                </div>
              </div>
              {r && (
                <div className="text-right">
                  <div className="text-[20px] font-semibold font-mono" style={{ color: 'var(--accent)', fontFamily: 'var(--font-dm-mono)' }}>
                    {r.effectiveAgg.toFixed(2)}
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--text3)' }}>current agg score</div>
                </div>
              )}
            </div>

            {/* Gauge + progress bars */}
            <div className="grid gap-6 mb-6" style={{ gridTemplateColumns: '200px 1fr' }}>
              <div>
                <div className="text-[11px] uppercase tracking-[0.06em] mb-3" style={{ color: 'var(--text3)' }}>Current score</div>
                <GaugeDial agg={currentAgg} />
                <div className="text-center mt-2">
                  <span
                    className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: currentCls.color + '20', color: currentCls.color }}
                  >
                    {currentCls.label}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.06em] mb-3" style={{ color: 'var(--text3)' }}>Progress to each classification</div>
                <ClassProgressBars targets={TARGETS} reqs={reqs} currentAgg={currentAgg} />
              </div>
            </div>

            {/* Needed chart */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <div className="text-[11px] uppercase tracking-[0.06em] mb-2" style={{ color: 'var(--text3)' }}>
                % needed in remaining assessments
              </div>
              <div className="text-[11px] mb-3" style={{ color: 'var(--text2)' }}>
                Pending:{' '}
                {pendingAss.map((a) => (
                  <span
                    key={a.id}
                    className="inline-block mr-1.5 px-2 py-0.5 rounded-md text-[11px]"
                    style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)' }}
                  >
                    {a.name} ({a.weight}%)
                  </span>
                ))}
              </div>
              <div className="h-[180px]">
                <NeededChart targets={TARGETS} reqs={reqs} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
