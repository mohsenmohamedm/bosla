'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from '@/lib/orders';

interface OrderStatusSelectProps {
  orderNumber: string;
  status: OrderStatus;
}

/** تغيير حالة الطلب من الداشبورد */
export default function OrderStatusSelect({ orderNumber, status }: OrderStatusSelectProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleChange = async (nextStatus: OrderStatus) => {
    setSaving(true);
    await fetch(`/api/admin/orders/${encodeURIComponent(orderNumber)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
    setSaving(false);
    router.refresh();
  };

  return (
    <select
      value={status}
      disabled={saving}
      onChange={(event) => handleChange(event.target.value as OrderStatus)}
      className="rounded-lg border border-bosla-silver/15 bg-bosla-charcoal px-3 py-2 text-sm text-bosla-white focus:border-bosla-gold focus:outline-none disabled:opacity-60"
    >
      {ORDER_STATUSES.map((value) => (
        <option key={value} value={value}>
          {ORDER_STATUS_LABELS[value]}
        </option>
      ))}
    </select>
  );
}
