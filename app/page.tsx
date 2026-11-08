import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import ProductGrid from '@/components/ProductGrid';
import WhyUs from '@/components/WhyUs';
import {
  getCategories,
  getFeaturedProducts,
  heroContent,
  whyUsItems,
} from '@/lib/data';

/**
 * الصفحة الرئيسية — Server Component.
 * كل المحتوى جاي من lib/data.ts، فمفيش داعي تعدّل الصفحة عشان تضيف قسم أو منتج.
 */
export default function HomePage() {
  const categories = getCategories();
  const featuredProducts = getFeaturedProducts(8);

  return (
    <main>
      <Hero content={heroContent} />
      <Categories categories={categories} />
      <ProductGrid products={featuredProducts} />
      <WhyUs items={whyUsItems} />
    </main>
  );
}
