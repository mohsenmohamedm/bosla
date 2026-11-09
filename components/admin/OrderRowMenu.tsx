'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface OrderRowMenuProps {
  href: string;
  orderNumber: string;
  phone: string;
}

/** قائمة الإجراءات (⋯) لكل طلب: فتح التفاصيل، نسخ رقم الطلب، نسخ رقم الموبايل */
export default function OrderRowMenu({ href, orderNumber, phone }: OrderRowMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1200);
    } catch {
      // المتصفح ممكن يرفض النسخ — مش مشكلة
    }
    setOpen(false);
  };

  const itemClass =
    'flex w-full items-center px-4 py-2.5 text-right text-sm text-bosla-silver/85 transition-colors hover:bg-bosla-graphite hover:text-bosla-gold';

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="إجراءات الطلب"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-bosla-silver/15 text-bosla-silver/80 transition-colors hover:border-bosla-gold hover:text-bosla-gold"
      >
        {copied ? (
          <span className="text-[0.65rem] text-emerald-300">تم</span>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <circle cx="5" cy="12" r="1.8" />
            <circle cx="12" cy="12" r="1.8" />
            <circle cx="19" cy="12" r="1.8" />
          </svg>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-11 z-20 w-56 overflow-hidden rounded-xl border border-bosla-silver/15 bg-bosla-charcoal py-1 shadow-xl"
        >
          <Link role="menuitem" href={href} className={itemClass} onClick={() => setOpen(false)}>
            فتح تفاصيل الطلب
          </Link>
          <button role="menuitem" type="button" className={itemClass} onClick={() => copy('order', orderNumber)}>
            نسخ رقم الطلب
          </button>
          <button role="menuitem" type="button" className={itemClass} onClick={() => copy('phone', phone)}>
            نسخ رقم الهاتف
          </button>
        </div>
      )}
    </div>
  );
}
