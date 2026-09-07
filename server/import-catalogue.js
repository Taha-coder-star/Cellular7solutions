/**
 * One-time bulk import of the scraped catalogue (F:\files (2)\products.json)
 * plus its local per-product image folders, uploaded to Cloudinary.
 *
 * Idempotent/resumable: skips any product whose name already exists in the
 * DB, so a crashed or interrupted run can just be re-run.
 *
 * Run from server/:  node import-catalogue.js
 */
require('dotenv').config({ override: true });
const dns = require('dns');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cloudinary = require('./config/cloudinary');
const Category = require('./models/Category');
const Brand = require('./models/Brand');
const Product = require('./models/Product');

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const SOURCE_DIR = 'F:/files (2)';
const DATA_FILE = path.join(SOURCE_DIR, 'products.json');
const IMAGE_EXT_RE = /\.(jpe?g|png|webp)$/i;

const stock = () => 5 + Math.floor(Math.random() * 46);

function parsePrice(price) {
  const n = parseFloat(String(price || '').replace(/[^0-9.]/g, ''));
  return Number.isNaN(n) ? 0 : n;
}

function parseStock(description) {
  const m = description && description.match(/In stock:\s*(\d+)/);
  return m ? parseInt(m[1], 10) : stock();
}

function cleanDescription(description, title) {
  if (!description) return title;
  const start = description.indexOf('Product Details');
  const end = description.indexOf('Show More');
  if (start !== -1 && end !== -1 && end > start) {
    const extracted = description.slice(start + 'Product Details'.length, end).trim();
    if (extracted) return extracted;
  }
  return title;
}

async function uploadImages(imageFolder) {
  if (!imageFolder) return [];
  const dir = path.join(SOURCE_DIR, imageFolder);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => IMAGE_EXT_RE.test(f));
  const uploads = await Promise.all(
    files.map((f) =>
      cloudinary.uploader
        .upload(path.join(dir, f), { folder: 'cellular-solutions/products' })
        .then((r) => r.secure_url)
        .catch((err) => {
          console.error(`  image upload failed (${f}):`, err.message);
          return null;
        })
    )
  );
  return uploads.filter(Boolean);
}

async function run() {
  await connectDB();

  const items = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  console.log(`Loaded ${items.length} products from catalogue.\n`);

  const categoryIds = {};
  const brandIds = {};
  const failures = [];
  let created = 0;
  let skipped = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    try {
      if (await Product.findOne({ name: item.title })) {
        skipped++;
        continue;
      }

      if (!categoryIds[item.category]) {
        let doc = await Category.findOne({ name: item.category });
        if (!doc) doc = await new Category({ name: item.category }).save();
        categoryIds[item.category] = doc._id;
      }

      if (!brandIds[item.brand]) {
        let doc = await Brand.findOne({ name: item.brand });
        if (!doc) doc = await new Brand({ name: item.brand }).save();
        brandIds[item.brand] = doc._id;
      }

      const images = await uploadImages(item.image_folder);

      await new Product({
        name: item.title,
        description: cleanDescription(item.description, item.title),
        price: parsePrice(item.price),
        category: categoryIds[item.category],
        brand: brandIds[item.brand],
        condition: 'new',
        stock: parseStock(item.description),
        images,
      }).save();

      created++;
      if (created % 25 === 0) console.log(`${created} created, ${skipped} skipped (${i + 1}/${items.length})`);
    } catch (err) {
      console.error(`FAILED "${item.title}":`, err.message);
      failures.push({ title: item.title, error: err.message });
    }
  }

  console.log('\n===== Import complete =====');
  console.log(`Created: ${created}`);
  console.log(`Skipped (already existed): ${skipped}`);
  console.log(`Failed: ${failures.length}`);
  if (failures.length) {
    fs.writeFileSync(path.join(__dirname, 'import-failures.json'), JSON.stringify(failures, null, 2));
    console.log('Failure details written to import-failures.json — re-run this script to retry them.');
  }

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('Import failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
