const assert = require('node:assert/strict');
const test = require('node:test');
const express = require('express');
const router = require('./repairRoutes');

test('repair API rejects new enquiries and protects historical records', async () => {
  const app = express();
  app.use('/api/repairs', router);
  const server = await new Promise((resolve, reject) => {
    const instance = app.listen(0, '127.0.0.1', () => resolve(instance));
    instance.on('error', reject);
  });
  try {
    const url = `http://127.0.0.1:${server.address().port}/api/repairs`;
    const submission = await fetch(url, { method: 'POST' });
    assert.equal(submission.status, 410);
    assert.match((await submission.json()).message, /WhatsApp/);

    const history = await fetch(url);
    assert.equal(history.status, 401);
  } finally {
    server.close();
  }
});
