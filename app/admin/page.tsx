import { redirect } from 'next/navigation';

/** /admin بيحوّل لصفحة الطلبات */
export default function AdminIndexPage() {
  redirect('/admin/orders');
}
