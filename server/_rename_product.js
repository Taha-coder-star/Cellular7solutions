require('dotenv').config({ override: true });
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');

const OLD_NAME = process.argv[2];
const NEW_NAME = process.argv[3];
if (!OLD_NAME || !NEW_NAME) throw new Error('Usage: node _rename_product.js "<old name>" "<new name>"');

async function run() {
  await connectDB();
  const product = await Product.findOne({ name: OLD_NAME });
  if (!product) throw new Error(`No product found named "${OLD_NAME}"`);

  product.name = NEW_NAME;
  await product.save();

  console.log(`✓ ${OLD_NAME} → ${product.name}`);
  await mongoose.disconnect();
}
run().catch(async (err) => { console.error(err); await mongoose.disconnect().catch(() => {}); process.exit(1); });
