/**
 * منطق الشحن والإعدادات اللي محتاجها الموقع (client + server).
 * الأرقام بتيجي من الداتابيز (settings: store) عن طريق layout، مش من الكود.
 */

export interface PublicStoreConfig {
  acceptingOrders: boolean;
  codEnabled: boolean;
  /** شحن باقي المحافظات بالجنيه */
  shippingOther: number;
  /** شحن القاهرة والجيزة بالجنيه */
  shippingCairoGiza: number;
  /** الشحن مجاني لو الإجمالي وصل للمبلغ ده (0 = مفيش شحن مجاني) */
  freeShippingFrom: number;
}

export const DEFAULT_PUBLIC_CONFIG: PublicStoreConfig = {
  acceptingOrders: true,
  codEnabled: true,
  shippingOther: 75,
  shippingCairoGiza: 75,
  freeShippingFrom: 0,
};

const CAIRO_GIZA = ['القاهرة', 'الجيزة'];

/**
 * الشحن لطلب معين.
 * لو المحافظة لسه متختارتش، بيرجع أقل سعر شحن (عشان نعرضه كـ "يبدأ من").
 */
export function shippingFor(config: PublicStoreConfig, governorate: string, subtotal: number): number {
  if (config.freeShippingFrom > 0 && subtotal >= config.freeShippingFrom) return 0;
  if (CAIRO_GIZA.includes(governorate)) return config.shippingCairoGiza;
  if (governorate) return config.shippingOther;
  return Math.min(config.shippingOther, config.shippingCairoGiza);
}
