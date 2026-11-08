/**
 * لوجو "بوصلة".
 *
 * - primary:   "بوصلة" بخط Reem Kufi بوزن ثقيل ولمسة ذهبية، ومعاه خط أفقي رفيع بسهم صغير
 *              كإشارة خفيفة للاتجاه. مفيش أي أيقونة بوصلة تقليدية.
 * - secondary: "بوصلة" فوق "Bosla" (B-O-S-L-A) بخط Inter رفيع ولون فضي.
 */

interface LogoProps {
  variant?: 'primary' | 'secondary';
  className?: string;
}

export default function Logo({ variant = 'primary', className = '' }: LogoProps) {
  if (variant === 'secondary') {
    return (
      <span
        className={`inline-flex flex-col items-start leading-none ${className}`}
        aria-label="بوصلة Bosla"
      >
        <span className="font-display text-2xl font-semibold text-bosla-white">
          بوصلة
        </span>
        <span className="mt-2 font-latin text-[0.65rem] font-light uppercase tracking-[0.42em] text-bosla-silver/70">
          Bosla
        </span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-3 leading-none ${className}`}
      aria-label="بوصلة"
    >
      <span className="bg-gradient-to-l from-bosla-gold via-[#E8D5A8] to-bosla-gold-deep bg-clip-text font-display text-3xl font-semibold text-transparent">
        بوصلة
      </span>
      <svg
        aria-hidden="true"
        viewBox="0 0 44 12"
        className="h-3 w-11 text-bosla-gold"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M42 6H6" />
        <path d="M12 2L6 6l6 4" />
      </svg>
    </span>
  );
}
