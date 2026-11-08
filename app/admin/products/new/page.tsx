import { redirect } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import { isAdminSession } from '@/lib/admin-session';
import { getCategories } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

export default async function NewProductPage() {
  if (!(await isAdminSession())) redirect('/admin/login');

  const categories = getCategories().map((category) => ({ id: category.id, name: category.name }));

  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 pt-36 md:px-8">
      <h1 className="mb-8 font-display text-3xl font-semibold text-bosla-white">منتج جديد</h1>
      <ProductForm categories={categories} />
    </main>
  );
}
