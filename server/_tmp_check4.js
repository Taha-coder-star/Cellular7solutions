require('dotenv').config({ override: true });
const mongoose = require('mongoose');
const Brand = require('./models/Brand');
const Category = require('./models/Category');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const brands = await Brand.find().lean();
  console.log('BRANDS:', brands.map(b => b.name));

  // print full category tree
  const cats = await Category.find().lean();
  const byId = {};
  cats.forEach(c => byId[c._id] = c);
  function pathOf(c) {
    const parts = [c.name];
    let cur = c;
    while (cur.parent && byId[cur.parent]) {
      cur = byId[cur.parent];
      parts.unshift(cur.name);
    }
    return parts.join(' > ');
  }
  console.log('TOTAL CATEGORIES:', cats.length);
  fs = require('fs');
  fs.writeFileSync('_tmp_cat_paths.txt', cats.map(c => pathOf(c) + '  ||ID:' + c._id).sort().join('\n'));
  console.log('wrote _tmp_cat_paths.txt');
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
