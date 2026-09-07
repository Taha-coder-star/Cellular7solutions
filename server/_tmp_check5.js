require('dotenv').config({ override: true });
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Brand = require('./models/Brand');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const xiaomiCat = await Category.findOne({ name: 'Xiaomi' });
  const p = await Product.findOne({ category: xiaomiCat._id }).populate('brand').lean();
  console.log('Xiaomi cat product brand:', p && p.brand);

  // names set for dedup check
  const names = await Product.distinct('name');
  console.log('distinct product name count:', names.length);
  const fs = require('fs');
  fs.writeFileSync('_tmp_db_names.json', JSON.stringify(names));
  console.log('wrote _tmp_db_names.json');
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
