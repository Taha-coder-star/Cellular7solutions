/**
 * One-time import of new products found in the Aug 2026 excellatlanta re-scrape
 * (F:\excell_catalogue_downloader_windows\excell_catalogue_downloader\output),
 * filtered down to items whose images don't already exist on Cloudinary
 * (see _tmp_new_items_by_image.json, produced by _tmp_image_dedup.js).
 *
 * Categories are resolved by walking each item's breadcrumb trail against the
 * existing Category tree (case-insensitive), reusing a matching node at each
 * level and creating a new child only where the tree doesn't already go deep
 * enough — so products land under the existing hierarchy instead of a flat
 * bucket.
 *
 * Idempotent/resumable: skips any product whose name already exists in the
 * DB, so a crashed or interrupted run can just be re-run.
 *
 * Run from server/:  node import-parts-2026-08.js
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

const SOURCE_DIR = 'F:/excell_catalogue_downloader_windows/excell_catalogue_downloader/output';
const ITEMS_FILE = path.join(__dirname, '_tmp_smoke_items.json');
const IMAGE_EXT_RE = /\.(jpe?g|png|webp)$/i;

// First breadcrumb segment (after stripping the generic "Store" wrapper) as
// scraped doesn't always match the existing top-level category name exactly.
const ROOT_ALIASES = {
  'google & more parts': 'Other Parts',
  'google & other cases': 'Other Cases',
  'motorola case': 'Motorola Cases',
  'samsung case': 'Samsung Cases',
};

const BRAND_TESTS = [
  [/\bapple\b|iphone|ipad|macbook|airpods|\bimac\b|apple watch/i, 'Apple'],
  [/\bsamsung\b|galaxy/i, 'Samsung'],
  [/\bmotorola\b|\bmoto g\b|\bmoto\b|\bedge\+?\b|\brazr\b/i, 'Motorola'],
  [/\bnokia\b/i, 'Nokia'],
  [/\bmicrosoft\b|\bsurface\b/i, 'Microsoft'],
  [/\bsony\b|xperia|playstation|\bps[45]\b/i, 'Sony'],
  [/\bnintendo\b|\bswitch\b/i, 'Nintendo'],
  [/\banker\b/i, 'Anker'],
  [/\bjbl\b/i, 'JBL'],
];

const stock = () => 5 + Math.floor(Math.random() * 46);
const normalize = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');

function parsePrice(price) {
  const n = parseFloat(String(price ?? '').replace(/[^0-9.]/g, ''));
  return Number.isNaN(n) ? 0 : n;
}

function parseStock(availability) {
  return /out.*stock/i.test(String(availability || '')) ? 0 : stock();
}

function brandNameFor(item) {
  const haystack = `${item.name} ${(item.breadcrumbs || []).join(' ')}`;
  for (const [re, name] of BRAND_TESTS) {
    if (re.test(haystack)) return name;
  }
  return 'Other';
}

// --- Category tree cache ---
// childIndex: parentKey ('root' or a Category _id string) -> Map<normalizedName, _id>
// nameIndex:  normalizedName -> [_id, ...]   (every node with that name, anywhere in the tree)
// parentOf:   _id string -> parent _id string | null
const childIndex = new Map();
const nameIndex = new Map();
const parentOf = new Map();

async function loadCategoryTree() {
  const all = await Category.find().lean();
  for (const c of all) {
    const key = c.parent ? String(c.parent) : 'root';
    if (!childIndex.has(key)) childIndex.set(key, new Map());
    childIndex.get(key).set(normalize(c.name), c._id);

    const nk = normalize(c.name);
    if (!nameIndex.has(nk)) nameIndex.set(nk, []);
    nameIndex.get(nk).push(c._id);

    parentOf.set(String(c._id), c.parent ? String(c.parent) : null);
  }
}

function isDescendant(id, ancestorId) {
  let cur = String(id);
  while (cur) {
    if (cur === String(ancestorId)) return true;
    cur = parentOf.get(cur) || null;
  }
  return false;
}

async function findOrCreateChild(parentId, name) {
  const key = parentId ? String(parentId) : 'root';
  if (!childIndex.has(key)) childIndex.set(key, new Map());
  const map = childIndex.get(key);
  const norm = normalize(name);
  if (map.has(norm)) return map.get(norm);

  const doc = await new Category({ name: name.trim(), parent: parentId || null }).save();
  map.set(norm, doc._id);
  if (!nameIndex.has(norm)) nameIndex.set(norm, []);
  nameIndex.get(norm).push(doc._id);
  parentOf.set(String(doc._id), parentId ? String(parentId) : null);
  return doc._id;
}

// Walks the breadcrumb trail against the existing tree, reusing matching
// nodes. If an intermediate segment doesn't match (the scrape's grouping
// differs from ours — e.g. "iPhone 14 to 17 Pro Max" vs. our per-series
// buckets), it looks for the deepest remaining segment (the actual device
// model / part type) anywhere under the last matched ancestor before
// falling back to creating new nodes for the unmatched tail.
async function resolveCategory(item) {
  let crumbs = (item.breadcrumbs || []).slice();
  if (crumbs.length && normalize(crumbs[0]) === 'store') crumbs.shift();
  if (crumbs.length && normalize(crumbs[crumbs.length - 1]) === normalize(item.name)) crumbs.pop();
  if (!crumbs.length) crumbs = [item.category, item.subcategory].filter(Boolean);
  if (!crumbs.length) crumbs = ['Store', 'Other'];

  const aliased = ROOT_ALIASES[normalize(crumbs[0])];
  if (aliased) crumbs[0] = aliased;

  let parentId = null;
  let anchor = null;
  for (let k = 0; k < crumbs.length; k++) {
    const seg = crumbs[k];
    const key = parentId ? String(parentId) : 'root';
    const map = childIndex.get(key);
    const norm = normalize(seg);
    if (map && map.has(norm)) {
      parentId = map.get(norm);
      anchor = parentId;
      continue;
    }

    if (anchor) {
      const target = normalize(crumbs[crumbs.length - 1]);
      const candidates = (nameIndex.get(target) || []).filter((id) => isDescendant(id, anchor));
      if (candidates.length === 1) return candidates[0];
    }

    for (const rest of crumbs.slice(k)) {
      parentId = await findOrCreateChild(parentId, rest);
    }
    return parentId;
  }
  return parentId;
}

async function uploadImages(localImages) {
  const files = (localImages || []).filter((p) => IMAGE_EXT_RE.test(p));
  const uploads = await Promise.all(
    files.map((rel) => {
      const full = path.join(SOURCE_DIR, rel.replace(/\\/g, path.sep));
      if (!fs.existsSync(full)) return null;
      return cloudinary.uploader
        .upload(full, { folder: 'cellular-solutions/products' })
        .then((r) => r.secure_url)
        .catch((err) => {
          console.error(`  image upload failed (${rel}):`, err.message);
          return null;
        });
    })
  );
  return uploads.filter(Boolean);
}

async function run() {
  await connectDB();
  await loadCategoryTree();

  const items = JSON.parse(fs.readFileSync(ITEMS_FILE, 'utf-8'));
  console.log(`Loaded ${items.length} candidate products.\n`);

  const brandIds = {};
  const failures = [];
  let created = 0;
  let skipped = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    try {
      if (await Product.findOne({ name: item.name })) {
        skipped++;
        continue;
      }

      const categoryId = await resolveCategory(item);

      const brandName = brandNameFor(item);
      if (!brandIds[brandName]) {
        let doc = await Brand.findOne({ name: brandName });
        if (!doc) doc = await Brand.findOne({ name: 'Other' });
        brandIds[brandName] = doc._id;
      }

      const images = await uploadImages(item.local_images);

      await new Product({
        name: item.name,
        description: (item.description && item.description.trim()) || item.name,
        price: parsePrice(item.price),
        category: categoryId,
        brand: brandIds[brandName],
        condition: 'new',
        stock: parseStock(item.availability),
        images,
      }).save();

      created++;
      if (created % 25 === 0) console.log(`${created} created, ${skipped} skipped (${i + 1}/${items.length})`);
    } catch (err) {
      console.error(`FAILED "${item.name}":`, err.message);
      failures.push({ name: item.name, error: err.message });
    }
  }

  console.log('\n===== Import complete =====');
  console.log(`Created: ${created}`);
  console.log(`Skipped (already existed): ${skipped}`);
  console.log(`Failed: ${failures.length}`);
  if (failures.length) {
    fs.writeFileSync(path.join(__dirname, 'import-parts-failures.json'), JSON.stringify(failures, null, 2));
    console.log('Failure details written to import-parts-failures.json — re-run this script to retry them.');
  }

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('Import failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
