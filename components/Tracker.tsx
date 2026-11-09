'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { productIdFromPath } from '@/lib/traffic';
import { trackEvent } from '@/lib/track-client';

/** بيسجّل مشاهدة كل صفحة، وبدء الطلب لما الزائر يفتح صفحة الدفع */
export default function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    trackEvent('pageview', { path: pathname, productId: productIdFromPath(pathname) });
    if (pathname === '/checkout') {
      trackEvent('checkout_start', { path: pathname });
    }
  }, [pathname]);

  return null;
}
