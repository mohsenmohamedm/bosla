import { MongoClient, type Db } from 'mongodb';

/**
 * اتصال قاعدة البيانات.
 * - على Cloudflare Workers: كل طلب ياخد اتصاله الخاص، لأن الاتصال المشترك بين الطلبات بيعلّق الـ Worker.
 * - على الجهاز (التطوير) أو أي سيرفر Node: الاتصال بيتحفظ ويتعاد استخدامه.
 * المتغير MONGODB_URI لازم يكون موجود (في .env.local أو في إعدادات Cloudflare).
 */

// مهلة زمنية عشان لو فيه مشكلة يطلع خطأ واضح بدل ما الطلب يفضل مستني
const CLIENT_OPTIONS = {
  maxPoolSize: 1,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
};

declare global {
  // eslint-disable-next-line no-var
  var __boslaMongoClient: Promise<MongoClient> | undefined;
}

const isWorkers = () =>
  typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers';

function getUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI مش موجود (في .env.local أو في إعدادات Cloudflare)');
  }
  return uri;
}

export async function getDb(): Promise<Db> {
  const uri = getUri();

  if (isWorkers()) {
    const client = new MongoClient(uri, CLIENT_OPTIONS);
    await client.connect();
    return client.db('bosla');
  }

  if (!global.__boslaMongoClient) {
    global.__boslaMongoClient = new MongoClient(uri, CLIENT_OPTIONS).connect();
  }
  const client = await global.__boslaMongoClient;
  return client.db('bosla');
}
