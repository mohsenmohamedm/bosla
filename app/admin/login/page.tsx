'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

const inputClass =
  'w-full rounded-xl border border-bosla-silver/15 bg-bosla-charcoal px-4 py-3 text-sm text-bosla-white focus:border-bosla-gold focus:outline-none';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      router.push('/admin');
      router.refresh();
      return;
    }

    const data = (await response.json().catch(() => ({}))) as { error?: string };
    setError(data.error ?? 'حصلت مشكلة، حاول تاني');
    setLoading(false);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <h1 className="mb-8 text-center font-display text-3xl font-semibold text-bosla-white">
        لوحة التحكم
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border border-bosla-gold/20 bg-bosla-charcoal/60 p-8">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-bosla-silver">الإيميل</label>
          <input id="email" type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        </div>
        <div>
          <label htmlFor="password" className="mb-2 block text-sm text-bosla-silver">الباسورد</label>
          <input id="password" type="password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-gradient-to-l from-bosla-gold to-bosla-gold-deep py-3.5 text-sm font-medium text-bosla-black transition-all duration-500 ease-smooth hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60"
        >
          {loading ? 'جاري الدخول…' : 'دخول'}
        </button>
      </form>
    </main>
  );
}
