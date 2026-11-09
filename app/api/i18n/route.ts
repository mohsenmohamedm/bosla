import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/products-db';
import { PRODUCT_EN_FALLBACK } from '@/lib/i18n-dict';

export const dynamic = 'force-dynamic';

/** GET /api/i18n — أزواج (عربي، إنجليزي) لأسماء ووصف المنتجات، عشان الموقع يبقى إنجليزي بالكامل */
export async function GET() {
  const pairs: Array<[string, string]> = [];
  try {
    const products = await getAllProducts();
    for (const product of products) {
      const record = product as unknown as Record<string, unknown>;
      const fallback = PRODUCT_EN_FALLBACK[product.id] ?? {};
      for (const field of ['name', 'description', 'imageAlt', 'badge']) {
        const ar = record[field];
        const own = record[field + 'En'];
        const en = typeof own === 'string' && own.trim() ? own.trim() : fallback[field];
        if (typeof ar === 'string' && ar.trim() && en) pairs.push([ar.trim(), en]);
      }
    }
  } catch {
    // لو قاعدة البيانات مش متاحة بنرجع قائمة فاضية
  }
  return NextResponse.json({ pairs }, { headers: { 'Cache-Control': 'public, max-age=60' } });
}
