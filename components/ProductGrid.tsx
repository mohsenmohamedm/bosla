import ProductCard from './ProductCard';
import Reveal from './Reveal';
import type { Product } from '@/lib/types';

interface ProductGridProps {
  products: Product[];
}

/**
 * قسم "منتجات مختارة": عمودين على الموبايل، و3 و4 على الشاشات الأكبر.
 */
export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <section id="products" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-12 md:px-8 md:pb-24">
      <Reveal className="mb-6 md:mb-12">
        <p className="text-sm tracking-wide text-bosla-gold">اختيارات بعناية</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-bosla-white md:mt-3 md:text-[34px]">منتجات مختارة</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-bosla-silver md:text-base">
          قطع نرشحها بعناية، لأننا نؤمن إن الاختيار الصح يبدأ من التفاصيل.
        </p>
      </Reveal>

      <div className="grid grid-cols-2 gap-3 md:gap-6 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
