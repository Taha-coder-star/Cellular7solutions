/**
 * Restructures Apple Parts from a flat list of 10 part-type categories
 * (Screens & Displays, Batteries, ...) into a model-group hierarchy:
 *
 *   Apple Parts
 *     -> iPhone 14 to 17 Pro Max -> iPhone 17 Pro Max -> Screens & Displays / Batteries / ...
 *     -> iPhone X to 13 Pro Max  -> iPhone 12 Pro -> ...
 *     -> iPhone 5 to 8 Plus      -> iPhone 6s Plus -> ...
 *     -> iPad 1 to 11 Gen        -> iPad (9th Gen) -> ...
 *     -> iPad Air Series         -> iPad Air 4 -> ...
 *     -> iPad Mini Series        -> iPad Mini 6 -> ...
 *     -> iPad Pro                -> iPad Pro 11" -> ...
 *     -> Watch                   -> Apple Watch Series 9 -> ...
 *
 * Groups and models are created eagerly (idempotent find-or-create) so the
 * nav dropdown always shows the full model list even for a model with zero
 * products yet. Part-type leaves under each model are created lazily, only
 * when a product is actually assigned one — otherwise every model would
 * carry 10 empty part-type children cluttering the structure.
 *
 * Existing products under the old 10 flat leaves are moved via the same
 * tool-keyword / part-type-keyword matching used by earlier passes, plus a
 * new model-alias matcher (longest-match-wins, same approach as
 * reassign-cases-finer.js) built from real product names in this catalogue.
 * Products with no confident single-model match fall back to the Apple
 * Parts root rather than a wrong guess. Once emptied, the old 10 flat
 * leaves are deleted.
 *
 * Run from server/:  node restructure-apple-parts.js
 */
require('dotenv').config({ override: true });
const dns = require('dns');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Category = require('./models/Category');
const Product = require('./models/Product');

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const alias = (...parts) => norm(parts.join(' '));

function model(name, ...extraAliases) {
  return { name, aliases: [norm(name), ...extraAliases] };
}

const PART_TYPES = ['Screens & Displays', 'Batteries', 'Charging', 'Cameras', 'Speakers/Audio', 'Flex Cables', 'Buttons', 'SIM Trays', 'Antennas', 'Other Parts'];

