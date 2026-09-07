/**
 * Idempotent migration: builds the full Phones / Accessories / Cases / Parts /
 * Repair Tools category tree (parent-linked) alongside the existing flat
 * categories, folds a handful of unambiguous old categories into the new
 * tree, and reassigns only high-confidence "Cases" products into the new
 * model-aware leaves. Safe to re-run — every node is found-or-created on
 * (parent, name).
 *
 * Run from server/:  node seed-category-tree.js
 */
require('dotenv').config({ override: true });
const dns = require('dns');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Category = require('./models/Category');
const Product = require('./models/Product');

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);

// ---- tree spec -------------------------------------------------------

const PART_TYPES = [
  'Screens & Displays', 'Batteries', 'Charging', 'Cameras', 'Speakers/Audio',
  'Flex Cables', 'Buttons', 'SIM Trays', 'Antennas', 'Other Parts',
];
const SAMSUNG_PART_TYPES = [...PART_TYPES.slice(0, -1), 'Fingerprint/Biometrics', 'Other Parts'];

const iphoneSeries = (label, models) => ({ name: label, children: models.map((name) => ({ name })) });

const APPLE_MODEL_SERIES = [
  iphoneSeries('iPhone 17 Series', ['iPhone 17', 'iPhone 17 Plus', 'iPhone 17 Pro', 'iPhone 17 Pro Max', 'iPhone Air']),
  iphoneSeries('iPhone 16 Series', ['iPhone 16', 'iPhone 16 Plus', 'iPhone 16 Pro', 'iPhone 16 Pro Max', 'iPhone 16e']),
  iphoneSeries('iPhone 15 Series', ['iPhone 15', 'iPhone 15 Plus', 'iPhone 15 Pro', 'iPhone 15 Pro Max']),
  iphoneSeries('Older iPhones', ['iPhone 14 Pro Max', 'iPhone 14', 'iPhone 13 Pro Max', 'iPhone 13', 'iPhone 12', 'iPhone 11 Pro Max', 'iPhone 11', 'iPhone XR', 'iPhone SE', 'Other Older iPhone']),
];

// Apple Cases only — iPad is not a phone model, so this is kept out of
// APPLE_MODEL_SERIES (which also seeds Phones > Apple's model list).
const APPLE_IPAD_SERIES = [
  iphoneSeries('iPad', ['iPad', 'iPad Air', 'iPad Mini', 'iPad Pro', 'Other iPad']),
];

const SAMSUNG_MODEL_SERIES = [
  iphoneSeries('Galaxy S Series', ['Galaxy S25 Ultra', 'Galaxy S25 Plus', 'Galaxy S25', 'Galaxy S24 Ultra', 'Galaxy S24 Plus', 'Galaxy S24', 'Other Galaxy S']),
  iphoneSeries('Galaxy A Series', ['Galaxy A56', 'Galaxy A36', 'Galaxy A16', 'Other Galaxy A']),
  iphoneSeries('Galaxy Z Series', ['Galaxy Z Fold 7', 'Galaxy Z Flip 7', 'Other Galaxy Z']),
  iphoneSeries('Galaxy Note Series', ['Galaxy Note 20 Ultra', 'Other Galaxy Note']),
  { name: 'Other Samsung' },
];

const MOTOROLA_MODEL_SERIES = [
  iphoneSeries('Moto G Series', ['Moto G Power', 'Moto G Stylus', 'Moto G Play', 'Other Moto G']),
  iphoneSeries('Edge Series', ['Edge Plus', 'Edge', 'Other Edge']),
  iphoneSeries('Razr Series', ['Razr Plus', 'Razr', 'Other Razr']),
  { name: 'Other Motorola' },
];

const partsChildren = (types) => types.map((name) => ({ name }));

