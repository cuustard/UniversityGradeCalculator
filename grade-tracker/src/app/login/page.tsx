'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    const trimmed = email.trim();
    if (!trimmed) {
      setErr('Enter your email address');
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
    });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div
        className="rounded-xl p-8 w-[420px] max-w-[90vw]"
        style={{ background: 'var(--bg2)', border: '1px solid var(--border2)' }}
      >
        <div className="text-center mb-6">
          <div className="text-[18px] font-semibold tracking-tight">📊 GradeTrack</div>
          <div className="text-[12px] mt-1" style={{ color: 'var(--text3)' }}>
            Sign in to view your grades on any device
          </div>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <div className="text-[28px] mb-3">✉️</div>
            <h1 className="text-[15px] font-medium mb-1">Check your email</h1>
            <p className="text-[13px]" style={{ color: 'var(--text2)' }}>
              We sent a magic link to <strong>{email.trim()}</strong>. Click it to sign in.
            </p>
            <button
              className="gt-btn-ghost mt-5"
              onClick={() => {
                setSent(false);
                setErr('');
              }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label
              className="block text-[11px] uppercase tracking-[0.06em] mb-1"
              style={{ color: 'var(--text3)' }}
            >
              Email address
            </label>
            <input
              className="gt-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            {err && (
              <p className="text-[11px] mt-2" style={{ color: 'var(--red)' }}>
                {err}
              </p>
            )}
            <button
              type="submit"
              className="gt-btn-primary w-full mt-4 justify-center"
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Sending…' : 'Send magic link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
