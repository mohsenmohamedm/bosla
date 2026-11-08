import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import LogoutButton from '@/components/admin/LogoutButton';
import OrderStatusSelect from '@/components/admin/OrderStatusSelect';
import { ADMIN_COOKIE, isValidAdminToken } from '@/lib/admin-auth';
import { getDb } from '@/lib/mongodb';
import { ORDER_STATUS_LABELS, type OrderStatus } from '@/lib/orders';
import { formatPrice } from '@/lib/store';

export const metadata = { robots: { index: false, follow: false } };

interface StoredOrder {
  orderNumber: string;
  status: OrderStatus;
  customer: {
    name: string;
    phone: string;
    governorate: string;
    address: string;
    notes?: string;
  };
  items: { name: string; quantity: number; price: number }[];
  total: number;
  createdAt: Date;
}

const formatDate = (date: Date) =>
  new Date(date).toLocaleString('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

export default async function AdminOrdersPage() {
  const cookieStore = await cookies();
  if (!isValidAdminToken(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect('/admin/login');
  }

  const db = await getDb();
  const orders = await db
    .collection<StoredOrder>('orders')
    .find({})
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-36 md:px-8">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-bosla-white">الطلبات</h1>
          <p className="mt-2 text-sm text-bosla-silver/60">
            {orders.length} طلب
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <AdminNav active="orders" />
          <LogoutButton />
        </div>
      </header>

      {orders.length === 0 ? (
        <p className="text-bosla-silver/60">لسه مفيش طلبات.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {orders.map((order) => (
            <article
              key={order.orderNumber}
              className="rounded-2xl border border-bosla-silver/10 bg-bosla-charcoal/60 p-6"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-bosla-silver/10 pb-4">
                <div>
                  <p className="font-display text-lg text-bosla-white">{order.orderNumber}</p>
                  <p className="mt-1 text-xs text-bosla-silver/50">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-bosla-silver/60">{ORDER_STATUS_LABELS[order.status]}</span>
                  <OrderStatusSelect orderNumber={order.orderNumber} status={order.status} />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 text-sm text-bosla-silver/80">
                  <p><span className="text-bosla-silver/50">الاسم:</span> {order.customer.name}</p>
                  <p>
                    <span className="text-bosla-silver/50">الموبايل:</span>{' '}
                    <a href={`tel:${order.customer.phone}`} className="text-bosla-gold hover:underline">
                      {order.customer.phone}
                    </a>
                  </p>
                  <p><span className="text-bosla-silver/50">المحافظة:</span> {order.customer.governorate}</p>
                  <p><span className="text-bosla-silver/50">العنوان:</span> {order.customer.address}</p>
                  {order.customer.notes && (
                    <p><span className="text-bosla-silver/50">ملاحظات:</span> {order.customer.notes}</p>
                  )}
                </div>

                <div className="text-sm text-bosla-silver/80">
                  <ul className="space-y-2">
                    {order.items.map((item, index) => (
                      <li key={`${order.orderNumber}-${index}`} className="flex justify-between gap-3">
                        <span>{item.name} × {item.quantity}</span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex justify-between border-t border-bosla-silver/10 pt-3 font-medium text-bosla-white">
                    <span>الإجمالي (شامل الشحن)</span>
                    <span className="text-bosla-gold">{formatPrice(order.total)}</span>
                  </div>
                  <p className="mt-2 text-xs text-bosla-silver/50">الدفع عند الاستلام</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
