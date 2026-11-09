import { NextResponse } from 'next/server';
import { isAdminSession } from '@/lib/admin-session';
import { setAcceptingOrders } from '@/lib/store-settings';

/** PUT /api/admin/store-status — بيفتح أو يقفل استقبال الطلبات (للأدمن بس) */
export async function PUT(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  let body: { open?: unknown };
  try {
    body = (await request.json()) as { open?: unknown };
  } catch {
    return NextResponse.json({ error: 'البيانات مش صحيحة' }, { status: 400 });
  }
  if (typeof body.open !== 'boolean') {
    return NextResponse.json({ error: 'قيمة الحالة مش صحيحة' }, { status: 400 });
  }

  await setAcceptingOrders(body.open);
  return NextResponse.json({ acceptingOrders: body.open });
}
