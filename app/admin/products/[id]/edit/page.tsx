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
  const product = await getProductById(id, { includeArchived: true });
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
    stock: typeof product.stock === 'number' ? String(product.stock) : '',
  };

  return (
    <section className="flex max-w-3xl flex-col gap-8">
      <h1 className="font-display text-3xl font-semibold text-bosla-white">تعديل: {product.name}</h1>
      <ProductForm productId={product.id} initial={initial} categories={categories} />
    </section>
  );
}
