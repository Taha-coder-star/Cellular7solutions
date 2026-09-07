require('dotenv').config({ override: true });
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
require('./models/Brand');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const items = JSON.parse(require('fs').readFileSync('_tmp_smoke_items.json', 'utf-8'));
  const all = await Category.find().lean();
  const byId = {};
  all.forEach((c) => (byId[c._id] = c));
  function pathOf(id) {
    const parts = [];
    let cur = byId[id];
    while (cur) {
      parts.unshift(cur.name);
      cur = cur.parent ? byId[cur.parent] : null;
    }
    return parts.join(' > ');
  }
  for (const it of items) {
    const p = await Product.findOne({ name: it.name }).populate('brand').lean();
    console.log('\n' + it.name);
    console.log('  category:', pathOf(p.category));
    console.log('  brand:', p.brand.name, '| price:', p.price, '| stock:', p.stock, '| images:', p.images.length, p.images[0]);
  }
  await mongoose.disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
