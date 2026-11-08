import type { Metadata, Viewport } from 'next';
import { Cairo, Inter, Reem_Kufi } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/lib/cart';
import { siteConfig } from '@/lib/data';

/* الخطوط — عناوين Reem Kufi، نصوص Cairo، إنجليزي Inter */
const reemKufi = Reem_Kufi({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-reem',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cairo',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'بوصلة | Bosla — متجرك الشامل',
    template: '%s | بوصلة Bosla',
  },
  description: siteConfig.description,
  applicationName: 'Bosla',
  keywords: ['بوصلة', 'Bosla', 'متجر إلكتروني', 'تسوق أونلاين'],
  openGraph: {
    title: 'بوصلة | Bosla — متجرك الشامل',
    description: siteConfig.description,
    siteName: 'Bosla',
    locale: 'ar_EG',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${reemKufi.variable} ${cairo.variable} ${inter.variable}`}
    >
      <body className="min-h-screen font-body">
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
