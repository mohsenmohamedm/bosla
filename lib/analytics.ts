import { getDb } from './mongodb';
import { getAllProducts } from './products-db';
import type { StoredOrder } from './admin-orders';
import { ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from './orders';
import { RANGES, SOURCES, type RangeKey } from './traffic';

/**
 * حسابات صفحة الإحصائيات. كل الأرقام محسوبة من collections: orders و events.
 * التاريخ بتوقيت القاهرة عشان اليوم يبدأ في نفس الوقت اللي الأدمن شايفه.
 */

export interface TrackEvent {
  type: string;
  sessionId: string;
  path: string;
  productId?: string | null;
  source: string;
  screen: string;
  createdAt: Date;
}

const DAY_MS = 86_400_000;

const cairoDay = (date: Date) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Cairo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);

const uniqueCount = (items: TrackEvent[]) => new Set(items.map((e) => e.sessionId)).size;

export interface DailyPoint {
  day: string;
  visits: number;
  views: number;
  orders: number;
  revenue: number;
}

export interface StatsData {
  rangeLabel: string;
  visits: number;
  views: number;
  orders: number;
  netRevenue: number;
  avgOrder: number;
  conversion: number;
  daily: DailyPoint[];
  statusCounts: { status: OrderStatus; label: string; value: number }[];
  governorates: { label: string; value: number }[];
  funnel: { label: string; value: number }[];
  sources: { label: string; value: number }[];
  screens: { label: string; value: number }[];
  products: {
    id: string;
    name: string;
    views: number;
    carts: number;
    sold: number;
    revenue: number;
    stock: number | null;
  }[];
  insights: string[];
}

export async function getStatsData(range: RangeKey): Promise<StatsData> {
  const { days, label } = RANGES[range];
  const now = Date.now();
  const since = new Date(now - days * DAY_MS);

  const dayKeys: string[] = [];
  for (let i = days - 1; i >= 0; i--) dayKeys.push(cairoDay(new Date(now - i * DAY_MS)));

  const db = await getDb();
  const [orders, events, products] = await Promise.all([
    db.collection<StoredOrder>('orders').find({ createdAt: { $gte: since } }).toArray(),
    db.collection<TrackEvent>('events').find({ createdAt: { $gte: since } }).toArray(),
    getAllProducts(),
  ]);

  const pageviews = events.filter((e) => e.type === 'pageview');
  const netOrders = orders.filter((o) => o.status !== 'cancelled');

  const visits = uniqueCount(pageviews);
  const views = pageviews.length;
  const orderCount = orders.length;
  const netRevenue = netOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrder = netOrders.length ? netRevenue / netOrders.length : 0;
  const conversion = visits ? (orderCount / visits) * 100 : 0;

  const daily: DailyPoint[] = dayKeys.map((day) => {
    const dayViews = pageviews.filter((e) => cairoDay(e.createdAt) === day);
    const dayOrders = orders.filter((o) => cairoDay(o.createdAt) === day);
    const dayNet = dayOrders.filter((o) => o.status !== 'cancelled');
    return {
      day,
      visits: uniqueCount(dayViews),
      views: dayViews.length,
      orders: dayOrders.length,
      revenue: dayNet.reduce((sum, o) => sum + o.total, 0),
    };
  });

  const statusCounts = ORDER_STATUSES.map((status) => ({
    status,
    label: ORDER_STATUS_LABELS[status],
    value: orders.filter((o) => o.status === status).length,
  }));

  const governorateMap = new Map<string, number>();
  for (const order of orders) {
    const key = order.customer.governorate;
    governorateMap.set(key, (governorateMap.get(key) ?? 0) + 1);
  }
  const governorates = [...governorateMap.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const carted = events.filter((e) => e.type === 'add_to_cart');
  const checkedOut = events.filter((e) => e.type === 'checkout_start');
  const funnel = [
    { label: 'زوار الموقع', value: uniqueCount(events) },
    { label: 'أضافوا منتج للسلة', value: uniqueCount(carted) },
    { label: 'فتحوا صفحة الدفع', value: uniqueCount(checkedOut) },
    { label: 'أكملوا الطلب', value: orderCount },
  ];

  const sources = SOURCES.map((source) => ({
    label: source,
    value: uniqueCount(pageviews.filter((e) => e.source === source)),
  })).filter((s) => s.value > 0);

  const screens = ['desktop', 'mobile'].map((screen) => ({
    label: screen === 'desktop' ? 'ديسكتوب' : 'موبايل',
    value: uniqueCount(pageviews.filter((e) => e.screen === screen)),
  }));

  const productRows = products
    .map((product) => {
      const lines = netOrders.flatMap((o) => o.items.filter((i) => i.productId === product.id));
      const sold = lines.reduce((sum, i) => sum + i.quantity, 0);
      return {
        id: product.id,
        name: product.name,
        views: pageviews.filter((e) => e.productId === product.id).length,
        carts: carted.filter((e) => e.productId === product.id).length,
        sold,
        revenue: lines.reduce((sum, i) => sum + i.price * i.quantity, 0),
        stock: typeof product.stock === 'number' ? product.stock : null,
      };
    })
    .sort((a, b) => b.revenue - a.revenue || b.views - a.views);

  const bestDay = daily.reduce((best, d) => (d.revenue > best.revenue ? d : best), daily[0]);
  const topGov = governorates[0];
  const insights: string[] = [];
  if (bestDay && bestDay.revenue > 0) {
    insights.push(`أعلى يوم في الإيراد كان ${bestDay.day} بإجمالي ${bestDay.revenue.toLocaleString('ar-EG')} ج.م.`);
  }
  if (topGov) {
    insights.push(`أكتر محافظة طلبات: ${topGov.label} بـ ${topGov.value} طلب.`);
  }
  const abandoned = Math.max(0, uniqueCount(carted) - uniqueCount(checkedOut));
  if (uniqueCount(carted) > 0) {
    insights.push(`${abandoned} زائر أضافوا للسلة ومافتحوش صفحة الدفع في الفترة دي.`);
  }
  insights.push(`نسبة التحويل (طلبات ÷ زيارات) ${conversion.toFixed(1)}%.`);

  return {
    rangeLabel: label,
    visits,
    views,
    orders: orderCount,
    netRevenue,
    avgOrder,
    conversion,
    daily,
    statusCounts,
    governorates,
    funnel,
    sources,
    screens,
    products: productRows,
    insights,
  };
}
