import { useState, type FormEvent } from 'react';

export default function AddPuzzleForm({ onAdd }: { onAdd: (name: string, url: string) => Promise<void> }) {
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
      setError('Please enter a valid URL (https://…).');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onAdd(name, url);
      setName('');
      setUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add puzzle');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 rounded-xl border bg-white p-4 shadow-sm sm:flex-row">
      <input
        className="flex-1 rounded-lg border px-3 py-2 text-sm"
        placeholder="Puzzle name (e.g. Wordle)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        maxLength={120}
      />
      <input
        className="flex-[2] rounded-lg border px-3 py-2 text-sm"
        placeholder="https://…"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        inputMode="url"
      />
      <button
        disabled={busy}
        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {busy ? 'Adding…' : 'Add puzzle'}
      </button>
      {error && <p className="text-sm text-red-600 sm:basis-full">{error}</p>}
    </form>
  );
}
