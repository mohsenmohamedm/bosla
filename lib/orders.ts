/**
 * حالات الطلب. آمنة للاستخدام في الـ client والـ server.
 * ✏️ لو عايز حالة جديدة، ضيفها هنا بس.
 */

export const ORDER_STATUSES = [
  'new',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'جديد',
  confirmed: 'تم التأكيد',
  shipped: 'تم الشحن',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
};

export const isOrderStatus = (value: unknown): value is OrderStatus =>
  typeof value === 'string' && (ORDER_STATUSES as readonly string[]).includes(value);
