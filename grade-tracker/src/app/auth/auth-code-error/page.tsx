import Link from 'next/link';

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div
        className="rounded-xl p-8 w-[420px] max-w-[90vw] text-center"
        style={{ background: 'var(--bg2)', border: '1px solid var(--border2)' }}
      >
        <div className="text-[32px] mb-3">⚠</div>
        <h1 className="text-[18px] font-semibold mb-2">Sign-in link invalid</h1>
        <p className="text-[13px] mb-6" style={{ color: 'var(--text2)' }}>
          That magic link is invalid or has expired. Request a fresh one to continue.
        </p>
        <Link href="/login" className="gt-btn-primary inline-flex">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
