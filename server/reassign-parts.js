/**
 * Categorizes the legacy scraped "Parts" bucket (241 products) into the new
 * Apple/Samsung/Motorola/Other Parts tree. Unlike Cases, the Parts tree is
 * only 2 levels deep under each brand (Brand Parts > part-type), so this is
 * brand routing (via Product.brand, already clean) + a part-type keyword
 * match — no per-model matching needed.
 *
 * Bonus: some "Parts" listings are actually repair tool kits/pry
 * bars/screwdrivers mis-filed under Parts — those get redirected to the
 * Repair Tools tree instead, checked before brand/part-type routing.
 *
 * Idempotent: only touches products still sitting in the old flat "Parts"
 * category.
 *
 * Run from server/:  node reassign-parts.js
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

const TOOL_KEYWORDS = [
  { regex: /screwdriver/i, leaf: 'Screwdrivers' },
  { regex: /tweezer/i, leaf: 'Tweezers' },
  { regex: /pry\s*(bar|tool)|spudger|opening tool|suction cup/i, leaf: 'Pry Tools' },
  { regex: /plier/i, leaf: 'Pliers' },
  { regex: /\bclamp\b|\bjig\b|(?<!screen )holder\b/i, leaf: 'Clamps & Holders' },
  { regex: /adhesive|\btape\b|\bglue\b/i, leaf: 'Adhesives & Tapes' },
  { regex: /heat gun|heating|hot air/i, leaf: 'Heating Equipment' },
  { regex: /vacuum|laminat/i, leaf: 'Vacuum Equipment' },
  { regex: /\btester\b|multimeter/i, leaf: 'Testers' },
  { regex: /programmer|eeprom/i, leaf: 'Programmers' },
  { regex: /soldering|reballing|board.level/i, leaf: 'Board-Level Tools' },
  { regex: /organizer|storage (tray|box|mat)/i, leaf: 'Storage & Organization' },
  { regex: /repair (tool|kit)|tool kit|tool set/i, leaf: 'Other Tools' },
];

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

async function run() {
  await connectDB();

  const oldParts = await Category.findOne({ name: 'Parts', parent: null });
  if (!oldParts) {
    console.log('No old flat "Parts" category found — nothing to do.');
    await mongoose.disconnect();
    return;
  }

  const repairTools = await Category.findOne({ name: 'Repair Tools', parent: null });
  const repairToolLeaves = Object.fromEntries(
    (await Category.find({ parent: repairTools._id }).lean()).map((l) => [l.name, l])
  );

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

  const products = await Product.find({ category: oldParts._id }).populate('brand', 'name');

  let toolCount = 0, leafCount = 0, rootOnlyCount = 0;
  const byRoot = {};

  for (const product of products) {
    const text = `${product.name} ${product.description}`;

    const tool = TOOL_KEYWORDS.find((t) => t.regex.test(text));
    if (tool && repairToolLeaves[tool.leaf]) {
      product.category = repairToolLeaves[tool.leaf]._id;
      await product.save();
      toolCount++;
      continue;
    }

    const brandName = product.brand?.name;
    let root, partLeaves;
    if (BRAND_TO_ROOT[brandName]) {
      root = rootByName[BRAND_TO_ROOT[brandName]];
      partLeaves = await leavesOf(root._id);
    } else {
      const subBrand = SUB_BRAND_KEYWORDS.find((s) => s.regex.test(text));
      root = (subBrand && otherPartsSubBrands[subBrand.name]) || otherPartsSubBrands['Other'];
      partLeaves = await leavesOf(root._id);
    }

    const partType = PART_TYPE_KEYWORDS.find((p) => p.regex.test(text));
    const target = (partType && partLeaves[partType.leaf]) || partLeaves['Other Parts'] || root;

    product.category = target._id;
    await product.save();

    const rootLabel = BRAND_TO_ROOT[brandName] || `Other Parts / ${root.name}`;
    byRoot[rootLabel] = (byRoot[rootLabel] || 0) + 1;
    if (target._id.equals(root._id)) rootOnlyCount++; else leafCount++;
  }

  console.log('\n===== Parts categorization complete =====');
  console.log(`Products processed: ${products.length}`);
  console.log(`Redirected to Repair Tools (mis-filed): ${toolCount}`);
  console.log(`Assigned to a part-type leaf: ${leafCount}`);
  console.log(`Assigned to brand/sub-brand root only (no part-type match): ${rootOnlyCount}`);
  console.log('By destination root:', byRoot);

  await mongoose.disconnect();
  console.log('\nDisconnected.');
}

run().catch(async (err) => {
  console.error('Parts categorization failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
