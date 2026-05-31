'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Module } from '@/lib/types';
import { calcModuleAgg, getClassification } from '@/lib/gradeUtils';

interface Props {
  modules: Module[];
}

export default function ModuleChart({ modules }: Props) {
  const data = modules
    .map((m) => {
      const r = calcModuleAgg(m);
      if (!r) return null;
      return { name: m.name.length > 12 ? m.name.slice(0, 12) + '…' : m.name, agg: r.effectiveAgg };
    })
    .filter(Boolean) as { name: string; agg: number }[];

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-[13px]" style={{ color: 'var(--text3)' }}>
        No graded modules yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
        <XAxis dataKey="name" tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 24]} tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
          formatter={(v: number) => [v.toFixed(2), 'Agg score']}
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
        />
        <Bar dataKey="agg" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={getClassification(entry.agg).color + 'cc'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
