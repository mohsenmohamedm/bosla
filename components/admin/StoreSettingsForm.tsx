'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

interface StoreSettingsFormProps {
  initial: {
    shippingOther: number;
    shippingCairoGiza: number;
    freeShippingFrom: number;
    codEnabled: boolean;
    policies: { shipping: string; returns: string; privacy: string };
    policiesEn: { shipping: string; returns: string; privacy: string };
  };
}

const inputClass =
  'w-full rounded-xl border border-bosla-silver/15 bg-bosla-black px-4 py-3 text-sm text-bosla-white placeholder:text-bosla-silver/30 focus:border-bosla-gold focus:outline-none';

const POLICY_SECTIONS = [
  { key: 'shipping', label: 'الشحن والتوصيل' },
  { key: 'returns', label: 'الاستبدال والاسترجاع' },
  { key: 'privacy', label: 'الخصوصية' },
] as const;

/** فورم إعدادات المتجر: الشحن، الدفع، والسياسات بالعربي والإنجليزي */
export default function StoreSettingsForm({ initial }: StoreSettingsFormProps) {
  const router = useRouter();
  const [shippingOther, setShippingOther] = useState(String(initial.shippingOther));
  const [shippingCairoGiza, setShippingCairoGiza] = useState(String(initial.shippingCairoGiza));
  const [freeShippingFrom, setFreeShippingFrom] = useState(String(initial.freeShippingFrom));
  const [codEnabled, setCodEnabled] = useState(initial.codEnabled);
  const [policies, setPolicies] = useState(initial.policies);
  const [policiesEn, setPoliciesEn] = useState(initial.policiesEn);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const response = await fetch('/api/admin/store-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shippingOther,
        shippingCairoGiza,
        freeShippingFrom,
        codEnabled,
        policies,
        policiesEn,
      }),
    });

    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (response.ok) {
      setMessage({ type: 'ok', text: 'اتحفظت الإعدادات' });
      router.refresh();
    } else {
      setMessage({ type: 'error', text: data.error ?? 'حصلت مشكلة، حاول تاني' });
    }
    setSaving(false);
  };

  const panel = 'flex flex-col gap-5 rounded-2xl border border-bosla-silver/10 bg-bosla-charcoal/60 p-6 md:p-8';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className={panel}>
          <h2 className="font-display text-xl text-bosla-white">الشحن والدفع</h2>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-bosla-silver/80">الشحن لباقي المحافظات (جنيه)</span>
            <input type="number" min={0} inputMode="numeric" dir="ltr" value={shippingOther} onChange={(e) => setShippingOther(e.target.value)} className={inputClass} />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-bosla-silver/80">الشحن للقاهرة والجيزة (جنيه)</span>
            <input type="number" min={0} inputMode="numeric" dir="ltr" value={shippingCairoGiza} onChange={(e) => setShippingCairoGiza(e.target.value)} className={inputClass} />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-bosla-silver/80">شحن مجاني بداية من (اختياري، 0 = مفيش)</span>
            <input type="number" min={0} inputMode="numeric" dir="ltr" value={freeShippingFrom} onChange={(e) => setFreeShippingFrom(e.target.value)} className={inputClass} />
          </label>

          <label className="flex items-center justify-between gap-4 rounded-xl border border-bosla-silver/10 bg-bosla-black px-5 py-4">
            <span className="text-sm text-bosla-white">تفعيل الدفع عند الاستلام</span>
            <input type="checkbox" checked={codEnabled} onChange={(e) => setCodEnabled(e.target.checked)} className="h-5 w-5 accent-bosla-gold" />
          </label>
        </div>

        <div className={panel}>
          <h2 className="font-display text-xl text-bosla-white">بيانات ثابتة</h2>
          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-bosla-silver/60">العملة</dt><dd className="text-bosla-white">جنيه مصري — EGP</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-bosla-silver/60">لغة المتجر</dt><dd className="text-bosla-white">العربية</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-bosla-silver/60">المتجر</dt><dd className="text-bosla-white" dir="ltr">bosla-store.shop</dd></div>
          </dl>
          <p className="text-xs leading-6 text-bosla-silver/50">
            الشحن المجاني بيتطبق لما إجمالي المنتجات يوصل للحد اللي تحدده. الشحن بيتحسب حسب المحافظة وقت الطلب.
          </p>
        </div>
      </div>

      <div className={panel}>
        <h2 className="font-display text-xl text-bosla-white">السياسات</h2>
        {POLICY_SECTIONS.map((section) => (
          <div key={section.key} className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm text-bosla-silver/80">{section.label} — English</span>
              <textarea
                dir="ltr"
                rows={5}
                value={policiesEn[section.key]}
                onChange={(e) => setPoliciesEn((p) => ({ ...p, [section.key]: e.target.value }))}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm text-bosla-silver/80">{section.label} — العربية</span>
              <textarea
                rows={5}
                value={policies[section.key]}
                onChange={(e) => setPolicies((p) => ({ ...p, [section.key]: e.target.value }))}
                className={inputClass}
              />
            </label>
          </div>
        ))}
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
