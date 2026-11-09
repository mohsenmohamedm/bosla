'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Lang = 'ar' | 'en';

const STORAGE_KEY = 'bosla-lang';

interface LangValue {
  lang: Lang;
  isAr: boolean;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  /** يرجّع النص بالعربي أو الإنجليزي حسب اللغة الحالية */
  t: (ar: string, en: string) => string;
}

const LangContext = createContext<LangValue>({
  lang: 'ar',
  isAr: true,
  setLang: () => {},
  toggle: () => {},
  t: (ar) => ar,
});

/** اسم القسم بالإنجليزي حسب الـ slug (لحد ما نضيف حقل nameEn في الداتا) */
export const CATEGORY_EN: Record<string, string> = {
  'car-accessories': 'Car Accessories',
};

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ar');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'ar') setLangState(saved);
    } catch {
      // التخزين غير متاح
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // التخزين غير متاح
    }
  }, []);

  const value = useMemo<LangValue>(
    () => ({
      lang,
      isAr: lang === 'ar',
      setLang,
      toggle: () => setLang(lang === 'ar' ? 'en' : 'ar'),
      t: (ar, en) => (lang === 'ar' ? ar : en),
    }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
