import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/lib/types';

interface CategoryCardProps {
  category: Category;
  /** لما يكون الكارت الوحيد، بيتعرض عريض */
  wide?: boolean;
}

/**
 * كارت قسم (ديسكتوب): صورة فوق، والاسم تحت بسهم.
 */
export default function CategoryCard({ category, wide = false }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      aria-label={`تصفح قسم ${category.name}`}
      className="group block overflow-hidden rounded-2xl border border-bosla-gold/10 bg-bosla-charcoal shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div className={`relative overflow-hidden bg-bosla-graphite ${wide ? 'aspect-[16/7]' : 'aspect-[4/3]'}`}>
        <Image
          src={category.image}
          alt={category.imageAlt}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex items-center justify-between gap-3 p-4 md:p-5">
        <h3 className="text-base font-bold text-bosla-white md:text-lg">{category.name}</h3>
        <span className="text-bosla-gold transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true">←</span>
      </div>
    </Link>
  );
}
