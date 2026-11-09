'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { HeroContent } from '@/lib/types';

const EASE = [0.4, 0, 0.2, 1] as const;

interface HeroProps {
  content: HeroContent;
}

/**
 * الهيرو: خلفية تيل متدرجة، نص على اليمين وصورة على الشمال (تحت النص على الموبايل).
 * زرار واحد للتسوق بلون الكورال.
 */
export default function Hero({ content }: HeroProps) {
  return (
    <section className="bg-gradient-to-br from-[#06302E] to-bosla-gold-deep text-bosla-black">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-12 pt-28 md:grid-cols-2 md:gap-16 md:px-8 md:pb-24 md:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex flex-col items-start gap-4 text-start md:gap-6"
        >
          <span className="rounded-full bg-bosla-sun/90 px-3 py-1 text-xs font-bold text-bosla-gold-deep">
            {content.eyebrow}
          </span>
          <h1 className="font-display text-[30px] font-bold leading-[1.25] md:text-[52px]">
            {content.title}
            {content.titleAccent && <span className="block text-bosla-sun">{content.titleAccent}</span>}
          </h1>
          <p className="max-w-md text-base leading-relaxed text-[#E3F1F0] md:text-lg">{content.subtitle}</p>
          <Link
            href={content.primaryCta.href}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-bosla-accent px-6 text-[15px] font-bold text-bosla-gold-deep transition-colors duration-300 hover:bg-[#E8523F] hover:text-white md:h-14 md:text-base"
          >
            <span>{content.primaryCta.label}</span>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          className="relative aspect-[4/3] overflow-hidden rounded-[20px] md:aspect-[4/5]"
        >
          <Image
            src={content.image}
            alt={content.imageAlt}
            fill
            priority
            quality={100}
            sizes="(min-width: 768px) 560px, 100vw"
            className="object-cover object-center"
          />
        </motion.div>
      </div>
    </section>
  );
}
