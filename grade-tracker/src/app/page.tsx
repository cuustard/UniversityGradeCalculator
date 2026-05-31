'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/dashboard/Dashboard';
import ModuleList from '@/components/modules/ModuleList';
import RequiredGrades from '@/components/calculator/RequiredGrades';
import ReferenceTables from '@/components/reference/ReferenceTables';

export type Page = 'dashboard' | 'modules' | 'calculator' | 'reference';

export default function Home() {
  const [page, setPage] = useState<Page>('dashboard');

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPage={page} onNavigate={setPage} />
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
