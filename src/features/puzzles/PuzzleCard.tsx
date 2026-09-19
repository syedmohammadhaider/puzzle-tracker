import { useState } from 'react';
import type { DailyLog, LogStatus, Puzzle } from '../../lib/types';
import { calcBestStreak, calcCurrentStreak } from '../../lib/streak';
import { todayLocalISO } from '../../lib/types';
import CheckinControl from '../logs/CheckinControl';
import HistoryHeatmap from '../logs/HistoryHeatmap';

export default function PuzzleCard({
  puzzle,
  logs,
  onCheckin,
  onArchive,
  onDelete,
}: {
  puzzle: Puzzle;
  logs: DailyLog[];
  onCheckin: (puzzleId: string, status: LogStatus) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const today = todayLocalISO();
  const todayStatus = logs.find((l) => l.date === today)?.status;
  const current = calcCurrentStreak(logs);
  const best = calcBestStreak(logs);

  const wrap = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold">{puzzle.name}</h2>
          <a
            href={puzzle.url}
            target="_blank"
            rel="noreferrer"
            className="block truncate text-sm text-blue-600 hover:underline"
          >
            {puzzle.url}
          </a>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-sm">
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium" title="Current streak">
            🔥 {current}
          </span>
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium" title="Best streak">
            Best {best}
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <CheckinControl todayStatus={todayStatus} busy={busy} onCheckin={(s) => wrap(() => onCheckin(puzzle.id, s))} />
        <div className="flex gap-2 text-xs">
          <button onClick={() => setShowHistory((v) => !v)} className="underline text-neutral-500">
            {showHistory ? 'Hide' : 'Last 30 days'}
          </button>
          <button
            onClick={() => wrap(() => onArchive(puzzle.id))}
            className="underline text-neutral-500"
            disabled={busy}
          >
            Archive
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete "${puzzle.name}" and its history?`)) wrap(() => onDelete(puzzle.id));
            }}
            className="underline text-red-500"
            disabled={busy}
          >
            Delete
          </button>
        </div>
      </div>

      {todayStatus && (
        <p className="mt-2 text-xs text-neutral-500">
          Today: <span className="font-medium capitalize">{todayStatus}</span>
        </p>
      )}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      {showHistory && (
        <div className="mt-3 border-t pt-3">
          <HistoryHeatmap logs={logs} />
        </div>
      )}
    </div>
  );
}
