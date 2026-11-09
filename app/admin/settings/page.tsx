import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import StoreSettingsForm from '@/components/admin/StoreSettingsForm';
import ResetDataButton from '@/components/admin/ResetDataButton';
import { ADMIN_COOKIE, isValidAdminToken } from '@/lib/admin-auth';
import { getStoreSettings } from '@/lib/store-settings';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminSettingsPage() {
  const cookieStore = await cookies();
  if (!isValidAdminToken(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect('/admin/login');
  }

  const settings = await getStoreSettings();

  return (
    <section className="flex flex-col gap-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-bosla-white">الإعدادات</h1>
        <p className="mt-2 text-sm text-bosla-silver/60">الشحن والدفع والسياسات — بتتحفظ في قاعدة البيانات وتظهر في الموقع فوراً</p>
      </header>
      <StoreSettingsForm
        initial={{
          shippingOther: settings.shippingOther,
          shippingCairoGiza: settings.shippingCairoGiza,
          freeShippingFrom: settings.freeShippingFrom,
          codEnabled: settings.codEnabled,
          policies: settings.policies,
          policiesEn: settings.policiesEn,
        }}
      />
    <ResetDataButton />
    </section>
  );
}
