'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

/** بيخفي هيدر وفوتر المتجر جوه صفحات لوحة التحكم */
export default function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return <>{children}</>;
}
