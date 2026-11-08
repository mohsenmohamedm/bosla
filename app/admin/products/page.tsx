import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import LogoutButton from '@/components/admin/LogoutButton';
import { DeleteProductButton, ImportSampleButton } from '@/components/admin/ProductActions';
import { isAdminSession } from '@/lib/admin-session';
import { getCategoryById } from '@/lib/data';
import { getAllProducts } from '@/lib/products-db';
import { formatPrice } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminProductsPage() {
  if (!(await isAdminSession())) redirect('/admin/login');

  const products = await getAllProducts();

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-36 md:px-8">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-bosla-white">المنتجات</h1>
          <p className="mt-2 text-sm text-bosla-silver/60">{products.length} منتج</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <AdminNav active="products" />
          <Link
            href="/admin/products/new"
            className="rounded-full bg-bosla-gold px-5 py-2 text-sm font-medium text-bosla-black transition-colors hover:bg-bosla-white"
          >
            + منتج جديد
          </Link>
          <LogoutButton />
        </div>
      </header>

      {products.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-bosla-silver/10 bg-bosla-charcoal/60 p-8">
          <p className="text-bosla-silver/70">لسه مفيش منتجات في المتجر.</p>
          <ImportSampleButton />
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {products.map((product) => {
            const category = getCategoryById(product.categoryId);
            return (
              <li
                key={product.id}
                className="flex flex-wrap items-center gap-5 rounded-2xl border border-bosla-silver/10 bg-bosla-charcoal/60 p-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-bosla-graphite">
                  <Image src={product.image} alt={product.imageAlt} fill sizes="80px" className="object-cover" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-bosla-white">{product.name}</p>
                  <p className="mt-1 text-xs text-bosla-silver/50">
                    {category?.name ?? 'بدون قسم'}
                    {product.featured && ' · مميز'}
                    {product.badge && ` · ${product.badge}`}
                  </p>
                </div>

                <p className="text-bosla-gold">{formatPrice(product.price)}</p>

                <div className="flex gap-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="rounded-full border border-bosla-silver/20 px-4 py-2 text-xs text-bosla-silver/80 transition-colors hover:border-bosla-gold hover:text-bosla-gold"
                  >
                    تعديل
                  </Link>
                  <DeleteProductButton productId={product.id} productName={product.name} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
