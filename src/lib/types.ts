export type LogStatus = 'solved' | 'attempted' | 'skipped';

export interface Puzzle {
  id: string;
  user_id: string;
  name: string;
  url: string;
  is_archived: boolean;
  created_at: string;
}

export interface DailyLog {
  id: string;
  puzzle_id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  status: LogStatus;
  created_at: string;
}

export function todayLocalISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function lastNDates(n: number, endISO?: string): string[] {
  const end = endISO ? new Date(endISO + 'T12:00:00') : new Date();
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    out.push(`${y}-${m}-${day}`);
  }
  return out;
}
