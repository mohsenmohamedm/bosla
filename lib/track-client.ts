import { classifySource, type EventType, type ScreenType } from './traffic';

/**
 * تتبع الزيارات من المتصفح. بيبعت الأحداث لـ /api/track.
 * كل تبويب بيتعد جلسة واحدة (sessionStorage)، عشان "الزيارات" تبقى جلسات مش أفراد.
 */

const SESSION_KEY = 'bosla_sid';
const SOURCE_KEY = 'bosla_src';

function getSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const created = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, created);
    return created;
  } catch {
    return crypto.randomUUID();
  }
}

function getSource(): string {
  try {
    const existing = sessionStorage.getItem(SOURCE_KEY);
    if (existing) return existing;
    const utm = new URLSearchParams(window.location.search).get('utm_source');
    const source = classifySource(utm || document.referrer || null);
    sessionStorage.setItem(SOURCE_KEY, source);
    return source;
  } catch {
    return 'مباشر / غير معروف';
  }
}

function getScreen(): ScreenType {
  return window.innerWidth < 768 ? 'mobile' : 'desktop';
}

export function trackEvent(type: EventType, extra?: { path?: string; productId?: string }): void {
  if (typeof window === 'undefined') return;
  const path = extra?.path ?? window.location.pathname;
  if (path.startsWith('/admin')) return;

  const body = {
    type,
    sessionId: getSessionId(),
    path,
    productId: extra?.productId,
    source: getSource(),
    screen: getScreen(),
  };

  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    // التتبع مش بيوقف الموقع
  });
}
