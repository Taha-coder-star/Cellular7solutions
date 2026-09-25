import assert from 'node:assert/strict';
import { buySellWhatsappLink, repairWhatsappLink, whatsappLink, WHATSAPP_NUMBER } from './whatsapp.js';

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

const buySellUrl = new URL(buySellWhatsappLink({
  name: 'Test Customer', phone: '+1 555 123 4567', device: 'iPhone 13 & case',
  condition: 'Good', description: 'Screen has a scratch\nBattery at 80%',
}));
assert.equal(buySellUrl.pathname, productUrl.pathname);
assert.match(buySellUrl.searchParams.get('text'), /quote for my device/);
assert.match(buySellUrl.searchParams.get('text'), /Device: iPhone 13 & case/);
assert.match(buySellUrl.searchParams.get('text'), /Condition: Good/);
assert.match(buySellUrl.searchParams.get('text'), /Details: Screen has a scratch\nBattery at 80%/);
assert.match(buySellUrl.searchParams.get('text'), /Name: Test Customer\nPhone: \+1 555 123 4567/);
assert.match(buySellUrl.search, /%26/);

console.log('Product, repair, and buy/sell WhatsApp links use the same number and preserve message details.');
