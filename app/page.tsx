import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import ProductGrid from '@/components/ProductGrid';
import WhyUs from '@/components/WhyUs';
import { getCategories, heroContent, whyUsItems } from '@/lib/data';
import { getFeaturedProducts } from '@/lib/products-db';

// الصفحة بتقرأ المنتجات من قاعدة البيانات، فبتتحدث مع كل زيارة
export const dynamic = 'force-dynamic';

/**
 * الصفحة الرئيسية — Server Component.
 * الأقسام من lib/data.ts، والمنتجات من قاعدة البيانات (بيتضيفوا من الداشبورد).
 */
export default async function HomePage() {
  const categories = getCategories();
  const featuredProducts = await getFeaturedProducts(8);

  return (
    <main>
      <Hero content={heroContent} />
      <Categories categories={categories} />
      <ProductGrid products={featuredProducts} />
      <WhyUs items={whyUsItems} />
    </main>
  );
}
