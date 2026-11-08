'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { HeroContent } from '@/lib/types';

const EASE = [0.4, 0, 0.2, 1] as const;

interface HeroProps {
  content: HeroContent;
}

/**
 * الهيرو — ملء الشاشة، صورة سينمائية بتأثير Parallax خفيف، وعنوان generic عن بوصلة.
 * لو هتضيف شرائح (slides) مستقبلاً: خلّي `content` مصفوفة ولفّ العرض حوالين index.
 */
export default function Hero({ content }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* الصورة — الـ scale داخل motion.style عشان ميتعارضش مع transform الـ parallax */}
      <motion.div
        style={{ y: imageY, scale: 1.1 }}
        className="absolute inset-0 -z-20"
      >
        <Image
          src={content.image}
          alt={content.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* طبقات التدرج واللمسة الذهبية */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-bosla-black/40 via-bosla-black/75 to-bosla-black" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(201,168,106,0.18),transparent_60%)]" />

      <motion.div
        style={{ opacity: contentOpacity }}
        className="mx-auto w-full max-w-7xl px-5 pb-24 pt-36 md:px-8"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-6 text-sm tracking-wide text-bosla-gold"
        >
          {content.eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="max-w-3xl font-display text-5xl font-semibold leading-tight text-bosla-white md:text-7xl"
        >
          {content.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
          className="mt-6 max-w-xl text-base leading-relaxed text-bosla-silver/80 md:text-lg"
        >
          {content.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link
            href={content.primaryCta.href}
            className="rounded-full bg-gradient-to-l from-bosla-gold to-bosla-gold-deep px-8 py-3.5 text-sm font-medium text-bosla-black shadow-glow transition-all duration-500 ease-smooth hover:-translate-y-0.5 hover:shadow-[0_0_60px_-10px_rgba(201,168,106,0.55)]"
          >
            {content.primaryCta.label}
          </Link>
          <Link
            href={content.secondaryCta.href}
            className="rounded-full border border-bosla-gold/60 px-8 py-3.5 text-sm font-medium text-bosla-gold transition-all duration-500 ease-smooth hover:border-bosla-gold hover:bg-bosla-gold/10"
          >
            {content.secondaryCta.label}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
