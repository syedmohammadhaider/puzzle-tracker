import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DailyLog, LogStatus } from '../../lib/types';
import { todayLocalISO } from '../../lib/types';
import { archivePuzzle, createPuzzle, deletePuzzle, fetchArchivedPuzzles, fetchPuzzles, fetchRecentLogs, restorePuzzle, upsertLog } from './api';
import AddPuzzleForm from './AddPuzzleForm';
import PuzzleCard from './PuzzleCard';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Up late';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const [puzzles, setPuzzles] = useState<Awaited<ReturnType<typeof fetchPuzzles>>>([]);
  const [archived, setArchived] = useState<Awaited<ReturnType<typeof fetchArchivedPuzzles>>>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [archivedBusy, setArchivedBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ps, ap] = await Promise.all([fetchPuzzles(), fetchArchivedPuzzles()]);
      setPuzzles(ps);
      setArchived(ap);
      const ls = await fetchRecentLogs(ps.map((p) => p.id), 90);
      setLogs(ls);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const logsByPuzzle = useMemo(() => {
    const m = new Map<string, DailyLog[]>();
    for (const l of logs) {
      const arr = m.get(l.puzzle_id) ?? [];
      arr.push(l);
      m.set(l.puzzle_id, arr);
    }
    return m;
  }, [logs]);

  const handleAdd = async (name: string, url: string) => {
    const created = await createPuzzle(name, url);
    setPuzzles((p) => [...p, created]);
  };

  const handleCheckin = async (puzzleId: string, status: LogStatus) => {
    const saved = await upsertLog(puzzleId, todayLocalISO(), status);
    setLogs((prev) => {
      const rest = prev.filter((l) => !(l.puzzle_id === puzzleId && l.date === saved.date));
      return [...rest, saved];
    });
  };

  const handleArchive = async (id: string) => {
    await archivePuzzle(id);
    setPuzzles((p) => {
      const found = p.find((x) => x.id === id);
      if (found) setArchived((a) => [...a, { ...found, is_archived: true }]);
      return p.filter((x) => x.id !== id);
    });
  };

  const handleRestore = async (id: string) => {
    setArchivedBusy(id);
    try {
      await restorePuzzle(id);
      setArchived((a) => a.filter((x) => x.id !== id));
      const ps = await fetchPuzzles();
      setPuzzles(ps);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to restore');
    } finally {
      setArchivedBusy(null);
    }
  };

  const handleDeleteArchived = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" and its history?`)) return;
    setArchivedBusy(id);
    try {
      await deletePuzzle(id);
      setArchived((a) => a.filter((x) => x.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete');
    } finally {
      setArchivedBusy(null);
    }
  };

  const handleDelete = async (id: string) => {
    await deletePuzzle(id);
    setPuzzles((p) => p.filter((x) => x.id !== id));
    setLogs((prev) => prev.filter((l) => l.puzzle_id !== id));
  };

  if (loading) return <p className="py-10 text-sm text-ink/60 dark:text-paper/60">Getting today ready…</p>;
  if (error)
    return (
      <div className="border-y border-rule py-10">
        <p className="text-sm">{error}</p>
        <button onClick={load} className="mt-3 rounded-lg border border-rule px-4 py-2 text-sm dark:border-white/20">
          Try again
        </button>
      </div>
    );

  const dateStr = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">{greeting()}</h1>
      <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">
        {dateStr} — {puzzles.length === 0 ? 'no puzzles yet' : `${puzzles.length} ${puzzles.length === 1 ? 'puzzle' : 'puzzles'} today`}
      </p>

      <div className="mt-5">
        <AddPuzzleForm onAdd={handleAdd} />
      </div>

      {puzzles.length === 0 ? (
        <div className="mt-6 border-y border-rule py-10">
          <p className="font-display text-xl font-semibold">Nothing on the page yet</p>
          <p className="mt-1 max-w-sm text-sm text-ink/60 dark:text-paper/60">
            Add the puzzles you do each morning above. One tap a day keeps each streak going.
          </p>
        </div>
      ) : (
        <div className="mt-2 divide-y divide-rule border-b border-rule dark:divide-white/10 dark:border-white/10">
          {puzzles.map((p) => (
            <div key={p.id} className="py-5 first:pt-4">
              <PuzzleCard
                puzzle={p}
                logs={logsByPuzzle.get(p.id) ?? []}
                onCheckin={handleCheckin}
                onArchive={handleArchive}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}

      {archived.length > 0 && (
        <div className="mt-8">
          <button
            onClick={() => setShowArchived((v) => !v)}
            className="text-sm text-ink/50 hover:text-ink dark:text-paper/50 dark:hover:text-paper"
          >
            {showArchived ? 'Hide archived' : `Archived (${archived.length})`}
          </button>
          {showArchived && (
            <ul className="mt-2 divide-y divide-rule border-y border-rule dark:divide-white/10 dark:border-white/10">
              {archived.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="truncate text-xs text-ink/50 dark:text-paper/50">
                      {p.url.replace(/^https?:\/\//, '')}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-sm">
                    <button
                      onClick={() => handleRestore(p.id)}
                      disabled={archivedBusy === p.id}
                      className="hover:text-ink disabled:opacity-50 dark:hover:text-paper"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => handleDeleteArchived(p.id, p.name)}
                      disabled={archivedBusy === p.id}
                      className="hover:text-flame disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
