'use client';

import { useState } from 'react';

/** زرار نسخ نص (مثلاً رقم الطلب) */
export default function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // المتصفح ممكن يمنع الحافظة، نتجاهل
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="نسخ رقم الطلب"
      className="flex h-7 w-7 items-center justify-center rounded-md text-bosla-silver/50 transition-colors hover:bg-bosla-graphite hover:text-bosla-gold"
    >
      {copied ? (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-emerald-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M5 12l5 5 9-10" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V6a2 2 0 0 1 2-2h9" />
        </svg>
      )}
    </button>
  );
}
