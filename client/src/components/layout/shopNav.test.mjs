// Runnable check for the Shop grouping logic. No framework — just node:
//   node src/components/layout/shopNav.test.mjs
import assert from 'node:assert';
import { buildShopEntries, stripGroupWord } from './shopNav.js';

// Mirrors the real seeded top-level category names (seed-category-tree.js).
const tree = [
  { _id: 'p', name: 'Phones', navOrder: null },
  { _id: 'ac', name: 'Accessories', navOrder: 1 },
  { _id: 'apc', name: 'Apple Cases', navOrder: 2 },
  { _id: 'sac', name: 'Samsung Cases', navOrder: 3 },
  { _id: 'moc', name: 'Motorola Cases', navOrder: 4 },
  { _id: 'otc', name: 'Other Cases', navOrder: 5 },
  { _id: 'app', name: 'Apple Parts', navOrder: 6 },
  { _id: 'sap', name: 'Samsung Parts', navOrder: 7 },
  { _id: 'mop', name: 'Motorola Parts', navOrder: 8 },
  { _id: 'otp', name: 'Other Parts', navOrder: 9 },
  { _id: 'rt', name: 'Repair Tools', navOrder: 10 },
];

const entries = buildShopEntries(tree);
const labels = entries.map((e) => (e.kind === 'group' ? e.label : e.node.name));

// The four *Cases and four *Parts collapse into one "Cases" and one "Parts".
// navOrder nodes come first in DB order; Phones has no navOrder so it sorts
// last — matching how the category-tree API orders roots.
assert.deepStrictEqual(labels, ['Accessories', 'Cases', 'Parts', 'Repair Tools', 'Phones']);

const cases = entries.find((e) => e.label === 'Cases');
assert.strictEqual(cases.members.length, 4, 'Cases groups all four brand nodes');
assert.strictEqual(cases.sort, 2, 'group sorts at its earliest member navOrder');

// "Repair Tools" ends in "Tools" but is the only such node → stays standalone.
assert.ok(labels.includes('Repair Tools'));

// Member labels get the group word stripped for display.
assert.strictEqual(stripGroupWord('Apple Cases', 'Cases'), 'Apple');
assert.strictEqual(stripGroupWord('Other Parts', 'Parts'), 'Other');

console.log('shopNav: all checks passed');
