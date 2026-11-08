import ProductCard from './ProductCard';
import Reveal from './Reveal';
import type { Product } from '@/lib/types';

interface ProductGridProps {
  products: Product[];
}

/**
 * قسم "منتجات مختارة" — عنوان generic، ومنتجات من كل الأقسام المتاحة.
 */
export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <section
      id="products"
      className="scroll-mt-24 border-y border-bosla-silver/5 bg-bosla-charcoal/40"
    >
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <Reveal className="mb-14 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm tracking-wide text-bosla-gold">اختيارات بعناية</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-bosla-white md:text-4xl">
              منتجات مختارة
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-bosla-silver/70">
            قطع نرشحها بعناية، لأننا نؤمن إن الاختيار الصح يبدأ من التفاصيل.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-8 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
