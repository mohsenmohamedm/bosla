import { MongoClient, type Db } from 'mongodb';

/**
 * اتصال واحد بقاعدة البيانات بيتعاد استخدامه بين الطلبات.
 * المتغير MONGODB_URI لازم يكون في .env.local
 */

const uri = process.env.MONGODB_URI;

declare global {
  // eslint-disable-next-line no-var
  var __boslaMongoClient: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error('MONGODB_URI مش موجود في ملف .env.local');
  }

  // نحفظ الاتصال على global عشان مايتعملش اتصال جديد مع كل طلب (وفي التطوير مع الـ hot reload)
  if (!global.__boslaMongoClient) {
    global.__boslaMongoClient = new MongoClient(uri).connect();
  }
  return global.__boslaMongoClient;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db('bosla');
}
