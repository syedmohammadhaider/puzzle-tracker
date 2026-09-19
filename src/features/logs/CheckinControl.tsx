import type { DailyLog, LogStatus } from '../../lib/types';

const OPTIONS: { value: LogStatus; label: string }[] = [
  { value: 'solved', label: 'Solved' },
  { value: 'attempted', label: 'Attempted' },
  { value: 'skipped', label: 'Skipped' },
];

export default function CheckinControl({
  todayStatus,
  busy,
  onCheckin,
}: {
  todayStatus?: LogStatus;
  busy: boolean;
  onCheckin: (s: LogStatus) => void;
}) {
  return (
    <div className="flex gap-1.5" role="group" aria-label="Today's status">
      {OPTIONS.map((o) => {
        const active = todayStatus === o.value;
        return (
          <button
            key={o.value}
            disabled={busy}
            onClick={() => onCheckin(o.value)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition disabled:opacity-50 ${
              active
                ? o.value === 'solved'
                  ? 'border-green-600 bg-green-600 text-white'
                  : o.value === 'attempted'
                    ? 'border-amber-500 bg-amber-500 text-white'
                    : 'border-neutral-400 bg-neutral-400 text-white'
                : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function statusDot(logsByDate: Map<string, DailyLog>, date: string): string {
  const s = logsByDate.get(date)?.status;
  if (!s) return 'bg-neutral-100';
  if (s === 'solved') return 'bg-green-500';
  if (s === 'attempted') return 'bg-amber-400';
  return 'bg-neutral-300';
}
