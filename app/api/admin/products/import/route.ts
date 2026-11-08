import { NextResponse } from 'next/server';
import { isAdminSession } from '@/lib/admin-session';
import { importSampleProducts } from '@/lib/products-db';

/** POST /api/admin/products/import — بيحط المنتجات التجريبية لو الجدول فاضي (للأدمن بس) */
export async function POST() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'لازم تسجل دخول الأول' }, { status: 401 });
  }

  const inserted = await importSampleProducts();
  return NextResponse.json({ inserted });
}
