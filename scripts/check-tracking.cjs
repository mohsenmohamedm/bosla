// فحص سريع: بيعد أحداث التتبع والطلبات في MongoDB. الاستخدام: node scripts/check-tracking.cjs
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const uri = /^MONGODB_URI=(.*)$/m.exec(env)?.[1]?.replace(/^"|"$/g, '').trim();
if (!uri) {
  console.log('MONGODB_URI مش موجود في .env.local');
  process.exit(1);
}

(async () => {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  try {
    await client.connect();
    const db = client.db('bosla');
    const since = new Date(Date.now() - 24 * 3600 * 1000);
    const events = db.collection('events');
    const byType = await events.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]).toArray();
    console.log('أحداث آخر 24 ساعة:', byType.length ? byType.map((r) => `${r._id}=${r.count}`).join(', ') : 'مفيش');
    console.log('إجمالي الأحداث:', await events.countDocuments());
    console.log('آخر حدث:', await events.find().sort({ createdAt: -1 }).limit(1).toArray());
    console.log('طلبات آخر 24 ساعة:', await db.collection('orders').countDocuments({ createdAt: { $gte: since } }));
  } catch (error) {
    console.log('فشل الاتصال:', error.name, String(error.message).slice(0, 200));
  } finally {
    await client.close().catch(() => {});
  }
})();
