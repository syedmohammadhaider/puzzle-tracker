import type { LogStatus } from '../../lib/types';

export interface ShareEntry {
  name: string;
  status: LogStatus;
  /** Current streak for this puzzle. Only shown for solved entries with streak > 1. */
  streak: number;
}

const SYMBOL: Record<LogStatus, string> = {
  solved: '✅',
  attempted: '⏳',
  skipped: '❌',
};

function formatDay(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Pure function — builds the shareable text for today's puzzles.
 * Streak is included only for solved puzzles with streak > 1.
 */
export function buildShareText(
  entries: ShareEntry[],
  date: Date = new Date(),
  appUrl = 'puzzle-tracker-theta.vercel.app',
): string {
  const lines = entries.map((e) => {
    const streakBit = e.status === 'solved' && e.streak > 1 ? ` (streak: ${e.streak}🔥)` : '';
    return `${SYMBOL[e.status]} ${e.name}${streakBit}`;
  });
  return [`🧩 My puzzles — ${formatDay(date)}`, '', ...lines, '', `Track yours → ${appUrl}`].join('\n');
}
