import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const card =
  'mx-auto mt-10 w-full max-w-sm border-y border-rule py-8 sm:mt-16 dark:border-white/10';
const input =
  'w-full rounded-lg border border-rule bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-ink/40 focus:border-ink/60 dark:border-white/20 dark:placeholder:text-paper/40 dark:focus:border-paper/60';
const primary =
  'w-full rounded-lg bg-ink px-3 py-2.5 text-sm font-medium text-paper disabled:opacity-50 dark:bg-paper dark:text-ink';
const secondary =
  'mt-2.5 w-full rounded-lg border border-rule px-3 py-2.5 text-sm dark:border-white/20';

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className={card}>
      <h1 className="font-display text-2xl font-semibold">{title}</h1>
      <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">{subtitle}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

export default function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { error } = await signIn(email.trim(), password);
      if (error) setError(error);
      else nav('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Your streaks are on the page.">
      <form onSubmit={onSubmit} className="space-y-2.5">
        <input className={input} type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={input} type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-flame">{error}</p>}
        <button disabled={busy} className={primary}>
          {busy ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <button
        onClick={async () => {
          const { error } = await signInWithGoogle();
          if (error) setError(error);
        }}
        className={secondary}
      >
        Continue with Google
      </button>
      <p className="mt-4 text-sm text-ink/60 dark:text-paper/60">
        New here?{' '}
        <Link className="underline underline-offset-2" to="/signup">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

export function SignupForm() {
  const { signUp, signInWithGoogle } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { error } = await signUp(email.trim(), password);
      if (error) setError(error);
      else setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <AuthShell title="Check your inbox" subtitle="One step left.">
        <p className="text-sm text-ink/70 dark:text-paper/70">
          Account created. Confirm via the email link if asked, then{' '}
          <button className="underline underline-offset-2" onClick={() => nav('/login')}>
            log in
          </button>
          .
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Create an account" subtitle="One tap a day, per puzzle.">
      <form onSubmit={onSubmit} className="space-y-2.5">
        <input className={input} type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={input} type="password" required minLength={6} placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-flame">{error}</p>}
        <button disabled={busy} className={primary}>
          {busy ? 'Creating…' : 'Create account'}
        </button>
      </form>
      <button
        onClick={async () => {
          const { error } = await signInWithGoogle();
          if (error) setError(error);
        }}
        className={secondary}
      >
        Continue with Google
      </button>
      <p className="mt-4 text-sm text-ink/60 dark:text-paper/60">
        Have an account?{' '}
        <Link className="underline underline-offset-2" to="/login">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
