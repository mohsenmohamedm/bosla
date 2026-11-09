/**
 * شريط الثقة: كارت أبيض عايم فوق نهاية الهيرو، أربع نقاط عامة.
 */
const ITEMS = [
  { title: 'منتجات أصلية', sub: 'مطابقة للوصف', icon: 'M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3zM9 12l2 2 4-4' },
  { title: 'استبدال واسترجاع', sub: 'سياسة واضحة', icon: 'M4 12a8 8 0 0 1 14-5.3L20 9M20 12a8 8 0 0 1-14 5.3L4 15M20 4v5h-5M4 20v-5h5' },
  { title: 'دفع آمن', sub: 'الدفع عند الاستلام', icon: 'M3 10h18v9H3zM3 7h18' },
  { title: 'توصيل سريع', sub: 'لكل المحافظات', icon: 'M3 7h11v9H3zM14 10h4l3 3v3h-7' },
];

export default function TrustBar() {
  return (
    <section aria-label="مميزات بوصلة" className="relative z-10 mx-auto -mt-10 max-w-6xl px-4 md:-mt-12 md:px-8">
      <ul className="grid grid-cols-2 gap-x-3 gap-y-5 rounded-3xl border border-bosla-gold/10 bg-white p-5 shadow-[0_12px_40px_-12px_rgba(6,48,46,0.25)] md:grid-cols-4 md:gap-6 md:p-7">
        {ITEMS.map((item) => (
          <li key={item.title} className="flex flex-col items-center gap-2 text-center md:flex-row md:gap-3 md:text-start">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-bosla-graphite text-bosla-gold">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={item.icon} />
              </svg>
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-bold text-bosla-white md:text-base">{item.title}</span>
              <span className="text-xs text-bosla-silver">{item.sub}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
