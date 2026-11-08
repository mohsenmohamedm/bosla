'use client';

import Image from 'next/image';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import { useCart } from '@/lib/cart';
import { STORE, calculateTotals, formatPrice } from '@/lib/store';

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCart();
  const { subtotal, shipping, total } = calculateTotals(items);

  if (items.length === 0) {
    return (
      <PageShell title="السلة" subtitle="السلة فاضية دلوقتي.">
        <div className="text-center">
          <Link
            href="/#products"
            className="inline-block rounded-full bg-bosla-gold px-8 py-3.5 text-sm font-medium text-bosla-black transition-all duration-500 ease-smooth hover:-translate-y-0.5 hover:shadow-glow"
          >
            تصفح المنتجات
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="السلة" subtitle={`${items.length} منتج في السلة`}>
      <div className="flex flex-col gap-6">
        {items.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="flex gap-5 rounded-2xl border border-bosla-silver/10 bg-bosla-charcoal/60 p-4 md:p-5"
          >
            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-bosla-graphite md:h-28 md:w-24">
              <Image src={product.image} alt={product.imageAlt} fill sizes="96px" className="object-cover" />
            </div>

            <div className="flex flex-1 flex-col justify-between gap-3">
              <div className="flex items-start justify-between gap-3">
                <Link href={`/products/${product.id}`} className="font-display text-base text-bosla-white hover:text-bosla-gold">
                  {product.name}
                </Link>
                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  className="text-xs text-bosla-silver/50 transition-colors duration-300 hover:text-red-400"
                >
                  إزالة
                </button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 rounded-full border border-bosla-silver/15 px-2 py-1">
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    aria-label="تقليل الكمية"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-bosla-silver transition-colors duration-300 hover:text-bosla-gold"
                  >
                    −
                  </button>
                  <span className="min-w-[1.5rem] text-center text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    aria-label="زيادة الكمية"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-bosla-silver transition-colors duration-300 hover:text-bosla-gold"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm font-medium text-bosla-gold">
                  {formatPrice(product.price * quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-bosla-gold/20 bg-bosla-charcoal/60 p-6 md:p-8">
        <div className="flex justify-between text-sm text-bosla-silver/80">
          <span>المجموع</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="mt-3 flex justify-between text-sm text-bosla-silver/80">
          <span>الشحن (لكل المحافظات)</span>
          <span>{formatPrice(shipping)}</span>
        </div>
        <div className="mt-5 flex justify-between border-t border-bosla-silver/10 pt-5 font-display text-lg text-bosla-white">
          <span>الإجمالي</span>
          <span className="text-bosla-gold">{formatPrice(total)}</span>
        </div>
        <p className="mt-4 text-xs text-bosla-silver/50">{STORE.paymentMethod}</p>

        <Link
          href="/checkout"
          className="mt-6 block rounded-full bg-gradient-to-l from-bosla-gold to-bosla-gold-deep py-3.5 text-center text-sm font-medium text-bosla-black transition-all duration-500 ease-smooth hover:-translate-y-0.5 hover:shadow-glow"
        >
          إتمام الطلب
        </Link>
      </div>
    </PageShell>
  );
}
