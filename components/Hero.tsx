'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { HeroContent } from '@/lib/types';

const EASE = [0.4, 0, 0.2, 1] as const;

interface HeroProps {
  content: HeroContent;
}

/**
 * الهيرو: تيل متدرج بزخرفة بوصلة خفيفة، نص في النص وزرارين.
 * من غير صورة، أسرع وأنضف.
 */
export default function Hero({ content }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#06302E] via-[#074F4D] to-[#0B6E6B] text-white">
      {/* زخرفة: دواير بوصلة + توهج */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#F5B83D]/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-[#FF6F5E]/10 blur-3xl" />
        <svg viewBox="0 0 400 400" className="absolute -left-20 top-1/2 h-[420px] w-[420px] -translate-y-1/2 text-white/10 md:-left-10 md:h-[560px] md:w-[560px]" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="200" cy="200" r="190" />
          <circle cx="200" cy="200" r="140" />
          <circle cx="200" cy="200" r="90" strokeDasharray="3 6" />
          <path d="M200 10v380M10 200h380" />
          <path d="M200 70l22 110-22 20-22-20z" fill="currentColor" stroke="none" />
        </svg>
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 pb-20 pt-32 text-center md:gap-7 md:px-8 md:pb-32 md:pt-44">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-[#F5B83D] backdrop-blur-sm md:text-sm"
        >
          {content.eyebrow}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          className="font-display text-[34px] font-bold leading-[1.25] md:text-[60px]"
        >
          {content.title}
          {content.titleAccent && <span className="block text-[#F5B83D]">{content.titleAccent}</span>}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: EASE }}
          className="max-w-xl text-base leading-relaxed text-[#E3F1F0] md:text-xl"
        >
          {content.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease: EASE }}
          className="mt-2 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href={content.primaryCta.href}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[#FF6F5E] px-7 text-[15px] font-bold text-[#06302E] shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E8523F] hover:text-white md:h-14 md:px-9 md:text-base"
          >
            <span>{content.primaryCta.label}</span>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
          </Link>
          <Link
            href={content.secondaryCta.href}
            className="inline-flex h-12 items-center rounded-full border border-white/30 px-7 text-[15px] font-bold text-white transition-colors duration-300 hover:bg-white/10 md:h-14 md:px-9 md:text-base"
          >
            {content.secondaryCta.label}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
