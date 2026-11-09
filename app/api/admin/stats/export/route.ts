import { isAdminSession } from '@/lib/admin-session';
import { getStatsData } from '@/lib/analytics';
import { isRangeKey } from '@/lib/traffic';

/**
 * GET /api/admin/stats/export?range=30d — تصدير الإحصائيات CSV (للأدمن بس).
 * الملف فيه 4 أقسام: الملخص، الأداء اليومي، المحافظات، المنتجات.
 */

const cell = (value: unknown) => {
  let text = value === undefined || value === null ? '' : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};

export async function GET(request: Request) {
  if (!(await isAdminSession())) {
    return new Response('غير مصرح', { status: 401 });
  }

  const range = new URL(request.url).searchParams.get('range') ?? '';
  if (!isRangeKey(range)) {
    return new Response('الفترة مش صحيحة', { status: 400 });
  }

  const data = await getStatsData(range);
  const sections: (string | number)[][][] = [
    [
      ['الفترة', data.rangeLabel],
      ['الزيارات', data.visits],
      ['المشاهدات', data.views],
      ['الطلبات', data.orders],
      ['نسبة التحويل %', data.conversion.toFixed(2)],
      ['صافي الإيراد (ج.م)', data.netRevenue],
      ['متوسط الطلب (ج.م)', data.avgOrder.toFixed(2)],
    ],
    [
      ['اليوم', 'الزيارات', 'المشاهدات', 'الطلبات', 'الإيراد (ج.م)'],
      ...data.daily.map((d) => [d.day, d.visits, d.views, d.orders, d.revenue]),
    ],
    [
      ['المحافظة', 'عدد الطلبات'],
      ...data.governorates.map((g) => [g.label, g.value]),
    ],
    [
      ['المنتج', 'المشاهدات', 'إضافة للسلة', 'المباع', 'الإيراد (ج.م)', 'المخزون'],
      ...data.products.map((p) => [p.name, p.views, p.carts, p.sold, p.revenue, p.stock ?? 'غير متتبع']),
    ],
  ];

  const titles = ['الملخص', 'الأداء اليومي', 'المحافظات', 'المنتجات'];
  const lines: string[] = [];
  sections.forEach((rows, index) => {
    lines.push(cell(titles[index]));
    rows.forEach((row) => lines.push(row.map(cell).join(',')));
    lines.push('');
  });

  const csv = '\uFEFF' + lines.join('\r\n');
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="bosla-stats-${range}-${stamp}.csv"`,
    },
  });
}
