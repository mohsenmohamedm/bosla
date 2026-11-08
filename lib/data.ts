import type {
  Category,
  CurrencyCode,
  HeroContent,
  NavItem,
  Product,
  WhyUsItem,
} from './types';

/* =========================================================================
 * 1) هوية الموقع
 * ========================================================================= */

export const siteConfig = {
  nameAr: 'بوصلة',
  nameEn: 'Bosla',
  tagline: 'متجرك الشامل',
  description: 'بوصلة Bosla — اختياراتك في مكان واحد',
  currency: 'EGP' as CurrencyCode,
} as const;

/* =========================================================================
 * 2) التنقل (Navigation)
 *    مش بنذكر أي قسم بالاسم هنا — "الأقسام" بس.
 * ========================================================================= */

export const navItems: NavItem[] = [
  { label: 'الرئيسية', href: '/' },
  { label: 'الأقسام', href: '#categories' },
  { label: 'من نحن', href: '#about' },
  { label: 'اتصل بنا', href: '#contact' },
];

/* =========================================================================
 * 3) الهيرو
 *    عام عن "بوصلة" بالكامل. لو هتضيف شرائح مستقبلاً حوّل ده لمصفوفة.
 * ========================================================================= */

export const heroContent: HeroContent = {
  eyebrow: 'بوصلة — متجرك الشامل',
  title: 'بوصلة — وجهتك للاختيار الأفضل',
  subtitle: 'كل اللي تحتاجه.. في مكان واحد.',
  // صورة placeholder من Pexels (close-up ليلي لإضاءة فاخرة). بدّلها بصورتك لما تتوفر.
  image:
    'https://images.pexels.com/photos/2906849/pexels-photo-2906849.jpeg?auto=compress&cs=tinysrgb&w=1920',
  imageAlt: 'لقطة سينمائية لإضاءة سيارة فاخرة ليلاً',
  primaryCta: { label: 'تسوق الآن', href: '#products' },
  secondaryCta: { label: 'من نحن', href: '#about' },
};

/* =========================================================================
 * 4) الأقسام (Categories)
 *
 * ➕ لإضافة قسم جديد: ضيف عنصر جديد في المصفوفة دي بس.
 *    الشبكة في Categories.tsx بتتوسع تلقائياً ومش محتاجة تعديل.
 * ========================================================================= */

export const categories: Category[] = [
  {
    id: 'car-accessories',
    slug: 'car-accessories',
    name: 'إكسسوارات العربيات',
    description:
      'قطع مختارة بعناية تضيف لمسة أنيقة لسيارتك، من الإضاءة إلى التفاصيل الداخلية.',
    // صورة placeholder من Pexels. غيّرها لصورة القسم الحقيقية.
    image:
      'https://images.pexels.com/photos/6761169/pexels-photo-6761169.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageAlt: 'سيارة سوداء أنيقة على طريق تحيط به الأشجار',
  },
  // ➕ أقسام مستقبلية تُضاف هنا، مثال:
  // {
  //   id: 'electronics',
  //   slug: 'electronics',
  //   name: 'إلكترونيات',
  //   description: '...',
  //   image: '...',
  //   imageAlt: '...',
  // },
];

/* =========================================================================
 * 5) المنتجات (Products)
 *
 * ➕ لإضافة منتج: ضيف عنصر جديد هنا، وخلي categoryId يساوي id قسم موجود.
 * ⚠️ الصور دي placeholders من Pexels — بدّلها بصور المنتجات الحقيقية.
 * ========================================================================= */

