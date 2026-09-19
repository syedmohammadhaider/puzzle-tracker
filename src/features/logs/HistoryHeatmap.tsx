import type { DailyLog } from '../../lib/types';
import { lastNDates } from '../../lib/types';
import { dotClass } from './CheckinControl';

export default function HistoryHeatmap({ logs }: { logs: DailyLog[] }) {
  const days = lastNDates(30);
  const byDate = new Map(logs.map((l) => [l.date, l]));
  return (
    <div>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {days.map((d) => {
          const l = byDate.get(d);
          return (
            <span
              key={d}
              title={`${d}: ${l?.status ?? 'no entry'}`}
              className={`h-4 w-4 shrink-0 rounded ${dotClass(l?.status)}`}
            />
          );
        })}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink/60 dark:text-paper/60">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-solved" /> Solved
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-tried" /> Tried
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-skip" /> Skipped
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full border border-rule dark:border-white/20" /> Missing
        </span>
      </div>
    </div>
  );
}
