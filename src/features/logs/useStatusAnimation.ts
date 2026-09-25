import { useCallback, useState } from 'react';
import confetti from 'canvas-confetti';
import type { LogStatus } from '../../lib/types';

/**
 * Single place where reduced motion is respected: every animation in this hook
 * is gated behind this check, so OS-level "reduce motion" users get an instant
 * state change with no confetti and no CSS motion. canvas-confetti also gets
 * `disableForReducedMotion: true` as belt-and-braces.
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

const CONFETTI_COLORS = ['#4A7C59', '#C97A2E', '#F7F5F0', '#1F1D1A'];

function burstFrom(el: HTMLElement): void {
  const r = el.getBoundingClientRect();
  void confetti({
    particleCount: 28,
    spread: 55,
    startVelocity: 28,
    ticks: 120,
    scalar: 0.8,
    disableForReducedMotion: true,
    colors: CONFETTI_COLORS,
    origin: {
      x: (r.left + r.width / 2) / window.innerWidth,
      y: (r.top + r.height / 2) / window.innerHeight,
    },
  });
}

/**
 * Reusable micro-feedback for status taps. Call `fire(status, el)` alongside
 * (not awaited before/after) the data mutation so a slow network never delays
 * the visual feedback. Skipped intentionally has no animation.
 */
export function useStatusAnimation() {
  const [rippleKey, setRippleKey] = useState(0);

  const fire = useCallback((status: LogStatus, el: HTMLElement | null) => {
    if (status === 'skipped' || prefersReducedMotion()) return;
    if (status === 'solved') {
      if (!el) return;
      // Restart the pop without remounting (keeps focus): strip, reflow, re-add.
      el.classList.remove('animate-status-pop');
      void el.offsetWidth;
      el.classList.add('animate-status-pop');
      burstFrom(el);
    } else {
      setRippleKey((k) => k + 1);
    }
  }, []);

  const clearRipple = useCallback(() => setRippleKey(0), []);

  return { rippleKey, fire, clearRipple };
}
