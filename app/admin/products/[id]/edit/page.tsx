import { notFound, redirect } from 'next/navigation';
import ProductForm, { type ProductFormValues } from '@/components/admin/ProductForm';
import { isAdminSession } from '@/lib/admin-session';
import { getCategories } from '@/lib/data';
import { getProductById } from '@/lib/products-db';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  if (!(await isAdminSession())) redirect('/admin/login');

  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const categories = getCategories().map((category) => ({ id: category.id, name: category.name }));

  const initial: ProductFormValues = {
    name: product.name,
    description: product.description,
    price: String(product.price),
    image: product.image,
    imageAlt: product.imageAlt,
    categoryId: product.categoryId,
    badge: product.badge ?? '',
    featured: Boolean(product.featured),
  };

  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 pt-36 md:px-8">
      <h1 className="mb-8 font-display text-3xl font-semibold text-bosla-white">تعديل: {product.name}</h1>
      <ProductForm productId={product.id} initial={initial} categories={categories} />
    </main>
  );
}
