require('dotenv').config({ override: true });
const fs = require('fs');
const connectDB = require('./config/db');
const Category = require('./models/Category');
const mongoose = require('mongoose');

const normalize = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
const ROOT_ALIASES = {
  'google & more parts': 'Other Parts',
  'google & other cases': 'Other Cases',
  'motorola case': 'Motorola Cases',
  'samsung case': 'Samsung Cases',
};

async function main() {
  await connectDB();
  const all = await Category.find().lean();
  const childIndex = new Map();
  const byId = new Map();
  const nameIndex = new Map();
  for (const c of all) {
    byId.set(String(c._id), c);
    const key = c.parent ? String(c.parent) : 'root';
    if (!childIndex.has(key)) childIndex.set(key, new Map());
    childIndex.get(key).set(normalize(c.name), c._id);
    const nk = normalize(c.name);
    if (!nameIndex.has(nk)) nameIndex.set(nk, []);
    nameIndex.get(nk).push(c._id);
  }

  function isDescendant(id, ancestorId) {
    let cur = byId.get(String(id));
    while (cur) {
      if (String(cur._id) === String(ancestorId)) return true;
      cur = cur.parent ? byId.get(String(cur.parent)) : null;
    }
    return false;
  }

  function pathOf(id) {
    const parts = [];
    let cur = byId.get(String(id));
    while (cur) {
      parts.unshift(cur.name);
      cur = cur.parent ? byId.get(String(cur.parent)) : null;
    }
    return parts.join(' > ');
  }

  function resolveDry(item) {
    let crumbs = (item.breadcrumbs || []).slice();
    if (crumbs.length && normalize(crumbs[0]) === 'store') crumbs.shift();
    if (crumbs.length && normalize(crumbs[crumbs.length - 1]) === normalize(item.name)) crumbs.pop();
    if (!crumbs.length) crumbs = [item.category, item.subcategory].filter(Boolean);
    if (!crumbs.length) crumbs = ['Store', 'Other'];
    const aliased = ROOT_ALIASES[normalize(crumbs[0])];
    if (aliased) crumbs[0] = aliased;

    let parentId = null;
    let anchor = null; // last real (non-simulated) matched id, i.e. top-level root once matched
    let wouldCreate = [];
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

      // Gap: try to jump straight to an existing node matching the deepest
      // remaining segment, anywhere under `anchor` (handles trees that group
      // differently at intermediate levels than the scrape's breadcrumbs).
      if (anchor) {
        const target = normalize(crumbs[crumbs.length - 1]);
        const candidates = (nameIndex.get(target) || []).filter((id) => isDescendant(id, anchor));
        if (candidates.length === 1) {
          return { parentId: candidates[0], wouldCreate: [], crumbsUsed: crumbs, jumped: true };
        }
      }
      wouldCreate = crumbs.slice(k);
      parentId = 'NEW:' + seg;
      break;
    }
    return { parentId, wouldCreate, crumbsUsed: crumbs };
  }

  const items = JSON.parse(fs.readFileSync('_tmp_new_items_by_image.json', 'utf-8'));
  const sampleIdx = [0, 1, 5, 20, 50, 100, 200, 300, 400, 500, 600, 700, 800, 850, 900, 950, 1000, 1035];
  for (const i of sampleIdx) {
    const item = items[i];
    if (!item) continue;
    const r = resolveDry(item);
    const existingPath = typeof r.parentId === 'string' && r.parentId.startsWith('NEW:') ? null : pathOf(r.parentId);
    console.log(`\n[${i}] "${item.name}"`);
    console.log('  breadcrumbs:', JSON.stringify(item.breadcrumbs));
    console.log('  crumbs used:', JSON.stringify(r.crumbsUsed));
    if (existingPath) console.log(`  -> MATCHED existing leaf${r.jumped ? ' (jump)' : ''}:`, existingPath);
    else console.log('  -> would create new node(s) starting at:', r.wouldCreate[0]);
  }

  await mongoose.disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