const STRUCTURE = [
  {
    group: 'iPhone 14 to 17 Pro Max',
    models: [
      model('iPhone 17 Pro Max'), model('iPhone 17 Pro'), model('iPhone 17 Plus'), model('iPhone 17'),
      model('iPhone Air', 'iphoneair'),
      model('iPhone 16e', 'iphone17e'),
      model('iPhone 16 Pro Max'), model('iPhone 16 Pro'), model('iPhone 16 Plus'), model('iPhone 16'),
      model('iPhone 15 Pro Max'), model('iPhone 15 Pro'), model('iPhone 15 Plus'), model('iPhone 15'),
      model('iPhone 14 Pro Max'), model('iPhone 14 Pro'), model('iPhone 14 Plus'), model('iPhone 14'),
      model('Other iPhone 14-17'),
    ],
  },
  {
    group: 'iPhone X to 13 Pro Max',
    models: [
      model('iPhone 13 Pro Max'), model('iPhone 13 Pro'), model('iPhone 13 Mini'), model('iPhone 13'),
      model('iPhone 12 Pro Max'), model('iPhone 12 Pro'), model('iPhone 12 Mini'), model('iPhone 12'),
      model('iPhone 11 Pro Max'), model('iPhone 11 Pro'), model('iPhone 11'),
      model('iPhone XS Max'), model('iPhone XS'), model('iPhone XR'), model('iPhone X'),
      model('iPhone SE (2022)', 'iphonese2022', 'se2022', 'iphonese3'),
      model('Other iPhone X-13'),
    ],
  },
  {
    group: 'iPhone 5 to 8 Plus',
    models: [
      model('iPhone 8 Plus'), model('iPhone 8'),
      model('iPhone 7 Plus'), model('iPhone 7', 'iphone7g'),
      model('iPhone 6s Plus'), model('iPhone 6s'),
      model('iPhone 6 Plus'), model('iPhone 6', 'iphone6g'),
      model('iPhone SE (1st Gen)', 'iphonese1stgen', 'iphonese'),
      model('iPhone 5s'), model('iPhone 5c'), model('iPhone 5'),
      model('Other iPhone 5-8'),
    ],
  },
  {
    group: 'iPad 1 to 11 Gen',
    models: [
      model('iPad (11th Gen)', 'ipad11thgen', 'ipad11gen'),
      model('iPad (10th Gen)', 'ipad10thgen', 'ipad10gen'),
      model('iPad (9th Gen)', 'ipad9thgen', 'ipad9gen'),
      model('iPad (8th Gen)', 'ipad8thgen', 'ipad8gen'),
      model('iPad (7th Gen)', 'ipad7thgen', 'ipad7gen'),
      model('iPad (6th Gen)', 'ipad6thgen', 'ipad6gen'),
      model('iPad (5th Gen)', 'ipad5thgen', 'ipad5gen'),
      model('iPad (4th Gen)', 'ipad4thgen', 'ipad4gen'),
      model('iPad (3rd Gen)', 'ipad3rdgen', 'ipad3gen'),
      model('iPad (2nd Gen)', 'ipad2ndgen', 'ipad2gen'),
      model('iPad (1st Gen)', 'ipad1stgen', 'ipad1gen'),
      model('Other iPad'),
    ],
  },
  {
    group: 'iPad Air Series',
    models: [
      model('iPad Air 5', 'ipadair5'), model('iPad Air 4', 'ipadair4'), model('iPad Air 3', 'ipadair3'),
      model('iPad Air 2', 'ipadair2'), model('iPad Air (1st Gen)', 'ipadair1', 'ipadair'),
      model('Other iPad Air'),
    ],
  },
  {
    group: 'iPad Mini Series',
    models: [
      model('iPad Mini 7', 'ipadmini7'), model('iPad Mini 6', 'ipadmini6'), model('iPad Mini 5', 'ipadmini5'),
      model('iPad Mini 4', 'ipadmini4'), model('iPad Mini 3', 'ipadmini3'), model('iPad Mini 2', 'ipadmini2'),
      model('iPad Mini (1st Gen)', 'ipadmini1', 'ipadmini'),
      model('Other iPad Mini'),
    ],
  },
  {
    group: 'iPad Pro',
    models: [
      model('iPad Pro 13"', 'ipadpro13'), model('iPad Pro 12.9"', 'ipadpro129'), model('iPad Pro 11"', 'ipadpro11'),
      model('iPad Pro 10.5"', 'ipadpro105'), model('iPad Pro 9.7"', 'ipadpro97'),
      model('Other iPad Pro'),
    ],
  },
  {
    group: 'Watch',
    models: [
      model('Apple Watch Ultra 2', 'watchultra2'), model('Apple Watch Ultra', 'watchultra'),
      model('Apple Watch Series 10', 'watchseries10'), model('Apple Watch Series 9', 'watchseries9'),
      model('Apple Watch Series 8', 'watchseries8'), model('Apple Watch Series 7', 'watchseries7'),
      model('Apple Watch Series 6', 'watchseries6'), model('Apple Watch Series 5', 'watchseries5'),
      model('Apple Watch Series 4', 'watchseries4'), model('Apple Watch Series 3', 'watchseries3'),
      model('Apple Watch SE (2nd Gen)', 'watchse2ndgen', 'watchse2'),
      model('Apple Watch SE (1st Gen)', 'watchse1stgen', 'watchse1', 'watchse'),
      model('Other Apple Watch'),
    ],
  },
];

const TOOL_KEYWORDS = [
  { regex: /screwdriver/i, leaf: 'Screwdrivers' },
  { regex: /tweezer/i, leaf: 'Tweezers' },
  { regex: /pry\s*(bar|tool)|spudger|opening tool|suction cup/i, leaf: 'Pry Tools' },
  { regex: /plier/i, leaf: 'Pliers' },
  { regex: /\bclamp\b|\bjig\b/i, leaf: 'Clamps & Holders' },
  { regex: /adhesive|\btape\b|\bglue\b/i, leaf: 'Adhesives & Tapes' },
  { regex: /heat gun|heating|hot air/i, leaf: 'Heating Equipment' },
  { regex: /vacuum|laminat/i, leaf: 'Vacuum Equipment' },
  { regex: /\btester\b|multimeter/i, leaf: 'Testers' },
  { regex: /programmer|eeprom|icopy|icopy board/i, leaf: 'Programmers' },
  { regex: /soldering|reballing|board.level/i, leaf: 'Board-Level Tools' },
  { regex: /organizer|storage (tray|box|mat)/i, leaf: 'Storage & Organization' },
  { regex: /repair (tool|kit)|tool kit|tool set/i, leaf: 'Other Tools' },
];

