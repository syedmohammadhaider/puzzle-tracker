import type { DailyLog } from '../../lib/types';
import { lastNDates } from '../../lib/types';
import { dotClass } from './CheckinControl';

export default function StreakDots({
  logs,
  days = 10,
  animateDate,
}: {
  logs: DailyLog[];
  days?: number;
  animateDate?: string;
}) {
  const dates = lastNDates(days);
  const byDate = new Map(logs.map((l) => [l.date, l]));
  return (
    <div className="flex items-center gap-1.5" role="img" aria-label={`Last ${days} days`}>
      {dates.map((d) => {
        const l = byDate.get(d);
        const animate = animateDate === d && l;
        return (
          <span
            key={animate ? `${d}-${l.status}-${l.id}` : d}
            title={`${d}: ${l?.status ?? 'no entry'}`}
            className={`h-2.5 w-2.5 rounded-full ${dotClass(l?.status)}${animate ? ' animate-dot-fill' : ''}`}
          />
        );
      })}
      <span className="ml-1.5 text-xs text-ink/50 dark:text-paper/50">last {days} days</span>
    </div>
  );
}
