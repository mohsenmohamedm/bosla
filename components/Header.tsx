'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './Logo';
import SearchDialog from './SearchDialog';
import { useCart } from '@/lib/cart';
import { navItems, siteConfig } from '@/lib/data';

/**
 * الهيدر — ثابت (Sticky/Fixed) وبيتحول من شفاف لأسود لما تنزل.
 * - قائمة تنقل ديسكتوب وموبايل (Hamburger بأنيميشن).
 * - أيقونة بحث (placeholder — ربطها بالبحث لما يتعمل).
 * - سلة بعدّاد من CartProvider.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-smooth ${
        scrolled
          ? 'border-b border-bosla-gold/10 bg-bosla-black/95 py-2 shadow-sm backdrop-blur-md md:py-2.5'
          : 'border-b border-bosla-gold/10 bg-bosla-black/95 py-3 backdrop-blur-md md:py-3.5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
        {/* اللوجو + السطر الصغير */}
        <Link
          href="/"
          aria-label={`${siteConfig.nameAr} — الصفحة الرئيسية`}
          className="-mr-2 flex shrink-0 items-center md:-mr-4"
        >
          <Logo variant="header" />
        </Link>

        {/* تنقل الديسكتوب */}
        <nav aria-label="القائمة الرئيسية" className="hidden items-center gap-12 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-lg font-bold tracking-wide text-bosla-silver transition-colors duration-300 hover:text-bosla-gold after:absolute after:-bottom-1.5 after:right-0 after:h-[2px] after:w-0 after:bg-bosla-gold after:transition-all after:duration-500 hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* أدوات: بحث + سلة + زر الموبايل */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="بحث"
            onClick={() => setSearchOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-bosla-gold/30 bg-white text-bosla-gold transition-all duration-300 hover:border-bosla-gold hover:bg-bosla-gold/10"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </button>

          <Link
            href="/cart"
            aria-label={`السلة — ${totalCount} قطعة`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-bosla-gold/30 bg-white text-bosla-gold transition-all duration-300 hover:border-bosla-gold hover:bg-bosla-gold/10"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
              <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            <AnimatePresence>
              {totalCount > 0 && (
                <motion.span
                  key={totalCount}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute -left-1.5 -top-1.5 flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-bosla-gold px-1.5 text-xs font-bold text-bosla-black shadow-glow"
                >
                  {totalCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`h-px w-5 bg-bosla-silver transition-all duration-500 ease-smooth ${
                menuOpen ? 'translate-y-[3px] rotate-45' : ''
              }`}
            />
            <span
              className={`h-px w-5 bg-bosla-silver transition-all duration-500 ease-smooth ${
                menuOpen ? '-translate-y-[3px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* قائمة الموبايل */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            aria-label="القائمة على الموبايل"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden border-t border-bosla-gold/10 bg-bosla-black/95 backdrop-blur-md md:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 py-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="block rounded-xl px-3 py-3 text-base text-bosla-silver transition-colors duration-300 hover:bg-bosla-gold/10 hover:text-bosla-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </header>
  );
}
