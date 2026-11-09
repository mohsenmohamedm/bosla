/* eslint-disable @next/next/no-img-element */
/**
 * شعار "بوصلة" (الصورة الأصلية: العلامة + الاسم). ثابت في العربي والإنجليزي.
 */

const LOGO_SRC = '/bosla-logo.png';

export function BoslaMark({ className = '' }: { className?: string }) {
  return <img src={LOGO_SRC} alt="" aria-hidden="true" className={className} width={400} height={662} />;
}

interface LogoProps {
  variant?: 'header' | 'primary' | 'secondary';
  className?: string;
}

export default function Logo({ variant = 'header', className = '' }: LogoProps) {
  const size =
    variant === 'header'
      ? 'h-[60px] md:h-[68px]'
      : variant === 'secondary'
        ? 'h-24'
        : 'h-20 md:h-24';
  return (
    <span className={`inline-flex items-center leading-none ${className}`}>
      <img
        src={LOGO_SRC}
        alt="بوصلة Bosla"
        width={400}
        height={662}
        className={`${size} w-auto select-none`}
        draggable={false}
      />
    </span>
  );
}
