import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import InventoryTable, { type InventoryRow } from '@/components/admin/InventoryTable';
import { ADMIN_COOKIE, isValidAdminToken } from '@/lib/admin-auth';
import { getCategoryById } from '@/lib/data';
import { getAllProducts } from '@/lib/products-db';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

const LOW_STOCK_LIMIT = 5;

export default async function AdminInventoryPage() {
  const cookieStore = await cookies();
  if (!isValidAdminToken(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect('/admin/login');
  }

  const products = await getAllProducts();
  const rows: InventoryRow[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    categoryName: getCategoryById(product.categoryId)?.name ?? 'بدون قسم',
    stock: typeof product.stock === 'number' ? product.stock : null,
  }));
  const tracked = rows.filter((r) => r.stock !== null);
  const lowStock = tracked.filter((r) => (r.stock ?? 0) > 0 && (r.stock ?? 0) <= LOW_STOCK_LIMIT);
  const outOfStock = tracked.filter((r) => r.stock === 0);
  const categories = [...new Set(rows.map((r) => r.categoryName))].sort();

  return (
    <section className="flex flex-col gap-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-bosla-white">المخزون</h1>
        <p className="mt-2 text-sm text-bosla-silver/60">
          {tracked.length} منتج متتبع، {lowStock.length} قرب يخلص، {outOfStock.length} خلص
        </p>
      </header>
      <InventoryTable rows={rows} categories={categories} />
    </section>
  );
}
