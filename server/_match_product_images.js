require('dotenv').config({ override: true });
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
require('./models/Category');

const KEY = process.env.UNSPLASH_ACCESS_KEY;
if (!KEY) throw new Error('UNSPLASH_ACCESS_KEY missing from .env');

// Products still carrying one of these shared category photos haven't been
// given a per-product match yet — safe to re-run, only touches those.
const SHARED_PHOTOS = new Set([
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
  'https://images.unsplash.com/photo-1612036781124-847f8939b154',
  'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb',
  'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7',
  'https://images.unsplash.com/photo-1573706519066-6c0611466bb7',
  'https://images.unsplash.com/photo-1654852360714-3899af1f5be7',
  'https://images.unsplash.com/photo-1557825835-a526494be845',
  'https://images.unsplash.com/photo-1583291023438-41cef6453b1f',
  'https://images.unsplash.com/photo-1726900303636-fb7447fce40d',
  'https://images.unsplash.com/photo-1731616103600-3fe7ccdc5a59',
  'https://images.unsplash.com/photo-1701856270353-403069731ce5',
  'https://images.unsplash.com/photo-1582978571763-2d039e56f0c3',
  'https://images.unsplash.com/photo-1758964087156-0eac97044f84',
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function searchPhoto(query) {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1`,
    { headers: { Authorization: `Client-ID ${KEY}` } }
  );
  if (!res.ok) throw new Error(`Unsplash ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.results[0]?.urls?.raw?.split('?')[0] ?? null;
}

async function run() {
  await connectDB();
  const products = await Product.find({
    images: { $elemMatch: { $in: [...SHARED_PHOTOS] } },
  }).populate('category');

  console.log(`Matching ${products.length} products against Unsplash (Demo tier: 50 req/hour)...`);
  let matched = 0, noResult = 0;
  for (const p of products) {
    const url = await searchPhoto(p.name);
    if (url) {
      p.images = [url];
      await p.save();
      matched++;
      console.log(`  ✓ ${p.name}`);
    } else {
      noResult++;
      console.log(`  · ${p.name} — no result, kept category photo`);
    }
    await sleep(1500); // stay well under the 50/hour demo rate limit
  }
  console.log(`\nDone. ${matched} matched, ${noResult} kept their category placeholder.`);
  await mongoose.disconnect();
}
run().catch(async (err) => { console.error(err); await mongoose.disconnect().catch(() => {}); process.exit(1); });
