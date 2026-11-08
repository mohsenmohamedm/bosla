import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE,
  checkAdminCredentials,
  createAdminToken,
} from '@/lib/admin-auth';

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'بيانات غلط' }, { status: 400 });
  }

  if (!body.email || !body.password || !checkAdminCredentials(body.email, body.password)) {
    return NextResponse.json({ error: 'الإيميل أو الباسورد غلط' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createAdminToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