const TREE = [
  {
    name: 'Phones',
    reuseTop: true, // reuse existing flat "Phones" category as this node
    children: [
      { name: 'Apple', children: APPLE_MODEL_SERIES },
      { name: 'Samsung', children: SAMSUNG_MODEL_SERIES },
      { name: 'Motorola', children: MOTOROLA_MODEL_SERIES },
      { name: 'Google Pixel' }, { name: 'OnePlus' }, { name: 'Xiaomi' },
      { name: 'Oppo' }, { name: 'Vivo' }, { name: 'Realme' }, { name: 'Other Brands' },
    ],
  },
  {
    name: 'Accessories', navOrder: 1,
    children: [
      { name: 'Cables' },
      { name: 'Chargers', reuseExisting: true },
      { name: 'Adapters' },
      { name: 'Wireless Chargers' },
      { name: 'Power Banks' },
      { name: 'Audio' },
      { name: 'Bluetooth', reuseExisting: true },
      { name: 'Speakers', reuseExisting: true },
      { name: 'Car Accessories' },
      { name: 'Phone Holders' },
      { name: 'Screen Protectors' },
      { name: 'Memory/Storage' },
      { name: 'AirPods', reuseExisting: true },
      { name: 'Headphones', reuseExisting: true },
      { name: 'Other' },
    ],
  },
  { name: 'Apple Cases', navOrder: 2, children: [...APPLE_MODEL_SERIES, ...APPLE_IPAD_SERIES] },
  { name: 'Samsung Cases', navOrder: 3, children: SAMSUNG_MODEL_SERIES },
  { name: 'Motorola Cases', navOrder: 4, children: MOTOROLA_MODEL_SERIES },
  {
    name: 'Other Cases', navOrder: 5,
    children: [{ name: 'Google/Pixel' }, { name: 'LG' }, { name: 'OnePlus' }, { name: 'Other Android' }],
  },
  { name: 'Apple Parts', navOrder: 6, children: partsChildren(PART_TYPES) },
  { name: 'Samsung Parts', navOrder: 7, children: partsChildren(SAMSUNG_PART_TYPES) },
  { name: 'Motorola Parts', navOrder: 8, children: partsChildren(PART_TYPES) },
  {
    name: 'Other Parts', navOrder: 9,
    children: ['Google', 'OnePlus', 'Xiaomi', 'Oppo', 'Vivo', 'Other'].map((name) => ({
      name, children: partsChildren(PART_TYPES),
    })),
  },
  {
    name: 'Repair Tools', navOrder: 10,
    children: [
      'Screwdrivers', 'Tweezers', 'Pry Tools', 'Pliers', 'Clamps & Holders',
      'Adhesives & Tapes', 'Heating Equipment', 'Vacuum Equipment',
      'Charging Stations', 'Testers', 'Programmers', 'Board-Level Tools',
      'Storage & Organization', 'Other Tools',
    ].map((name) => ({ name })),
  },
];

// Old flat categories that unambiguously fold under the new "Accessories" node.
// Matches the `reuseExisting` leaves above by name.
const FOLD_IN_PARENT = 'Accessories';
const FOLD_IN_NAMES = ['Chargers', 'Bluetooth', 'Speakers', 'AirPods', 'Headphones'];

// ---- build ------------------------------------------------------------

const counts = {
  categoriesCreated: 0,
  subcategoriesCreated: 0,
  phoneBrandsCreated: 0,
  phoneModelsCreated: 0,
  duplicatesSkipped: 0,
  alreadyExisted: 0,
};

async function upsertCategory(name, parentId, navOrder) {
  const doc = await Category.findOne({ parent: parentId || null, name });
  if (doc) {
    counts.duplicatesSkipped++;
    counts.alreadyExisted++;
    if (navOrder !== undefined && doc.navOrder !== navOrder) {
      doc.navOrder = navOrder;
      await doc.save();
    }
    return doc;
  }
  return new Category({ name, parent: parentId || null, navOrder: navOrder ?? null }).save();
}

