import type { LogStatus } from '../../lib/types';

/**
 * Shared status → emoji mappings for exported (plain-text) share content.
 * These are fixed regardless of the app's light/dark theme — once pasted into
 * Twitter/WhatsApp/etc. there is no theme, so the mapping never changes.
 * Plain codepoints only (no U+FE0F variation selectors).
 */

// Per-puzzle streak share: color blocks. ⬜ = no entry for that day.
export const STREAK_BLOCK: Record<LogStatus, string> = {
  solved: '🟩',
  attempted: '🟧',
  skipped: '🟥',
};

// Daily share card reuses the same blocks as the streak share so a full day
// and a single puzzle look visually consistent wherever they're pasted.
export const DAILY_SYMBOL: Record<LogStatus, string> = STREAK_BLOCK;

export const MISSING_BLOCK = '⬜';

export function streakBlock(status?: LogStatus | null): string {
  return status ? STREAK_BLOCK[status] : MISSING_BLOCK;
}
