'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import Logo from '@/components/Logo';

const inputClass =
  'w-full rounded-xl border border-bosla-silver/15 bg-bosla-black px-4 py-3 text-sm text-bosla-white placeholder:text-bosla-silver/30 focus:border-bosla-gold focus:outline-none';

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
    <main className="grid min-h-[100dvh] grid-cols-1 pt-24 lg:grid-cols-2">
      {/* الفورم */}
      <section className="flex flex-col justify-center px-6 py-16 md:px-16">
        <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-bosla-gold/30 px-4 py-1.5 text-xs text-bosla-silver">
          <span className="h-1.5 w-1.5 rounded-full bg-bosla-gold" />
          لوحة الإدارة
        </span>

        <h1 className="font-display text-4xl font-semibold text-bosla-white">أهلاً بيك من جديد</h1>
        <p className="mt-3 text-sm text-bosla-silver/60">سجّل دخولك لإدارة المنتجات والطلبات.</p>

        <form onSubmit={handleSubmit} className="mt-10 flex max-w-md flex-col gap-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-bosla-silver">البريد الإلكتروني</label>
            <input
              id="email"
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm text-bosla-silver">كلمة المرور</label>
            <input
              id="password"
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-gradient-to-l from-bosla-gold to-bosla-gold-deep py-3.5 text-sm font-medium text-bosla-black transition-all duration-500 ease-smooth hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60"
          >
            {loading ? 'جاري الدخول…' : 'دخول لوحة التحكم'}
          </button>
        </form>

        <a href="/" className="mt-8 w-fit text-sm text-bosla-gold hover:underline">
          ← العودة للمتجر
        </a>
      </section>

      {/* البراند */}
      <aside className="hidden flex-col items-center justify-center gap-6 border-r border-bosla-gold/10 bg-bosla-charcoal lg:flex">
        <Logo variant="primary" className="scale-150" />
        <p className="mt-4 font-display text-2xl text-bosla-silver">كل تفصيلة في مكانها.</p>
        <p className="text-xs tracking-[0.4em] text-bosla-silver/40">BOSLA · متجرك الشامل</p>
      </aside>
    </main>
  );
}
