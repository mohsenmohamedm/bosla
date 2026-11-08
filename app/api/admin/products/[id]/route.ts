import { NextResponse } from 'next/server';
import { isAdminSession } from '@/lib/admin-session';
import { parseProductInput } from '@/lib/product-validation';
import { deleteProduct, updateProduct } from '@/lib/products-db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** PUT /api/admin/products/[id] — تعديل منتج (للأدمن بس) */
export async function PUT(request: Request, { params }: RouteContext) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'لازم تسجل دخول الأول' }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'البيانات مش صحيحة' }, { status: 400 });
  }

  const { data, error } = parseProductInput(body);
  if (!data) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const updated = await updateProduct(id, data);
  if (!updated) {
    return NextResponse.json({ error: 'المنتج مش موجود' }, { status: 404 });
  }

  return NextResponse.json({ id });
}

/** DELETE /api/admin/products/[id] — حذف منتج (للأدمن بس) */
export async function DELETE(_request: Request, { params }: RouteContext) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'لازم تسجل دخول الأول' }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteProduct(id);
  if (!deleted) {
    return NextResponse.json({ error: 'المنتج مش موجود' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
