'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { formatPrice } from '@/lib/store';
import type { Product } from '@/lib/types';

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

/** نافذة البحث — بتتفتح من زرار البحث في الهيدر */
export default function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // قفل السكرول وفوكس على الخانة لما النافذة تتفتح
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  // بحث بعد توقف الكتابة 250ms
  useEffect(() => {
    if (!open) return;
    const term = query.trim();
    if (!term) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as { products: Product[] };
        setResults(data.products);
      } catch {
        // اتلغى أو فشل الاتصال
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, open]);

  const handleClose = () => {
    setQuery('');
    setResults([]);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="بحث في المنتجات"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] bg-bosla-black/95 backdrop-blur-md"
        >
          <div className="mx-auto flex h-full max-w-2xl flex-col px-5 pt-28 md:px-8">
            <div className="flex items-center gap-4 border-b border-bosla-gold/20 pb-4">
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ابحث عن منتج..."
                className="flex-1 bg-transparent text-lg text-bosla-white outline-none placeholder:text-bosla-silver/40"
              />
              <button
                type="button"
                onClick={handleClose}
                className="text-sm text-bosla-silver/70 transition-colors hover:text-bosla-gold"
              >
                إغلاق
              </button>
            </div>

            <div className="mt-6 flex-1 overflow-y-auto pb-10">
              {loading && <p className="text-sm text-bosla-silver/50">بندور...</p>}

              {!loading && query.trim() && results.length === 0 && (
                <p className="text-sm text-bosla-silver/50">مفيش نتايج لـ "{query.trim()}".</p>
              )}

              <ul className="flex flex-col gap-3">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.id}`}
                      onClick={handleClose}
                      className="flex items-center gap-4 rounded-2xl border border-bosla-silver/10 p-3 transition-colors duration-300 hover:border-bosla-gold/40"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-bosla-graphite">
                        <Image src={product.image} alt={product.imageAlt} fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-bosla-white">{product.name}</p>
                        <p className="mt-1 text-sm text-bosla-gold">{formatPrice(product.price)}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
