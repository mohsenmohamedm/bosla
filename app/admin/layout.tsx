import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { ADMIN_COOKIE, isValidAdminToken } from '@/lib/admin-auth';
import { getStoreSettings } from '@/lib/store-settings';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

/**
 * تخطيط الداشبورد: القائمة الجانبية والشريط العلوي يظهروا بس لو الأدمن مسجل دخول.
 * صفحة الدخول بتتعرض من غير أي حاجة من دول.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const isAuthed = isValidAdminToken(cookieStore.get(ADMIN_COOKIE)?.value);

  if (!isAuthed) {
    return <>{children}</>;
  }

  const store = await getStoreSettings();

  return (
    <div className="mx-auto flex max-w-[1500px] flex-col gap-6 px-4 pb-24 pt-8 md:px-8 lg:flex-row lg:items-start lg:gap-8">
      <AdminSidebar adminEmail={process.env.ADMIN_EMAIL ?? ''} />
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <AdminTopBar initialOpen={store.acceptingOrders} />
        {children}
      </div>
    </div>
  );
}
