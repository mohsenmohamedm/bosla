'use client';

import { useLang } from '@/lib/lang';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/lib/cart';
import { trackEvent } from '@/lib/track-client';
import type { Product } from '@/lib/types';

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

/** زرار إضافة للسلة مع تأكيد مؤقت وتسجيل الحدث في الإحصائيات */
export default function AddToCartButton({ product, className = '' }: AddToCartButtonProps) {
  const { t } = useLang();
  const { addItem } = useCart();
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

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={`rounded-full bg-bosla-gold px-10 py-4 text-sm font-medium text-bosla-black transition-all duration-500 ease-smooth hover:-translate-y-0.5 hover:bg-bosla-white hover:shadow-glow ${className}`}
    >
      {added ? t('تمت الإضافة للسلة ✓', 'Added to cart ✓') : t('أضف للسلة', 'Add to cart')}
    </button>
  );
}
