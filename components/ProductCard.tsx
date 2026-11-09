'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/cart';
import { trackEvent } from '@/lib/track-client';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

/**
 * كارت منتج: صورة مربعة، شارة ذهبية، الاسم والوصف، السعر، وصف الزراير
 * "أضف للسلة" و"شراء الآن" بنفس العرض والارتفاع.
 */
export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const handleAdd = () => {
    addItem(product);
    trackEvent('add_to_cart', { productId: product.id });
    setAdded(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setAdded(false), 1600);
  };

  const handleBuyNow = () => {
    addItem(product);
    trackEvent('add_to_cart', { productId: product.id });
    router.push('/checkout');
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-bosla-gold/10 bg-bosla-charcoal shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <Link href={`/products/${product.id}`} aria-label={product.name} className="relative aspect-square overflow-hidden bg-bosla-graphite">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {product.badge && (
          <span className="absolute start-3 top-3 rounded-full bg-bosla-sun px-2.5 py-1 text-xs font-bold text-bosla-gold-deep">
            {product.badge}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3 md:p-4">
        <h3 className="line-clamp-2 text-sm font-bold text-bosla-white md:text-lg">
          <Link href={`/products/${product.id}`} className="transition-colors duration-300 hover:text-bosla-gold">
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-1 text-xs text-bosla-silver md:text-sm">{product.description}</p>
        <p className="mt-auto pt-1 text-base font-bold text-bosla-white md:text-lg">
          {product.price.toLocaleString('ar-EG')} <span className="text-xs font-normal text-bosla-silver">ج.م</span>
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex h-11 flex-1 items-center justify-center rounded-xl border-2 border-bosla-gold text-sm font-bold text-bosla-gold transition-colors duration-300 hover:bg-bosla-gold hover:text-white"
          >
            شراء الآن
          </button>
          <button
            type="button"
            onClick={handleAdd}
            aria-live="polite"
            className="flex h-11 flex-1 items-center justify-center rounded-xl bg-bosla-gold text-sm font-bold text-white transition-all duration-300 hover:bg-bosla-gold-deep"
          >
            {added ? 'تمت الإضافة ✓' : 'أضف للسلة'}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
