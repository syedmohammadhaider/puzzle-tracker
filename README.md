# Daily Puzzle Tracker

A minimalist daily puzzle companion. Collect the puzzles you play every day — Wordle, Puzzmo, Advent of Code, whatever — check in with one tap, and watch your streaks grow.

## What it does

- **Your puzzle shelf** — each puzzle with its name, link, today's status, current streak, and best streak.
- **One-tap daily check-in** — mark today as Solved, Attempted, or Skipped. One entry per puzzle per day.
- **Forgiving streaks** — both Solved and Attempted keep the streak alive. Skipped or missing a day breaks it. Streaks count back consecutively from today (or yesterday, if today isn't logged yet).
- **Last-30-days view** — a compact heatmap per puzzle: green for solved, amber for attempted, grey for skipped, empty for missing.
- **Archive or delete** — shelve puzzles you pause, permanently remove the ones you drop (history goes with them).

## How it works

- **Frontend:** Vite + React + TypeScript, Tailwind for a clean mobile-first UI, React Router for `/`, `/login`, `/signup` with protected routes.
- **Backend:** Supabase Auth (email/password + Google OAuth) and Postgres. Two tables — `puzzles` and `daily_logs` with a unique `(puzzle_id, date)` constraint and Row Level Security so users only ever see their own rows.
- **Streaks** are computed client-side in `src/lib/streak.ts`. Each puzzle fetches at most ~90 recent logs, so there's no need for extra database round-trips, and the rule stays easy to tweak and test.

## Project layout

- `src/features/auth/` — session context, login, signup, route guard
- `src/features/puzzles/` — dashboard, puzzle cards, add-puzzle form, Supabase queries
- `src/features/logs/` — check-in control, 30-day heatmap
- `src/lib/` — Supabase client, streak math, shared types
- `supabase/migrations/` — schema + RLS policies

Built for daily use: fast to open on your phone, fast to check in, motivating to keep the fire alive.
