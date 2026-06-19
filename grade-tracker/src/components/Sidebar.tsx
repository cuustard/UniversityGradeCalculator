'use client';

import { LayoutDashboard, Book, Calculator, Table, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Page } from '@/components/AppShell';
import { createClient } from '@/lib/supabase/client';
import { useStore } from '@/lib/store';

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  userEmail: string;
}

const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'dashboard',  label: 'Dashboard',      icon: <LayoutDashboard size={16} /> },
  { page: 'modules',    label: 'Modules',         icon: <Book size={16} /> },
  { page: 'calculator', label: 'Required Grades', icon: <Calculator size={16} /> },
  { page: 'reference',  label: 'Grade Tables',    icon: <Table size={16} /> },
];

export default function Sidebar({ currentPage, onNavigate, userEmail }: Props) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    useStore.getState().reset();
    router.push('/login');
  }

  return (
    <nav
      className="w-[220px] flex-shrink-0 flex flex-col sticky top-0 h-screen"
      style={{ background: 'var(--bg2)', borderRight: '1px solid var(--border)' }}
    >
      {/* Logo */}
      <div className="px-5 pb-6 pt-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="text-[15px] font-semibold tracking-tight">📊 GradeTrack</div>
        <div className="text-[11px] mt-0.5" style={{ color: 'var(--text3)' }}>
          Your university
        </div>
      </div>

      {/* Nav */}
      <div className="mt-3">
        <div className="nav-section">Overview</div>
        {navItems.slice(0, 1).map((item) => (
          <NavItem key={item.page} {...item} active={currentPage === item.page} onNavigate={onNavigate} />
        ))}
        <div className="nav-section">Academic</div>
        {navItems.slice(1, 3).map((item) => (
          <NavItem key={item.page} {...item} active={currentPage === item.page} onNavigate={onNavigate} />
        ))}
        <div className="nav-section">Reference</div>
        {navItems.slice(3).map((item) => (
          <NavItem key={item.page} {...item} active={currentPage === item.page} onNavigate={onNavigate} />
        ))}
      </div>

      {/* Account footer */}
      <div className="mt-auto px-5 py-4" style={{ borderTop: '1px solid var(--border)' }}>
        {userEmail && (
          <div
            className="text-[11px] mb-2 truncate"
            style={{ color: 'var(--text3)' }}
            title={userEmail}
          >
            {userEmail}
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full text-[12px] transition-colors text-left"
          style={{ color: 'var(--text2)' }}
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>

      <style jsx>{`
        .nav-section {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--text3);
          padding: 16px 20px 6px;
          text-transform: uppercase;
        }
      `}</style>
    </nav>
  );
}

function NavItem({
  page, label, icon, active, onNavigate,
}: { page: Page; label: string; icon: React.ReactNode; active: boolean; onNavigate: (p: Page) => void }) {
  return (
    <button
      onClick={() => onNavigate(page)}
      className="flex items-center gap-2 w-full px-5 py-2 text-[13px] transition-colors text-left"
      style={{
        color: active ? 'var(--text)' : 'var(--text2)',
        background: active ? 'var(--bg3)' : 'transparent',
      }}
    >
      {icon}
      {label}
    </button>
  );
}
