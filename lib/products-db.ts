import { getDb } from './mongodb';
import { products as sampleProducts } from './data';
import type { ProductInput } from './product-validation';
import type { Product } from './types';

/**
 * قراءة وكتابة المنتجات في قاعدة البيانات (collection: products).
 * المنتجات بتتضاف وتتعدل من الداشبورد، وزرار الاستيراد بيحط المنتجات التجريبية من lib/data.ts.
 */

const COLLECTION = 'products';
const hideMongoId = { projection: { _id: 0 } } as const;

export async function getAllProducts(): Promise<Product[]> {
  const db = await getDb();
  return db
    .collection<Product>(COLLECTION)
    .find({}, hideMongoId)
    .sort({ name: 1 })
    .toArray();
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDb();
  return db.collection<Product>(COLLECTION).findOne({ id }, hideMongoId);
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const db = await getDb();
  return db
    .collection<Product>(COLLECTION)
    .find({ categoryId }, hideMongoId)
    .toArray();
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const db = await getDb();
  return db
    .collection<Product>(COLLECTION)
    .find({ featured: true }, hideMongoId)
    .limit(limit)
    .toArray();
}

/** بيضيف منتج جديد وبيرجع المنتج بالـ ID بتاعه */
export async function createProduct(input: ProductInput): Promise<Product> {
  const db = await getDb();
  const product: Product = {
    id: createProductId(),
    currency: 'EGP',
    ...input,
  };
  await db.collection<Product>(COLLECTION).insertOne({ ...product });
  return product;
}

/** بيعدل منتج موجود. بيرجع false لو المنتج مش موجود */
export async function updateProduct(id: string, input: ProductInput): Promise<boolean> {
  const db = await getDb();
  const result = await db
    .collection<Product>(COLLECTION)
    .updateOne({ id }, { $set: { ...input, currency: 'EGP' } });
  return result.matchedCount > 0;
}

/** بيمسح منتج. بيرجع false لو المنتج مش موجود */
export async function deleteProduct(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection<Product>(COLLECTION).deleteOne({ id });
  return result.deletedCount > 0;
}

/** بيحط المنتجات التجريبية لو الجدول فاضي. بيرجع عدد المنتجات اللي اتضافت */
export async function importSampleProducts(): Promise<number> {
  const db = await getDb();
  const collection = db.collection<Product>(COLLECTION);
  const count = await collection.countDocuments();
  if (count > 0) return 0;

  await collection.insertMany(sampleProducts.map((product) => ({ ...product })));
  return sampleProducts.length;
}

/** بحث في اسم ووصف المنتجات (مش حساس لحالة الحروف) */
export async function searchProducts(query: string, limit = 12): Promise<Product[]> {
  const term = query.trim().slice(0, 80);
  if (!term) return [];

  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = { $regex: escaped, $options: 'i' };

  const db = await getDb();
  return db
    .collection<Product>(COLLECTION)
    .find({ $or: [{ name: pattern }, { description: pattern }] }, hideMongoId)
    .limit(limit)
    .toArray();
}

function createProductId(): string {
  const random = Math.random().toString(36).slice(2, 6);
  return `p-${Date.now().toString(36)}${random}`;
}
