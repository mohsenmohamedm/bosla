import { NextResponse } from 'next/server';
import { isAdminSession } from '@/lib/admin-session';
import { isValidPixelId, isValidTestEventCode, savePixelSettings, type PixelSettings } from '@/lib/pixel';

/** PUT /api/admin/pixel — حفظ إعدادات Meta Pixel و CAPI (للأدمن بس) */
export async function PUT(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'لازم تسجل دخول الأول' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: 'البيانات مش صحيحة' }, { status: 400 });

  const pixelId = typeof body.pixelId === 'string' ? body.pixelId.trim() : '';
  const testPixelId = typeof body.testPixelId === 'string' ? body.testPixelId.trim() : '';
  const testEventCode = typeof body.testEventCode === 'string' ? body.testEventCode.trim() : '';
  const accessToken = typeof body.accessToken === 'string' ? body.accessToken.trim() : '';
  const enabled = body.enabled === true;

  if (pixelId && !isValidPixelId(pixelId)) {
    return NextResponse.json({ error: 'رقم الـ Pixel لازم يكون أرقام بس' }, { status: 400 });
  }
  if (testPixelId && !isValidPixelId(testPixelId)) {
    return NextResponse.json({ error: 'رقم Pixel الاختبار لازم يكون أرقام بس' }, { status: 400 });
  }
  if (!isValidTestEventCode(testEventCode)) {
    return NextResponse.json({ error: 'كود الاختبار لازم يكون حروف وأرقام بس' }, { status: 400 });
  }
  if (accessToken.length > 500) {
    return NextResponse.json({ error: 'التوكن طويل أوي' }, { status: 400 });
  }
  if (enabled && (!pixelId || (!accessToken && !(body.hasToken === true)))) {
    return NextResponse.json({ error: 'لتفعيل الـ Pixel لازم رقم الـ Pixel والتوكن' }, { status: 400 });
  }

  const update: Partial<PixelSettings> = { pixelId, testPixelId, testEventCode, enabled };
  if (accessToken) update.accessToken = accessToken;

  await savePixelSettings(update);
  return NextResponse.json({ ok: true });
}
