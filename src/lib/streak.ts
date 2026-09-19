import type { DailyLog, LogStatus } from './types';
import { todayLocalISO } from './types';

/**
 * Streak rule (per user choice): "solved" + "attempted" both continue the streak.
 * "skipped" and missing days break it.
 *
 * Why client-side?
 * - Dataset is tiny (one row per puzzle per day, max ~30 rows fetched for the
 *   heatmap). No need for a DB round-trip per puzzle.
 * - Keeps the rule easy to change/toggle in UI without redeploying SQL.
 * - Works offline-friendly and is trivially unit-testable.
 * If this ever scales to thousands of logs per puzzle, move to a Postgres
 * function (e.g. `current_streak(puzzle_id)`) to avoid shipping history.
 */

const STREAK_OK: ReadonlySet<LogStatus> = new Set(['solved', 'attempted']);

function toDayNumber(isoDate: string): number {
  const [y, m, d] = isoDate.split('-').map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

export function isStreakDay(status: LogStatus): boolean {
  return STREAK_OK.has(status);
}

export function calcCurrentStreak(logs: Pick<DailyLog, 'date' | 'status'>[], todayISO = todayLocalISO()): number {
  const byDate = new Map<string, LogStatus>();
  for (const l of logs) byDate.set(l.date, l.status);

  const todayNum = toDayNumber(todayISO);
  // Streak may end today OR yesterday (if today not yet logged).
  const todayStatus = byDate.get(todayISO);
  let cursor = todayStatus && isStreakDay(todayStatus) ? todayNum : todayNum - 1;

  let streak = 0;
  // Walk backwards day by day; first gap/skipped/missing stops the streak.
  // Guard the loop so corrupt/future data can't cause an infinite walk.
  for (let i = 0; i < 3660; i++) {
    const d = new Date(cursor * 86_400_000);
    const iso = d.toISOString().slice(0, 10);
    const s = byDate.get(iso);
    if (s && isStreakDay(s)) {
      streak++;
      cursor--;
    } else {
      break;
    }
  }
  return streak;
}

export function calcBestStreak(logs: Pick<DailyLog, 'date' | 'status'>[]): number {
  const sorted = [...logs].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  let best = 0;
  let run = 0;
  let prevNum: number | null = null;
  for (const l of sorted) {
    if (!isStreakDay(l.status)) {
      run = 0;
      prevNum = null;
      continue;
    }
    const n = toDayNumber(l.date);
    if (prevNum !== null && n === prevNum) {
      // duplicate date entry — ignore (unique constraint should prevent this)
      continue;
    }
    if (prevNum !== null && n === prevNum + 1) {
      run++;
    } else {
      run = 1;
    }
    prevNum = n;
    if (run > best) best = run;
  }
  return best;
}
