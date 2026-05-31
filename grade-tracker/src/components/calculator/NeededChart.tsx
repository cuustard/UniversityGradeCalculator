'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { ClassificationBoundary, RequiredGradeResult } from '@/lib/types';

interface Props {
  targets: ClassificationBoundary[];
  reqs: (RequiredGradeResult | null)[];
}

export default function NeededChart({ targets, reqs }: Props) {
  const data = targets.map((t, i) => {
    const req = reqs[i];
    return {
      name: t.short,
      value: req?.status === 'impossible' ? 101 : req?.status === 'achieved' ? 0 : (req?.pct ?? 0),
      color: req?.status === 'impossible' ? '#c0392b88' : req?.status === 'achieved' ? '#3d997088' : t.color + 'aa',
      req,
    };
  });

  function tooltipFormatter(_: unknown, __: string, props: { payload?: { req?: RequiredGradeResult } }) {
    const req = props?.payload?.req;
    if (!req) return ['—'];
    if (req.status === 'impossible') return ['Not achievable'];
    if (req.status === 'achieved') return ['Already achieved'];
    return [`${req.pct}%`];
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
        <XAxis dataKey="name" tick={{ fill: 'var(--text2)', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 105]} tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v > 100 ? '' : `${v}%`} />
        <ReferenceLine y={100} stroke="var(--border2)" strokeDasharray="4 4" />
        <Tooltip
          contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
          formatter={tooltipFormatter as never}
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
