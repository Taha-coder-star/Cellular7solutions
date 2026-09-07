/**
 * Categorizes the legacy scraped "Chargers & Cables" (98) and "Audio" (103)
 * buckets. Both turned out to be a mix of real consumer accessories AND
 * repair parts mis-filed here (charging port flex cables, ear speaker /
 * earpiece components tied to a specific phone model) — those get
 * redirected into the brand Parts tree (reusing the same routing as
 * reassign-parts.js); genuine accessories go into Accessories' children.
 *
 * Idempotent: only touches products still sitting in the old flat
 * "Chargers & Cables" / "Audio" categories.
 *
 * Run from server/:  node reassign-chargers-audio.js
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

// A "for <bare model number>" style listing (no "iPhone"/"Samsung" prefix)
// is this supplier's shorthand for a repair part, not a consumer accessory.
const PART_INDICATOR = /\bflex( cable)?\b|charging port|charging dock|dock connector|proximity sensor|earpiece|ear speaker|aftermarket|compatible for (iphone|samsung|galaxy|moto)|\bmt\s*xt\d+\b|\bfor\s+(1[1-7]|xr|xs|se)\b/i;

const PART_TYPE_KEYWORDS = [
  { regex: /camera/i, leaf: 'Cameras' },
  { regex: /batter/i, leaf: 'Batteries' },
  { regex: /fingerprint|biometric|touch\s*id/i, leaf: 'Fingerprint/Biometrics' },
  { regex: /charging (port|flex|assembly)|charge port|dock connector/i, leaf: 'Charging' },
  { regex: /antenna/i, leaf: 'Antennas' },
  { regex: /speaker|earpiece|microphone|\baudio\b/i, leaf: 'Speakers/Audio' },
  { regex: /flex cable|\bflex\b/i, leaf: 'Flex Cables' },
  { regex: /\bbutton/i, leaf: 'Buttons' },
  { regex: /sim (tray|card tray)/i, leaf: 'SIM Trays' },
  { regex: /lcd|screen|digitizer|display|glass/i, leaf: 'Screens & Displays' },
];

const SUB_BRAND_KEYWORDS = [
  { regex: /pixel|google/i, name: 'Google' },
  { regex: /oneplus/i, name: 'OnePlus' },
  { regex: /xiaomi|redmi/i, name: 'Xiaomi' },
  { regex: /\boppo\b/i, name: 'Oppo' },
  { regex: /\bvivo\b/i, name: 'Vivo' },
];

const BRAND_TO_ROOT = { Apple: 'Apple Parts', Samsung: 'Samsung Parts', Motorola: 'Motorola Parts' };

const CHARGERS_ACCESSORY_KEYWORDS = [
  { regex: /car\s*(charger|mount)/i, leaf: 'Car Accessories' },
  { regex: /wireless charg/i, leaf: 'Wireless Chargers' },
  { regex: /power bank|power supply|\bmobile power\b/i, leaf: 'Power Banks' },
  { regex: /adapter|adaptor/i, leaf: 'Adapters' },
  { regex: /\bcable\b/i, leaf: 'Cables' },
];
const CHARGERS_DEFAULT_LEAF = 'Chargers';

const AUDIO_ACCESSORY_KEYWORDS = [
  { regex: /airpod/i, leaf: 'AirPods' },
  { regex: /speaker/i, leaf: 'Speakers' },
  { regex: /bluetooth/i, leaf: 'Bluetooth' },
];
const AUDIO_DEFAULT_LEAF = 'Audio';

async function buildPartsRouting() {
  const partsRoots = await Category.find({
    name: { $in: ['Apple Parts', 'Samsung Parts', 'Motorola Parts', 'Other Parts'] },
    parent: null,
  }).lean();
  const rootByName = Object.fromEntries(partsRoots.map((r) => [r.name, r]));
  const otherPartsSubBrands = Object.fromEntries(
    (await Category.find({ parent: rootByName['Other Parts']._id }).lean()).map((b) => [b.name, b])
  );
  const leavesByParent = {};
  async function leavesOf(parentId) {
    const key = String(parentId);
    if (!leavesByParent[key]) {
      leavesByParent[key] = Object.fromEntries(
        (await Category.find({ parent: parentId }).lean()).map((l) => [l.name, l])
      );
    }
    return leavesByParent[key];
  }
  return { rootByName, otherPartsSubBrands, leavesOf };
}

async function routeToPart(product, text, routing) {
  const brandName = product.brand?.name;
  let root, partLeaves;
  if (BRAND_TO_ROOT[brandName]) {
    root = routing.rootByName[BRAND_TO_ROOT[brandName]];
    partLeaves = await routing.leavesOf(root._id);
  } else {
    const subBrand = SUB_BRAND_KEYWORDS.find((s) => s.regex.test(text));
    root = (subBrand && routing.otherPartsSubBrands[subBrand.name]) || routing.otherPartsSubBrands['Other'];
    partLeaves = await routing.leavesOf(root._id);
  }
  const partType = PART_TYPE_KEYWORDS.find((p) => p.regex.test(text));
  return (partType && partLeaves[partType.leaf]) || partLeaves['Other Parts'] || root;
}

async function processCategory(oldCategoryName, accessoryKeywords, defaultLeaf, routing) {
  const oldCat = await Category.findOne({ name: oldCategoryName, parent: null });
  if (!oldCat) return { total: 0, toParts: 0, toAccessory: 0 };

  const accessories = await Category.findOne({ name: 'Accessories', parent: null });
  const accessoryLeaves = Object.fromEntries(
    (await Category.find({ parent: accessories._id }).lean()).map((l) => [l.name, l])
  );

  const products = await Product.find({ category: oldCat._id }).populate('brand', 'name');
  let toParts = 0, toAccessory = 0;

  for (const product of products) {
    const text = `${product.name} ${product.description}`;

    if (PART_INDICATOR.test(text)) {
      const target = await routeToPart(product, text, routing);
      product.category = target._id;
      await product.save();
      toParts++;
      continue;
    }

    const match = accessoryKeywords.find((k) => k.regex.test(text));
    const leafName = match ? match.leaf : defaultLeaf;
    const target = accessoryLeaves[leafName] || accessoryLeaves[defaultLeaf];
    product.category = target._id;
    await product.save();
    toAccessory++;
  }

  return { total: products.length, toParts, toAccessory };
}

async function run() {
  await connectDB();
  const routing = await buildPartsRouting();

  const chargers = await processCategory('Chargers & Cables', CHARGERS_ACCESSORY_KEYWORDS, CHARGERS_DEFAULT_LEAF, routing);
  const audio = await processCategory('Audio', AUDIO_ACCESSORY_KEYWORDS, AUDIO_DEFAULT_LEAF, routing);

  console.log('\n===== Chargers & Cables / Audio categorization complete =====');
  console.log(`Chargers & Cables: ${chargers.total} products — ${chargers.toParts} redirected to Parts, ${chargers.toAccessory} kept as accessories`);
  console.log(`Audio: ${audio.total} products — ${audio.toParts} redirected to Parts, ${audio.toAccessory} kept as accessories`);

  await mongoose.disconnect();
  console.log('\nDisconnected.');
}

run().catch(async (err) => {
  console.error('Categorization failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
