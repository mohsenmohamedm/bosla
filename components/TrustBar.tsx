/**
 * شريط الثقة تحت الهيرو: أربع نقاط بأيقونة وسطرين نص.
 * (من غير ذكر الشحن، حسب الطلب.)
 */
const ITEMS = [
  { title: 'منتجات أصلية', sub: 'من موردين معتمدين', icon: 'M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z' },
  { title: 'استبدال واسترجاع', sub: 'سياسة واضحة', icon: 'M4 12a8 8 0 0 1 14-5.3L20 9M20 12a8 8 0 0 1-14 5.3L4 15M20 4v5h-5M4 20v-5h5' },
  { title: 'دفع آمن', sub: 'طرق دفع متعددة ومشفّرة', icon: 'M3 10h18v9H3zM3 7h18' },
  { title: 'دعم واتساب', sub: 'نرد عليك بسرعة', icon: 'M4 5h16v11H8l-4 4z' },
];

export default function TrustBar() {
  return (
    <section aria-label="ضمانات بوصلة" className="border-b border-bosla-gold/10 bg-bosla-black">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-5 px-4 py-6 md:grid-cols-4 md:gap-6 md:px-8 md:py-8">
        {ITEMS.map((item) => (
          <li key={item.title} className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bosla-graphite text-bosla-gold">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={item.icon} />
              </svg>
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-bold text-bosla-white">{item.title}</span>
              <span className="text-xs text-bosla-silver">{item.sub}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
