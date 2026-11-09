import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import OrderRowMenu from '@/components/admin/OrderRowMenu';
import OrderStatusSelect from '@/components/admin/OrderStatusSelect';
import { ADMIN_COOKIE, isValidAdminToken } from '@/lib/admin-auth';
import {
  ORDER_DATE_RANGES,
  STATUS_BADGE_CLASSES,
  buildOrderFilter,
  formatDateTime,
  parseOrderQuery,
  type StoredOrder,
} from '@/lib/admin-orders';
import { getDb } from '@/lib/mongodb';
import { getAllProducts } from '@/lib/products-db';
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from '@/lib/orders';
import { formatPrice } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

const PAGE_SIZE = 25;

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  if (!isValidAdminToken(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect('/admin/login');
  }

  const params = await searchParams;
  const query = parseOrderQuery(params);
  const filter = buildOrderFilter(query);

  const db = await getDb();
  const collection = db.collection<StoredOrder>('orders');
  const [total, orders, products] = await Promise.all([
    collection.countDocuments(filter),
    collection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((query.page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .toArray(),
    getAllProducts(),
  ]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const exportParams = new URLSearchParams();
  if (query.status) exportParams.set('status', query.status);
  if (query.product) exportParams.set('product', query.product);
  if (query.date !== 'all') exportParams.set('date', query.date);
  if (query.q) exportParams.set('q', query.q);
  const exportQs = exportParams.toString();

  const pageHref = (page: number) => {
    const next = new URLSearchParams(exportParams);
    if (page > 1) next.set('page', String(page));
    const qs = next.toString();
    return qs ? `/admin/orders?${qs}` : '/admin/orders';
  };

  const selectClass =
    'rounded-full border border-bosla-silver/15 bg-bosla-charcoal px-4 py-2.5 text-sm text-bosla-white focus:border-bosla-gold focus:outline-none';

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-bosla-white">الطلبات</h1>
          <p className="mt-2 text-sm text-bosla-silver/60">
            {total.toLocaleString('ar-EG')} طلب مطابق للفلاتر
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/orders${exportQs ? `?${exportQs}` : ''}`}
            className="rounded-full border border-bosla-silver/20 px-5 py-2.5 text-sm text-bosla-silver/85 transition-colors hover:border-bosla-gold hover:text-bosla-gold"
          >
            تحديث
          </Link>
          <a
            href={`/api/admin/orders/export${exportQs ? `?${exportQs}` : ''}`}
            className="rounded-full border border-bosla-gold/50 px-5 py-2.5 text-sm text-bosla-gold transition-colors hover:bg-bosla-gold/10"
          >
            تصدير CSV
          </a>
        </div>
      </header>

      {/* الفلاتر */}
      <form action="/admin/orders" className="flex flex-wrap items-center gap-3 rounded-2xl border border-bosla-silver/10 bg-bosla-charcoal/60 p-4">
        <select name="status" defaultValue={query.status ?? ''} className={selectClass} aria-label="الحالة">
          <option value="">كل الحالات</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
          ))}
        </select>
        <select name="product" defaultValue={query.product ?? ''} className={`${selectClass} max-w-[220px]`} aria-label="المنتج">
          <option value="">كل المنتجات</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <select name="date" defaultValue={query.date} className={selectClass} aria-label="الفترة">
          {(Object.keys(ORDER_DATE_RANGES) as (keyof typeof ORDER_DATE_RANGES)[]).map((key) => (
            <option key={key} value={key}>{ORDER_DATE_RANGES[key]}</option>
          ))}
        </select>
        <input
          type="search"
          name="q"
          defaultValue={query.q}
          placeholder="ابحث برقم الطلب، الاسم، أو الموبايل"
          className="min-w-0 flex-1 rounded-full border border-bosla-silver/15 bg-bosla-charcoal px-5 py-2.5 text-sm text-bosla-white placeholder:text-bosla-silver/40 focus:border-bosla-gold focus:outline-none md:max-w-sm"
        />
        <button
          type="submit"
          className="rounded-full bg-bosla-gold px-6 py-2.5 text-sm font-medium text-bosla-black transition-colors hover:bg-bosla-white"
        >
          تطبيق
        </button>
      </form>

      {orders.length === 0 ? (
        <p className="rounded-2xl border border-bosla-silver/10 bg-bosla-charcoal/60 p-8 text-center text-bosla-silver/60">
          مفيش طلبات مطابقة.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-bosla-silver/10 bg-bosla-charcoal/60">
          <table className="w-full min-w-[1000px] text-right text-sm">
            <thead className="border-b border-bosla-silver/10 text-xs text-bosla-silver/50">
              <tr>
                <th className="px-4 py-4 font-normal">الطلب</th>
                <th className="px-4 py-4 font-normal">التوقيت</th>
                <th className="px-4 py-4 font-normal">العميل</th>
                <th className="px-4 py-4 font-normal">الحالة</th>
                <th className="px-4 py-4 font-normal">التوصيل</th>
                <th className="px-4 py-4 font-normal">المنتجات</th>
                <th className="px-4 py-4 font-normal">الإجمالي</th>
                <th className="px-4 py-4 font-normal">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const pieces = order.items.reduce((sum, i) => sum + i.quantity, 0);
                const href = `/admin/orders/${encodeURIComponent(order.orderNumber)}`;
                return (
                  <tr key={order.orderNumber} className="border-b border-bosla-silver/5 align-top last:border-0 hover:bg-bosla-graphite/40">
                    <td className="px-4 py-4">
                      <Link href={href} dir="ltr" className="font-medium text-bosla-white hover:text-bosla-gold">
                        {order.orderNumber}
                      </Link>
                      <span className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-[0.7rem] ${STATUS_BADGE_CLASSES[order.status]}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-xs text-bosla-silver/60">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-bosla-white">{order.customer.name}</p>
                      <a href={`tel:${order.customer.phone}`} dir="ltr" className="mt-1 inline-block text-xs text-bosla-gold hover:underline">
                        {order.customer.phone}
                      </a>
                    </td>
                    <td className="px-4 py-4">
                      <OrderStatusSelect orderNumber={order.orderNumber} status={order.status} />
                    </td>
                    <td className="max-w-[220px] px-4 py-4 text-xs text-bosla-silver/70">
                      <p className="text-bosla-white">{order.customer.governorate}</p>
                      <p className="mt-1 line-clamp-2">{order.customer.address}</p>
                    </td>
                    <td className="px-4 py-4 text-xs text-bosla-silver/70">
                      <details className="group">
                        <summary className="cursor-pointer list-none text-bosla-silver/80 hover:text-bosla-gold">
                          {pieces} قطعة · {order.items.length} منتج
                          <span className="mr-1 text-[0.65rem] group-open:hidden">▾</span>
                        </summary>
                        <ul className="mt-2 flex max-w-[260px] flex-col gap-1 text-bosla-silver/80">
                          {order.items.map((item) => (
                            <li key={item.productId}>
                              {item.name} × {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </details>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <p className="font-medium text-bosla-gold">{formatPrice(order.total)}</p>
                      <p className="mt-1 text-[0.7rem] text-bosla-silver/50">
                        {formatPrice(order.subtotal)} + شحن {formatPrice(order.shipping)}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <OrderRowMenu href={href} orderNumber={order.orderNumber} phone={order.customer.phone} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-bosla-silver/10 px-4 py-3 text-xs text-bosla-silver/60">
            <span>
              صفحة {query.page.toLocaleString('ar-EG')} من {pageCount.toLocaleString('ar-EG')} · {total.toLocaleString('ar-EG')} طلب
            </span>
            <div className="flex gap-2">
              {query.page > 1 && (
                <Link href={pageHref(query.page - 1)} className="rounded-full border border-bosla-silver/20 px-4 py-1.5 hover:border-bosla-gold hover:text-bosla-gold">
                  السابق
                </Link>
              )}
              {query.page < pageCount && (
                <Link href={pageHref(query.page + 1)} className="rounded-full border border-bosla-silver/20 px-4 py-1.5 hover:border-bosla-gold hover:text-bosla-gold">
                  التالي
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
