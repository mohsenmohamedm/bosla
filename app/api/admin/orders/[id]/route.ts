import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, isValidAdminToken } from '@/lib/admin-auth';
import { isOrderStatus } from '@/lib/orders';
import { getDb } from '@/lib/mongodb';

/** PATCH /api/admin/orders/[id] — تغيير حالة الطلب (للأدمن بس) */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  if (!isValidAdminToken(cookieStore.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: 'مش مسموح' }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { status?: unknown } | null;

  if (!body || !isOrderStatus(body.status)) {
    return NextResponse.json({ error: 'الحالة مش صحيحة' }, { status: 400 });
  }

  const db = await getDb();
  const result = await db
    .collection('orders')
    .updateOne(
      { orderNumber: id },
      { $set: { status: body.status, updatedAt: new Date() } },
    );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'الطلب مش موجود' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
