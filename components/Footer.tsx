import Link from 'next/link';
import Logo from './Logo';
import { navItems, siteConfig } from '@/lib/data';

const legalLinks = [
  { label: 'سياسة الخصوصية', href: '/privacy' },
  { label: 'الشروط والأحكام', href: '/terms' },
  { label: 'الاسترجاع والاستبدال', href: '/returns' },
];

/**
 * الفوتر: تيل غامق، الشعار الفرعي "مقصودك.. أينما كنت" هنا بدل الهيدر،
 * وروابط مختصرة من غير تكرار قائمة الهيدر كلها، وسطر حقوق.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#06302E] text-[#E3F1F0]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3 md:px-8 md:py-16">
        <div className="flex flex-col items-start gap-4">
          <Logo variant="secondary" />
          <p className="text-sm text-[#E3F1F0]/80">مقصودك.. أينما كنت</p>
        </div>

        <nav aria-label="روابط سريعة" className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-bosla-sun">روابط سريعة</h3>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="w-fit text-sm text-[#E3F1F0]/80 transition-colors hover:text-bosla-sun">
              {item.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="السياسات" className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-bosla-sun">السياسات</h3>
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="w-fit text-sm text-[#E3F1F0]/80 transition-colors hover:text-bosla-sun">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-[#E3F1F0]/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-[#E3F1F0]/60 md:px-8">
          © {year} {siteConfig.nameAr} {siteConfig.nameEn}. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
