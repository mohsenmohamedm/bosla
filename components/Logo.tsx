/**
 * شعار "بوصلة": العلامة فوق، والاسم تحتها، والجملة "مقصودك.. أينما كنت" تحت الاسم.
 *
 * - primary:   العلامة + الاسم + الجملة (الهيدر)
 * - secondary: العلامة + الاسم بس (الفوتر)
 */

export function BoslaMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 118" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="bm-ring" x1="10" y1="20" x2="90" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#9FB3B1" />
          <stop offset="0.45" stopColor="#4F6B69" />
          <stop offset="1" stopColor="#B7C7C5" />
        </linearGradient>
        <linearGradient id="bm-teal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0B6E6B" />
          <stop offset="1" stopColor="#074F4D" />
        </linearGradient>
        <linearGradient id="bm-needle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF8470" />
          <stop offset="1" stopColor="#FF6F5E" />
        </linearGradient>
      </defs>
      {/* حلقة التعليق */}
      <circle cx="50" cy="9" r="7" stroke="url(#bm-ring)" strokeWidth="3.5" />
      <rect x="45.5" y="15" width="9" height="11" rx="2" fill="url(#bm-ring)" />
      {/* إطار البوصلة */}
      <circle cx="50" cy="70" r="42" stroke="url(#bm-ring)" strokeWidth="7" />
      <circle cx="50" cy="70" r="34.5" stroke="#4F6B69" strokeOpacity="0.35" strokeWidth="1.5" />
      <path d="M50 30v7M50 103v7M10 70h7M83 70h7" stroke="#4F6B69" strokeWidth="2.5" strokeLinecap="round" />
      {/* حرف B */}
      <path
        d="M36 47h19a11.5 11.5 0 0 1 0 23H36M36 70h22a12 12 0 0 1 0 24H36M36 47v47"
        stroke="url(#bm-teal)"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* إبرتا البوصلة */}
      <path d="M50 70L24 41l17 22z" fill="url(#bm-needle)" />
      <path d="M50 70L77 41 59 63z" fill="url(#bm-needle)" />
      <path d="M50 70L30 99l15-23z" fill="#8A9A99" />
      <circle cx="50" cy="70" r="5.5" fill="#FBF8F2" stroke="#4F6B69" strokeWidth="2" />
    </svg>
  );
}

interface LogoProps {
  variant?: 'header' | 'primary' | 'secondary';
  className?: string;
}

export default function Logo({ variant = 'header', className = '' }: LogoProps) {
  /** الاسم: "بوصلة" فوق، وتحتها Bosla موزعة حروفها على عرض الكلمة العربية، بنفس الخط. */
  const wordmark = (arClass: string, enClass: string) => (
    <span className="inline-flex flex-col items-stretch gap-1 leading-none">
      <span className={`text-center font-display font-extrabold leading-none text-bosla-gold-deep ${arClass}`}>بوصلة</span>
      <span dir="ltr" aria-hidden="true" className={`flex justify-between font-display font-extrabold leading-none text-bosla-gold-deep ${enClass}`}>
        {['B', 'O', 'S', 'L', 'A'].map((ch, idx) => (
          <span key={idx}>{ch}</span>
        ))}
      </span>
    </span>
  );

  if (variant === 'header') {
    return (
      <span className={`inline-flex items-center gap-3 leading-none ${className}`} aria-label="بوصلة Bosla">
        {wordmark('text-[26px] md:text-[30px]', 'text-[12px] md:text-[14px]')}
        <BoslaMark className="h-[46px] w-auto md:h-[52px]" />
      </span>
    );
  }

  if (variant === 'secondary') {
    return (
      <span className={`inline-flex items-center gap-3 leading-none ${className}`} aria-label="بوصلة Bosla">
        {wordmark('text-[32px]', 'text-sm')}
        <BoslaMark className="h-14 w-auto" />
      </span>
    );
  }

  return (
    <span className={`inline-flex flex-col items-center gap-1.5 leading-none ${className}`} aria-label="بوصلة — مقصودك، أينما كنت">
      <BoslaMark className="h-14 w-auto md:h-16" />
      <span className="font-calligraphy text-4xl text-bosla-gold md:text-5xl">بوصلة</span>
      <span className="font-body text-sm font-semibold text-bosla-silver md:text-base">مقصودك.. أينما كنت</span>
    </span>
  );
}
