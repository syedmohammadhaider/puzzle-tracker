-- Daily Puzzle Tracker schema
-- Run in Supabase SQL editor or via Supabase CLI.

create type log_status as enum ('solved', 'attempted', 'skipped');

create table public.puzzles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  url text not null,
  is_archived boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  puzzle_id uuid not null references public.puzzles (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  status log_status not null,
  created_at timestamptz not null default now(),
  unique (puzzle_id, date)
);

create index idx_puzzles_user on public.puzzles (user_id);
create index idx_logs_puzzle_date on public.daily_logs (puzzle_id, date desc);
create index idx_logs_user on public.daily_logs (user_id);

alter table public.puzzles enable row level security;
alter table public.daily_logs enable row level security;

-- Users can only see/manage their own rows.
create policy "users own puzzles"
  on public.puzzles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users own logs"
  on public.daily_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
