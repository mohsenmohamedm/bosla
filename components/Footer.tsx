import Link from 'next/link';
import Logo from './Logo';
import { navItems, siteConfig } from '@/lib/data';
import { STORE } from '@/lib/store';

const legalLinks = [
  { label: 'سياسة الخصوصية', href: '/privacy' },
  { label: 'الشروط والأحكام', href: '/terms' },
  { label: 'الاسترجاع والاستبدال', href: '/returns' },
];

const socialLinks = [
  { label: 'إنستجرام', href: '#' },
  { label: 'فيسبوك', href: '#' },
  { label: 'تيك توك', href: '#' },
];

/**
 * الفوتر — خلفية أغمق، اللوجو الثانوي (بوصلة + Bosla)، روابط سريعة، وحقوق النشر.
 * id="contact" عشان لينك "اتصل بنا" في الهيدر يوصله.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="scroll-mt-24 border-t border-bosla-gold/10 bg-[#050505]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-3 md:px-8">
        <div className="flex flex-col gap-5">
          <Logo variant="secondary" />
          <p className="max-w-xs text-sm leading-relaxed text-bosla-silver/60">
            بوصلة Bosla — متجرك الشامل لاختيارات مميزة.
          </p>
          <div className="flex flex-col gap-2 text-sm text-bosla-silver/70">
            <a
              href={`https://wa.me/${STORE.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit transition-colors duration-300 hover:text-bosla-gold"
            >
              واتساب: {STORE.whatsappDisplay}
            </a>
            <a href={`mailto:${STORE.email}`} className="w-fit transition-colors duration-300 hover:text-bosla-gold">
              {STORE.email}
            </a>
          </div>
          <nav aria-label="الصفحات القانونية" className="flex flex-col gap-2 text-xs text-bosla-silver/60">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="w-fit transition-colors duration-300 hover:text-bosla-gold">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <nav aria-label="روابط سريعة" className="flex flex-col gap-3">
          <h3 className="font-display text-sm font-semibold text-bosla-gold">روابط سريعة</h3>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="w-fit text-sm text-bosla-silver/70 transition-colors duration-300 hover:text-bosla-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <h3 className="font-display text-sm font-semibold text-bosla-gold">تابعنا</h3>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="w-fit text-sm text-bosla-silver/70 transition-colors duration-300 hover:text-bosla-gold"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-bosla-silver/5">
        <p className="mx-auto max-w-7xl px-5 py-6 text-center text-xs text-bosla-silver/50 md:px-8">
          © {year} {siteConfig.nameAr} {siteConfig.nameEn}. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
