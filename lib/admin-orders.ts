import type { Filter } from 'mongodb';
import { isOrderStatus, type OrderStatus } from './orders';

/** شكل الطلب زي ما متخزن في MongoDB (collection: orders) */
export interface StoredOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface StoredOrder {
  orderNumber: string;
  status: OrderStatus;
  customer: {
    name: string;
    phone: string;
    governorate: string;
    address: string;
    notes?: string;
  };
  items: StoredOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  createdAt: Date;
  updatedAt?: Date;
}

/** ألوان شارة كل حالة في الداشبورد */
export const STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  new: 'border-bosla-gold/40 bg-bosla-gold/10 text-bosla-gold',
  confirmed: 'border-sky-400/30 bg-sky-400/10 text-sky-300',
  shipped: 'border-violet-400/30 bg-violet-400/10 text-violet-300',
  delivered: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  cancelled: 'border-red-400/30 bg-red-400/10 text-red-300',
};

export const formatDateTime = (date: Date | string) =>
  new Date(date).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' });

/** بيهرب الحروف الخاصة عشان البحث في MongoDB ما يتكسرش */
export const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* ---------- فلترة الطلبات (الصفحة + التصدير) ---------- */


export const ORDER_DATE_RANGES = {
  today: 'النهارده',
  '7d': 'آخر 7 أيام',
  '30d': 'آخر 30 يوم',
  all: 'كل الوقت',
} as const;
export type OrderDateRange = keyof typeof ORDER_DATE_RANGES;

export interface OrderQuery {
  status?: OrderStatus;
  product?: string;
  date: OrderDateRange;
  q: string;
  page: number;
}

/** بيقرأ الفلاتر من الرابط ويتأكد إنها صحيحة */
export function parseOrderQuery(params: Record<string, string | undefined>): OrderQuery {
  const status = params.status && isOrderStatus(params.status) ? params.status : undefined;
  const date = (params.date && params.date in ORDER_DATE_RANGES ? params.date : 'all') as OrderDateRange;
  const page = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1);
  return {
    status,
    product: (params.product ?? '').slice(0, 100) || undefined,
    date,
    q: (params.q ?? '').trim().slice(0, 60),
    page,
  };
}

/** بداية يوم النهارده بتوقيت القاهرة */
function startOfCairoToday(): Date {
  const key = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Cairo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  return new Date(`${key}T00:00:00+02:00`);
}

export function buildOrderFilter(query: OrderQuery): Filter<StoredOrder> {
  const filter: Filter<StoredOrder> = {};
  if (query.status) filter.status = query.status;
  if (query.product) filter['items.productId'] = query.product;

  if (query.date === 'today') {
    filter.createdAt = { $gte: startOfCairoToday() };
  } else if (query.date !== 'all') {
    const days = query.date === '7d' ? 7 : 30;
    filter.createdAt = { $gte: new Date(Date.now() - days * 86_400_000) };
  }

  if (query.q) {
    const pattern = escapeRegex(query.q);
    filter.$or = [
      { orderNumber: { $regex: pattern, $options: 'i' } },
      { 'customer.phone': { $regex: pattern } },
      { 'customer.name': { $regex: pattern, $options: 'i' } },
    ];
  }
  return filter;
}
