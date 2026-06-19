# GradeTrack

A university grade tracker that converts coursework/exam grades into Lancaster
aggregation scores and degree classifications. Built with Next.js, Zustand, Recharts
and Tailwind, with **Supabase accounts (magic-link sign-in)** so your grades sync
across any device.

## Setup

### 1. Create a Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In the **SQL Editor**, run the migration in
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql). This creates
   the `modules` and `assessments` tables and the Row Level Security policies that scope
   every row to its owner.
3. **Authentication → URL Configuration → Redirect URLs**: add
   `http://localhost:3000/**` (and your production URL later, e.g.
   `https://your-app.vercel.app/**`). The email provider is enabled by default.
4. **Project Settings → API Keys**: copy the **Project URL** and the **publishable** key
   (`sb_publishable_...`). You do **not** need the secret key — this app is fully client/SSR
   and relies on Row Level Security, so the secret key is never used.

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and paste in the two values:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxxxxxx
```

### 3. Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to `/login`;
enter your email, click the magic link, and you're in.

> **Email limits:** Supabase's built-in email has a low send rate, which is fine for
> personal use. For real usage configure custom SMTP under **Authentication → Emails → SMTP**.

## Deploy (Vercel)

1. Push to GitHub and import the repo into [Vercel](https://vercel.com/new).
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as environment variables.
3. Add your Vercel domain to the Supabase **Redirect URLs** (step 1.3 above).

## How it works

- `src/lib/gradeUtils.ts` — grade/aggregation math (Lancaster UG Assessment Regulations).
- `src/lib/store.ts` — Zustand store backed by Supabase: loads your rows on open and
  writes through on every edit.
- `src/lib/supabase/` — browser and server Supabase clients (`@supabase/ssr`).
- `src/proxy.ts` — session refresh + auth gate (redirects to `/login` when signed out).
- `src/app/login`, `src/app/auth/confirm` — magic-link sign-in flow.
