import { cookies } from 'next/headers';
import { ADMIN_COOKIE, isValidAdminToken } from './admin-auth';

/** بيرجع true لو الأدمن مسجل دخول (للاستخدام في الصفحات والـ API) */
export async function isAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidAdminToken(cookieStore.get(ADMIN_COOKIE)?.value);
}
