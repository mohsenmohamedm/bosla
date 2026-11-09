import { T } from '@/lib/lang';
import Link from 'next/link';
import Logo from './Logo';
import { siteConfig } from '@/lib/data';

const legalLinks = [
  { label: 'سياسة الخصوصية', href: '/privacy' },
  { label: 'الشروط والأحكام', href: '/terms' },
  { label: 'الاسترجاع والاستبدال', href: '/returns' },
];

/** الفوتر: تيل غامق، الشعار، روابط السياسات، وسطر حقوق. من غير بيانات تواصل. */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 bg-[#06302E] text-[#E3F1F0]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-10 text-center md:px-8 md:py-14">
        <div className="rounded-2xl bg-[#FAF7F0] px-7 py-4">
          <Logo variant="secondary" />
        </div>
        <p className="text-sm text-[#E3F1F0]/80"><T ar="مقصودك.. أينما كنت" en="Your destination.. wherever you are" /></p>
        <nav aria-label="السياسات" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-[#E3F1F0]/80 transition-colors hover:text-[#F5B83D]">
              <T ar={link.label} en={FOOT_EN[link.label] ?? link.label} />
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-[#E3F1F0]/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-[#E3F1F0]/60 md:px-8">
          © {year} {siteConfig.nameAr} {siteConfig.nameEn}. <T ar="جميع الحقوق محفوظة." en="All rights reserved." />
        </p>
      </div>
    </footer>
  );
}

const FOOT_EN: Record<string, string> = {
  'سياسة الخصوصية': 'Privacy Policy',
  'الشروط والأحكام': 'Terms & Conditions',
  'الاسترجاع والاستبدال': 'Returns & Exchanges',
};
