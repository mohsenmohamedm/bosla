/**
 * شعار "بوصلة": العلامة فوق، والاسم تحتها، والجملة "مقصودك.. أينما كنت" تحت الاسم.
 *
 * - primary:   العلامة + الاسم + الجملة (الهيدر)
 * - secondary: العلامة + الاسم بس (الفوتر)
 */

export function BoslaMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 84" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="bosla-gold-grad" x1="0" y1="0" x2="80" y2="84" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3FB5AE" />
          <stop offset="0.55" stopColor="#0B6E6B" />
          <stop offset="1" stopColor="#074F4D" />
        </linearGradient>
        <linearGradient id="bosla-needle-grad" x1="40" y1="8" x2="62" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFA08F" />
          <stop offset="1" stopColor="#FF6F5E" />
        </linearGradient>
      </defs>
      {/* الباء: الخط الأفقي والقوس تحته */}
      <path d="M8 40 H72" stroke="url(#bosla-gold-grad)" strokeWidth="5" strokeLinecap="round" />
      <path d="M14 40 Q14 66 40 66 Q66 66 66 40" stroke="url(#bosla-gold-grad)" strokeWidth="5" strokeLinecap="round" />
      {/* نقطة الباء */}
      <circle cx="40" cy="78" r="4" fill="url(#bosla-gold-grad)" />
      {/* إبرة البوصلة: نص مضيء + نص خافت، مركزها على الباء */}
      <path d="M40 40 L62 8 L48 44 Z" fill="url(#bosla-needle-grad)" />
      <path d="M40 40 L32 44 L18 16 Z" fill="url(#bosla-needle-grad)" opacity="0.5" />
      <circle cx="40" cy="40" r="3" fill="#FFFBF5" />
    </svg>
  );
}

interface LogoProps {
  variant?: 'header' | 'primary' | 'secondary';
  className?: string;
}

export default function Logo({ variant = 'header', className = '' }: LogoProps) {
  if (variant === 'header') {
    return (
      <span className={`inline-flex flex-col items-center gap-1 leading-none ${className}`} aria-label="بوصلة">
        <BoslaMark className="h-7 w-auto md:h-8" />
        <span className="font-calligraphy text-xl text-bosla-gold md:text-2xl">بوصلة</span>
      </span>
    );
  }

  if (variant === 'secondary') {
    return (
      <span className={`inline-flex flex-col items-center gap-1 leading-none ${className}`} aria-label="بوصلة">
        <BoslaMark className="h-9 w-auto" />
        <span className="font-calligraphy text-2xl text-bosla-gold">بوصلة</span>
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
