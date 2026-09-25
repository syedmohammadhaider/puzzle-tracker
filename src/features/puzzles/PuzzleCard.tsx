import { useEffect, useRef, useState } from 'react';
import type { DailyLog, LogStatus, Puzzle } from '../../lib/types';
import { calcBestStreak, calcCurrentStreak } from '../../lib/streak';
import { lastNDates, todayLocalISO } from '../../lib/types';
import CheckinControl from '../logs/CheckinControl';
import StreakDots from '../logs/StreakDots';
import HistoryHeatmap from '../logs/HistoryHeatmap';
import { buildStreakShareText } from '../share/buildStreakShareText';
import { shareText } from '../share/shareText';

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
  const [justTapped, setJustTapped] = useState<string | undefined>(undefined);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const showToast = (msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2000);
  };

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

  const checkin = (s: LogStatus) =>
    wrap(async () => {
      await onCheckin(puzzle.id, s);
      setJustTapped(today);
    });

  const onShareStreak = async () => {
    // Same 10-day history the dot row renders (oldest → newest, ending today).
    // Built synchronously so the share/clipboard call stays in the click gesture.
    const byDate = new Map(logs.map((l) => [l.date, l.status]));
    const statuses = lastNDates(10).map((d) => byDate.get(d));
    const text = buildStreakShareText(puzzle.name, current, statuses, window.location.host);
    const outcome = await shareText(text);
    if (outcome === 'copied') showToast('Copied to clipboard!');
    else if (outcome === 'failed') showToast('Could not copy — long-press to select the text');
  };

  return (
    <section>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="min-w-0 flex-1 truncate font-display text-xl font-semibold">{puzzle.name}</h2>
        <div className="flex shrink-0 items-center gap-0.5">
          <p className="text-flame" title={`Current streak: ${current} days. Best: ${best}.`}>
            <span aria-hidden>🔥</span>{' '}
            <span className="font-display text-2xl font-semibold">{current}</span>
            {best > current && <span className="ml-1.5 text-xs font-normal text-ink/50 dark:text-paper/50">Best {best}</span>}
          </p>
          <button
            onClick={onShareStreak}
            title="Share streak"
            aria-label={`Share ${puzzle.name} streak`}
            className="rounded-full p-1.5 text-ink/40 hover:text-ink dark:text-paper/40 dark:hover:text-paper"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
              <path d="M12 15V4m0 0 4 4m-4-4L8 8" />
              <path d="M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" />
            </svg>
          </button>
        </div>
      </div>
      <a
        href={puzzle.url}
        target="_blank"
        rel="noreferrer"
        className="mt-0.5 block truncate text-sm text-ink/60 underline decoration-rule underline-offset-2 hover:text-ink dark:text-paper/60 dark:decoration-white/20 dark:hover:text-paper"
      >
        {puzzle.url.replace(/^https?:\/\//, '')}
      </a>

      <div className="mt-2.5">
        <StreakDots logs={logs} days={10} animateDate={justTapped} />
      </div>

      <div className="mt-3">
        <CheckinControl todayStatus={todayStatus} busy={busy} onCheckin={checkin} />
      </div>

      {error && <p className="mt-2 text-sm text-flame">{error}</p>}
      {toast && (
        <p
          role="status"
          className="fixed bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm text-paper dark:bg-paper dark:text-ink"
        >
          {toast}
        </p>
      )}

      {showHistory && (
        <div className="mt-3 border-t border-rule pt-3 dark:border-white/10">
          <HistoryHeatmap logs={logs} />
        </div>
      )}

      <div className="mt-3 flex items-center gap-2 text-sm text-ink/50 dark:text-paper/50">
        <button onClick={() => setShowHistory((v) => !v)} className="hover:text-ink dark:hover:text-paper">
          {showHistory ? 'Hide history' : 'Last 30 days'}
        </button>
        <span aria-hidden>·</span>
        <button onClick={() => wrap(() => onArchive(puzzle.id))} className="hover:text-ink dark:hover:text-paper" disabled={busy}>
          Archive
        </button>
        <span aria-hidden>·</span>
        <button
          onClick={() => {
            if (confirm(`Delete "${puzzle.name}" and its history?`)) wrap(() => onDelete(puzzle.id));
          }}
          className="hover:text-flame"
          disabled={busy}
        >
          Delete
        </button>
      </div>
    </section>
  );
}
