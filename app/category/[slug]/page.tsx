import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { categories } from '@/lib/data';
import { getProductsByCategory } from '@/lib/products-db';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) return { title: 'قسم غير موجود' };
  return { title: category.name, description: category.description };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const categoryProducts = await getProductsByCategory(category.id);

  return (
    <main className="mx-auto max-w-7xl px-5 pb-24 pt-36 md:px-8">
      <nav aria-label="مسار الصفحة" className="mb-10 flex flex-wrap gap-2 text-sm text-bosla-silver/60">
        <Link href="/" className="hover:text-bosla-gold">الرئيسية</Link>
        <span>/</span>
        <span className="text-bosla-silver">{category.name}</span>
      </nav>

      <header className="mb-14 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold text-bosla-white md:text-5xl">
          {category.name}
        </h1>
        <p className="mt-4 leading-relaxed text-bosla-silver/70">{category.description}</p>
      </header>

      {categoryProducts.length === 0 ? (
        <p className="text-bosla-silver/60">مفيش منتجات في القسم ده دلوقتي.</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-8 xl:grid-cols-4">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
