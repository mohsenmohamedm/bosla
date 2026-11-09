import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getProductById } from '@/lib/products-db';
import { sendPurchaseEvent } from '@/lib/pixel';
import { getStoreSettings } from '@/lib/store-settings';
import { shippingFor } from '@/lib/shipping';
import {
  GOVERNORATES,
  STORE,
  createOrderId,
  isValidEgyptianPhone,
} from '@/lib/store';

/**
 * POST /api/orders
 * بيستقبل بيانات العميل والمنتجات (ID والكمية بس).
 * الأسعار بتتقرأ من قاعدة البيانات على السيرفر، فالعميل مايقدرش يغيّر السعر.
 * المخزون بيتخصم للمنتجات اللي المخزون بتاعها متتبع (رقم). الطلب مش بيتوقف بسببه.
 */

interface IncomingItem {
  productId: string;
  quantity: number;
}

interface IncomingBody {
  customer: {
    name: string;
    phone: string;
    governorate: string;
    address: string;
    notes?: string;
  };
  items: IncomingItem[];
}

const badRequest = (message: string) =>
  NextResponse.json({ error: message }, { status: 400 });

export async function POST(request: Request) {
  const settings = await getStoreSettings();
  if (!settings.acceptingOrders) {
    return NextResponse.json({ error: 'استقبال الطلبات متوقف مؤقتاً، حاول بعد شوية' }, { status: 403 });
  }
  if (!settings.codEnabled) {
    return NextResponse.json({ error: 'الدفع عند الاستلام مش متاح حالياً' }, { status: 403 });
  }

  let body: IncomingBody;
  try {
    body = (await request.json()) as IncomingBody;
  } catch {
    return badRequest('البيانات مش صحيحة');
  }

  const { customer, items } = body ?? {};

  if (!customer || typeof customer.name !== 'string' || customer.name.trim().length < 3) {
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
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return badRequest('السلة فاضية');
  }

  // نحسب الأسعار من قاعدة البيانات
  const orderItems = [];
  for (const item of items) {
    const product = await getProductById(String(item.productId));
    const quantity = Number(item.quantity);
    if (!product) return badRequest('منتج مش موجود أو اتشال من المتجر');
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return badRequest('الكمية مش صحيحة');
    }
    orderItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    });
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = shippingFor(settings, customer.governorate, subtotal);
  const total = subtotal + shipping;

  const orderNumber = createOrderId();
  const phone = customer.phone.replace(/\s|-/g, '');

  const db = await getDb();
  await db.collection('orders').insertOne({
    orderNumber,
    status: 'new',
    customer: {
      name: customer.name.trim(),
      phone,
      governorate: customer.governorate,
      address: customer.address.trim(),
      notes: customer.notes?.trim() || '',
    },
    items: orderItems,
    subtotal,
    shipping,
    total,
    paymentMethod: STORE.paymentMethod,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // خصم المخزون للمنتجات اللي مخزونها متتبع بس
  await Promise.all(
    orderItems.map((item) =>
      db.collection('products').updateOne(
        { id: item.productId, stock: { $type: 'number' } },
        { $inc: { stock: -item.quantity } },
      ),
    ),
  );

  // إرسال حدث الشراء لـ Meta (لو الـ Pixel مفعّل)
  await sendPurchaseEvent({ orderNumber, phone, total });

  return NextResponse.json({ id: orderNumber, total }, { status: 201 });
}
