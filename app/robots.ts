import type { MetadataRoute } from 'next';
import { STORE } from '@/lib/store';

/** ملف robots.txt — بيوجّه محركات البحث للموقع والـ sitemap */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/cart', '/checkout', '/order-success'],
      },
    ],
    sitemap: `${STORE.siteUrl}/sitemap.xml`,
  };
}
