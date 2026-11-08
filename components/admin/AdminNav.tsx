import Link from 'next/link';

interface AdminNavProps {
  active: 'orders' | 'products';
}

const links = [
  { key: 'orders', label: 'الطلبات', href: '/admin' },
  { key: 'products', label: 'المنتجات', href: '/admin/products' },
] as const;

/** تنقل بين صفحات الداشبورد */
export default function AdminNav({ active }: AdminNavProps) {
  return (
    <nav aria-label="تنقل الداشبورد" className="flex gap-2">
      {links.map((link) => (
        <Link
          key={link.key}
          href={link.href}
          className={`rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
            active === link.key
              ? 'bg-bosla-gold text-bosla-black'
              : 'border border-bosla-silver/20 text-bosla-silver/80 hover:border-bosla-gold hover:text-bosla-gold'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
