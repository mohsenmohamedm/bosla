import { NextResponse } from 'next/server';
import { isAdminSession } from '@/lib/admin-session';
import { parseProductInput } from '@/lib/product-validation';
import { createProduct } from '@/lib/products-db';

/** POST /api/admin/products — إضافة منتج جديد (للأدمن بس) */
export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'لازم تسجل دخول الأول' }, { status: 401 });
  }

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

  const product = await createProduct(data);
  return NextResponse.json({ id: product.id }, { status: 201 });
}
