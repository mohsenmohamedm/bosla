'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { GOVERNORATES } from '@/lib/store';
import { ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from '@/lib/orders';

interface OrderEditFormProps {
  orderNumber: string;
  initial: {
    status: OrderStatus;
    name: string;
    phone: string;
    governorate: string;
    address: string;
    notes: string;
  };
}

const inputClass =
  'w-full rounded-xl border border-bosla-silver/15 bg-bosla-black px-4 py-2.5 text-sm text-bosla-white focus:border-bosla-gold focus:outline-none';

/** تعديل بيانات العميل والحالة من صفحة تفاصيل الطلب */
export default function OrderEditForm({ orderNumber, initial }: OrderEditFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const response = await fetch(`/api/admin/orders/${encodeURIComponent(orderNumber)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: form.status,
        customer: {
          name: form.name,
          phone: form.phone,
          governorate: form.governorate,
          address: form.address,
          notes: form.notes,
        },
      }),
    });

    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (response.ok) {
      setMessage({ type: 'ok', text: 'اتحفظت التعديلات' });
      router.refresh();
    } else {
      setMessage({ type: 'error', text: data.error ?? 'حصلت مشكلة، حاول تاني' });
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border border-bosla-gold/20 bg-bosla-charcoal/60 p-6">
      <h2 className="font-display text-lg text-bosla-white">تعديل الطلب</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className="mb-2 block text-xs text-bosla-silver/60">حالة الطلب</label>
          <select id="status" className={inputClass} value={form.status} onChange={(e) => update('status', e.target.value)}>
            {ORDER_STATUSES.map((value) => (
              <option key={value} value={value}>{ORDER_STATUS_LABELS[value]}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="governorate" className="mb-2 block text-xs text-bosla-silver/60">المحافظة</label>
          <select id="governorate" className={inputClass} value={form.governorate} onChange={(e) => update('governorate', e.target.value)}>
            {GOVERNORATES.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="name" className="mb-2 block text-xs text-bosla-silver/60">الاسم</label>
          <input id="name" className={inputClass} value={form.name} onChange={(e) => update('name', e.target.value)} required />
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-xs text-bosla-silver/60">الموبايل</label>
          <input id="phone" dir="ltr" className={inputClass} value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="address" className="mb-2 block text-xs text-bosla-silver/60">العنوان</label>
          <textarea id="address" rows={2} className={inputClass} value={form.address} onChange={(e) => update('address', e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="notes" className="mb-2 block text-xs text-bosla-silver/60">ملاحظات</label>
          <textarea id="notes" rows={2} className={inputClass} value={form.notes} onChange={(e) => update('notes', e.target.value)} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-bosla-gold px-7 py-2.5 text-sm font-medium text-bosla-black transition-colors hover:bg-bosla-white disabled:opacity-60"
        >
          {saving ? 'بنحفظ...' : 'حفظ التعديلات'}
        </button>
        {message && (
          <p className={`text-xs ${message.type === 'ok' ? 'text-emerald-300' : 'text-red-400'}`}>{message.text}</p>
        )}
      </div>
    </form>
  );
}
