import { NextResponse } from 'next/server';
import { isAdminSession } from '@/lib/admin-session';
import { setProductArchived } from '@/lib/products-db';

/** PUT /api/admin/products/[id]/archive — أرشفة منتج أو إرجاعه للمتجر (للأدمن بس) */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { archived?: unknown } | null;
  if (!body || typeof body.archived !== 'boolean') {
    return NextResponse.json({ error: 'قيمة الأرشفة مش صحيحة' }, { status: 400 });
  }

  const { id } = await params;
  const found = await setProductArchived(id, body.archived);
  if (!found) return NextResponse.json({ error: 'المنتج مش موجود' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
