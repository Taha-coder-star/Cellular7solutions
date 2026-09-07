require('dotenv').config({ override: true });
const fs = require('fs');
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const dbNames = new Set((await Product.distinct('name')).map((n) => n.trim().toLowerCase()));
  const items = JSON.parse(fs.readFileSync('F:/excell_catalogue_downloader_windows/excell_catalogue_downloader/output/products.json', 'utf-8'));

  const seenInSource = new Set();
  const newItems = [];
  let dupWithinSource = 0;
  for (const it of items) {
    const key = (it.name || '').trim().toLowerCase();
    if (!key) continue;
    if (seenInSource.has(key)) { dupWithinSource++; continue; }
    seenInSource.add(key);
    if (!dbNames.has(key)) newItems.push(it);
  }

  console.log('source total:', items.length);
  console.log('dup within source (same name twice):', dupWithinSource);
  console.log('already in DB:', items.length - dupWithinSource - newItems.length);
  console.log('NEW (not in DB):', newItems.length);
  console.log('\nsample of 15 new item names:');
  newItems.slice(0, 15).forEach((it) => console.log(' -', it.name, '|', JSON.stringify(it.breadcrumbs)));

  fs.writeFileSync('_tmp_new_items.json', JSON.stringify(newItems));
  await mongoose.disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
