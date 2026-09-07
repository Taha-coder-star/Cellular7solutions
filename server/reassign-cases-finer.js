/**
 * Second follow-up pass after reassign-cases-by-brand.js. That pass got
 * every Cases product to the correct brand root (Apple/Samsung/Motorola/
 * Other Cases) but found 0 exact model-leaf matches, because:
 *   - the old matcher skipped any product whose text contained "/", which
 *     also killed legitimate single-model listings like "Moto G Power
 *     2025/2026" (a year-range suffix, not two different phones)
 *   - supplier listings abbreviate ("S25 Ultra" instead of "Galaxy S25
 *     Ultra", "Samsung A23" instead of "Galaxy A23")
 *   - some referenced models weren't in the tree at all (iPhone XR, iPhone
 *     11 Pro Max, any iPad case — now added by seed-category-tree.js)
 *
 * This pass normalizes both leaf names and product text (lowercase,
 * alphanumeric-only) before substring matching, assigns a leaf only when
 * exactly one distinct leaf matches (genuinely ambiguous listings like
 * "iPhone 12/13 Pro Max" still fall through), and adds a family-level
 * fallback (e.g. detect "s26" as a Galaxy S phone with no matching exact
 * leaf -> "Other Galaxy S") so newer/unseeded model numbers still land one
 * level deeper than the brand root instead of not moving at all.
 *
 * Only touches products currently sitting exactly on a brand-root category
 * (Apple/Samsung/Motorola/Other Cases) — safe to re-run.
 *
 * Run from server/:  node reassign-cases-finer.js
 */
require('dotenv').config({ override: true });
const dns = require('dns');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Category = require('./models/Category');
const Product = require('./models/Product');

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);

// Strip marketing brand words before normalizing — supplier listings routinely
// drop "Galaxy"/"Samsung" ("S24 Ultra" instead of "Galaxy S24 Ultra"), which
// otherwise makes every leaf-name substring check fail silently.
const BRAND_WORDS = /\b(galaxy|samsung|apple|motorola)\b/gi;
const norm = (s) => s.toLowerCase().replace(BRAND_WORDS, '').replace(/[^a-z0-9]/g, '');

// Among several substring-matching leaves, prefer the most specific (longest)
// one as long as every shorter match is contained within it — e.g. "s24" and
// "s24ultra" both matching "...S24 Ultra..." isn't real ambiguity, it's the
// same product; "iphone12" and "iphone13" both matching genuinely is.
function pickBestMatch(candidates) {
  if (candidates.length === 0) return null;
  const sorted = [...candidates].sort((a, b) => b.norm.length - a.norm.length);
  const longest = sorted[0];
  const trulyAmbiguous = sorted.some((m) => m._id !== longest._id && !longest.norm.includes(m.norm));
  return trulyAmbiguous ? null : longest;
}

const FAMILY_FALLBACKS = {
  'Samsung Cases': [
    { regex: /\bs\d{2}\b/, seriesName: 'Galaxy S Series', otherLeaf: 'Other Galaxy S' },
    { regex: /\ba\d{2}\b/, seriesName: 'Galaxy A Series', otherLeaf: 'Other Galaxy A' },
    { regex: /z\s*(flip|fold)/, seriesName: 'Galaxy Z Series', otherLeaf: 'Other Galaxy Z' },
    { regex: /\bnote\s*\d+/, seriesName: 'Galaxy Note Series', otherLeaf: 'Other Galaxy Note' },
  ],
  'Motorola Cases': [
    { regex: /moto\s*g\b/, seriesName: 'Moto G Series', otherLeaf: 'Other Moto G' },
    { regex: /\bedge\b/, seriesName: 'Edge Series', otherLeaf: 'Other Edge' },
    { regex: /\brazr\b/, seriesName: 'Razr Series', otherLeaf: 'Other Razr' },
  ],
  'Apple Cases': [
    { regex: /\bipad\b/, seriesName: 'iPad', otherLeaf: 'Other iPad' },
    { regex: /\biphone\b/, seriesName: 'Older iPhones', otherLeaf: 'Other Older iPhone' },
  ],
};

