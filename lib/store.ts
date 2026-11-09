import type { CartItem } from './types';
import { shippingFor, type PublicStoreConfig } from './shipping';

/* =========================================================================
 * إعدادات المتجر الثابتة: الشحن، التواصل، طريقة الدفع.
 * ✏️ أي تغيير في الشحن أو الواتساب يتم من هنا بس.
 * ========================================================================= */

export const STORE = {
  name: 'Bosla',
  nameAr: 'بوصلة',
  currencyLabel: 'ج.م',
  /** رقم الواتساب بصيغة دولية بدون + */
  whatsappNumber: '201030627267',
  whatsappDisplay: '01030627267',
  email: 'mohsenmohammed9876@gmail.com',
  /** الدومين الأساسي للموقع — بيتستخدم في الـ metadata والـ sitemap */
  siteUrl: 'https://bosla-store.shop',
  paymentMethod: 'الدفع عند الاستلام',
} as const;

export const GOVERNORATES = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'الدقهلية',
  'البحر الأحمر',
  'البحيرة',
  'الفيوم',
  'الغربية',
  'الإسماعيلية',
  'المنوفية',
  'المنيا',
  'القليوبية',
  'الوادي الجديد',
  'السويس',
  'أسوان',
  'أسيوط',
  'بني سويف',
  'بورسعيد',
  'دمياط',
  'الشرقية',
  'جنوب سيناء',
  'كفر الشيخ',
  'مطروح',
  'الأقصر',
  'قنا',
  'شمال سيناء',
  'سوهاج',
] as const;

export interface CustomerDetails {
  name: string;
  phone: string;
  governorate: string;
  address: string;
  notes?: string;
}

export interface OrderSummary {
  id: string;
  createdAt: string;
  items: CartItem[];
  customer: CustomerDetails;
  subtotal: number;
  shipping: number;
  total: number;
}

export const formatPrice = (amount: number): string =>
  `${amount.toLocaleString('ar-EG')} ${STORE.currencyLabel}`;

export const calculateTotals = (
  items: CartItem[],
  config: PublicStoreConfig,
  governorate = '',
) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = items.length > 0 ? shippingFor(config, governorate, subtotal) : 0;
  return { subtotal, shipping, total: subtotal + shipping };
};

export const createOrderId = (): string =>
  `BSL-${Date.now().toString(36).toUpperCase()}`;

/** نص الطلب اللي هيتبعت للمتجر على الواتساب */
export const buildOrderMessage = (order: OrderSummary): string => {
  const lines = order.items.map(
    (item) =>
      `- ${item.product.name} × ${item.quantity} = ${formatPrice(item.product.price * item.quantity)}`,
  );

  return [
    `طلب جديد من ${STORE.nameAr} (${STORE.name})`,
    `رقم الطلب: ${order.id}`,
    '',
    'المنتجات:',
    ...lines,
    '',
    `الإجمالي قبل الشحن: ${formatPrice(order.subtotal)}`,
    `الشحن: ${formatPrice(order.shipping)}`,
    `الإجمالي: ${formatPrice(order.total)}`,
    `طريقة الدفع: ${STORE.paymentMethod}`,
    '',
    'بيانات العميل:',
    `الاسم: ${order.customer.name}`,
    `الموبايل: ${order.customer.phone}`,
    `المحافظة: ${order.customer.governorate}`,
    `العنوان: ${order.customer.address}`,
    ...(order.customer.notes ? [`ملاحظات: ${order.customer.notes}`] : []),
  ].join('\n');
};

export const buildWhatsAppUrl = (message: string): string =>
  `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(message)}`;

/** التحقق من رقم موبايل مصري (01X XXXXXXXX) */
export const isValidEgyptianPhone = (phone: string): boolean =>
  /^01[0125]\d{8}$/.test(phone.replace(/\s|-/g, ''));
