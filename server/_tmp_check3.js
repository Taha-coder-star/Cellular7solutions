require('dotenv').config({ override: true });
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const sample = await Product.find().limit(5).skip(500).lean();
  for (const p of sample) {
    console.log(p.name, '=>', p.images);
  }
  // domain histogram
  const all = await Product.find().select('images').lean();
  const domains = {};
  for (const p of all) {
    for (const img of (p.images || [])) {
      try {
        const host = new URL(img).host;
        domains[host] = (domains[host] || 0) + 1;
      } catch { domains['(invalid)'] = (domains['(invalid)'] || 0) + 1; }
    }
  }
  console.log(domains);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
