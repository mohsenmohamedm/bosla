import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { EVENT_TYPES, SCREEN_TYPES } from '@/lib/traffic';

/**
 * POST /api/track — مسار عام بيسجّل أحداث الزوار (مشاهدة صفحة، إضافة للسلة، بدء الطلب).
 * بيرجع 204 دايماً عشان مايعرفش المتصفح تفاصيل التخزين.
 */

const clip = (value: unknown, max: number): string | undefined =>
  typeof value === 'string' ? value.slice(0, max) : undefined;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const type = String(body.type ?? '');
  const sessionId = clip(body.sessionId, 64);
  const path = clip(body.path, 200);

  if (!(EVENT_TYPES as readonly string[]).includes(type) || !sessionId || !path) {
    return new NextResponse(null, { status: 400 });
  }
  if (path.startsWith('/admin')) {
    return new NextResponse(null, { status: 204 });
  }

  const screenValue = String(body.screen ?? '');
  const screen = (SCREEN_TYPES as readonly string[]).includes(screenValue) ? screenValue : 'desktop';

  try {
    const db = await getDb();
    await db.collection('events').insertOne({
      type,
      sessionId,
      path,
      productId: clip(body.productId, 100) ?? null,
      source: clip(body.source, 40) ?? 'مباشر / غير معروف',
      screen,
      createdAt: new Date(),
    });
  } catch {
    // التتبع مش بيوقف أي حاجة
  }

  return new NextResponse(null, { status: 204 });
}
