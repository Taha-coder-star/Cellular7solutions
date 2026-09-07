require('dotenv').config({ override: true });
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const cloudfrontCount = await Product.countDocuments({ images: { $regex: 'cloudfront' } });
  const unsplashCount = await Product.countDocuments({ images: { $regex: 'unsplash' } });
  const total = await Product.countDocuments();
  console.log({ total, cloudfrontCount, unsplashCount });
  const sample = await Product.find({ images: { $regex: 'cloudfront' } }).limit(2).lean();
  console.log(JSON.stringify(sample, null, 2));
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
