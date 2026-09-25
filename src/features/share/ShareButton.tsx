import { useEffect, useRef, useState } from 'react';
import { buildShareText, type ShareEntry } from './buildShareText';
import { shareText } from './shareText';

export default function ShareButton({ entries }: { entries: ShareEntry[] }) {
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const showToast = (msg: string) => {
    setToast(msg);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2000);
  };

  const ready = entries.length > 0;

  const onShare = async () => {
    if (!ready) return;
    // Build synchronously, then call the share/clipboard API directly in the
    // same gesture — both APIs reject if not called from user activation.
    const text = buildShareText(entries, new Date(), window.location.host);
    const outcome = await shareText(text);
    if (outcome === 'copied') showToast('Copied to clipboard!');
    else if (outcome === 'failed') showToast('Could not copy — long-press to select the text');
  };

  return (
    <>
      <button
        onClick={onShare}
        disabled={!ready}
        title={ready ? 'Share today' : 'Log a puzzle to share your day'}
        className="shrink-0 rounded-full border border-rule px-3.5 py-1.5 text-sm hover:border-ink/50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/20 dark:hover:border-paper/60"
      >
        Share
      </button>
      {toast && (
        <p
          role="status"
          className="fixed bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm text-paper dark:bg-paper dark:text-ink"
        >
          {toast}
        </p>
      )}
    </>
  );
}
