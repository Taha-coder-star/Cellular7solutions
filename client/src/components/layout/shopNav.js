// Pure helpers for the mobile Shop drill-down. No React/DOM here so the
// grouping logic can be unit-checked in isolation (see shopNav.test.mjs).

export const lastWord = (name) => name.trim().split(/\s+/).pop();

export const stripGroupWord = (name, word) =>
  name.replace(new RegExp(`\\s*${word}$`), '').trim() || name;

// Fold flat top-level nodes sharing a trailing word ("Apple Cases",
// "Samsung Cases"… → a virtual "Cases") into one drill-down entry. Everything
// else stays standalone. Ordered by navOrder, then name. Derived entirely from
// the tree — no hardcoded category names.
export const isBrowseableCategory = (node) => !/^(test\b|store$)/i.test(node.name.trim());

const DEVICE_ORDER = new Map([
  ['phones', 0], ['smartphones', 0], ['laptops', 1], ['gaming', 2], ['tablet', 3], ['ipad', 4],
]);

const sortOrder = (node) => DEVICE_ORDER.get(node.name.toLowerCase()) ??
  (node.navOrder == null ? 1000 : 100 + node.navOrder);

export function buildShopEntries(tree) {
  const browseable = tree.filter(isBrowseableCategory);
  const wordCounts = {};
  browseable.forEach((n) => {
    if (n.name.trim().split(/\s+/).length >= 2) {
      const w = lastWord(n.name);
      wordCounts[w] = (wordCounts[w] || 0) + 1;
    }
  });

  const groups = new Map();
  const entries = [];
  browseable.forEach((node) => {
    const w = lastWord(node.name);
    if (wordCounts[w] >= 2) {
      let g = groups.get(w);
      if (!g) {
        g = { kind: 'group', label: w, members: [], sort: Infinity };
        groups.set(w, g);
        entries.push(g);
      }
      g.members.push(node);
      g.sort = Math.min(g.sort, sortOrder(node));
    } else {
      entries.push({ kind: 'node', node, sort: sortOrder(node) });
    }
  });

  return entries.sort((a, b) => {
    if (a.sort !== b.sort) return a.sort - b.sort;
    const an = a.kind === 'group' ? a.label : a.node.name;
    const bn = b.kind === 'group' ? b.label : b.node.name;
    return an.localeCompare(bn);
  });
}
