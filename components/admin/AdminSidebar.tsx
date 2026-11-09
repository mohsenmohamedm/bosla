'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import LogoutButton from './LogoutButton';

const items = [
  { href: '/admin/stats', label: 'الإحصائيات', icon: 'M4 6h7v7H4zM13 6h7v4h-7zM13 12h7v6h-7zM4 15h7v3H4z' },
  { href: '/admin/products', label: 'المنتجات', icon: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5' },
  { href: '/admin/categories', label: 'الأقسام', icon: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z' },
  { href: '/admin/orders', label: 'الطلبات', icon: 'M6 6h12l1 14H5zM9 9V6a3 3 0 0 1 6 0v3' },
  { href: '/admin/inventory', label: 'المخزون', icon: 'M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8' },
  { href: '/admin/settings', label: 'الإعدادات', icon: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4 12h2M18 12h2M12 4v2M12 18v2' },
  { href: '/admin/pixel', label: 'CAPI و Pixel', icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18' },
] as const;

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

/** القائمة الجانبية للداشبورد (ديسكتوب) + شريط تنقل للموبايل */
export default function AdminSidebar({ adminEmail }: { adminEmail: string }) {
  const pathname = usePathname();

  return (
    <>
      {/* موبايل */}
      <nav aria-label="تنقل الداشبورد" className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
              isActive(pathname, item.href)
                ? 'bg-bosla-gold text-bosla-black'
                : 'border border-bosla-silver/20 text-bosla-silver/80'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* ديسكتوب */}
      <aside className="sticky top-32 hidden h-fit w-64 shrink-0 flex-col gap-6 rounded-2xl border border-bosla-silver/10 bg-bosla-charcoal/60 p-6 lg:flex">
        <div className="flex flex-col items-start gap-2">
          <Logo variant="primary" />
          <p className="text-xs text-bosla-silver/50">لوحة إدارة المتجر</p>
        </div>

        <nav aria-label="القائمة الرئيسية للداشبورد" className="flex flex-col gap-1">
          {items.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors duration-300 ${
                  active
                    ? 'bg-bosla-gold/15 text-bosla-gold'
                    : 'text-bosla-silver/80 hover:bg-bosla-graphite hover:text-bosla-white'
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={item.icon} />
                </svg>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-4 border-t border-bosla-silver/10 pt-6">
          <Link href="/" className="flex items-center gap-3 text-sm text-bosla-silver/70 transition-colors hover:text-bosla-gold">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
            </svg>
            زيارة المتجر
          </Link>

          <div className="flex items-center gap-3 rounded-xl bg-bosla-black/40 p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bosla-gold/15 text-xs font-medium text-bosla-gold" aria-hidden="true">
              BS
            </span>
            <div className="min-w-0">
              <p className="text-sm text-bosla-white">إدارة بوصلة</p>
              <p className="truncate text-xs text-bosla-silver/50" dir="ltr">{adminEmail}</p>
            </div>
          </div>

          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
