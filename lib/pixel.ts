import { createHash } from 'crypto';
import { getDb } from './mongodb';
import { STORE } from './store';

/**
 * إعدادات Meta Pixel و Conversions API (CAPI).
 * بتتخزن في collection: settings، والدوكيومنت id بتاعه = "pixel".
 */

export interface PixelSettings {
  pixelId: string;
  /** Pixel اختبار منفصل: لو متحدد، الموقع والـ CAPI بيبعتوا عليه بدل الإنتاجي */
  testPixelId: string;
  accessToken: string;
  testEventCode: string;
  enabled: boolean;
}

interface PixelDoc extends Partial<PixelSettings> {
  _id: string;
}

const EMPTY_SETTINGS: PixelSettings = {
  pixelId: '',
  testPixelId: '',
  accessToken: '',
  testEventCode: '',
  enabled: false,
};

export const isValidPixelId = (value: string) => /^\d{5,20}$/.test(value);
export const isValidTestEventCode = (value: string) => /^[A-Za-z0-9]{0,30}$/.test(value);

export async function getPixelSettings(): Promise<PixelSettings> {
  try {
    const db = await getDb();
    const doc = await db.collection<PixelDoc>('settings').findOne({ _id: 'pixel' });
    if (!doc) return EMPTY_SETTINGS;
    return {
      pixelId: doc.pixelId ?? '',
      testPixelId: doc.testPixelId ?? '',
      accessToken: doc.accessToken ?? '',
      testEventCode: doc.testEventCode ?? '',
      enabled: doc.enabled === true,
    };
  } catch {
    // لو قاعدة البيانات مش متاحة (مثلاً وقت البناء) نرجّع الإعدادات الفاضية
    return EMPTY_SETTINGS;
  }
}

/** بيحفظ الحقول اللي اتبعتت بس. الـ accessToken بيتحدّث لو اتبعت قيمة جديدة */
export async function savePixelSettings(update: Partial<PixelSettings>): Promise<void> {
  const db = await getDb();
  await db
    .collection<PixelDoc>('settings')
    .updateOne({ _id: 'pixel' }, { $set: update }, { upsert: true });
}

/** كود Meta Pixel الأساسي (بيتحقن في كل صفحة لو الـ Pixel مفعّل) */
export function metaPixelCode(pixelId: string): string {
  return `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`;
}

/** الـ Pixel اللي الموقع والـ CAPI بيشتغلوا عليه: الاختبار لو موجود، وإلا الإنتاجي */
export const activePixelId = (settings: Pick<PixelSettings, 'pixelId' | 'testPixelId'>): string =>
  settings.testPixelId && isValidPixelId(settings.testPixelId) ? settings.testPixelId : settings.pixelId;

const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

/** موبايل مصري بصيغة 01xxxxxxxxx → 201xxxxxxxxx (لازم يكون بالـ hash عشان Meta) */
const normalizePhone = (phone: string) => `20${phone.replace(/\D/g, '').slice(-10)}`;

/**
 * بيبعت حدث Purchase لـ Meta عن طريق Conversions API.
 * بيفشل بصمت لو Meta وقع أو الإعدادات ناقصة، عشان ما يوقفش الطلب.
 */
export async function sendPurchaseEvent(order: {
  orderNumber: string;
  phone: string;
  total: number;
}): Promise<void> {
  const settings = await getPixelSettings();
  const datasetId = activePixelId(settings);
  if (!settings.enabled || !isValidPixelId(datasetId) || !settings.accessToken) return;

  const body = {
    data: [
      {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: order.orderNumber,
        action_source: 'website',
        event_source_url: STORE.siteUrl,
        user_data: { ph: [sha256(normalizePhone(order.phone))] },
        custom_data: { currency: 'EGP', value: order.total },
      },
    ],
    ...(settings.testEventCode ? { test_event_code: settings.testEventCode } : {}),
  };

  try {
    await fetch(
      `https://graph.facebook.com/v19.0/${datasetId}/events?access_token=${encodeURIComponent(settings.accessToken)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(4000),
      },
    );
  } catch {
    // نتجاهل الخطأ: الطلب اتسجل خلاص
  }
}
