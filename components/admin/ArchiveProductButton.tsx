'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

/** زرار أرشفة / إرجاع منتج للمتجر */
export default function ArchiveProductButton({ productId, archived }: { productId: string; archived: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}/archive`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: !archived }),
      });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className="rounded-full border border-bosla-silver/20 px-4 py-2 text-xs text-bosla-silver/80 transition-colors hover:border-bosla-gold hover:text-bosla-gold disabled:opacity-60"
    >
      {archived ? 'إرجاع للمتجر' : 'أرشفة'}
    </button>
  );
}
