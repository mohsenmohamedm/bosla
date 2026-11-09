'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { formatPrice } from '@/lib/store';
import type { Product } from '@/lib/types';
import { useLang } from '@/lib/lang';

/** خانة بحث مدمجة في الهيدر: بتكتب في نفس الخانة والنتايج بتنزل تحتها مباشرة. */
export default function HeaderSearch({ className = '' }: { className?: string }) {
  const { t } = useLang();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (event: Event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setResults([]);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/products/search?q=' + encodeURIComponent(term), { signal: controller.signal });
        const data = (await response.json()) as { products: Product[] };
        setResults(data.products);
        setLoading(false);
      } catch {
        // اتلغى أو فشل الاتصال
      }
    }, 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const pick = () => {
    setOpen(false);
    setQuery('');
    setResults([]);
  };

  const term = query.trim();

  return (
    <div ref={wrapRef} className={'relative ' + className}>
      <div className="flex h-9 items-center gap-2 rounded-xl border border-bosla-gold/25 bg-white px-3 transition-colors focus-within:border-bosla-gold md:h-10">
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0 text-bosla-gold" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          type="text"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          aria-label={t('بحث', 'Search')}
          placeholder={t('بتدور على إيه في بوصلة؟', 'What are you looking for at Bosla?')}
          className="min-w-0 flex-1 bg-transparent text-[16px] font-semibold text-bosla-white outline-none placeholder:font-medium placeholder:text-bosla-silver/80"
        />
      </div>

      {open && term && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 max-h-[60vh] overflow-y-auto rounded-2xl border border-bosla-gold/15 bg-white p-2 shadow-xl">
          {loading && <p className="p-3 text-sm text-bosla-silver">{t('بندور...', 'Searching...')}</p>}
          {!loading && results.length === 0 && (
            <p className="p-3 text-sm text-bosla-silver">{t('مفيش نتايج لـ "' + term + '"', 'No results for "' + term + '"')}</p>
          )}
          <ul className="flex flex-col">
            {results.map((product) => (
              <li key={product.id}>
                <Link
                  href={'/products/' + product.id}
                  onClick={pick}
                  className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-bosla-graphite"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-bosla-graphite">
                    <Image src={product.image} alt={product.imageAlt} fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-bosla-white">{product.name}</p>
                    <p className="text-sm font-bold text-bosla-gold">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
