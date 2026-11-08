import { NextResponse } from 'next/server';
import { searchProducts } from '@/lib/products-db';

export const dynamic = 'force-dynamic';

/** GET /api/products/search?q=... — بحث عام في المنتجات (مفتوح للزوار) */
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q') ?? '';
  const products = await searchProducts(query);
  return NextResponse.json({ products });
}
