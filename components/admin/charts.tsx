/* رسومات SVG بسيطة بتتعرض على السيرفر — من غير مكتبات خارجية */

interface Point {
  label: string;
  value: number;
}

export function LineChart({ data, height = 240 }: { data: Point[]; height?: number }) {
  const W = 700;
  const H = height;
  const P = 28;
  const max = Math.max(1, ...data.map((d) => d.value));
  const step = data.length > 1 ? (W - P * 2) / (data.length - 1) : 0;
  const x = (i: number) => P + i * step;
  const y = (v: number) => H - P - (v / max) * (H - P * 2);
  const points = data.map((d, i) => `${x(i)},${y(d.value)}`).join(' ');
  const area = data.length
    ? `${x(0)},${H - P} ${points} ${x(data.length - 1)},${H - P}`
    : '';
  const labelEvery = Math.max(1, Math.ceil(data.length / 8));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="رسم بياني للأداء اليومي">
      <defs>
        <linearGradient id="bosla-line-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C9A86A" stopOpacity="0.35" />
          <stop offset="1" stopColor="#C9A86A" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((t) => (
        <g key={t}>
          <line x1={P} x2={W - P} y1={y(max * t)} y2={y(max * t)} stroke="#D4D4D8" strokeOpacity="0.12" />
          <text x={P} y={y(max * t) - 6} fill="#D4D4D8" fillOpacity="0.5" fontSize="11">
            {Math.round(max * t).toLocaleString('ar-EG')}
          </text>
        </g>
      ))}
      {data.length > 0 && <polygon points={area} fill="url(#bosla-line-fill)" />}
      <polyline points={points} fill="none" stroke="#C9A86A" strokeWidth="2.5" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={d.label + i}>
          <circle cx={x(i)} cy={y(d.value)} r="3" fill="#C9A86A" />
          {i % labelEvery === 0 && (
            <text x={x(i)} y={H - 8} textAnchor="middle" fill="#D4D4D8" fillOpacity="0.5" fontSize="11">
              {d.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

export function DonutChart({ items }: { items: { label: string; value: number; color: string }[] }) {
  const total = items.reduce((sum, i) => sum + i.value, 0);
  const R = 60;
  const C = 2 * Math.PI * R;
  let acc = 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <svg viewBox="0 0 160 160" className="h-40 w-40 shrink-0" role="img" aria-label="توزيع الحالات">
        <circle cx="80" cy="80" r={R} fill="none" stroke="#D4D4D8" strokeOpacity="0.1" strokeWidth="22" />
        {total > 0 &&
          items.map((item) => {
            const len = (item.value / total) * C;
            const offset = -acc;
            acc += len;
            return item.value > 0 ? (
              <circle
                key={item.label}
                cx="80"
                cy="80"
                r={R}
                fill="none"
                stroke={item.color}
                strokeWidth="22"
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={offset}
                transform="rotate(-90 80 80)"
              />
            ) : null;
          })}
        <text x="80" y="78" textAnchor="middle" fill="#16203F" fontSize="22">{total}</text>
        <text x="80" y="98" textAnchor="middle" fill="#D4D4D8" fillOpacity="0.5" fontSize="11">طلب</text>
      </svg>
      <ul className="grid w-full gap-2 text-sm">
        {items.map((item) => (
          <li key={item.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-bosla-silver/80">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} aria-hidden="true" />
              {item.label}
            </span>
            <span className="text-bosla-white">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BarList({
  items,
  suffix = '',
}: {
  items: { label: string; value: number; sub?: string }[];
  suffix?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  if (items.length === 0) {
    return <p className="text-sm text-bosla-silver/50">مفيش بيانات في الفترة دي.</p>;
  }
  return (
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <li key={item.label} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-bosla-silver/85">{item.label}</span>
            <span className="text-bosla-white">
              {item.value.toLocaleString('ar-EG')}
              {suffix}
              {item.sub && <span className="mr-2 text-xs text-bosla-silver/50">{item.sub}</span>}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-bosla-graphite">
            <div className="h-full rounded-full bg-bosla-gold" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
