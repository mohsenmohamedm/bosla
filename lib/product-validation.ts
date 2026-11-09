import { categories } from './data';

/**
 * التحقق من بيانات المنتج اللي جاية من الداشبورد.
 * الصور لازم تكون من مصادر مسموحة في next.config.js (Pexels وUnsplash حالياً).
 * لو هتستخدم Cloudinary، ضيف الـ host بتاعه في next.config.js وهنا.
 */

export const ALLOWED_IMAGE_HOSTS = ['images.pexels.com', 'images.unsplash.com'];

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  image: string;
  imageAlt: string;
  categoryId: string;
  badge: string;
  nameEn: string;
  descriptionEn: string;
  imageAltEn: string;
  badgeEn: string;
  featured: boolean;
  /** null = المخزون مش متتبع */
  stock: number | null;
}

export function parseProductInput(body: unknown): { data?: ProductInput; error?: string } {
  if (!body || typeof body !== 'object') {
    return { error: 'البيانات مش صحيحة' };
  }

  const input = body as Record<string, unknown>;
  const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

  const name = text(input.name);
  const description = text(input.description);
  const image = text(input.image);
  const imageAlt = text(input.imageAlt);
  const categoryId = text(input.categoryId);
  const badge = text(input.badge);
  const nameEn = text(input.nameEn);
  const descriptionEn = text(input.descriptionEn);
  const imageAltEn = text(input.imageAltEn);
  const badgeEn = text(input.badgeEn);
  const price = Number(input.price);
  const featured = input.featured === true;

  const stockText = text(input.stock);
  const stock = stockText === '' ? null : Number(stockText);

  if (name.length < 2) return { error: 'اكتب اسم المنتج' };
  if (description.length < 5) return { error: 'اكتب وصف مختصر للمنتج' };
  if (!Number.isFinite(price) || price <= 0) return { error: 'السعر لازم يكون رقم أكبر من صفر' };
  if (imageAlt.length < 3) return { error: 'اكتب وصف للصورة' };
  if (!categories.some((category) => category.id === categoryId)) {
    return { error: 'اختار قسم صحيح' };
  }
  if (stock !== null && (!Number.isInteger(stock) || stock < 0)) {
    return { error: 'المخزون لازم يكون رقم صحيح صفر أو أكتر' };
  }

  try {
    const url = new URL(image);
    if (url.protocol !== 'https:' || !ALLOWED_IMAGE_HOSTS.includes(url.hostname)) {
      return { error: `رابط الصورة لازم يكون من: ${ALLOWED_IMAGE_HOSTS.join(' أو ')}` };
    }
  } catch {
    return { error: 'رابط الصورة مش صحيح' };
  }

  return {
    data: { name, description, price, image, imageAlt, categoryId, badge, nameEn, descriptionEn, imageAltEn, badgeEn, featured, stock },
  };
}
