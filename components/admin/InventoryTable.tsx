'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export interface InventoryRow {
  id: string;
  name: string;
  categoryName: string;
  stock: number | null;
}

const LOW_STOCK_LIMIT = 5;
type StockFilter = 'all' | 'tracked' | 'low' | 'out' | 'untracked';

const STOCK_FILTERS: { key: StockFilter; label: string }[] = [
  { key: 'all', label: 'كل الحالات' },
  { key: 'tracked', label: 'متتبع' },
  { key: 'low', label: 'قرب يخلص' },
  { key: 'out', label: 'خلص' },
  { key: 'untracked', label: 'غير متتبع' },
];

const inputClass =
  'rounded-full border border-bosla-silver/15 bg-bosla-charcoal px-4 py-2.5 text-sm text-bosla-white placeholder:text-bosla-silver/40 focus:border-bosla-gold focus:outline-none';

/** جدول المخزون مع البحث والفلاتر وتصدير CSV */
export default function InventoryTable({ rows, categories }: { rows: InventoryRow[]; categories: string[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<StockFilter>('all');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (term && !row.name.toLowerCase().includes(term) && !row.id.toLowerCase().includes(term)) return false;
      if (category && row.categoryName !== category) return false;
      if (status === 'tracked' && row.stock === null) return false;
      if (status === 'low' && !(row.stock !== null && row.stock > 0 && row.stock <= LOW_STOCK_LIMIT)) return false;
      if (status === 'out' && row.stock !== 0) return false;
      if (status === 'untracked' && row.stock !== null) return false;
      return true;
    });
  }, [rows, search, category, status]);

  const exportCsv = () => {
    const header = ['المنتج', 'القسم', 'المخزون'];
    const lines = filtered.map((r) => [
      r.name,
      r.categoryName,
      r.stock === null ? 'غير متتبع' : String(r.stock),
    ]);
    const csv =
      '﻿' +
      [header, ...lines]
        .map((row) => row.map((v) => `"${v.replace(/"/g, '""')}"`).join(','))
        .join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `bosla-inventory-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث بالاسم أو الكود"
          className={`${inputClass} min-w-0 flex-1 md:max-w-sm`}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} aria-label="القسم">
          <option value="">كل الأقسام</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as StockFilter)} className={inputClass} aria-label="حالة المخزون">
          {STOCK_FILTERS.map((f) => (
            <option key={f.key} value={f.key}>{f.label}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={exportCsv}
          className="rounded-full border border-bosla-gold/50 px-5 py-2.5 text-sm text-bosla-gold transition-colors hover:bg-bosla-gold/10"
        >
          تصدير CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-bosla-silver/10 bg-bosla-charcoal/60">
        <table className="w-full min-w-[640px] text-right text-sm">
          <thead className="border-b border-bosla-silver/10 text-xs text-bosla-silver/50">
            <tr>
              <th className="px-4 py-4 font-normal">المنتج</th>
              <th className="px-4 py-4 font-normal">القسم</th>
              <th className="px-4 py-4 font-normal">المخزون</th>
              <th className="px-4 py-4 font-normal" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => {
              const hasStock = row.stock !== null;
              const stock = row.stock ?? 0;
              const stockClass = !hasStock
                ? 'text-bosla-silver/40'
                : stock === 0
                  ? 'text-red-300'
                  : stock <= LOW_STOCK_LIMIT
                    ? 'text-amber-300'
                    : 'text-emerald-300';
              return (
                <tr key={row.id} className="border-b border-bosla-silver/5 last:border-0 hover:bg-bosla-graphite/40">
                  <td className="px-4 py-4 text-bosla-white">{row.name}</td>
                  <td className="px-4 py-4 text-xs text-bosla-silver/70">{row.categoryName}</td>
                  <td className={`px-4 py-4 font-medium ${stockClass}`}>{hasStock ? `${stock} قطعة` : 'غير متتبع'}</td>
                  <td className="px-4 py-4 text-left">
                    <Link
                      href={`/admin/products/${row.id}/edit`}
                      className="rounded-full border border-bosla-silver/20 px-4 py-2 text-xs text-bosla-silver/80 transition-colors hover:border-bosla-gold hover:text-bosla-gold"
                    >
                      تعديل المخزون
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-bosla-silver/50">مفيش منتجات مطابقة.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
