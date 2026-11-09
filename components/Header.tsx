'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './Logo';
import HeaderSearch from './HeaderSearch';
import { useCart } from '@/lib/cart';
import { getCategories, siteConfig } from '@/lib/data';
import { CATEGORY_EN, useLang } from '@/lib/lang';

/**
 * الهيدر بشكل ماركت بليس: صف اللوجو + لغة + سلة، شريط بحث عريض، وشريط أقسام.
 * الأقسام بتتقرأ من getCategories() فلما تضيف قسم جديد بيظهر هنا لوحده.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { totalCount } = useCart();
  const { lang, isAr, toggle, t } = useLang();
  const categories = getCategories();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const iconBtn =
    'relative flex h-10 items-center justify-center gap-1.5 rounded-full border border-bosla-gold/25 bg-white px-3 text-bosla-gold transition-colors duration-300 hover:border-bosla-gold hover:bg-bosla-gold/10';

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-bosla-gold/10 bg-bosla-black/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2 md:px-8 md:py-2.5">
        <Link
          href="/"
          aria-label={`${isAr ? siteConfig.nameAr : siteConfig.nameEn} — ${t('الصفحة الرئيسية', 'Home')}`}
          className="order-1 flex shrink-0 items-center md:-ms-4"
        >
          <Logo variant="header" />
        </Link>

        {/* شريط البحث */}
        <HeaderSearch className="order-3 w-full md:order-2 md:mx-auto md:max-w-2xl md:flex-1" />

        {/* لغة + سلة */}
        <div className="order-2 ms-auto flex items-center gap-2 md:order-3 md:ms-0">
          <button type="button" onClick={toggle} aria-label={t('التبديل إلى الإنجليزية', 'Switch to Arabic')} className={iconBtn}>
            <span className="text-xs font-bold">{lang === 'ar' ? 'EN' : 'عربي'}</span>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
            </svg>
          </button>

          <Link
            href="/cart"
            aria-label={t(`السلة — ${totalCount} قطعة`, `Cart — ${totalCount} items`)}
            className={`${iconBtn} w-10 !px-0`}
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
                  className="absolute -end-1.5 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-bosla-accent px-1 text-[11px] font-bold text-white shadow"
                >
                  {totalCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </div>

      {/* شريط الأقسام */}
      <nav
        aria-label={t('الأقسام', 'Categories')}
        className={`overflow-hidden border-t border-bosla-gold/10 transition-all duration-300 ${scrolled ? 'max-h-0 border-t-0' : 'max-h-14'}`}
      >
        <ul className="mx-auto flex max-w-[1600px] items-center gap-1 overflow-x-auto px-3 py-1 md:px-8">
          <li>
            <Link href="/" className="block whitespace-nowrap rounded-lg px-3 py-2 text-[15px] font-extrabold text-bosla-gold transition-all duration-200 hover:-translate-y-0.5 hover:bg-bosla-gold/10 active:scale-95">
              {t('الرئيسية', 'Home')}
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/category/${category.slug}`}
                className="block whitespace-nowrap rounded-lg px-3 py-2 text-[15px] font-bold text-bosla-silver transition-all duration-200 hover:-translate-y-0.5 hover:bg-bosla-gold/10 hover:text-bosla-gold-deep active:scale-95"
              >
                {isAr ? category.name : CATEGORY_EN[category.slug] ?? category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
