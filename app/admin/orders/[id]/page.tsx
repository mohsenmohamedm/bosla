import Link from 'next/link';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import OrderEditForm from '@/components/admin/OrderEditForm';
import { ADMIN_COOKIE, isValidAdminToken } from '@/lib/admin-auth';
import { STATUS_BADGE_CLASSES, formatDateTime, type StoredOrder } from '@/lib/admin-orders';
import { getDb } from '@/lib/mongodb';
import { ORDER_STATUS_LABELS } from '@/lib/orders';
import { formatPrice } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  if (!isValidAdminToken(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const db = await getDb();
  const order = await db.collection<StoredOrder>('orders').findOne({ orderNumber: id });
  if (!order) notFound();

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/orders" className="text-sm text-bosla-silver/60 hover:text-bosla-gold">
            ← كل الطلبات
          </Link>
          <h1 className="mt-3 font-display text-3xl font-semibold text-bosla-white" dir="ltr">
            {order.orderNumber}
          </h1>
          <p className="mt-2 text-sm text-bosla-silver/60">{formatDateTime(order.createdAt)}</p>
        </div>
        <span className={`rounded-full border px-4 py-1.5 text-sm ${STATUS_BADGE_CLASSES[order.status]}`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* بيانات العميل والتعديل */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-bosla-silver/10 bg-bosla-charcoal/60 p-6">
            <h2 className="mb-5 font-display text-lg text-bosla-white">بيانات العميل</h2>
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-bosla-silver/50">الاسم</dt>
                <dd className="mt-1 text-bosla-white">{order.customer.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-bosla-silver/50">الموبايل</dt>
                <dd className="mt-1">
                  <a href={`tel:${order.customer.phone}`} dir="ltr" className="text-bosla-gold hover:underline">
                    {order.customer.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-bosla-silver/50">المحافظة</dt>
                <dd className="mt-1 text-bosla-white">{order.customer.governorate}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-bosla-silver/50">العنوان</dt>
                <dd className="mt-1 text-bosla-white">{order.customer.address}</dd>
              </div>
              {order.customer.notes && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-bosla-silver/50">ملاحظات</dt>
                  <dd className="mt-1 text-bosla-silver/80">{order.customer.notes}</dd>
                </div>
              )}
            </dl>
          </div>

          <OrderEditForm
            orderNumber={order.orderNumber}
            initial={{
              status: order.status,
              name: order.customer.name,
              phone: order.customer.phone,
              governorate: order.customer.governorate,
              address: order.customer.address,
              notes: order.customer.notes ?? '',
            }}
          />
        </div>

        {/* المنتجات والإجمالي */}
        <aside className="h-fit rounded-2xl border border-bosla-silver/10 bg-bosla-charcoal/60 p-6">
          <h2 className="mb-5 font-display text-lg text-bosla-white">المنتجات</h2>
          <ul className="flex flex-col gap-4">
            {order.items.map((item, index) => (
              <li key={`${order.orderNumber}-${index}`} className="flex justify-between gap-3 text-sm">
                <span className="text-bosla-silver/85">
                  {item.name} <span className="text-bosla-silver/50">× {item.quantity}</span>
                </span>
                <span className="whitespace-nowrap text-bosla-white">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-2 border-t border-bosla-silver/10 pt-5 text-sm">
            <div className="flex justify-between text-bosla-silver/70">
              <span>المجموع</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-bosla-silver/70">
              <span>الشحن</span>
              <span>{formatPrice(order.shipping)}</span>
            </div>
            <div className="mt-2 flex justify-between text-base font-medium text-bosla-white">
              <span>الإجمالي</span>
              <span className="text-bosla-gold">{formatPrice(order.total)}</span>
            </div>
            <p className="mt-2 text-xs text-bosla-silver/50">الدفع عند الاستلام</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
