import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE, isValidAdminToken } from '@/lib/admin-auth';
import { getStatsData } from '@/lib/analytics';
import { RANGES, isRangeKey, type RangeKey } from '@/lib/traffic';
import { formatPrice } from '@/lib/store';
import { BarList, DonutChart, LineChart } from '@/components/admin/charts';
import { STATUS_BADGE_CLASSES } from '@/lib/admin-orders';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

const METRICS = {
  visits: { label: 'الزيارات' },
  views: { label: 'المشاهدات' },
  orders: { label: 'الطلبات' },
  revenue: { label: 'الإيراد' },
} as const;
type MetricKey = keyof typeof METRICS;
const isMetric = (value: unknown): value is MetricKey =>
  typeof value === 'string' && value in METRICS;

const STATUS_COLORS: Record<string, string> = {
  new: '#C9A86A',
  confirmed: '#38bdf8',
  shipped: '#a78bfa',
  delivered: '#34d399',
  cancelled: '#f87171',
};

interface PageProps {
  searchParams: Promise<{ range?: string; metric?: string }>;
}

export default async function AdminStatsPage({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  if (!isValidAdminToken(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect('/admin/login');
  }

  const params = await searchParams;
  const range: RangeKey = isRangeKey(params.range) ? params.range : '30d';
  const metric: MetricKey = isMetric(params.metric) ? params.metric : 'visits';
  const data = await getStatsData(range);

  const cards = [
    { label: 'الزيارات', value: data.visits.toLocaleString('ar-EG') },
    { label: 'المشاهدات', value: data.views.toLocaleString('ar-EG') },
    { label: 'الطلبات', value: data.orders.toLocaleString('ar-EG') },
    { label: 'نسبة التحويل', value: `${data.conversion.toFixed(1)}%` },
    { label: 'صافي الإيراد', value: formatPrice(data.netRevenue) },
    { label: 'متوسط الطلب', value: formatPrice(data.avgOrder) },
  ];

  const series = data.daily.map((d) => ({
    label: d.day.slice(5),
    value: d[metric],
  }));

  const pillClass = (active: boolean) =>
    `shrink-0 rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
      active
        ? 'bg-bosla-gold text-bosla-black'
        : 'border border-bosla-silver/20 text-bosla-silver/80 hover:border-bosla-gold hover:text-bosla-gold'
    }`;

  const panel = 'rounded-2xl border border-bosla-silver/10 bg-bosla-charcoal/60 p-6';

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-bosla-white">الإحصائيات</h1>
          <p className="mt-2 text-sm text-bosla-silver/60">أداء المتجر — {data.rangeLabel}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
        <a href={`/api/admin/stats/export?range=${range}`} className="rounded-full border border-bosla-gold/50 px-4 py-2 text-sm text-bosla-gold transition-colors hover:bg-bosla-gold/10">تصدير CSV</a>
        <nav aria-label="الفترة الزمنية" className="flex gap-2">
          {(Object.keys(RANGES) as RangeKey[]).map((key) => (
            <Link key={key} href={`/admin/stats?range=${key}&metric=${metric}`} className={pillClass(range === key)}>
              {RANGES[key].label}
            </Link>
          ))}
        </nav>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className={panel}>
            <p className="text-xs text-bosla-silver/50">{card.label}</p>
            <p className="mt-3 font-display text-3xl text-bosla-gold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className={panel}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-lg text-bosla-white">الأداء اليومي</h2>
          <nav aria-label="المقياس" className="flex gap-2 overflow-x-auto">
            {(Object.keys(METRICS) as MetricKey[]).map((key) => (
              <Link key={key} href={`/admin/stats?range=${range}&metric=${key}`} className={pillClass(metric === key)}>
                {METRICS[key].label}
              </Link>
            ))}
          </nav>
        </div>
        <LineChart data={series} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className={panel}>
          <h2 className="mb-6 font-display text-lg text-bosla-white">الطلبات حسب الحالة</h2>
          <DonutChart
            items={data.statusCounts.map((s) => ({ label: s.label, value: s.value, color: STATUS_COLORS[s.status] }))}
          />
        </div>
        <div className={panel}>
          <h2 className="mb-6 font-display text-lg text-bosla-white">ملاحظات سريعة</h2>
          <ul className="flex flex-col gap-3 text-sm text-bosla-silver/80">
            {data.insights.map((line) => (
              <li key={line} className="rounded-xl border border-bosla-silver/10 bg-bosla-black p-4">
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            {data.statusCounts.map((s) => (
              <span key={s.status} className={`rounded-full border px-3 py-1 text-xs ${STATUS_BADGE_CLASSES[s.status]}`}>
                {s.label}: {s.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className={panel}>
          <h2 className="mb-6 font-display text-lg text-bosla-white">أكتر المحافظات طلبات</h2>
          <BarList items={data.governorates} />
        </div>
        <div className={panel}>
          <h2 className="mb-6 font-display text-lg text-bosla-white">نشاط الزيارات (قمع البيع)</h2>
          <BarList items={data.funnel} />
        </div>
        <div className={panel}>
          <h2 className="mb-6 font-display text-lg text-bosla-white">مصادر الزيارات</h2>
          <BarList items={data.sources} />
        </div>
        <div className={panel}>
          <h2 className="mb-6 font-display text-lg text-bosla-white">أحجام الشاشات</h2>
          <BarList items={data.screens} />
        </div>
      </div>

      <div className={`${panel} overflow-x-auto`}>
        <h2 className="mb-6 font-display text-lg text-bosla-white">أداء المنتجات</h2>
        {data.products.length === 0 ? (
          <p className="text-sm text-bosla-silver/50">مفيش منتجات.</p>
        ) : (
          <table className="w-full min-w-[640px] text-right text-sm">
            <thead className="border-b border-bosla-silver/10 text-xs text-bosla-silver/50">
              <tr>
                <th className="px-3 py-3 font-normal">المنتج</th>
                <th className="px-3 py-3 font-normal">المشاهدات</th>
                <th className="px-3 py-3 font-normal">إضافة للسلة</th>
                <th className="px-3 py-3 font-normal">المباع</th>
                <th className="px-3 py-3 font-normal">الإيراد</th>
                <th className="px-3 py-3 font-normal">المخزون</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((p) => (
                <tr key={p.id} className="border-b border-bosla-silver/5 last:border-0">
                  <td className="px-3 py-3 text-bosla-white">{p.name}</td>
                  <td className="px-3 py-3 text-bosla-silver/80">{p.views}</td>
                  <td className="px-3 py-3 text-bosla-silver/80">{p.carts}</td>
                  <td className="px-3 py-3 text-bosla-silver/80">{p.sold}</td>
                  <td className="px-3 py-3 text-bosla-gold">{formatPrice(p.revenue)}</td>
                  <td className="px-3 py-3 text-bosla-silver/80">{p.stock === null ? 'غير متتبع' : p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
