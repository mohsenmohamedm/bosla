import { NextResponse } from 'next/server';
import { isAdminSession } from '@/lib/admin-session';
import { getDb } from '@/lib/mongodb';

/** POST /api/admin/reset-data — بيمسح الطلبات وأحداث الزيارات (للأدمن بس، بتأكيد) */
export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  let body: { confirm?: unknown };
  try {
    body = (await request.json()) as { confirm?: unknown };
  } catch {
    return NextResponse.json({ error: 'البيانات مش صحيحة' }, { status: 400 });
  }
  if (body.confirm !== 'تصفير') {
    return NextResponse.json({ error: 'اكتب كلمة التأكيد بالظبط' }, { status: 400 });
  }

  const db = await getDb();
  const orders = await db.collection('orders').deleteMany({});
  const events = await db.collection('events').deleteMany({});
  return NextResponse.json({ orders: orders.deletedCount, events: events.deletedCount });
}
