// Plain-node self-check: `node client/src/utils/pagination.test.mjs`
import assert from 'node:assert';
import { getPaginationRange as r } from './pagination.js';

assert.deepStrictEqual(r(1, 1), [1]);
assert.deepStrictEqual(r(1, 3), [1, 2, 3]);
assert.deepStrictEqual(r(1, 5), [1, 2, 3, 4, 5]);
assert.deepStrictEqual(r(1, 10), [1, 2, 3, 4, 5, '...', 10]);
assert.deepStrictEqual(r(1, 100), [1, 2, 3, 4, 5, '...', 100]);
assert.deepStrictEqual(r(50, 100), [1, '...', 48, 49, 50, 51, 52, '...', 100]);
assert.deepStrictEqual(r(98, 100), [1, '...', 96, 97, 98, 99, 100]);
assert.deepStrictEqual(r(100, 100), [1, '...', 96, 97, 98, 99, 100]);
assert.deepStrictEqual(r(12, 23, 1), [1, '...', 11, 12, 13, '...', 23]);

console.log('pagination.test.mjs: all assertions passed');
