import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import Categories from '@/components/Categories';
import ProductGrid from '@/components/ProductGrid';
import WhyUs from '@/components/WhyUs';
import Reviews from '@/components/Reviews';
import Contact from '@/components/Contact';
import { getCategories, heroContent, whyUsItems } from '@/lib/data';
import { getFeaturedProducts } from '@/lib/products-db';

// الصفحة بتقرأ المنتجات من قاعدة البيانات، فبتتحدث مع كل زيارة
export const dynamic = 'force-dynamic';

/**
 * الصفحة الرئيسية — Server Component.
 * الترتيب: هيرو ← ضمانات ← أقسام ← منتجات ← لماذا بوصلة ← آراء ← تواصل.
 */
export default async function HomePage() {
  const categories = getCategories();
  const featuredProducts = await getFeaturedProducts(8);

  return (
    <main>
      <Hero content={heroContent} />
      <TrustBar />
      <Categories categories={categories} />
      <ProductGrid products={featuredProducts} />
      <WhyUs items={whyUsItems} />
      <Reviews />
      <Contact />
    </main>
  );
}
