'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/cart';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

const formatPrice = (price: number, currency: Product['currency']) =>
  `${price.toLocaleString('ar-EG')} ${currency === 'EGP' ? 'ج.م' : currency}`;

/**
 * كارت منتج: صورة على خلفية داكنة، الاسم، السعر، وزرار "أضف للسلة"
 * بيظهر عند المرور (وظاهر دايماً على الموبايل لأن مفيش hover).
 */
export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="group flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-bosla-graphite ring-1 ring-bosla-silver/10 transition-shadow duration-500 group-hover:shadow-glow group-hover:ring-bosla-gold/50">
        <Link href={`/products/${product.id}`} aria-label={product.name} className="absolute inset-0">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
          />
        </Link>

        {product.badge && (
          <span className="absolute right-3 top-3 rounded-full bg-bosla-black/70 px-3 py-1 text-xs text-bosla-gold backdrop-blur">
            {product.badge}
          </span>
        )}

        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-0 opacity-100 transition-all duration-500 ease-smooth md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <button
            type="button"
            onClick={handleAdd}
            className="w-full rounded-full bg-bosla-gold py-3 text-sm font-medium text-bosla-black transition-colors duration-300 hover:bg-bosla-white"
          >
            {added ? 'تمت الإضافة ✓' : 'أضف للسلة'}
          </button>
        </div>
      </div>

      <div className="mt-4 px-1">
        <h3 className="font-display text-lg font-medium text-bosla-white">
          <Link href={`/products/${product.id}`} className="transition-colors duration-300 hover:text-bosla-gold">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-bosla-silver/65">
          {product.description}
        </p>
        <p className="mt-2 text-sm font-medium text-bosla-gold">
          {formatPrice(product.price, product.currency)}
        </p>
      </div>
    </motion.article>
  );
}