export const products: Product[] = [
  {
    id: 'p-001',
    name: 'كشافات LED أمامية بتصميم حاد',
    description: 'إضاءة بيضاء نقية وتصميم عصري يمنح الواجهة حضوراً أقوى.',
    price: 2350,
    currency: 'EGP',
    image:
      'https://images.pexels.com/photos/10955788/pexels-photo-10955788.jpeg?auto=compress&cs=tinysrgb&w=800',
    imageAlt: 'كشاف أمامي لسيارة عند الغسق',
    categoryId: 'car-accessories',
    badge: 'الأكثر طلباً',
    featured: true,
  },
  {
    id: 'p-002',
    name: 'مصابيح خلفية ديناميكية',
    description: 'تأثير إضاءة متدرج يلفت الانتباه بهدوء وأناقة.',
    price: 1190,
    currency: 'EGP',
    image:
      'https://images.pexels.com/photos/27393772/pexels-photo-27393772.jpeg?auto=compress&cs=tinysrgb&w=800',
    imageAlt: 'سيارة حمراء ليلاً تحت المطر',
    categoryId: 'car-accessories',
    featured: true,
  },
  {
    id: 'p-003',
    name: 'كشافات أمامية بتصميم كلاسيكي',
    description: 'لمسة كلاسيكية بخامات متينة تناسب الذوق الرفيع.',
    price: 1640,
    currency: 'EGP',
    image:
      'https://images.pexels.com/photos/18674882/pexels-photo-18674882.jpeg?auto=compress&cs=tinysrgb&w=800',
    imageAlt: 'كشاف أمامي منبثق لسيارة رياضية حمراء',
    categoryId: 'car-accessories',
    featured: true,
  },
  {
    id: 'p-004',
    name: 'كشافات ضباب LED',
    description: 'رؤية أوضح في الظروف الصعبة بإضاءة مركزة.',
    price: 760,
    currency: 'EGP',
    image:
      'https://images.pexels.com/photos/3758443/pexels-photo-3758443.jpeg?auto=compress&cs=tinysrgb&w=800',
    imageAlt: 'سيارة كشف بغروب الشمس على طريق ريفي',
    categoryId: 'car-accessories',
    featured: true,
  },
  {
    id: 'p-005',
    name: 'إضاءة محيطية داخلية',
    description: 'أجواء هادئة داخل المقصورة مع تحكم سهل في الشدة.',
    price: 980,
    currency: 'EGP',
    image:
      'https://images.pexels.com/photos/2932807/pexels-photo-2932807.jpeg?auto=compress&cs=tinysrgb&w=800',
    imageAlt: 'سيارة كشف مكشوفة بجوار الواجهة البحرية',
    categoryId: 'car-accessories',
    featured: true,
  },
  {
    id: 'p-006',
    name: 'عدسات كشافات مضيئة',
    description: 'تحديث بصري يمنح الكشافات مظهراً أنظف وأكثر فخامة.',
    price: 1450,
    currency: 'EGP',
    image:
      'https://images.pexels.com/photos/33526402/pexels-photo-33526402.jpeg?auto=compress&cs=tinysrgb&w=800',
    imageAlt: 'تفاصيل كشاف سيارة كلاسيكية زرقاء',
    categoryId: 'car-accessories',
    featured: true,
  },
];

/* =========================================================================
 * 6) "لماذا بوصلة؟"
 * ========================================================================= */

export const whyUsItems: WhyUsItem[] = [
  {
    id: 'shipping',
    icon: 'shipping',
    title: 'شحن سريع',
    description: 'نوصّل طلبك بأسرع وقت لأغلب المحافظات، بعناية كاملة من أول خطوة.',
  },
  {
    id: 'authentic',
    icon: 'authentic',
    title: 'جودة أصلية',
    description: 'منتجات مختارة من موردين معتمدين، ونضمن مطابقتها للوصف.',
  },
  {
    id: 'secure',
    icon: 'secure',
    title: 'دفع آمن',
    description: 'طرق دفع متعددة ومشفّرة تمنحك راحة البال في كل معاملة.',
  },
];

/* =========================================================================
 * 7) Helpers — بتتعامل مع البيانات من غير ما الـ UI يعرف مصدرها
 * ========================================================================= */

export const getCategories = (): Category[] => categories;

export const getCategoryById = (id: string): Category | undefined =>
  categories.find((category) => category.id === id);

export const getProductsByCategory = (categoryId: string): Product[] =>
  products.filter((product) => product.categoryId === categoryId);

export const getFeaturedProducts = (limit = 8): Product[] =>
  products.filter((product) => product.featured).slice(0, limit);
