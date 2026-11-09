'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent, type ReactNode } from 'react';

export interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  image: string;
  imageAlt: string;
  categoryId: string;
  badge: string;
  featured: boolean;
  stock?: string;
}

interface ProductFormProps {
  /** لو موجود، الفورم بيعدل المنتج. لو مش موجود، بيضيف منتج جديد */
  productId?: string;
  initial?: ProductFormValues;
  categories: { id: string; name: string }[];
}

const emptyValues: ProductFormValues = {
  name: '',
  description: '',
  price: '',
  image: '',
  imageAlt: '',
  categoryId: '',
  badge: '',
  featured: false,
  stock: '',
};

const inputClass =
  'w-full rounded-xl border border-bosla-silver/15 bg-bosla-black/60 px-4 py-3 text-bosla-white outline-none transition-colors placeholder:text-bosla-silver/30 focus:border-bosla-gold';

/** فورم إضافة وتعديل المنتجات في الداشبورد */
export default function ProductForm({ productId, initial, categories }: ProductFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(initial ?? { ...emptyValues, categoryId: categories[0]?.id ?? '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        productId ? `/api/admin/products/${productId}` : '/api/admin/products',
        {
          method: productId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...values, price: Number(values.price) }),
        },
      );
      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        setError(result.error ?? 'حصلت مشكلة، حاول تاني');
        setSubmitting(false);
        return;
      }

      router.push('/admin/products');
      router.refresh();
    } catch {
      setError('مقدرناش نوصل للسيرفر، اتأكد من الاتصال');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 rounded-2xl border border-bosla-silver/10 bg-bosla-charcoal/60 p-6 md:grid-cols-2 md:p-8">
      <Field label="اسم المنتج" className="md:col-span-2">
        <input required minLength={2} value={values.name} onChange={(e) => update('name', e.target.value)} className={inputClass} />
      </Field>

      <Field label="الوصف" className="md:col-span-2">
        <textarea required rows={4} value={values.description} onChange={(e) => update('description', e.target.value)} className={inputClass} />
      </Field>

      <Field label="السعر (جنيه)">
        <input required type="number" min={1} step="1" inputMode="numeric" value={values.price} onChange={(e) => update('price', e.target.value)} className={inputClass} />
      </Field>

      <Field label="المخزون (عدد القطع)" hint="سيبه فاضي لو مش عايز تتبع المخزون">
        <input type="number" min={0} step="1" inputMode="numeric" value={values.stock ?? ''} onChange={(e) => update('stock', e.target.value)} className={inputClass} />
      </Field>

      <Field label="القسم">
        <select required value={values.categoryId} onChange={(e) => update('categoryId', e.target.value)} className={inputClass}>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </Field>

      <Field label="شارة (اختياري)" hint="مثال: جديد، الأكثر مبيعاً">
        <input value={values.badge} onChange={(e) => update('badge', e.target.value)} className={inputClass} />
      </Field>

      <Field label="رابط الصورة" hint="لازم يكون من Pexels أو Unsplash (https://)" className="md:col-span-2">
        <input required type="url" dir="ltr" value={values.image} onChange={(e) => update('image', e.target.value)} className={inputClass} placeholder="https://images.pexels.com/photos/..." />
      </Field>

      <Field label="وصف الصورة (للمكفوفين ومحركات البحث)" className="md:col-span-2">
        <input required value={values.imageAlt} onChange={(e) => update('imageAlt', e.target.value)} className={inputClass} />
      </Field>

      <Field label="ظهور في الصفحة الرئيسية">
        <label className="flex items-center gap-3 py-3 text-bosla-silver/80">
          <input type="checkbox" checked={values.featured} onChange={(e) => update('featured', e.target.checked)} className="h-5 w-5 accent-bosla-gold" />
          منتج مميز
        </label>
      </Field>

      {error && (
        <p role="alert" className="md:col-span-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3 md:col-span-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-bosla-gold px-8 py-3 text-sm font-medium text-bosla-black transition-all duration-300 hover:bg-bosla-white disabled:opacity-60"
        >
          {submitting ? 'بنحفظ...' : productId ? 'حفظ التعديلات' : 'إضافة المنتج'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="rounded-full border border-bosla-silver/20 px-8 py-3 text-sm text-bosla-silver/80 transition-colors hover:border-bosla-gold hover:text-bosla-gold"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  className = '',
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-sm text-bosla-silver/80">{label}</span>
      {children}
      {hint && <span className="text-xs text-bosla-silver/40">{hint}</span>}
    </label>
  );
}
