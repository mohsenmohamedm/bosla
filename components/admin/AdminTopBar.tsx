'use client';

import { usePathname } from 'next/navigation';
import StoreStatusToggle from './StoreStatusToggle';

const TITLES: [string, string][] = [
  ['/admin/stats', 'الإحصائيات'],
  ['/admin/products', 'المنتجات'],
  ['/admin/categories', 'الأقسام'],
  ['/admin/orders', 'الطلبات'],
  ['/admin/inventory', 'المخزون'],
  ['/admin/settings', 'الإعدادات'],
  ['/admin/pixel', 'CAPI و Pixel'],
];

/** الشريط العلوي للداشبورد: حالة استقبال الطلبات + عنوان الصفحة + أفاتار */
export default function AdminTopBar({ initialOpen }: { initialOpen: boolean }) {
  const pathname = usePathname();
  const title = TITLES.find(([href]) => pathname === href || pathname.startsWith(`${href}/`))?.[1] ?? 'لوحة التحكم';

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-bosla-silver/10 bg-bosla-charcoal/60 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bosla-gold/15 text-xs font-medium text-bosla-gold" aria-hidden="true">
          BS
        </span>
        <StoreStatusToggle initialOpen={initialOpen} />
      </div>
      <span className="text-sm text-bosla-silver/70">{title}</span>
    </div>
  );
}
