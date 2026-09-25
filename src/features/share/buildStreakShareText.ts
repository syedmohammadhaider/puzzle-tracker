import type { LogStatus } from '../../lib/types';
import { streakBlock } from './shareEmoji';

/**
 * Pure function — builds the shareable text for one puzzle's streak.
 * `last10Days` is oldest → newest (ending today); missing days render as ⬜.
 */
export function buildStreakShareText(
  puzzleName: string,
  streak: number,
  last10Days: (LogStatus | null | undefined)[],
  appUrl = 'puzzle-tracker-theta.vercel.app',
): string {
  const blocks = last10Days.map(streakBlock).join('');
  return [
    `🔥 ${streak} day streak on ${puzzleName}`,
    `${blocks} (last 10 days)`,
    '',
    `Track yours → ${appUrl}`,
  ].join('\n');
}
