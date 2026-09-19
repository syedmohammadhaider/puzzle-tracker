import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../features/auth/AuthContext';

export default function Layout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-semibold tracking-tight">
            🧩 Puzzle Tracker
          </Link>
          {user && (
            <div className="flex items-center gap-3 text-sm">
              <span className="hidden max-w-45 truncate text-neutral-500 sm:inline">{user.email}</span>
              <button onClick={() => signOut()} className="rounded-lg border px-2.5 py-1 text-xs font-medium">
                Log out
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl px-4 py-6">{children}</main>
    </div>
  );
}
