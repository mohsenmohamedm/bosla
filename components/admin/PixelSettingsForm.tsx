'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

interface PixelSettingsFormProps {
  initial: {
    pixelId: string;
    testPixelId: string;
    testEventCode: string;
    enabled: boolean;
    hasToken: boolean;
  };
}

const inputClass =
  'w-full rounded-xl border border-bosla-silver/15 bg-bosla-black px-4 py-3 text-sm text-bosla-white placeholder:text-bosla-silver/30 focus:border-bosla-gold focus:outline-none';

/** فورم إعدادات Meta Pixel و Conversions API */
export default function PixelSettingsForm({ initial }: PixelSettingsFormProps) {
  const router = useRouter();
  const [pixelId, setPixelId] = useState(initial.pixelId);
  const [testPixelId, setTestPixelId] = useState(initial.testPixelId);
  const [testEventCode, setTestEventCode] = useState(initial.testEventCode);
  const [accessToken, setAccessToken] = useState('');
  const [enabled, setEnabled] = useState(initial.enabled);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const response = await fetch('/api/admin/pixel', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pixelId,
        testPixelId,
        testEventCode,
        accessToken,
        enabled,
        hasToken: initial.hasToken,
      }),
    });

    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (response.ok) {
      setAccessToken('');
      setMessage({ type: 'ok', text: 'اتحفظت الإعدادات' });
      router.refresh();
    } else {
      setMessage({ type: 'error', text: data.error ?? 'حصلت مشكلة، حاول تاني' });
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-2xl border border-bosla-silver/10 bg-bosla-charcoal/60 p-6 md:p-8">
      <div className="flex flex-col gap-2">
        <label htmlFor="trackingMode" className="text-sm text-bosla-silver/80">وضع التتبع</label>
        <select
          id="trackingMode"
          value={enabled ? 'live' : 'off'}
          onChange={(e) => setEnabled(e.target.value === 'live')}
          className={inputClass}
        >
          <option value="live">تلقائي من أول زيارة</option>
          <option value="off">متوقف</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="pixelId" className="text-sm text-bosla-silver/80">رقم الـ Pixel (Pixel ID)</label>
        <input id="pixelId" dir="ltr" inputMode="numeric" value={pixelId} onChange={(e) => setPixelId(e.target.value)} className={inputClass} placeholder="123456789012345" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="testPixelId" className="text-sm text-bosla-silver/80">Pixel اختبار منفصل — اختياري</label>
        <input id="testPixelId" dir="ltr" inputMode="numeric" value={testPixelId} onChange={(e) => setTestPixelId(e.target.value)} className={inputClass} placeholder="سيبه فاضي في الإنتاج" />
        <span className="text-xs text-bosla-silver/40">لو اتملى، الموقع والـ CAPI بيبعتوا على الـ Pixel ده بدل الإنتاجي. امسحه بعد الاختبار عشان الطلبات الحقيقية ترجع للإنتاجي.</span>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="accessToken" className="text-sm text-bosla-silver/80">توكن الـ Conversions API</label>
        <input
          id="accessToken"
          type="password"
          dir="ltr"
          autoComplete="off"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          className={inputClass}
          placeholder={initial.hasToken ? 'محفوظ — سيبه فاضي لو مش عايز تغيّره' : 'الصق التوكن هنا'}
        />
        <span className="text-xs text-bosla-silver/40">بيتخزن على السيرفر، ومش بيتعرض تاني بعد الحفظ.</span>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="testEventCode" className="text-sm text-bosla-silver/80">كود الاختبار (اختياري)</label>
        <input id="testEventCode" dir="ltr" value={testEventCode} onChange={(e) => setTestEventCode(e.target.value)} className={inputClass} placeholder="TEST12345" />
        <span className="text-xs text-bosla-silver/40">سيبه فاضي في الإنتاج. لو فيه كود، الأحداث بتظهر في Test Events بس.</span>
      </div>

      {message && (
        <p className={`text-xs ${message.type === 'ok' ? 'text-emerald-300' : 'text-red-400'}`}>{message.text}</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-fit rounded-full bg-bosla-gold px-8 py-3 text-sm font-medium text-bosla-black transition-colors hover:bg-bosla-white disabled:opacity-60"
      >
        {saving ? 'بنحفظ...' : 'حفظ الإعدادات'}
      </button>
    </form>
  );
}
