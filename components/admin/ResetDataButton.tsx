'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/** زرار تصفير بيانات الاختبار (الطلبات + أحداث الزيارات). محمي بتأكيد بالكتابة. */
export default function ResetDataButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [word, setWord] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const reset = async () => {
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/reset-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: word.trim() }),
      });
      const data = (await response.json()) as { error?: string; orders?: number; events?: number };
      if (!response.ok) {
        setMessage(data.error ?? 'حصل خطأ');
      } else {
        setMessage(`تم التصفير: ${data.orders ?? 0} طلب، ${data.events ?? 0} حدث زيارة.`);
        setOpen(false);
        setWord('');
        router.refresh();
      }
    } catch {
      setMessage('مش قادر أكلم السيرفر');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-red-200 bg-red-50/60 p-5">
      <h2 className="text-lg font-bold text-red-700">تصفير بيانات الاختبار</h2>
      <p className="mt-1 text-sm text-bosla-silver">
        بيمسح كل الطلبات وإحصائيات الزيارات عشان اللوحة تبدأ من الصفر. المنتجات والأقسام والإعدادات مش بتتمسح. الحذف نهائي ومفيش تراجع.
      </p>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-bold text-red-700 transition-all duration-200 hover:bg-red-600 hover:text-white active:scale-95"
        >
          تصفير الطلبات والإحصائيات
        </button>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            value={word}
            onChange={(event) => setWord(event.target.value)}
            placeholder='اكتب "تصفير" للتأكيد'
            className="h-10 rounded-xl border border-red-300 bg-white px-3 text-sm outline-none focus:border-red-500"
          />
          <button
            type="button"
            disabled={busy || word.trim() !== 'تصفير'}
            onClick={reset}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition-all duration-200 hover:bg-red-700 active:scale-95 disabled:opacity-40"
          >
            {busy ? 'جاري التصفير...' : 'تأكيد الحذف النهائي'}
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setWord('');
            }}
            className="rounded-xl px-3 py-2 text-sm text-bosla-silver hover:text-bosla-gold"
          >
            إلغاء
          </button>
        </div>
      )}
      {message && <p className="mt-3 text-sm font-medium text-bosla-gold-deep">{message}</p>}
    </section>
  );
}