const PART_TYPE_KEYWORDS = [
  { regex: /camera/i, leaf: 'Cameras' },
  { regex: /batter/i, leaf: 'Batteries' },
  { regex: /charging (port|flex|assembly|dock)|charge port|dock connector|nfc charging/i, leaf: 'Charging' },
  { regex: /antenna/i, leaf: 'Antennas' },
  { regex: /speaker|earpiece|ear\s*piece|microphone|vibrator/i, leaf: 'Speakers/Audio' },
  { regex: /flex cable|\bflex\b/i, leaf: 'Flex Cables' },
  { regex: /\bbutton/i, leaf: 'Buttons' },
  { regex: /sim (tray|card)/i, leaf: 'SIM Trays' },
  { regex: /lcd|screen|digitizer|display|glass|oled/i, leaf: 'Screens & Displays' },
];

function pickBestMatch(candidates) {
  if (candidates.length === 0) return null;
  const sorted = [...candidates].sort((a, b) => b.aliasNorm.length - a.aliasNorm.length);
  const longest = sorted[0];
  const trulyAmbiguous = sorted.some((m) => m.modelName !== longest.modelName && !longest.aliasNorm.includes(m.aliasNorm));
  return trulyAmbiguous ? null : longest;
}

async function findOrCreate(name, parentId, navOrder) {
  let doc = await Category.findOne({ parent: parentId, name });
  if (!doc) doc = await new Category({ name, parent: parentId, navOrder: navOrder ?? null }).save();
  return doc;
}

async function run() {
  await connectDB();

  const appleParts = await Category.findOne({ name: 'Apple Parts', parent: null });
  const oldLeaves = await Category.find({ parent: appleParts._id }).lean();

  // Build the new group -> model tree (eager) and a flat alias index for matching.
  const modelIndex = []; // { modelName, aliasNorm, doc, groupDoc }
  for (const spec of STRUCTURE) {
    const groupDoc = await findOrCreate(spec.group, appleParts._id);
    for (const m of spec.models) {
      const modelDoc = await findOrCreate(m.name, groupDoc._id);
      for (const a of m.aliases) {
        modelIndex.push({ modelName: m.name, aliasNorm: a, doc: modelDoc, groupDoc });
      }
    }
  }

  const products = await Product.find({ category: { $in: oldLeaves.map((l) => l._id) } });

  let toTools = 0, toModelPartType = 0, toRoot = 0;
  const partTypeLeafCache = {};
  async function partTypeLeaf(modelDoc, leafName) {
    const key = `${modelDoc._id}:${leafName}`;
    if (!partTypeLeafCache[key]) partTypeLeafCache[key] = await findOrCreate(leafName, modelDoc._id);
    return partTypeLeafCache[key];
  }

  const repairTools = await Category.findOne({ name: 'Repair Tools', parent: null });
  const repairToolLeaves = Object.fromEntries(
    (await Category.find({ parent: repairTools._id }).lean()).map((l) => [l.name, l])
  );

  for (const product of products) {
    const rawText = `${product.name} ${product.description}`;
    const text = norm(rawText);

    const tool = TOOL_KEYWORDS.find((t) => t.regex.test(rawText));
    if (tool && repairToolLeaves[tool.leaf]) {
      product.category = repairToolLeaves[tool.leaf]._id;
      await product.save();
      toTools++;
      continue;
    }

    const candidates = modelIndex.filter((m) => text.includes(m.aliasNorm));
    const best = pickBestMatch(candidates);

    if (best) {
      const partType = PART_TYPE_KEYWORDS.find((p) => p.regex.test(rawText));
      const leaf = await partTypeLeaf(best.doc, (partType && partType.leaf) || 'Other Parts');
      product.category = leaf._id;
      await product.save();
      toModelPartType++;
    } else {
      product.category = appleParts._id;
      await product.save();
      toRoot++;
    }
  }

  // Clean up the old flat part-type leaves now that they're empty.
  let deleted = 0;
  for (const leaf of oldLeaves) {
    const remaining = await Product.countDocuments({ category: leaf._id });
    const children = await Category.countDocuments({ parent: leaf._id });
    if (remaining === 0 && children === 0) {
      await Category.deleteOne({ _id: leaf._id });
      deleted++;
    }
  }

  console.log('\n===== Apple Parts restructure complete =====');
  console.log(`Products processed: ${products.length}`);
  console.log(`Redirected to Repair Tools (mis-filed): ${toTools}`);
  console.log(`Assigned to model > part-type leaf: ${toModelPartType}`);
  console.log(`Fell back to Apple Parts root (ambiguous/no model match): ${toRoot}`);
  console.log(`Old flat part-type categories deleted: ${deleted} / ${oldLeaves.length}`);

  const newChildren = await Category.find({ parent: appleParts._id }).lean();
  console.log(`\nApple Parts now has ${newChildren.length} direct children:`, newChildren.map((c) => c.name));

  await mongoose.disconnect();
  console.log('\nDisconnected.');
}

run().catch(async (err) => {
  console.error('Restructure failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
