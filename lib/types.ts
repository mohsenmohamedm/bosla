/**
 * أنواع البيانات (TypeScript types) لمتجر "بوصلة".
 * كل البيانات في lib/data.ts لازم تتطابق مع الأنواع دي.
 */

export type CurrencyCode = 'EGP';

/** قسم في المتجر (إكسسوارات العربيات، إلكترونيات، أزياء... إلخ) */
export interface Category {
  /** معرّف فريد وثابت — بيُستخدم في Product.categoryId */
  id: string;
  /** اسم في الرابط (URL) */
  slug: string;
  /** الاسم المعروض */
  name: string;
  /** وصف قصير للكارت */
  description: string;
  /** صورة الكارت (رابط Pexels/Unsplash أو مسار محلي في public/) */
  image: string;
  /** وصف الصورة لقارئات الشاشة وSEO */
  imageAlt: string;
}

/** منتج داخل قسم */
export interface Product {
  id: string;
  name: string;
  description: string;
  /** السعر بالجنيه المصري */
  price: number;
  currency: CurrencyCode;
  image: string;
  imageAlt: string;
  /** لازم يساوي id لقسم موجود في categories */
  categoryId: Category['id'];
  /** شارة اختيارية (جديد، الأكثر طلباً...) */
  badge?: string;
  /** يظهر في "منتجات مختارة" في الصفحة الرئيسية */
  featured?: boolean;
  /** عدد القطع في المخزون. null أو مش موجود = المخزون مش متتبع */
  stock?: number | null;
  /** المنتج المؤرشف مابيظهرش في المتجر ومابيتطلبش */
  archived?: boolean;
  /** تاريخ الإضافة (ISO) */
  createdAt?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface CtaLink {
  label: string;
  href: string;
}

/** محتوى الهيرو. لو حبيت شرائح متعددة مستقبلاً: حوّله لـ HeroContent[] */
export interface HeroContent {
  eyebrow: string;
  title: string;
  /** الجزء الملوّن من العنوان (في سطر تاني) */
  titleAccent?: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
}

export type WhyUsIconKey = 'shipping' | 'authentic' | 'secure';

export interface WhyUsItem {
  id: string;
  icon: WhyUsIconKey;
  title: string;
  description: string;
}

/** عنصر داخل السلة */
export interface CartItem {
  product: Product;
  quantity: number;
}
