import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DeleteProductButton, ImportSampleButton } from '@/components/admin/ProductActions';
import ArchiveProductButton from '@/components/admin/ArchiveProductButton';
import { isAdminSession } from '@/lib/admin-session';
import { getCategoryById } from '@/lib/data';
import { getAllProducts } from '@/lib/products-db';
import { formatPrice } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminProductsPage() {
  if (!(await isAdminSession())) redirect('/admin/login');

  const products = await getAllProducts();
  const weekAgo = Date.now() - 14 * 86_400_000;
  const archivedCount = products.filter((p) => p.archived).length;
  const activeCount = products.length - archivedCount;
  const newCount = products.filter((p) => !p.archived && p.createdAt && new Date(p.createdAt).getTime() >= weekAgo).length;

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-bosla-white">المنتجات</h1>
          <p className="mt-2 text-sm text-bosla-silver/60">
            {products.length} منتج · نشطة {activeCount} · جديدة {newCount} · مؤرشفة {archivedCount}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-bosla-gold px-6 py-2.5 text-sm font-medium text-bosla-black transition-colors hover:bg-bosla-white"
        >
          + إضافة منتج
        </Link>
      </header>

      {products.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-bosla-silver/10 bg-bosla-charcoal/60 p-8">
          <p className="text-bosla-silver/70">لسه مفيش منتجات في المتجر.</p>
          <ImportSampleButton />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-bosla-silver/10 bg-bosla-charcoal/60">
          <table className="w-full min-w-[720px] text-right text-sm">
            <thead className="border-b border-bosla-silver/10 text-xs text-bosla-silver/50">
              <tr>
                <th className="px-4 py-4 font-normal">المنتج</th>
                <th className="px-4 py-4 font-normal">القسم</th>
                <th className="px-4 py-4 font-normal">السعر</th>
                <th className="px-4 py-4 font-normal">الشارات</th>
                <th className="px-4 py-4 font-normal" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const category = getCategoryById(product.categoryId);
                return (
                  <tr key={product.id} className="border-b border-bosla-silver/5 last:border-0 hover:bg-bosla-graphite/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-bosla-graphite">
                          <Image src={product.image} alt={product.imageAlt} fill sizes="56px" className="object-cover" />
                        </div>
                        <span className="max-w-[260px] text-bosla-white">
                          {product.name}
                          {product.archived && <span className="mr-2 rounded-full border border-bosla-silver/30 px-2 py-0.5 text-[0.65rem] text-bosla-silver/60">مؤرشف</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-bosla-silver/70">{category?.name ?? 'بدون قسم'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-bosla-gold">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3 text-xs text-bosla-silver/60">
                      {[product.featured && 'مميز', product.badge].filter(Boolean).join(' · ') || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="rounded-full border border-bosla-silver/20 px-4 py-2 text-xs text-bosla-silver/80 transition-colors hover:border-bosla-gold hover:text-bosla-gold"
                        >
                          تعديل
                        </Link>
                        <ArchiveProductButton productId={product.id} archived={product.archived === true} />
                        <DeleteProductButton productId={product.id} productName={product.name} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
