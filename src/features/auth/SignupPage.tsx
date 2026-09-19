import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function SignupPage() {
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
      <div className="mx-auto mt-16 w-full max-w-sm rounded-xl border bg-white p-6 text-sm shadow-sm">
        <h1 className="text-xl font-semibold">Check your email</h1>
        <p className="mt-2 text-neutral-600">
          Account created. Confirm via the email link if required, then{' '}
          <button className="underline" onClick={() => nav('/login')}>
            log in
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-16 w-full max-w-sm rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Sign up</h1>
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
          minLength={6}
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={busy}
          className="w-full rounded-lg bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {busy ? 'Creating…' : 'Create account'}
        </button>
      </form>
      <button
        onClick={async () => {
          const { error } = await signInWithGoogle();
          if (error) setError(error);
        }}
        className="mt-3 w-full rounded-lg border px-3 py-2 text-sm font-medium hover:bg-neutral-50"
      >
        Continue with Google
      </button>
      <p className="mt-4 text-sm text-neutral-500">
        Have an account?{' '}
        <Link className="underline" to="/login">
          Log in
        </Link>
      </p>
    </div>
  );
}
