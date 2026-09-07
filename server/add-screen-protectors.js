/**
 * Adds a new top-level "Screen Protectors" nav category, structured exactly
 * like the existing Cases tree (Apple/Samsung/Motorola/Other, each broken
 * into series then individual models — reusing the same model lists as
 * seed-category-tree.js for consistency).
 *
 * Screen-protector products are scattered across the whole catalog today —
 * the old flat "Tempered Glass" category (2), the unsorted "Store" bucket
 * (23), and a few that landed under Parts > Screens & Displays during
 * earlier passes (6) — found via a keyword scan (excluding camera-lens
 * protectors, which are a different product entirely). Each gets routed by
 * brand, then by model when the name unambiguously names one, falling back
 * to the shared series when a listing covers several models from the same
 * series (e.g. "for 13/13 Pro/14" — extremely common in this vertical,
 * since one protector often fits several models with the same screen), and
 * to the brand root only when nothing more specific can be inferred safely.
 *
 * Idempotent: only touches products not already under the new tree.
 *
 * Run from server/:  node add-screen-protectors.js
 */
require('dotenv').config({ override: true });
const dns = require('dns');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Category = require('./models/Category');
const Product = require('./models/Product');
require('./models/Brand');

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const series = (name, models) => ({ name, children: models.map((m) => ({ name: m })) });

const APPLE_MODEL_SERIES = [
  series('iPhone 17 Series', ['iPhone 17', 'iPhone 17 Plus', 'iPhone 17 Pro', 'iPhone 17 Pro Max', 'iPhone Air']),
  series('iPhone 16 Series', ['iPhone 16', 'iPhone 16 Plus', 'iPhone 16 Pro', 'iPhone 16 Pro Max', 'iPhone 16e']),
  series('iPhone 15 Series', ['iPhone 15', 'iPhone 15 Plus', 'iPhone 15 Pro', 'iPhone 15 Pro Max']),
  series('Older iPhones', ['iPhone 14 Pro Max', 'iPhone 14', 'iPhone 13 Pro Max', 'iPhone 13', 'iPhone 12', 'iPhone 11 Pro Max', 'iPhone 11', 'iPhone XR', 'iPhone SE', 'Other Older iPhone']),
];
const APPLE_IPAD_SERIES = [series('iPad', ['iPad', 'iPad Air', 'iPad Mini', 'iPad Pro', 'Other iPad'])];

const SAMSUNG_MODEL_SERIES = [
  series('Galaxy S Series', ['Galaxy S25 Ultra', 'Galaxy S25 Plus', 'Galaxy S25', 'Galaxy S24 Ultra', 'Galaxy S24 Plus', 'Galaxy S24', 'Other Galaxy S']),
  series('Galaxy A Series', ['Galaxy A56', 'Galaxy A36', 'Galaxy A16', 'Other Galaxy A']),
  series('Galaxy Z Series', ['Galaxy Z Fold 7', 'Galaxy Z Flip 7', 'Other Galaxy Z']),
  series('Galaxy Note Series', ['Galaxy Note 20 Ultra', 'Other Galaxy Note']),
  { name: 'Other Samsung' },
];

const MOTOROLA_MODEL_SERIES = [
  series('Moto G Series', ['Moto G Power', 'Moto G Stylus', 'Moto G Play', 'Other Moto G']),
  series('Edge Series', ['Edge Plus', 'Edge', 'Other Edge']),
  series('Razr Series', ['Razr Plus', 'Razr', 'Other Razr']),
  { name: 'Other Motorola' },
];

const TREE = [
  { name: 'Apple Screen Protectors', children: [...APPLE_MODEL_SERIES, ...APPLE_IPAD_SERIES] },
  { name: 'Samsung Screen Protectors', children: SAMSUNG_MODEL_SERIES },
  { name: 'Motorola Screen Protectors', children: MOTOROLA_MODEL_SERIES },
  {
    name: 'Other Screen Protectors',
    children: [{ name: 'Google/Pixel' }, { name: 'LG' }, { name: 'OnePlus' }, { name: 'Other Android' }],
  },
];

const BRAND_TO_ROOT = { Apple: 'Apple Screen Protectors', Samsung: 'Samsung Screen Protectors', Motorola: 'Motorola Screen Protectors' };
const SUB_BRAND_KEYWORDS = [
  { regex: /pixel|google/i, name: 'Google/Pixel' },
  { regex: /oneplus/i, name: 'OnePlus' },
  { regex: /\blg\b/i, name: 'LG' },
];

const KEYWORD_RE = /tempered glass|screen protector|glass protector|screen guard|privacy glass|9h glass/i;
const EXCLUDE_RE = /camera/i; // camera-lens protectors are a different product, not a screen protector

async function findOrCreate(name, parentId, navOrder) {
  let doc = await Category.findOne({ parent: parentId, name });
  if (!doc) doc = await new Category({ name, parent: parentId, navOrder: navOrder ?? null }).save();
  return doc;
}

function pickBestMatch(candidates) {
  if (candidates.length === 0) return null;
  const sorted = [...candidates].sort((a, b) => b.aliasNorm.length - a.aliasNorm.length);
  const longest = sorted[0];
  const trulyAmbiguous = sorted.some((m) => m.modelName !== longest.modelName && !longest.aliasNorm.includes(m.aliasNorm));
  return trulyAmbiguous ? null : longest;
}

