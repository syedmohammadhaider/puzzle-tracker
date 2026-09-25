/**
 * Shared share/clipboard interaction (same pattern for daily and per-puzzle sharing).
 * Must be called directly from a click handler — both navigator.share and the
 * Clipboard API require user activation, so build the text synchronously first
 * and do no async work before calling this.
 */
export type ShareOutcome = 'shared' | 'copied' | 'dismissed' | 'failed';

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Non-secure contexts (plain http) have no Clipboard API.
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

export async function shareText(text: string): Promise<ShareOutcome> {
  if (navigator.share) {
    try {
      await navigator.share({ text });
      return 'shared';
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return 'dismissed'; // user closed the sheet
      // Otherwise fall through to clipboard.
    }
  }
  try {
    await copyText(text);
    return 'copied';
  } catch {
    return 'failed';
  }
}
