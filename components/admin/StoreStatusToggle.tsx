'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface StoreStatusToggleProps {
  initialOpen: boolean;
}

/** زرار "استقبال الطلبات مفتوح / مغلق" في شريط الداشبورد */
export default function StoreStatusToggle({ initialOpen }: StoreStatusToggleProps) {
  const router = useRouter();
  const [open, setOpen] = useState(initialOpen);
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/store-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ open: !open }),
      });
      if (res.ok) {
        setOpen(!open);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={open}
      className="flex items-center gap-3 rounded-full border border-bosla-silver/15 bg-bosla-charcoal px-4 py-2 text-sm text-bosla-white transition-colors hover:border-bosla-gold disabled:opacity-60"
    >
      <span className={`h-2.5 w-2.5 rounded-full ${open ? 'bg-emerald-400' : 'bg-red-400'}`} aria-hidden="true" />
      {open ? 'استقبال الطلبات مفتوح' : 'استقبال الطلبات مقفول'}
      <span
        className={`relative h-5 w-9 rounded-full transition-colors ${open ? 'bg-emerald-500/60' : 'bg-bosla-graphite'}`}
        aria-hidden="true"
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-bosla-white transition-all ${open ? 'right-0.5' : 'right-[1.1rem]'}`}
        />
      </span>
    </button>
  );
}
