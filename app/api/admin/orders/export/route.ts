import { isAdminSession } from '@/lib/admin-session';
import { buildOrderFilter, parseOrderQuery, type StoredOrder } from '@/lib/admin-orders';
import { getDb } from '@/lib/mongodb';
import { ORDER_STATUS_LABELS } from '@/lib/orders';

/**
 * GET /api/admin/orders/export?… — تصدير الطلبات CSV بنفس فلاتر الصفحة.
 * BOM عشان Excel يفهم العربي.
 */

const EXPORT_LIMIT = 5000;

/** بيمنع تنفيذ المعادلات في Excel (=, +, -, @) */
const cell = (value: unknown) => {
  let text = value === undefined || value === null ? '' : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};

export async function GET(request: Request) {
  if (!(await isAdminSession())) {
    return new Response('غير مصرح', { status: 401 });
  }

  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());
  const query = parseOrderQuery(params);
  const db = await getDb();

  const orders = await db
    .collection<StoredOrder>('orders')
    .find(buildOrderFilter(query))
    .sort({ createdAt: -1 })
    .limit(EXPORT_LIMIT)
    .toArray();

  const headers = [
    'رقم الطلب', 'التاريخ', 'الاسم', 'الموبايل', 'المحافظة', 'العنوان',
    'المنتجات', 'عدد القطع', 'المجموع الفرعي', 'الشحن', 'الإجمالي', 'الحالة', 'ملاحظات',
  ];

  const rows = orders.map((o) => [
    o.orderNumber,
    new Date(o.createdAt).toLocaleString('ar-EG'),
    o.customer.name,
    o.customer.phone,
    o.customer.governorate,
    o.customer.address,
    o.items.map((i) => `${i.name} × ${i.quantity}`).join(' | '),
    o.items.reduce((sum, i) => sum + i.quantity, 0),
    o.subtotal,
    o.shipping,
    o.total,
    ORDER_STATUS_LABELS[o.status],
    o.customer.notes ?? '',
  ]);

  const csv = '﻿' + [headers, ...rows].map((row) => row.map(cell).join(',')).join('\r\n');
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="bosla-orders-${stamp}.csv"`,
    },
  });
}
