/**
 * ثوابت وأدوات مشتركة بين الموقع والسيرفر (آمنة للاستخدام في الـ client والـ server).
 */

export const EVENT_TYPES = ['pageview', 'add_to_cart', 'checkout_start'] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const SCREEN_TYPES = ['mobile', 'desktop'] as const;
export type ScreenType = (typeof SCREEN_TYPES)[number];

export const SOURCES = [
  'فيسبوك',
  'إنستجرام',
  'جوجل',
  'تيك توك',
  'واتساب',
  'مباشر / غير معروف',
  'أخرى',
] as const;

export type RangeKey = '7d' | '30d' | '90d';

export const RANGES: Record<RangeKey, { label: string; days: number }> = {
  '7d': { label: 'آخر 7 أيام', days: 7 },
  '30d': { label: 'آخر 30 يوم', days: 30 },
  '90d': { label: 'آخر 90 يوم', days: 90 },
};

export const isRangeKey = (value: unknown): value is RangeKey =>
  typeof value === 'string' && value in RANGES;

/** بيحدد مصدر الزيارة من utm_source أو رابط الإحالة */
export function classifySource(value: string | null | undefined): string {
  const text = (value ?? '').toLowerCase();
  if (!text) return 'مباشر / غير معروف';
  if (text.includes('facebook') || text.includes('fb.')) return 'فيسبوك';
  if (text.includes('instagram')) return 'إنستجرام';
  if (text.includes('google')) return 'جوجل';
  if (text.includes('tiktok')) return 'تيك توك';
  if (text.includes('whatsapp') || text.includes('wa.me')) return 'واتساب';
  return 'أخرى';
}

/** بيستخرج رقم المنتج من مسار صفحة المنتج */
export function productIdFromPath(path: string): string | undefined {
  const match = /^\/products\/([^/?#]+)/.exec(path);
  return match ? decodeURIComponent(match[1]) : undefined;
}
