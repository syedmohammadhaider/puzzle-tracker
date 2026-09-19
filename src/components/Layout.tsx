import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { useTheme } from '../lib/useTheme';

export default function Layout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <div className="relative min-h-screen">
      <div aria-hidden className="graph-paper pointer-events-none absolute inset-0" />
      <header className="relative border-b border-rule bg-paper dark:border-white/10 dark:bg-coal">
        <div className="mx-auto flex w-full max-w-[640px] items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <Link to="/" className="min-w-0">
            <span className="block truncate font-display text-lg font-semibold">Puzzle Streaks</span>
            <span className="block text-sm text-ink/60 dark:text-paper/60">keep the fire alive</span>
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="h-9 min-w-9 rounded-full border border-rule px-2 text-base dark:border-white/15"
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>
            {user && (
              <button
                onClick={() => signOut()}
                className="rounded-full border border-rule px-3 py-1.5 text-sm dark:border-white/15"
              >
                Log out
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="relative mx-auto w-full max-w-[640px] px-4 pb-16 pt-6 sm:px-6">{children}</main>
    </div>
  );
}
