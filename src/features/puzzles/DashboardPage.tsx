import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DailyLog, LogStatus } from '../../lib/types';
import { todayLocalISO } from '../../lib/types';
import { archivePuzzle, createPuzzle, deletePuzzle, fetchPuzzles, fetchRecentLogs, upsertLog } from './api';
import AddPuzzleForm from './AddPuzzleForm';
import PuzzleCard from './PuzzleCard';

export default function DashboardPage() {
  const [puzzles, setPuzzles] = useState<Awaited<ReturnType<typeof fetchPuzzles>>>([]);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const ps = await fetchPuzzles();
      setPuzzles(ps);
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
    setPuzzles((p) => p.filter((x) => x.id !== id));
  };

  const handleDelete = async (id: string) => {
    await deletePuzzle(id);
    setPuzzles((p) => p.filter((x) => x.id !== id));
    setLogs((prev) => prev.filter((l) => l.puzzle_id !== id));
  };

  if (loading) return <p className="py-10 text-center text-sm text-neutral-500">Loading puzzles…</p>;
  if (error)
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <button onClick={load} className="mt-2 rounded-lg border px-3 py-1.5 text-sm">
          Retry
        </button>
      </div>
    );

  return (
    <div className="space-y-4">
      <AddPuzzleForm onAdd={handleAdd} />
      {puzzles.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <p className="font-medium">No puzzles yet</p>
          <p className="mt-1 text-sm text-neutral-500">Add your first daily puzzle above — e.g. Wordle, Puzzmo, Advent of Code.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {puzzles.map((p) => (
            <PuzzleCard
              key={p.id}
              puzzle={p}
              logs={logsByPuzzle.get(p.id) ?? []}
              onCheckin={handleCheckin}
              onArchive={handleArchive}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
