'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** تأخير بالثواني قبل الحركة */
  delay?: number;
  className?: string;
}

/**
 * غلاف بسيط يظهر المحتوى بنعومة لما يدخل في الشاشة.
 * بيتشغل مرة واحدة بس (once: true).
 */
export default function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
