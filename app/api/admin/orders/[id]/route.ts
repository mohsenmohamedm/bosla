import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, isValidAdminToken } from '@/lib/admin-auth';
import { getDb } from '@/lib/mongodb';
import { isOrderStatus } from '@/lib/orders';
import { GOVERNORATES, isValidEgyptianPhone } from '@/lib/store';

/**
 * PATCH /api/admin/orders/[id] — تعديل حالة الطلب وبيانات العميل (للأدمن بس).
 * كل الحقول اختيارية، والتحقق بيتم على كل حقل بيتبعت.
 */

interface CustomerPatch {
  name?: unknown;
  phone?: unknown;
  governorate?: unknown;
  address?: unknown;
  notes?: unknown;
}

interface OrderPatchBody {
  status?: unknown;
  customer?: CustomerPatch;
}

const badRequest = (message: string) => NextResponse.json({ error: message }, { status: 400 });

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  if (!isValidAdminToken(cookieStore.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: 'مش مسموح' }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as OrderPatchBody | null;
  if (!body) return badRequest('البيانات مش صحيحة');

  const $set: Record<string, unknown> = { updatedAt: new Date() };

  if (body.status !== undefined) {
    if (!isOrderStatus(body.status)) return badRequest('الحالة مش صحيحة');
    $set.status = body.status;
  }

  if (body.customer) {
    const customer = body.customer;

    if (typeof customer.name !== 'string' || customer.name.trim().length < 3) {
      return badRequest('اكتب الاسم بالكامل');
    }
    if (typeof customer.phone !== 'string' || !isValidEgyptianPhone(customer.phone)) {
      return badRequest('رقم الموبايل مش صحيح');
    }
    if (!GOVERNORATES.includes(customer.governorate as (typeof GOVERNORATES)[number])) {
      return badRequest('المحافظة مش صحيحة');
    }
    if (typeof customer.address !== 'string' || customer.address.trim().length < 10) {
      return badRequest('اكتب العنوان بالتفصيل');
    }

    $set['customer.name'] = customer.name.trim().slice(0, 100);
    $set['customer.phone'] = customer.phone.replace(/\s|-/g, '');
    $set['customer.governorate'] = customer.governorate;
    $set['customer.address'] = customer.address.trim().slice(0, 300);
    $set['customer.notes'] =
      typeof customer.notes === 'string' ? customer.notes.trim().slice(0, 500) : '';
  }

  const db = await getDb();
  const result = await db
    .collection('orders')
    .updateOne({ orderNumber: id }, { $set });

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'الطلب مش موجود' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