async function run() {
  await connectDB();

  const screenProtectorsRoot = await findOrCreate('Screen Protectors', null, 11);

  // Build the tree and a flat model-alias index for matching, same shape as
  // reassign-cases-finer.js — each entry knows its own model doc AND the
  // series doc one level up, for the series-level fallback.
  const modelIndex = []; // { modelName, aliasNorm, modelDoc, seriesDoc, brandRootDoc }
  for (const brandSpec of TREE) {
    const brandRootDoc = await findOrCreate(brandSpec.name, screenProtectorsRoot._id);
    for (const child of brandSpec.children) {
      const seriesDoc = await findOrCreate(child.name, brandRootDoc._id);
      if (child.children) {
        for (const m of child.children) {
          const modelDoc = await findOrCreate(m.name, seriesDoc._id);
          modelIndex.push({ modelName: m.name, aliasNorm: norm(m.name), modelDoc, seriesDoc, brandRootDoc });
        }
      }
    }
  }

  const existingIds = new Set(modelIndex.flatMap((m) => [String(m.modelDoc._id), String(m.seriesDoc._id), String(m.brandRootDoc._id)]));
  existingIds.add(String(screenProtectorsRoot._id));

  const candidates = await Product.find({
    $or: [{ name: KEYWORD_RE }, { description: KEYWORD_RE }],
    name: { $not: EXCLUDE_RE },
    category: { $nin: [...existingIds] },
  }).populate('brand', 'name');

  let toModel = 0, toSeries = 0, toBrandRoot = 0, toSubBrand = 0;

  for (const product of candidates) {
    const rawText = `${product.name} ${product.description}`;
    const text = norm(rawText);
    const brandName = product.brand?.name;

    if (BRAND_TO_ROOT[brandName]) {
      const rootName = BRAND_TO_ROOT[brandName];
      const brandModels = modelIndex.filter((m) => m.brandRootDoc.name === rootName);
      const candidateMatches = brandModels.filter((m) => text.includes(m.aliasNorm));
      const best = pickBestMatch(candidateMatches);

      if (best) {
        product.category = best.modelDoc._id;
        await product.save();
        toModel++;
      } else if (candidateMatches.length > 1 && candidateMatches.every((m) => String(m.seriesDoc._id) === String(candidateMatches[0].seriesDoc._id))) {
        // Ambiguous between several models, but they're all in the same series
        // (e.g. "for 13/13 Pro/14" — common for bundle-fit protectors) — the
        // series itself is still a confident, useful placement.
        product.category = candidateMatches[0].seriesDoc._id;
        await product.save();
        toSeries++;
      } else {
        const rootDoc = brandModels[0]?.brandRootDoc;
        product.category = rootDoc ? rootDoc._id : screenProtectorsRoot._id;
        await product.save();
        toBrandRoot++;
      }
    } else {
      const otherRoot = await Category.findOne({ name: 'Other Screen Protectors', parent: screenProtectorsRoot._id });
      const subBrand = SUB_BRAND_KEYWORDS.find((s) => s.regex.test(rawText));
      const target = subBrand ? await Category.findOne({ name: subBrand.name, parent: otherRoot._id }) : otherRoot;
      product.category = (target || otherRoot)._id;
      await product.save();
      toSubBrand++;
    }
  }

  // Clean up the now-redundant old locations: the flat "Tempered Glass"
  // category and the flat "Screen Protectors" leaf under Accessories,
  // if they're empty after this pass.
  let deleted = 0;
  for (const name of ['Tempered Glass']) {
    const cat = await Category.findOne({ name, parent: null });
    if (cat) {
      const remaining = await Product.countDocuments({ category: cat._id });
      const children = await Category.countDocuments({ parent: cat._id });
      if (remaining === 0 && children === 0) {
        await Category.deleteOne({ _id: cat._id });
        deleted++;
      }
    }
  }
  const accessories = await Category.findOne({ name: 'Accessories', parent: null });
  if (accessories) {
    const oldLeaf = await Category.findOne({ name: 'Screen Protectors', parent: accessories._id });
    if (oldLeaf) {
      const remaining = await Product.countDocuments({ category: oldLeaf._id });
      const children = await Category.countDocuments({ parent: oldLeaf._id });
      if (remaining === 0 && children === 0) {
        await Category.deleteOne({ _id: oldLeaf._id });
        deleted++;
      }
    }
  }

  console.log('\n===== Screen Protectors category created =====');
  console.log(`Candidate products found (catalog-wide keyword scan): ${candidates.length}`);
  console.log(`Assigned to exact model: ${toModel}`);
  console.log(`Assigned to shared series (multi-model bundle listing): ${toSeries}`);
  console.log(`Assigned to brand root only: ${toBrandRoot}`);
  console.log(`Assigned under Other Screen Protectors: ${toSubBrand}`);
  console.log(`Old redundant categories deleted: ${deleted}`);

  await mongoose.disconnect();
  console.log('\nDisconnected.');
}

run().catch(async (err) => {
  console.error('Screen Protectors migration failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
