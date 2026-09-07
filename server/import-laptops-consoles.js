/**
 * One-time bulk import of laptop and console products from
 * F:\product\laptopconsoles\laptops_consoles (numbered per-product image
 * folders under laptops/<brand-slug>/ and consoles/<brand-slug>/), uploaded
 * to Cloudinary. Laptops go under the existing "Laptops" category, consoles
 * under the existing "Gaming" category. Console brands are folded into the
 * existing Sony/Microsoft brands (Sony PlayStation -> Sony, Xbox -> Microsoft).
 *
 * Idempotent/resumable: skips any product whose name already exists.
 *
 * Run from server/:  node import-laptops-consoles.js
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

const SOURCE_DIR = 'F:/product/laptopconsoles/laptops_consoles';
const IMAGE_EXT_RE = /\.(jpe?g|png|webp)$/i;

const CATEGORY_FOR = { laptops: 'Laptops', consoles: 'Gaming' };
const BRAND_ALIAS = { 'Sony PlayStation': 'Sony', Xbox: 'Microsoft' };

const stock = () => 5 + Math.floor(Math.random() * 46);

// results.csv columns: category,brand,product,images,status
function loadRows() {
  const csv = fs.readFileSync(path.join(SOURCE_DIR, 'results.csv'), 'utf-8').trim().split('\n');
  csv.shift(); // header
  return csv.map((line) => {
    const [category, brand, product] = line.split(',');
    return { category, brand, product };
  });
}

function brandSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Product folders are named "NNN_slugified-name" inside category/brand-slug/.
function findProductDir(category, brand, product) {
  const brandDir = path.join(SOURCE_DIR, category, brandSlug(brand));
  if (!fs.existsSync(brandDir)) return null;
  const wanted = product.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const match = fs.readdirSync(brandDir).find((d) => d.slice(4) === wanted);
  return match ? path.join(brandDir, match) : null;
}

async function uploadImages(dir) {
  if (!dir || !fs.existsSync(dir)) return [];
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

  const rows = loadRows();
  console.log(`Loaded ${rows.length} products from results.csv.\n`);

  const categoryIds = {};
  const brandIds = {};
  const failures = [];
  let created = 0;
  let skipped = 0;

  for (let i = 0; i < rows.length; i++) {
    const { category, brand: rawBrand, product } = rows[i];
    const brandName = BRAND_ALIAS[rawBrand] || rawBrand;
    try {
      if (await Product.findOne({ name: product })) {
        skipped++;
        continue;
      }

      const categoryName = CATEGORY_FOR[category];
      if (!categoryIds[categoryName]) {
        let doc = await Category.findOne({ name: categoryName, parent: null });
        if (!doc) doc = await new Category({ name: categoryName }).save();
        categoryIds[categoryName] = doc._id;
      }

      if (!brandIds[brandName]) {
        let doc = await Brand.findOne({ name: brandName });
        if (!doc) doc = await new Brand({ name: brandName }).save();
        brandIds[brandName] = doc._id;
      }

      const dir = findProductDir(category, rawBrand, product);
      const images = await uploadImages(dir);

      await new Product({
        name: product,
        description: `${product} — ${brandName} ${category === 'laptops' ? 'laptop' : 'console'}.`,
        price: 0, // ponytail: no pricing data in results.csv, needs manual pricing before going live
        category: categoryIds[categoryName],
        brand: brandIds[brandName],
        condition: 'new',
        stock: stock(),
        images,
      }).save();

      created++;
      if (created % 25 === 0) console.log(`${created} created, ${skipped} skipped (${i + 1}/${rows.length})`);
    } catch (err) {
      console.error(`FAILED "${product}":`, err.message);
      failures.push({ product, error: err.message });
    }
  }

  console.log('\n===== Import complete =====');
  console.log(`Created: ${created}`);
  console.log(`Skipped (already existed): ${skipped}`);
  console.log(`Failed: ${failures.length}`);
  if (failures.length) {
    fs.writeFileSync(path.join(__dirname, 'import-laptops-consoles-failures.json'), JSON.stringify(failures, null, 2));
    console.log('Failure details written to import-laptops-consoles-failures.json — re-run this script to retry them.');
  }

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('Import failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
