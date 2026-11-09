import Link from 'next/link';
import type { HeroContent } from '@/lib/types';

interface HeroProps {
  content?: HeroContent;
}

/**
 * بانر مدمج على طريقة الماركت بليس: النص على اليمين وزخرفة بوصلة على الشمال،
 * مرتفع قليلًا عشان المنتجات تظهر بسرعة على الموبايل.
 */
export default function Hero(_props: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-l from-[#06302E] via-[#074F4D] to-[#0B6E6B] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-[#F5B83D]/15 blur-3xl" />
        <svg viewBox="0 0 400 400" className="absolute -left-12 top-1/2 h-48 w-48 -translate-y-1/2 text-white/15 md:left-10 md:h-72 md:w-72" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="200" cy="200" r="190" />
          <circle cx="200" cy="200" r="130" />
          <circle cx="200" cy="200" r="70" strokeDasharray="3 6" />
          <path d="M200 10v380M10 200h380" />
          <path d="M200 60l26 120-26 20-26-20z" fill="currentColor" stroke="none" />
        </svg>
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-1.5 px-3 pb-5 pt-[88px] text-right md:gap-3 md:px-6 md:pb-12 md:pt-36">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[11px] font-bold text-[#F5B83D] md:text-sm">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 md:h-4 md:w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" fill="currentColor" /></svg>
          سوق بوصلة
        </span>
        <h1 className="font-display text-xl font-extrabold leading-snug md:text-5xl md:leading-tight">
          كل ما تحتاجه.. <span className="text-[#F5B83D]">في مكان واحد</span>
        </h1>
        <p className="max-w-xs text-xs leading-relaxed text-white/80 md:max-w-xl md:text-lg">
          منتجات مختارة بأسعار واضحة، والدفع عند الاستلام.
        </p>
        <Link
          href="#products"
          className="mt-1 inline-flex h-9 items-center justify-center rounded-full bg-white px-5 text-xs font-bold text-[#074F4D] shadow-md transition-colors hover:bg-[#E3F1F0] md:h-12 md:px-8 md:text-base"
        >
          تسوق دلوقتي ←
        </Link>
      </div>
    </section>
  );
}
