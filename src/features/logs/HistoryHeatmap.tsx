import type { DailyLog } from '../../lib/types';
import { lastNDates } from '../../lib/types';
import { statusDot } from './CheckinControl';

export default function HistoryHeatmap({ logs }: { logs: DailyLog[] }) {
  const days = lastNDates(30);
  const byDate = new Map(logs.map((l) => [l.date, l]));
  return (
    <div>
      <div className="flex gap-1">
        {days.map((d) => (
          <div
            key={d}
            title={`${d}: ${byDate.get(d)?.status ?? 'no entry'}`}
            className={`h-5 w-3 rounded-sm sm:h-6 sm:w-4 ${statusDot(byDate, d)}`}
          />
        ))}
      </div>
      <div className="mt-1.5 flex gap-3 text-[11px] text-neutral-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-green-500" /> Solved
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-400" /> Attempted
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-neutral-300" /> Skipped
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-neutral-100 ring-1 ring-neutral-200" /> Missing
        </span>
      </div>
    </div>
  );
}
