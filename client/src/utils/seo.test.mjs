import { test } from 'node:test';
import assert from 'node:assert/strict';
import { categoryMeta, pageMeta, productMeta } from './seo.js';

test('pageMeta covers fixed and repair routes, and leaves catalog routes alone', () => {
  assert.match(pageMeta('/').title, /Glencoe, AL/);
  assert.match(pageMeta('/repair/phone').title, /^Phone Repair in Glencoe/);
  assert.match(pageMeta('/repair/phone/battery/').title, /^Battery \| Phone Repair/);
  assert.equal(pageMeta('/repair/nope'), null);
  assert.equal(pageMeta('/repair/phone/nope'), null);
  assert.equal(pageMeta('/product/123'), null);
});

test('productMeta cleans imported text and fits a search snippet', () => {
  const same = productMeta({ name: 'Speaker聽', description: 'Speaker聽' });
  assert.equal(same.title, 'Speaker | Cellular Solutions');
  assert.match(same.description, /^Speaker\. Ask about/);
  assert.ok(productMeta({ name: 'x', description: 'word '.repeat(100) }).description.length <= 160);
});

test('categoryMeta tells same-named categories apart by parent', () => {
  assert.match(categoryMeta([{ name: 'Cases' }, { name: 'iPhone 17' }]).title, /^iPhone 17 - Cases \|/);
});
