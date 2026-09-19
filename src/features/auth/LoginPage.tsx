import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

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

  const onGoogle = async () => {
    setError(null);
    const { error } = await signInWithGoogle();
    if (error) setError(error);
  };

  return (
    <div className="mx-auto mt-16 w-full max-w-sm rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Log in</h1>
      <p className="mt-1 text-sm text-neutral-500">Track your daily puzzles.</p>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input
          className="w-full rounded-lg border px-3 py-2 text-sm"
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded-lg border px-3 py-2 text-sm"
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={busy}
          className="w-full rounded-lg bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {busy ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <button
        onClick={onGoogle}
        className="mt-3 w-full rounded-lg border px-3 py-2 text-sm font-medium hover:bg-neutral-50"
      >
        Continue with Google
      </button>
      <p className="mt-4 text-sm text-neutral-500">
        No account?{' '}
        <Link className="underline" to="/signup">
          Sign up
        </Link>
      </p>
    </div>
  );
}