async function buildNode(spec, parentId, depth, rootName) {
  let doc;
  if (spec.reuseTop) {
    doc = await Category.findOne({ parent: null, name: spec.name });
    if (doc) counts.alreadyExisted++;
    else { doc = await new Category({ name: spec.name, parent: null, navOrder: spec.navOrder ?? null }).save(); counts.categoriesCreated++; }
  } else if (spec.reuseExisting) {
    doc = await Category.findOne({ parent: parentId, name: spec.name }) || await Category.findOne({ parent: null, name: spec.name });
    if (doc) {
      counts.alreadyExisted++;
      if (String(doc.parent || '') !== String(parentId)) {
        doc.parent = parentId;
        await doc.save();
      }
    } else {
      doc = await new Category({ name: spec.name, parent: parentId, navOrder: null }).save();
      counts.subcategoriesCreated++;
    }
  } else {
    const existed = await Category.findOne({ parent: parentId || null, name: spec.name });
    doc = await upsertCategory(spec.name, parentId, spec.navOrder);
    if (!existed) {
      if (depth === 0) counts.categoriesCreated++;
      else if (depth === 1 && rootName === 'Phones') counts.phoneBrandsCreated++;
      else if (rootName === 'Phones') counts.phoneModelsCreated++;
      else counts.subcategoriesCreated++;
    }
  }

  for (const child of spec.children || []) {
    await buildNode(child, doc._id, depth + 1, spec.reuseTop ? spec.name : rootName);
  }
  return doc;
}

// ---- product reassignment: "Cases" -> model-aware leaves --------------

async function collectLeafModels(rootNames) {
  const roots = await Category.find({ parent: null, name: { $in: rootNames } });
  const leaves = [];
  async function walk(catId) {
    const children = await Category.find({ parent: catId });
    for (const child of children) {
      const grandchildren = await Category.find({ parent: child._id });
      if (grandchildren.length === 0) leaves.push(child);
      else await walk(child._id);
    }
  }
  for (const root of roots) await walk(root._id);
  return leaves.sort((a, b) => b.name.length - a.name.length);
}

async function reassignCases() {
  const oldCases = await Category.findOne({ parent: null, name: 'Cases' });
  const untouched = [];
  let modified = 0;
  if (!oldCases) return { modified, untouched };

  const leafModels = await collectLeafModels(['Apple Cases', 'Samsung Cases', 'Motorola Cases']);
  const products = await Product.find({ category: oldCases._id });

  for (const product of products) {
    const text = `${product.name} ${product.description}`.toLowerCase();
    // ponytail: skip anything mentioning a "/" model range (e.g. "iPhone 12/13 Pro Max") —
    // too ambiguous for a single-leaf match; upgrade to multi-category tagging if that's ever needed.
    if (text.includes('/')) {
      untouched.push(product.name);
      continue;
    }
    const match = leafModels.find((leaf) => text.includes(leaf.name.toLowerCase()));
    if (match) {
      product.category = match._id;
      await product.save();
      modified++;
    } else {
      untouched.push(product.name);
    }
  }
  return { modified, untouched };
}

// ---- run ----------------------------------------------------------------

async function run() {
  await connectDB();
  await Category.syncIndexes(); // drop the old global-unique "name" index, add the new compound ones

  for (const node of TREE) {
    await buildNode(node, null, 0, node.name);
  }

  // Fold in the remaining unambiguous old flat categories not already handled via reuseExisting above
  const accessories = await Category.findOne({ parent: null, name: FOLD_IN_PARENT });
  for (const name of FOLD_IN_NAMES) {
    const cat = await Category.findOne({ name, parent: null });
    if (cat && accessories) {
      cat.parent = accessories._id;
      await cat.save();
    }
  }

  const totalProducts = await Product.countDocuments();
  const { modified, untouched } = await reassignCases();

  console.log('\n===== Category tree migration complete =====');
  console.log(`Categories already existed: ${counts.alreadyExisted}`);
  console.log(`Categories created: ${counts.categoriesCreated}`);
  console.log(`Subcategories created: ${counts.subcategoriesCreated}`);
  console.log(`Phone brands created: ${counts.phoneBrandsCreated}`);
  console.log(`Phone models created: ${counts.phoneModelsCreated}`);
  console.log(`Duplicates skipped: ${counts.duplicatesSkipped}`);
  console.log(`Existing products modified: ${modified}`);
  console.log(`Existing products untouched: ${totalProducts - modified}`);
  if (untouched.length) {
    console.log(`\nCase products left untouched (${untouched.length}):`);
    untouched.forEach((n) => console.log(`  - ${n}`));
  }

  await mongoose.disconnect();
  console.log('\nDisconnected.');
}

run().catch(async (err) => {
  console.error('Migration failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
