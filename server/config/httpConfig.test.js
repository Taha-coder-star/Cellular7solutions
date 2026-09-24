const assert = require('node:assert/strict');
const test = require('node:test');
const httpConfig = require('./httpConfig');

test('Render restricts CORS to the production storefront even without CLIENT_URL', () => {
  assert.deepEqual(httpConfig({ RENDER: 'true' }), {
    hosted: true,
    clientOrigin: 'https://cellular7solutions.vercel.app',
  });
});

test('local development and explicit origins are handled separately', () => {
  assert.equal(httpConfig({}).clientOrigin, true);
  assert.equal(httpConfig({ NODE_ENV: 'production', CLIENT_URL: 'https://store.example/' }).clientOrigin, 'https://store.example');
  assert.throws(() => httpConfig({ RENDER: 'true', CLIENT_URL: 'http://store.example' }), /HTTPS/);
  assert.throws(() => httpConfig({ RENDER: 'true', CLIENT_URL: 'https://store.example/path' }), /origin/);
});
