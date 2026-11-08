'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import PageShell from '@/components/PageShell';
import { STORE, formatPrice, type OrderSummary } from '@/lib/store';

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem('bosla:lastOrder');
      if (raw) setOrder(JSON.parse(raw) as OrderSummary);
    } catch {
      // بيانات تالفة
    }
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (!order) {
    return (
      <PageShell title="طلبك" subtitle="مفيش طلب حديث لعرضه.">
        <div className="text-center">
          <Link href="/" className="text-bosla-gold hover:underline">الرجوع للرئيسية</Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="شكراً لطلبك"
      subtitle={`رقم الطلب: ${order.id}. طلبك اتسجل بنجاح.`}
    >
      <div className="rounded-2xl border border-bosla-gold/20 bg-bosla-charcoal/60 p-6 md:p-8">
        <h2 className="font-display text-lg text-bosla-white">تفاصيل الطلب</h2>
        <ul className="mt-5 flex flex-col gap-3 text-sm text-bosla-silver/80">
          {order.items.map(({ product, quantity }) => (
            <li key={product.id} className="flex justify-between gap-3">
              <span>{product.name} × {quantity}</span>
              <span>{formatPrice(product.price * quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 space-y-3 border-t border-bosla-silver/10 pt-5 text-sm text-bosla-silver/80">
          <div className="flex justify-between"><span>المجموع</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between"><span>الشحن</span><span>{formatPrice(order.shipping)}</span></div>
          <div className="flex justify-between border-t border-bosla-silver/10 pt-3 font-display text-base text-bosla-white">
            <span>الإجمالي</span><span className="text-bosla-gold">{formatPrice(order.total)}</span>
          </div>
        </div>
        <p className="mt-4 text-xs text-bosla-silver/50">{STORE.paymentMethod}</p>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4 text-center">
        <p className="text-sm text-bosla-silver/70">
          احتفظ برقم الطلب. الدفع عند الاستلام.
        </p>
        <Link href="/" className="mt-2 text-sm text-bosla-gold hover:underline">
          الرجوع للرئيسية
        </Link>
      </div>
    </PageShell>
  );
}
