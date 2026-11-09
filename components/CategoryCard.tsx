'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/lib/types';
import { useLang } from '@/lib/lang';

interface CategoryCardProps {
  category: Category;
  /** لما يكون الكارت الوحيد، بيتعرض عريض */
  wide?: boolean;
}

/**
 * كارت قسم (ديسكتوب): صورة فوق، والاسم تحت بسهم.
 */
export default function CategoryCard({ category, wide = false }: CategoryCardProps) {
  const { isAr, t, cf } = useLang();
  const name = cf(category, 'name');
  return (
    <Link
      href={`/category/${category.slug}`}
      aria-label={`${t('تصفح قسم', 'Browse')} ${name}`}
      className="group block overflow-hidden rounded-2xl border border-bosla-gold/10 bg-bosla-charcoal shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div className={`relative overflow-hidden bg-bosla-graphite ${wide ? 'aspect-[16/7]' : 'aspect-[4/3]'}`}>
        <Image
          src={category.image}
          alt={cf(category, 'imageAlt')}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex items-center justify-between gap-3 p-4 md:p-5">
        <h3 className="text-base font-bold text-bosla-white md:text-lg">{name}</h3>
        <span className="text-bosla-gold transition-transform duration-300 group-hover:rtl:-translate-x-1 group-hover:ltr:translate-x-1" aria-hidden="true">{isAr ? '←' : '→'}</span>
      </div>
    </Link>
  );
}
