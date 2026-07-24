require('dotenv').config({ override: true });
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const cloudinary = require('./config/cloudinary');

const PRODUCT_NAME = process.argv[2];
const FILE_PATH = process.argv[3];
if (!PRODUCT_NAME || !FILE_PATH) throw new Error('Usage: node _set_product_image.js "<product name>" "<file path>"');

async function run() {
  await connectDB();
  const product = await Product.findOne({ name: PRODUCT_NAME });
  if (!product) throw new Error(`No product found named "${PRODUCT_NAME}"`);

  const result = await cloudinary.uploader.upload(FILE_PATH, { folder: 'cellular-solutions/products' });
  product.images = [result.secure_url];
  await product.save();

  console.log(`✓ ${product.name} → ${result.secure_url}`);
  await mongoose.disconnect();
}
run().catch(async (err) => { console.error(err); await mongoose.disconnect().catch(() => {}); process.exit(1); });
