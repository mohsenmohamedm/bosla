import { NextResponse } from 'next/server';
import { isAdminSession } from '@/lib/admin-session';
import { updateStoreSettings, type StoreSettings } from '@/lib/store-settings';

/** PUT /api/admin/store-settings — حفظ إعدادات المتجر (للأدمن بس) */

const NUMBER_FIELDS = ['shippingOther', 'shippingCairoGiza', 'freeShippingFrom'] as const;
const POLICY_FIELDS = ['shipping', 'returns', 'privacy'] as const;
const MAX_POLICY_LENGTH = 5000;

const sanitizePolicies = (input: unknown) => {
  const source = (input ?? {}) as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const field of POLICY_FIELDS) {
    const value = source[field];
    if (typeof value === 'string') out[field] = value.slice(0, MAX_POLICY_LENGTH);
  }
  return out;
};

export async function PUT(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ error: 'البيانات مش صحيحة' }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};

  for (const field of NUMBER_FIELDS) {
    if (body[field] === undefined) continue;
    const value = Number(body[field]);
    if (!Number.isInteger(value) || value < 0 || value > 100000) {
      return NextResponse.json({ error: 'قيمة الشحن لازم تكون رقم صحيح من 0 لـ 100000' }, { status: 400 });
    }
    patch[field] = value;
  }

  if (body.codEnabled !== undefined) {
    if (typeof body.codEnabled !== 'boolean') {
      return NextResponse.json({ error: 'قيمة الدفع عند الاستلام مش صحيحة' }, { status: 400 });
    }
    patch.codEnabled = body.codEnabled;
  }

  if (body.policies !== undefined) patch.policies = sanitizePolicies(body.policies);
  if (body.policiesEn !== undefined) patch.policiesEn = sanitizePolicies(body.policiesEn);

  await updateStoreSettings(patch as Partial<StoreSettings>);
  return NextResponse.json({ ok: true });
}
