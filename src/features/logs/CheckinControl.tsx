import type { LogStatus } from '../../lib/types';

const OPTIONS: { value: LogStatus; label: string }[] = [
  { value: 'solved', label: 'Solved' },
  { value: 'attempted', label: 'Tried' },
  { value: 'skipped', label: 'Skip' },
];

/** Fill color per state. Missing days render as a hollow dot (see StreakDots). */
export function dotClass(status?: LogStatus): string {
  if (status === 'solved') return 'bg-solved';
  if (status === 'attempted') return 'bg-tried';
  if (status === 'skipped') return 'bg-skip';
  return 'border border-rule dark:border-white/20';
}

const selectedClass: Record<LogStatus, string> = {
  solved: 'border-solved bg-solved text-white',
  attempted: 'border-tried bg-tried text-white',
  skipped: 'border-skip bg-skip text-white',
};

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
    <div className="grid grid-cols-3 gap-2" role="group" aria-label="Today's status">
      {OPTIONS.map((o) => {
        const active = todayStatus === o.value;
        return (
          <button
            key={o.value}
            disabled={busy}
            onClick={() => onCheckin(o.value)}
            aria-pressed={active}
            className={`min-h-11 rounded-lg border px-2 py-2 text-sm font-medium disabled:opacity-50 ${
              active
                ? selectedClass[o.value]
                : 'border-rule bg-transparent text-ink hover:border-ink/50 dark:border-white/20 dark:text-paper dark:hover:border-paper/60'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
