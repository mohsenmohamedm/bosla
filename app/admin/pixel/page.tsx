import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PixelSettingsForm from '@/components/admin/PixelSettingsForm';
import { ADMIN_COOKIE, isValidAdminToken } from '@/lib/admin-auth';
import { getPixelSettings } from '@/lib/pixel';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminPixelPage() {
  const cookieStore = await cookies();
  if (!isValidAdminToken(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect('/admin/login');
  }

  const settings = await getPixelSettings();

  return (
    <section className="flex flex-col gap-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-bosla-white">Meta Pixel و CAPI</h1>
        <p className="mt-2 text-sm text-bosla-silver/60">
          بيتابع الزوار وبيبعت حدث الشراء لـ Meta عند كل طلب جديد.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <div className="flex flex-col gap-4 rounded-2xl border border-bosla-silver/10 bg-bosla-charcoal/60 p-6 md:p-8">
        <h2 className="font-display text-xl text-bosla-white">إرسال مباشر إلى Meta</h2>
        <p className="text-sm text-bosla-silver/80">الأحداث بتتبعت مرة واحدة في الخلفية من غير ما تتحفظ في قاعدة البيانات أو المتصفح.</p>
        <p className="text-xs leading-6 text-bosla-silver/50">
          مفيش طابور إعادة إرسال. لو فشل الاتصال، الحدث مابيتعادش تلقائياً. راجع وصول الأحداث من Test Events داخل Meta.
        </p>
        <a href="https://business.facebook.com/events_manager2" target="_blank" rel="noopener noreferrer" className="w-fit text-sm text-bosla-gold hover:underline">
          افتح Meta Test Events
        </a>
      </div>
      <PixelSettingsForm
        initial={{
          pixelId: settings.pixelId,
          testPixelId: settings.testPixelId,
          testEventCode: settings.testEventCode,
          enabled: settings.enabled,
          hasToken: settings.accessToken.length > 0,
        }}
      />
      </div>
    </section>
  );
}
