'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

/** زرار مسح منتج من قائمة المنتجات */
export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`متأكد إنك عايز تمسح "${productName}"؟`)) return;
    setBusy(true);
    const response = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
    if (response.ok) {
      router.refresh();
    } else {
      window.alert('مقدرناش نمسح المنتج، حاول تاني');
    }
    setBusy(false);
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={busy}
      className="rounded-full border border-red-500/30 px-4 py-2 text-xs text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-50"
    >
      {busy ? 'بنمسح...' : 'مسح'}
    </button>
  );
}

/** زرار إضافة المنتجات التجريبية (بيشتغل بس لو الجدول فاضي) */
export function ImportSampleButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleImport = async () => {
    setBusy(true);
    setMessage(null);
    const response = await fetch('/api/admin/products/import', { method: 'POST' });
    const result = (await response.json().catch(() => ({}))) as { inserted?: number; error?: string };
    if (response.ok) {
      setMessage(result.inserted ? `اتضاف ${result.inserted} منتج` : 'الجدول مش فاضي، مفيش حاجة اتضافت');
      router.refresh();
    } else {
      setMessage(result.error ?? 'حصلت مشكلة');
    }
    setBusy(false);
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleImport}
        disabled={busy}
        className="rounded-full border border-bosla-gold/50 px-6 py-3 text-sm text-bosla-gold transition-colors hover:bg-bosla-gold/10 disabled:opacity-50"
      >
        {busy ? 'بنضيف...' : 'استيراد منتجات تجريبية'}
      </button>
      {message && <p className="text-xs text-bosla-silver/60">{message}</p>}
    </div>
  );
}
