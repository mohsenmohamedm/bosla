import { getDb } from './mongodb';
import { DEFAULT_PUBLIC_CONFIG, type PublicStoreConfig } from './shipping';

/**
 * إعدادات المتجر (collection: settings، _id: 'store').
 * كل القيم هنا بتتعدل من صفحة الإعدادات في الداشبورد.
 */

export interface StorePolicies {
  shipping: string;
  returns: string;
  privacy: string;
}

export interface StoreSettings extends PublicStoreConfig {
  policies: StorePolicies;
  policiesEn: StorePolicies;
}

interface StoreSettingsDoc {
  _id: string;
  acceptingOrders?: boolean;
  codEnabled?: boolean;
  shippingOther?: number;
  shippingCairoGiza?: number;
  freeShippingFrom?: number;
  policies?: Partial<StorePolicies>;
  policiesEn?: Partial<StorePolicies>;
  updatedAt?: Date;
}

const EMPTY_POLICIES: StorePolicies = { shipping: '', returns: '', privacy: '' };

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  ...DEFAULT_PUBLIC_CONFIG,
  policies: { ...EMPTY_POLICIES },
  policiesEn: { ...EMPTY_POLICIES },
};

export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const db = await getDb();
    const doc = await db.collection<StoreSettingsDoc>('settings').findOne({ _id: 'store' });
    return {
      acceptingOrders: doc?.acceptingOrders !== false,
      codEnabled: doc?.codEnabled !== false,
      shippingOther: doc?.shippingOther ?? DEFAULT_PUBLIC_CONFIG.shippingOther,
      shippingCairoGiza: doc?.shippingCairoGiza ?? DEFAULT_PUBLIC_CONFIG.shippingCairoGiza,
      freeShippingFrom: doc?.freeShippingFrom ?? 0,
      policies: { ...EMPTY_POLICIES, ...doc?.policies },
      policiesEn: { ...EMPTY_POLICIES, ...doc?.policiesEn },
    };
  } catch {
    // لو الداتابيز وقعت، نفضل نستقبل طلبات بالقيم الافتراضية بدل ما نقفل المتجر
    return DEFAULT_STORE_SETTINGS;
  }
}

/** الجزء اللي الموقع العام محتاجه بس (من غير السياسات) */
export const toPublicConfig = (settings: StoreSettings): PublicStoreConfig => ({
  acceptingOrders: settings.acceptingOrders,
  codEnabled: settings.codEnabled,
  shippingOther: settings.shippingOther,
  shippingCairoGiza: settings.shippingCairoGiza,
  freeShippingFrom: settings.freeShippingFrom,
});

/** بيحدّث الحقول اللي جاية بس، والسياسات بتتحدث حقل حقل */
export async function updateStoreSettings(patch: Partial<StoreSettings>): Promise<void> {
  const $set: Record<string, unknown> = { updatedAt: new Date() };
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue;
    if (key === 'policies' || key === 'policiesEn') {
      for (const [field, text] of Object.entries(value as Partial<StorePolicies>)) {
        $set[`${key}.${field}`] = text;
      }
    } else {
      $set[key] = value;
    }
  }
  const db = await getDb();
  await db
    .collection<StoreSettingsDoc>('settings')
    .updateOne({ _id: 'store' }, { $set: $set as Partial<StoreSettingsDoc> }, { upsert: true });
}

export async function setAcceptingOrders(open: boolean): Promise<void> {
  await updateStoreSettings({ acceptingOrders: open });
}
