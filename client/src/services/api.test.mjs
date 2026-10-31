import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const catalog = JSON.parse(readFileSync(new URL('../../public/catalog.json', import.meta.url)));
globalThis.fetch = async () => ({ ok: true, json: async () => catalog });
const { default: api } = await import('./api.js');

test('static API answers the routes the pages use', async () => {
  const { data: page } = await api.get('/products', { params: { limit: 5, category: undefined } });
  assert.equal(page.products.length, 5);
  assert.equal(page.total, catalog.products.length);

  const { data: tree } = await api.get('/categories/tree');
  const root = tree[0];
  const { data: resolved } = await api.get('/categories/resolve', { params: { path: root.slug } });
  assert.equal(resolved.category._id, root._id);

  const { data: inRoot } = await api.get('/products', { params: { category: root._id, limit: 100 } });
  assert.ok(inRoot.total > 0, 'category filter includes descendant categories');

  const { data: hits } = await api.get('/products', { params: { search: 'galaxy case' } });
  assert.ok(hits.total > 0 && hits.products.every((p) => /galaxy|samsung/i.test(`${p.name} ${p.description} ${p.brand.name} ${p.category.name}`)));

  const { data: one } = await api.get(`/products/${catalog.products[0]._id}`);
  assert.equal(one.name, catalog.products[0].name);
  await assert.rejects(api.get('/products/nope'), (e) => e.response.status === 404);
});
