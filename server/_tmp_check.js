require('dotenv').config({ override: true });
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Brand = require('./models/Brand');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const count = await Product.countDocuments();
  const catCount = await Category.countDocuments();
  const brandCount = await Brand.countDocuments();
  console.log('products:', count, 'categories:', catCount, 'brands:', brandCount);
  const sample = await Product.findOne().populate('category brand').lean();
  console.log(JSON.stringify(sample, null, 2));
  const cats = await Category.find().lean();
  console.log('category tree sample (first 20):');
  console.log(cats.slice(0, 20).map(c => `${c._id} | parent:${c.parent} | ${c.name}`).join('\n'));
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
