import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';
import { formatPrice } from '@/lib/store';
import { getCategoryById } from '@/lib/data';
import { getProductById } from '@/lib/products-db';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: 'منتج غير موجود' };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const category = getCategoryById(product.categoryId);

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-36 md:px-8">
      <nav aria-label="مسار الصفحة" className="mb-10 flex flex-wrap gap-2 text-sm text-bosla-silver/60">
        <Link href="/" className="hover:text-bosla-gold">الرئيسية</Link>
        {category && (
          <>
            <span>/</span>
            <Link href={`/category/${category.slug}`} className="hover:text-bosla-gold">
              {category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-bosla-silver">{product.name}</span>
      </nav>

      <div className="grid gap-12 md:grid-cols-2 md:items-start">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-bosla-graphite ring-1 ring-bosla-silver/10">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          {product.badge && (
            <span className="absolute right-4 top-4 rounded-full bg-bosla-black/70 px-3 py-1 text-xs text-bosla-gold backdrop-blur">
              {product.badge}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-6 md:pt-6">
          <h1 className="font-display text-3xl font-semibold text-bosla-white md:text-4xl">
            {product.name}
          </h1>
          <p className="text-2xl font-medium text-bosla-gold">
            {formatPrice(product.price)}
          </p>
          <p className="leading-relaxed text-bosla-silver/75">{product.description}</p>

          <div className="mt-4 flex flex-col gap-4 border-t border-bosla-silver/10 pt-8 text-sm text-bosla-silver/70">
            <p>الشحن لكل المحافظات بسعر موحد، والدفع عند الاستلام.</p>
          </div>

          <AddToCartButton product={product} className="w-full md:w-auto" />
        </div>
      </div>
    </main>
  );
}
