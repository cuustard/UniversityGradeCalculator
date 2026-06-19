'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/dashboard/Dashboard';
import ModuleList from '@/components/modules/ModuleList';
import RequiredGrades from '@/components/calculator/RequiredGrades';
import ReferenceTables from '@/components/reference/ReferenceTables';

export type Page = 'dashboard' | 'modules' | 'calculator' | 'reference';

export default function AppShell({ userEmail }: { userEmail: string }) {
  const [page, setPage] = useState<Page>('dashboard');
  const load = useStore((s) => s.load);
  const loaded = useStore((s) => s.loaded);

  useEffect(() => {
    load();
  }, [load]);

  if (!loaded) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-[13px]"
        style={{ color: 'var(--text3)' }}
      >
        Loading your grades…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPage={page} onNavigate={setPage} userEmail={userEmail} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto">
          {page === 'dashboard'   && <Dashboard />}
          {page === 'modules'     && <ModuleList />}
          {page === 'calculator'  && <RequiredGrades />}
          {page === 'reference'   && <ReferenceTables />}
        </div>
      </main>
    </div>
  );
}
