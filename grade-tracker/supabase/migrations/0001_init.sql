-- GradeTrack initial schema
-- Run this in the Supabase SQL Editor (or via the Supabase CLI).

create table if not exists modules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  credits integer not null,
  created_at timestamptz not null default now()
);

create table if not exists assessments (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references modules(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('coursework','exam')),
  weight numeric not null,
  grade text,                                   -- raw value (letter or % as text); null = ungraded
  grade_type text check (grade_type in ('letter','pct')),
  created_at timestamptz not null default now()
);

create index if not exists modules_user_id_idx on modules(user_id);
create index if not exists assessments_module_id_idx on assessments(module_id);
create index if not exists assessments_user_id_idx on assessments(user_id);

alter table modules enable row level security;
alter table assessments enable row level security;

-- Each user can only read/write their own rows.
drop policy if exists "own modules" on modules;
create policy "own modules" on modules for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own assessments" on assessments;
create policy "own assessments" on assessments for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