const OTHER_CASES_KEYWORD_LEAVES = [
  { keywords: ['pixel', 'google'], leaf: 'Google/Pixel' },
  { keywords: ['oneplus'], leaf: 'OnePlus' },
  { keywords: ['lg'], leaf: 'LG' },
];

async function collectLeaves(rootId) {
  const leaves = [];
  async function walk(catId) {
    const children = await Category.find({ parent: catId }).lean();
    for (const child of children) {
      const grandchildren = await Category.find({ parent: child._id }).lean();
      if (grandchildren.length === 0) leaves.push(child);
      else await walk(child._id);
    }
  }
  await walk(rootId);
  return leaves;
}

async function processDeepRoot(rootName) {
  const root = await Category.findOne({ name: rootName, parent: null });
  if (!root) return { leaf: 0, family: 0, unmatched: 0 };

  const leaves = await collectLeaves(root._id);
  const normalizedLeaves = leaves.map((l) => ({ ...l, norm: norm(l.name) }));
  const otherLeafByName = Object.fromEntries(leaves.map((l) => [l.name, l]));
  const families = FAMILY_FALLBACKS[rootName] || [];
  const familyLeafIds = families.map((f) => otherLeafByName[f.otherLeaf]?._id).filter(Boolean);

  // Re-scan products at the root AND ones already parked on a family "Other X"
  // bucket from a prior pass — the brand-word-stripping fix below can now
  // resolve some of those to an exact model leaf.
  const products = await Product.find({ category: { $in: [root._id, ...familyLeafIds] } });
  let leafCount = 0, familyCount = 0, unmatched = 0;

  for (const product of products) {
    const text = norm(`${product.name} ${product.description}`);
    const rawText = `${product.name} ${product.description}`.toLowerCase();

    // "Other X" leaves are fallback buckets, not real models — exclude them
    // from the exact-match pool so a real model can't be shadowed by them.
    const exactMatches = normalizedLeaves.filter((l) => !l.name.startsWith('Other') && text.includes(l.norm));
    const distinctExact = [...new Map(exactMatches.map((m) => [String(m._id), m])).values()];
    const best = pickBestMatch(distinctExact);

    if (best) {
      product.category = best._id;
      await product.save();
      leafCount++;
      continue;
    }

    const family = families.find((f) => f.regex.test(rawText));
    if (family && otherLeafByName[family.otherLeaf]) {
      if (String(product.category) !== String(otherLeafByName[family.otherLeaf]._id)) {
        product.category = otherLeafByName[family.otherLeaf]._id;
        await product.save();
      }
      familyCount++;
      continue;
    }

    unmatched++;
  }

  return { leaf: leafCount, family: familyCount, unmatched, total: products.length };
}

async function processOtherCases() {
  const root = await Category.findOne({ name: 'Other Cases', parent: null });
  if (!root) return { leaf: 0, unmatched: 0 };
  const leaves = await Category.find({ parent: root._id }).lean();
  const leafByName = Object.fromEntries(leaves.map((l) => [l.name, l]));

  const products = await Product.find({ category: root._id });
  let leafCount = 0, unmatched = 0;

  for (const product of products) {
    const text = `${product.name} ${product.description}`.toLowerCase();
    const match = OTHER_CASES_KEYWORD_LEAVES.find((k) => k.keywords.some((kw) => text.includes(kw)));
    if (match && leafByName[match.leaf]) {
      product.category = leafByName[match.leaf]._id;
      await product.save();
      leafCount++;
    } else {
      unmatched++;
    }
  }
  return { leaf: leafCount, unmatched, total: products.length };
}

async function run() {
  await connectDB();

  const results = {};
  for (const rootName of ['Apple Cases', 'Samsung Cases', 'Motorola Cases']) {
    results[rootName] = await processDeepRoot(rootName);
  }
  results['Other Cases'] = await processOtherCases();

  console.log('\n===== Finer-grained Cases matching complete =====');
  for (const [name, r] of Object.entries(results)) {
    console.log(`${name}: ${r.total} products — leaf: ${r.leaf ?? 0}, family: ${r.family ?? 0}, unmatched (stayed at root): ${r.unmatched}`);
  }

  await mongoose.disconnect();
  console.log('\nDisconnected.');
}

run().catch(async (err) => {
  console.error('Finer reassignment failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
