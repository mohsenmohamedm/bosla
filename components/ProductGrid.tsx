import { T } from '@/lib/lang';
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
        <p className="text-sm tracking-wide text-bosla-gold"><T ar="اختيارات بعناية" en="Hand-picked" /></p>
        <h2 className="mt-2 font-display text-2xl font-bold text-bosla-white md:mt-3 md:text-[34px]"><T ar="منتجات مختارة" en="Featured Products" /></h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-bosla-silver md:text-base">
          <T ar="قطع نرشحها بعناية، لأننا نؤمن إن الاختيار الصح يبدأ من التفاصيل." en="Pieces we recommend with care, because we believe the right choice starts with the details." />
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
