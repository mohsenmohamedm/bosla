import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/lib/types';

interface CategoryCardProps {
  category: Category;
  /** لما يكون الكارت الوحيد في الشبكة، بيتعرض عريض */
  wide?: boolean;
}

/**
 * كارت قسم. Server Component — الحركة بـ CSS transitions عشان يفضل خفيف.
 * حالياً الرابط بيروح لـ #products؛ لما تعمل صفحات أقسام، غيّره لـ /category/[slug].
 */
export default function CategoryCard({ category, wide = false }: CategoryCardProps) {
  return (
    <Link
      href="#products"
      aria-label={`تصفح قسم ${category.name}`}
      className={`group relative block overflow-hidden rounded-3xl border border-bosla-silver/10 bg-bosla-graphite transition-all duration-500 ease-smooth hover:border-bosla-gold/60 hover:shadow-glow ${
        wide ? 'aspect-[16/9]' : 'aspect-[4/5]'
      }`}
    >
      <Image
        src={category.image}
        alt={category.imageAlt}
        fill
        sizes={wide ? '(min-width: 1024px) 56rem, 100vw' : '(min-width: 768px) 50vw, 100vw'}
        className="object-cover opacity-80 transition-transform duration-700 ease-smooth group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-bosla-black via-bosla-black/40 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <h3 className="font-display text-2xl font-semibold text-bosla-white md:text-3xl">
          {category.name}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-bosla-silver/80">
          {category.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm text-bosla-gold transition-all duration-500 ease-smooth group-hover:gap-3">
          استكشف القسم ←
        </span>
      </div>
    </Link>
  );
}
