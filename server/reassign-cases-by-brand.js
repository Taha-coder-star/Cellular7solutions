/**
 * Follow-up to seed-category-tree.js: the initial migration only moved Cases
 * products with an unambiguous single-model text match (304 of 984), leaving
 * 680 behind in the old flat "Cases" category. Every one of those has a
 * clean Product.brand ref (Apple/Samsung/Motorola/Other/Various), so this
 * pass routes all of them to the correct brand-level root — Apple Cases,
 * Samsung Cases, Motorola Cases, or Other Cases — and additionally drops
 * each into its exact model leaf when the product name/description
 * unambiguously names one. Idempotent: only touches products still sitting
 * in the old "Cases" category.
 *
 * Run from server/:  node reassign-cases-by-brand.js
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

const BRAND_TO_ROOT = {
  Apple: 'Apple Cases',
  Samsung: 'Samsung Cases',
  Motorola: 'Motorola Cases',
};
const FALLBACK_ROOT = 'Other Cases';

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
  return leaves.sort((a, b) => b.name.length - a.name.length);
}

async function run() {
  await connectDB();

  const oldCases = await Category.findOne({ name: 'Cases', parent: null });
  if (!oldCases) {
    console.log('No old flat "Cases" category found — nothing to do.');
    await mongoose.disconnect();
    return;
  }

  const rootNames = [...new Set([...Object.values(BRAND_TO_ROOT), FALLBACK_ROOT])];
  const roots = await Category.find({ name: { $in: rootNames }, parent: null }).lean();
  const rootByName = Object.fromEntries(roots.map((r) => [r.name, r]));
  const leavesByRoot = {};
  for (const root of roots) {
    leavesByRoot[root._id] = await collectLeaves(root._id);
  }

  const products = await Product.find({ category: oldCases._id }).populate('brand', 'name');

  let movedToLeaf = 0;
  let movedToRoot = 0;
  const byRootCount = {};

  for (const product of products) {
    const brandName = product.brand?.name;
    const rootName = BRAND_TO_ROOT[brandName] || FALLBACK_ROOT;
    const root = rootByName[rootName];
    if (!root) continue; // shouldn't happen — root categories were created by the tree migration

    const text = `${product.name} ${product.description}`.toLowerCase();
    let target = root;
    if (!text.includes('/')) {
      const leaves = leavesByRoot[root._id] || [];
      const match = leaves.find((leaf) => text.includes(leaf.name.toLowerCase()));
      if (match) {
        target = match;
        movedToLeaf++;
      } else {
        movedToRoot++;
      }
    } else {
      movedToRoot++;
    }

    product.category = target._id;
    await product.save();
    byRootCount[rootName] = (byRootCount[rootName] || 0) + 1;
  }

  console.log('\n===== Brand-based Cases reassignment complete =====');
  console.log(`Products processed: ${products.length}`);
  console.log(`Moved to exact model leaf: ${movedToLeaf}`);
  console.log(`Moved to brand root only: ${movedToRoot}`);
  console.log('By root:', byRootCount);

  await mongoose.disconnect();
  console.log('\nDisconnected.');
}

run().catch(async (err) => {
  console.error('Reassignment failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
