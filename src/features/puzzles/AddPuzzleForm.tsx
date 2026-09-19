import { useState, type FormEvent } from 'react';

export default function AddPuzzleForm({ onAdd }: { onAdd: (name: string, url: string) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    try {
      new URL(url.trim());
    } catch {
      setError('That URL looks off — try starting with https://');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onAdd(name, url);
      setName('');
      setUrl('');
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add puzzle');
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-lg border border-rule px-3.5 py-2.5 text-left text-sm text-ink/60 hover:border-ink/50 hover:text-ink dark:border-white/20 dark:text-paper/60 dark:hover:border-paper/60 dark:hover:text-paper"
      >
        + Add a puzzle
      </button>
    );
  }

  const input =
    'w-full rounded-lg border border-rule bg-transparent px-3 py-2 text-sm outline-none placeholder:text-ink/40 focus:border-ink/60 dark:border-white/20 dark:placeholder:text-paper/40 dark:focus:border-paper/60';

  return (
    <form onSubmit={submit} className="rounded-lg border border-rule p-3 dark:border-white/20">
      <div className="grid gap-2">
        <input
          className={input}
          placeholder="Puzzle name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={120}
        />
        <input
          className={input}
          placeholder="https://…"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          inputMode="url"
        />
        <div className="flex gap-2">
          <button
            disabled={busy}
            className="min-h-10 flex-1 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper disabled:opacity-50 dark:bg-paper dark:text-ink"
          >
            {busy ? 'Adding…' : 'Add puzzle'}
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setError(null);
            }}
            className="min-h-10 rounded-lg border border-rule px-4 py-2 text-sm dark:border-white/20"
          >
            Cancel
          </button>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-flame">{error}</p>}
    </form>
  );
}
