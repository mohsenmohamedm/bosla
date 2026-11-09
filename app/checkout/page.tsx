'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import PageShell from '@/components/PageShell';
import { useStoreConfig } from '@/components/StoreConfigProvider';
import { useCart } from '@/lib/cart';
import {
  GOVERNORATES,
  STORE,
  calculateTotals,
  formatPrice,
  isValidEgyptianPhone,
  type CustomerDetails,
  type OrderSummary,
} from '@/lib/store';

type FormErrors = Partial<Record<keyof CustomerDetails, string>>;

const inputClass =
  'w-full rounded-xl border border-bosla-silver/15 bg-bosla-charcoal px-4 py-3 text-sm text-bosla-white placeholder:text-bosla-silver/40 transition-colors duration-300 focus:border-bosla-gold focus:outline-none';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCart();
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [form, setForm] = useState<CustomerDetails>({
    name: '',
    phone: '',
    governorate: '',
    address: '',
    notes: '',
  });

  const config = useStoreConfig();
  const { subtotal, shipping, total } = calculateTotals(items, config, form.governorate);

  const updateField = (field: keyof CustomerDetails) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (form.name.trim().length < 3) nextErrors.name = 'اكتب الاسم بالكامل';
    if (!isValidEgyptianPhone(form.phone)) nextErrors.phone = 'اكتب رقم موبايل مصري صحيح (11 رقم)';
    if (!form.governorate) nextErrors.governorate = 'اختار المحافظة';
    if (form.address.trim().length < 10) nextErrors.address = 'اكتب العنوان بالتفصيل';
    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (items.length === 0 || submitting) return;
    if (!config.codEnabled) {
      setSubmitError('الدفع عند الاستلام مش متاح حالياً');
      return;
    }

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError('');

    const customer: CustomerDetails = {
      ...form,
      phone: form.phone.replace(/\s|-/g, ''),
      notes: form.notes?.trim() || undefined,
    };

    try {
      // السيرفر بيحسب الأسعار بنفسه ويحفظ الطلب في قاعدة البيانات
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          items: items.map(({ product, quantity }) => ({
            productId: product.id,
            quantity,
          })),
        }),
      });

      const data = (await response.json().catch(() => ({}))) as { id?: string; error?: string };

      if (!response.ok || !data.id) {
        setSubmitError(data.error ?? 'حصلت مشكلة، حاول تاني');
        setSubmitting(false);
        return;
      }

      const order: OrderSummary = {
        id: data.id,
        createdAt: new Date().toISOString(),
        items,
        customer,
        subtotal,
        shipping,
        total,
      };

      // نحفظ الملخص عشان صفحة التأكيد تعرضه، وبعدين نفضّي السلة
      window.sessionStorage.setItem('bosla:lastOrder', JSON.stringify(order));
      router.push('/order-success');
      clear();
    } catch {
      setSubmitError('مفيش اتصال بالإنترنت، جرّب تاني');
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <PageShell title="إتمام الطلب" subtitle="مفيش منتجات في السلة.">
        <div className="text-center">
          <Link href="/#products" className="text-bosla-gold hover:underline">
            تصفح المنتجات
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="إتمام الطلب" subtitle={`${STORE.paymentMethod} — الشحن يبدأ من ${formatPrice(Math.min(config.shippingOther, config.shippingCairoGiza))}`}>
      <form onSubmit={handleSubmit} noValidate className="grid gap-10 md:grid-cols-5">
        <div className="flex flex-col gap-5 md:col-span-3">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm text-bosla-silver">الاسم بالكامل</label>
            <input id="name" className={inputClass} value={form.name} onChange={updateField('name')} autoComplete="name" />
            {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm text-bosla-silver">رقم الموبايل</label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              className={inputClass}
              value={form.phone}
              onChange={updateField('phone')}
              placeholder="01XXXXXXXXX"
              autoComplete="tel"
            />
            {errors.phone && <p className="mt-1.5 text-xs text-red-400">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="governorate" className="mb-2 block text-sm text-bosla-silver">المحافظة</label>
            <select id="governorate" className={inputClass} value={form.governorate} onChange={updateField('governorate')}>
              <option value="">اختار المحافظة</option>
              {GOVERNORATES.map((governorate) => (
                <option key={governorate} value={governorate}>{governorate}</option>
              ))}
            </select>
            {errors.governorate && <p className="mt-1.5 text-xs text-red-400">{errors.governorate}</p>}
          </div>

          <div>
            <label htmlFor="address" className="mb-2 block text-sm text-bosla-silver">العنوان بالتفصيل</label>
            <textarea
              id="address"
              rows={3}
              className={inputClass}
              value={form.address}
              onChange={updateField('address')}
              placeholder="الشارع، رقم العمارة، الدور، علامة مميزة"
            />
            {errors.address && <p className="mt-1.5 text-xs text-red-400">{errors.address}</p>}
          </div>

          <div>
            <label htmlFor="notes" className="mb-2 block text-sm text-bosla-silver">ملاحظات (اختياري)</label>
            <textarea id="notes" rows={2} className={inputClass} value={form.notes} onChange={updateField('notes')} />
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-bosla-gold/20 bg-bosla-charcoal/60 p-6 md:col-span-2">
          <h2 className="font-display text-lg text-bosla-white">ملخص الطلب</h2>
          <ul className="mt-5 flex flex-col gap-3 text-sm text-bosla-silver/80">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex justify-between gap-3">
                <span>{product.name} × {quantity}</span>
                <span>{formatPrice(product.price * quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 space-y-3 border-t border-bosla-silver/10 pt-5 text-sm text-bosla-silver/80">
            <div className="flex justify-between"><span>المجموع</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>الشحن</span><span>{formatPrice(shipping)}</span></div>
            <div className="flex justify-between border-t border-bosla-silver/10 pt-3 font-display text-base text-bosla-white">
              <span>الإجمالي</span><span className="text-bosla-gold">{formatPrice(total)}</span>
            </div>
          </div>

          {submitError && <p className="mt-4 text-xs text-red-400">{submitError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-gradient-to-l from-bosla-gold to-bosla-gold-deep py-3.5 text-sm font-medium text-bosla-black transition-all duration-500 ease-smooth hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60"
          >
            {submitting ? 'جاري تأكيد الطلب…' : 'تأكيد الطلب'}
          </button>
        </aside>
      </form>
    </PageShell>
  );
}
