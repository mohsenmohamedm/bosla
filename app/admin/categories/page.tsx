import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE, isValidAdminToken } from '@/lib/admin-auth';
import { getCategories } from '@/lib/data';
import { getAllProducts } from '@/lib/products-db';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminCategoriesPage() {
  const cookieStore = await cookies();
  if (!isValidAdminToken(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect('/admin/login');
  }

  const [categories, products] = await Promise.all([getCategories(), getAllProducts()]);

  const countByCategory = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.categoryId] = (acc[product.categoryId] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className="flex flex-col gap-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-bosla-white">الأقسام</h1>
        <p className="mt-2 text-sm text-bosla-silver/60">
          {categories.length} قسم. الأقسام بتتعرّف من الكود (lib/data.ts) عشان الروابط تفضل ثابتة.
        </p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-bosla-silver/10 bg-bosla-charcoal/60">
        <table className="w-full min-w-[640px] text-right text-sm">
          <thead className="border-b border-bosla-silver/10 text-xs text-bosla-silver/50">
            <tr>
              <th className="px-4 py-4 font-normal">القسم</th>
              <th className="px-4 py-4 font-normal">الوصف</th>
              <th className="px-4 py-4 font-normal">عدد المنتجات</th>
              <th className="px-4 py-4 font-normal">الرابط</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-bosla-silver/5 last:border-0 hover:bg-bosla-graphite/40">
                <td className="px-4 py-4 text-bosla-white">{category.name}</td>
                <td className="max-w-[320px] px-4 py-4 text-xs text-bosla-silver/70">{category.description}</td>
                <td className="px-4 py-4 text-bosla-gold">{countByCategory[category.id] ?? 0}</td>
                <td className="px-4 py-4">
                  <Link href={`/category/${category.slug}`} className="text-xs text-bosla-silver/70 hover:text-bosla-gold" dir="ltr">
                    /category/{category.slug}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
