import assert from 'node:assert/strict';
import { repairWhatsappLink, whatsappLink, WHATSAPP_NUMBER } from './whatsapp.js';

const productUrl = new URL(whatsappLink({ name: 'Test phone' }));
assert.equal(productUrl.pathname, `/${WHATSAPP_NUMBER}`);
assert.match(productUrl.searchParams.get('text'), /Test phone/);

for (const [deviceType, label] of [
  ['Phone', 'Phone'],
  ['Laptop', 'Laptop'],
  ['Game Console', 'Gaming console'],
  ['Other', 'Other electronics'],
]) {
  const url = new URL(repairWhatsappLink({
    deviceType,
    brandModel: 'Model A & B',
    issue: 'Won\'t charge & restarts\nScreen shows #error 😀',
    name: 'Test Customer',
  }));
  const message = url.searchParams.get('text');
  assert.equal(url.pathname, productUrl.pathname);
  assert.match(message, /request a repair/i);
  assert.match(message, new RegExp(`Device type: ${label}`));
  assert.match(message, /Brand and model: Model A & B/);
  assert.match(message, /Problem:\nWon't charge & restarts\nScreen shows #error 😀/);
  assert.match(message, /Name: Test Customer/);
  assert.match(url.search, /%0A/);
  assert.match(url.search, /%26/);
  assert.match(url.search, /%23/);
}

const optional = new URL(repairWhatsappLink({
  deviceType: 'Other', brandModel: '', issue: 'Device details', name: '',
})).searchParams.get('text');
assert.doesNotMatch(optional, /Brand and model:|Name:/);

console.log('Product and repair WhatsApp links use the same number; all device labels and special characters passed.');
