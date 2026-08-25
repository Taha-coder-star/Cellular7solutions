// Pure helpers over a flat list of { _id, parent } category docs — no DB, no Express.

function buildChildrenMap(flatCategories) {
  const byParent = new Map();
  for (const cat of flatCategories) {
    const key = cat.parent ? String(cat.parent) : 'root';
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(cat);
  }
  return byParent;
}

function expandToDescendants(flatCategories, targetId) {
  const byParent = buildChildrenMap(flatCategories);
  const result = [String(targetId)];
  const queue = [String(targetId)];
  while (queue.length) {
    const current = queue.shift();
    const children = byParent.get(current) || [];
    for (const child of children) {
      const childId = String(child._id);
      result.push(childId);
      queue.push(childId);
    }
  }
  return result;
}

module.exports = { expandToDescendants, buildChildrenMap };
