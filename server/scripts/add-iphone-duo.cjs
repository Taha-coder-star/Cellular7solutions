require('dotenv').config({ override: true, quiet: true });
const path = require('node:path');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const cloudinary = require('../config/cloudinary');

async function main() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  const existing = await Product.findOne({ name: /^iPhone Duo$/i });
  if (existing) {
    console.log(JSON.stringify({ created: false, id: String(existing._id), name: existing.name }));
    return;
  }

  const [category, brand] = await Promise.all([
    Category.findOne({ slug: 'smartphones', parent: null }),
    Brand.findOne({ name: /^Apple$/i }),
  ]);
  if (!category || !brand) throw new Error('Apple brand or Smartphones category is missing.');

  const upload = await cloudinary.uploader.upload(
    path.resolve(__dirname, '../../client/public/assets/iphone-duo-official.jpg'),
    { folder: 'cellular-solutions/products', public_id: 'iphone-duo-official', overwrite: false, resource_type: 'image' },
  );
  const product = await Product.create({
    name: 'iPhone Duo',
    description: 'Apple’s foldable iPhone with a 7.6-inch inner display and a 5.4-inch outer display. Announced in star white and night sky. Contact Cellular Solutions for pricing and store availability.',
    price: 0,
    stock: 0,
    condition: 'new',
    category: category._id,
    brand: brand._id,
    images: [upload.secure_url],
    isFeatured: false,
  });
  console.log(JSON.stringify({ created: true, id: String(product._id), name: product.name, stock: product.stock, image: upload.secure_url }));
}

main().catch(() => {
  console.error('Could not add iPhone Duo; check database and image-upload connectivity.');
  process.exitCode = 1;
}).finally(() => mongoose.disconnect());
