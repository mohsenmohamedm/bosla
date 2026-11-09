import type { Metadata, Viewport } from 'next';
import { Aref_Ruqaa, Cairo, Inter, Reem_Kufi } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Tracker from '@/components/Tracker';
import { CartProvider } from '@/lib/cart';
import { siteConfig } from '@/lib/data';
import { activePixelId, getPixelSettings, isValidPixelId, metaPixelCode } from '@/lib/pixel';
import { StoreConfigProvider } from '@/components/StoreConfigProvider';
import { getStoreSettings, toPublicConfig } from '@/lib/store-settings';
import { STORE } from '@/lib/store';
import { LangProvider } from '@/lib/lang';

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

const calligraphy = Aref_Ruqaa({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-calligraphy',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  /** الروابط المطلقة (Open Graph وغيره) بتتبني من الدومين ده */
  metadataBase: new URL(STORE.siteUrl),
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
    url: STORE.siteUrl,
    locale: 'ar_EG',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B6E6B',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pixel = await getPixelSettings();
  const datasetId = activePixelId(pixel);
  const pixelId = pixel.enabled && isValidPixelId(datasetId) ? datasetId : null;
  const publicStore = toPublicConfig(await getStoreSettings());

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${reemKufi.variable} ${cairo.variable} ${inter.variable} ${calligraphy.variable}`}
    >
      <body className="min-h-screen font-body">
        {pixelId && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {metaPixelCode(pixelId)}
          </Script>
        )}
        <StoreConfigProvider value={publicStore}>
        <LangProvider>
<CartProvider>
          <Tracker />
          <Header />
          {children}
          <Footer />
        </CartProvider>
</LangProvider>
        </StoreConfigProvider>
      </body>
    </html>
  );
}
