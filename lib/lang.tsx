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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LocalizedItem = Record<string, any> & { id?: string; slug?: string };

const STORAGE_KEY = 'bosla-lang';

interface LangValue {
  lang: Lang;
  isAr: boolean;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  /** يرجّع النص بالعربي أو الإنجليزي حسب اللغة الحالية */
  t: (ar: string, en: string) => string;
  /** سعر منسّق حسب اللغة */
  price: (n: number) => string;
  /** رقم منسّق حسب اللغة */
  num: (n: number) => string;
  /** حقل منتج باللغة الحالية (بيرجع للعربي لو مفيش ترجمة) */
  pf: (p: LocalizedItem, field: 'name' | 'description' | 'imageAlt' | 'badge') => string;
  /** حقل قسم باللغة الحالية */
  cf: (c: LocalizedItem, field: 'name' | 'description' | 'imageAlt') => string;
}

const LangContext = createContext<LangValue>({
  lang: 'ar',
  isAr: true,
  setLang: () => {},
  toggle: () => {},
  t: (ar) => ar,
  price: (n) => `${n.toLocaleString('ar-EG')} ج.م`,
  num: (n) => n.toLocaleString('ar-EG'),
  pf: (p, field) => String(p[field] ?? ''),
  cf: (c, field) => String(c[field] ?? ''),
});

/** اسم القسم بالإنجليزي حسب الـ slug (لحد ما نضيف حقل nameEn في الداتا) */
export const CATEGORY_EN: Record<string, string> = {
  'car-accessories': 'Car Accessories',
};

/** ترجمات المنتجات التجريبية (لحد ما تتكتب من الداشبورد في nameEn وغيره) */
const PRODUCT_EN: Record<string, Record<string, string>> = {
  'p-001': { name: 'Sharp-design LED headlights', description: 'Pure white lighting and a modern design that gives the front end a stronger presence.', imageAlt: 'Car headlight at dusk', badge: 'Best seller' },
  'p-002': { name: 'Dynamic rear lights', description: 'A gradient lighting effect that catches the eye with quiet elegance.', imageAlt: 'Red car at night in the rain' },
  'p-003': { name: 'Classic-design headlights', description: 'A classic touch with durable materials for refined taste.', imageAlt: 'Pop-up headlight on a red sports car' },
  'p-004': { name: 'LED fog lights', description: 'Clearer vision in tough conditions with focused lighting.', imageAlt: 'Convertible at sunset on a country road' },
  'p-005': { name: 'Interior ambient lighting', description: 'A calm atmosphere inside the cabin with easy intensity control.', imageAlt: 'Convertible parked by the seafront' },
  'p-006': { name: 'Illuminated headlight lenses', description: 'A visual upgrade that gives headlights a cleaner, more premium look.', imageAlt: 'Close-up of a classic blue car headlight' },
};

const CATEGORY_TEXT_EN: Record<string, Record<string, string>> = {
  'car-accessories': {
    name: 'Car Accessories',
    description: 'Carefully selected pieces that add an elegant touch to your car, from lighting to interior details.',
    imageAlt: 'Car interior accessories: phone holder, thermal cup and charger',
  },
};

/** نص من الداتا بالإنجليزي لو متاح، وإلا بالعربي */
export function localizedField(item: LocalizedItem, field: string, lang: Lang, table: Record<string, Record<string, string>>): string {
  if (lang === 'en') {
    const own = item[field + 'En'];
    if (typeof own === 'string' && own.trim()) return own;
    const key = item.id ?? item.slug ?? '';
    const fallback = table[key]?.[field] ?? (item.slug ? table[item.slug]?.[field] : undefined);
    if (fallback) return fallback;
  }
  return String(item[field] ?? '');
}

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
      price: (n) => (lang === 'ar' ? `${n.toLocaleString('ar-EG')} ج.م` : `EGP ${n.toLocaleString('en-US')}`),
      num: (n) => n.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US'),
      pf: (p, field) => localizedField(p, field, lang, PRODUCT_EN),
      cf: (c, field) => localizedField(c, field, lang, CATEGORY_TEXT_EN),
    }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** نص ثنائي اللغة تقدر تستخدمه جوه الصفحات اللي مش Client */
export function T({ ar, en }: { ar: string; en: string }) {
  const { lang } = useLang();
  return <>{lang === 'en' ? en : ar}</>;
}

/** نص لحقل منتج/قسم حسب اللغة: <PF item={product} field="name" /> */
export function PF({ item, field, kind = 'product' }: { item: LocalizedItem; field: 'name' | 'description' | 'imageAlt' | 'badge'; kind?: 'product' | 'category' }) {
  const { pf, cf } = useLang();
  return <>{kind === 'product' ? pf(item, field) : cf(item, field as 'name' | 'description' | 'imageAlt')}</>;
}
