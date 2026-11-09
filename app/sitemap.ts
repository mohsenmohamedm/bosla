import type { MetadataRoute } from 'next';
import { getCategories } from '@/lib/data';
import { getAllProducts } from '@/lib/products-db';
import { STORE } from '@/lib/store';

// بيتقرأ من قاعدة البيانات، فبيتحدث مع كل طلب
export const dynamic = 'force-dynamic';

/** ملف sitemap.xml — بيضم الصفحات والأقسام والمنتجات */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages = ['', '/privacy', '/terms', '/returns'].map((path) => ({
    url: `${STORE.siteUrl}${path}`,
    lastModified: now,
  }));

  const categoryPages = getCategories().map((category) => ({
    url: `${STORE.siteUrl}/category/${category.slug}`,
    lastModified: now,
  }));

  const products = (await getAllProducts()).filter((p) => !p.archived);
  const productPages = products.map((product) => ({
    url: `${STORE.siteUrl}/products/${product.id}`,
    lastModified: now,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
