require('dotenv').config({ override: true });
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const total = await Product.countDocuments();
  const catCount = await Category.countDocuments();
  console.log('products:', total, '| categories:', catCount);
  await mongoose.disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
