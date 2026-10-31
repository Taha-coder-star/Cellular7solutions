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

test('search lists phones before cases and parts', async () => {
  const { data } = await api.get('/products', { params: { search: 'iphone 16', limit: 8 } });
  assert.equal(data.products[0].category.name, 'Smartphones');
  assert.ok(data.products.slice(0, 5).every((p) => p.category.name === 'Smartphones'));
});

test('aliases: ps5 finds PlayStation 5 consoles first', async () => {
  const { expandAliases } = await import('./api.js');
  assert.equal(expandAliases('PS5 controller'), 'playstation 5 controller');
  assert.equal(expandAliases('ps 4'), 'playstation 4');
  assert.equal(expandAliases('xbox x'), 'xbox series x');
  const { data } = await api.get('/products', { params: { search: 'ps5', limit: 5 } });
  assert.ok(data.total > 0);
  assert.match(data.products[0].name, /playstation 5/i);
  assert.equal(data.products[0].category.name, 'Gaming');
});

test('synonyms and plurals widen matches', async () => {
  const { expandAliases } = await import('./api.js');
  assert.equal(expandAliases('iPhone16 ProMax screen protector'), 'iphone 16 pro max glass');
  const { data: screens } = await api.get('/products', { params: { search: 'iphone 12 pro max screen', limit: 20 } });
  assert.ok(screens.products.some((p) => /lcd|oled/i.test(p.name)), 'screen finds LCD/OLED parts');
  const { data: batteries } = await api.get('/products', { params: { search: 'batteries', limit: 5 } });
  assert.ok(batteries.total > 0 && /battery/i.test(batteries.products[0].name));
});
