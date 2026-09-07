/**
 * Import professional product images for non-Samsung smartphones from GSMArena,
 * store them on Cloudinary (existing media system), and attach to the matching
 * Product. Safely re-runnable: a JSON ledger tracks per-model status and valid
 * successes are skipped.
 *
 * Usage:
 *   node scripts/import-phone-images.js            # all 75
 *   node scripts/import-phone-images.js --limit 5  # first 5 (test run)
 *   node scripts/import-phone-images.js --only "iPhone 17 Pro"
 *   node scripts/import-phone-images.js --force     # ignore ledger, reprocess
 *
 * Samsung is intentionally NOT in the model list and is never touched.
 */
require('dotenv').config({ override: true });
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const fs = require('fs');
const path = require('path');
const os = require('os');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const MODELS = require('./phone-models');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const LEDGER = path.join(__dirname, 'import-log.json');
const TMP = path.join(os.tmpdir(), 'phone-img-import');
const FOLDER = 'cellular-solutions/products/catalog';
// Consistent webp delivery, padded to a square white card. GSMArena renders are
// portrait on white, so padding is invisible and dimensions stay uniform.
const XFORM = 'f_webp,q_auto,c_pad,b_white,w_800,h_800';
const DELAY_MS = 1500;      // politeness gap between GSMArena hits
const TIMEOUT_MS = 20000;
const RETRIES = 3;

const args = process.argv.slice(2);
const getArg = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const LIMIT = getArg('--limit') ? parseInt(getArg('--limit'), 10) : null;
const ONLY = getArg('--only');
const FORCE = args.includes('--force');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();

function loadLedger() {
  try { return JSON.parse(fs.readFileSync(LEDGER, 'utf8')); } catch { return {}; }
}
function saveLedger(l) { fs.writeFileSync(LEDGER, JSON.stringify(l, null, 2)); }

async function fetchText(url) {
  let lastErr;
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
      const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' }, signal: ctrl.signal });
      clearTimeout(t);
      if (res.status === 429) { await sleep(5000 * attempt); throw new Error('429 rate limited'); }
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.text();
    } catch (e) { lastErr = e; await sleep(1000 * attempt); }
  }
  throw lastErr;
}

async function downloadImage(url, dest) {
  let lastErr;
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
      const res = await fetch(url, { headers: { 'User-Agent': UA, Referer: 'https://www.gsmarena.com/' }, signal: ctrl.signal });
      clearTimeout(t);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const ct = res.headers.get('content-type') || '';
      if (!ct.startsWith('image/')) throw new Error('not an image: ' + ct);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 2000) throw new Error('image too small (' + buf.length + 'b)');
      fs.writeFileSync(dest, buf);
      return buf.length;
    } catch (e) { lastErr = e; await sleep(1000 * attempt); }
  }
  throw lastErr;
}

// Parse GSMArena quick-search results into [{href, name}], first = best match.
function parseResults(html) {
  const block = html.match(/<div class="makers">([\s\S]*?)<\/div>/i);
  const scope = block ? block[1] : html;
  const out = [];
  const re = /<a href="([a-z0-9_]+-\d+\.php)"[^>]*>\s*<img[^>]*>\s*<strong><span>([\s\S]*?)<\/span>/gi;
  let m;
  while ((m = re.exec(scope))) out.push({ href: m[1], name: m[2].replace(/<[^>]+>/g, ' ').trim() });
  return out;
}

// Choose first result whose name contains all verify tokens and no reject tokens.
function pickMatch(results, model) {
  const verify = model.verify.map(norm);
  const reject = (model.reject || []).map(norm);
  for (const r of results) {
    const n = ' ' + norm(r.name + ' ' + r.href.replace(/-\d+\.php$/, '')) + ' ';
    const ok = verify.every((v) => n.includes(' ' + v + ' ') || n.includes(v));
    const bad = reject.some((x) => n.includes(' ' + x + ' ') || n.includes(x));
    if (ok && !bad) return r;
  }
  return null;
}

async function resolveImage(model) {
  const searchUrl = 'https://www.gsmarena.com/results.php3?sQuickSearch=yes&sName=' + encodeURIComponent(model.q);
  const html = await fetchText(searchUrl);
  const results = parseResults(html);
  if (!results.length) return { status: 'MISSING', reason: 'no search results' };
  const match = pickMatch(results, model);
  if (!match) return { status: 'MISSING', reason: 'no result passed exact-model verification (top: ' + results.slice(0, 3).map((r) => r.name).join(' | ') + ')' };

  await sleep(DELAY_MS);
  const page = await fetchText('https://www.gsmarena.com/' + match.href);
  const og = page.match(/<meta property="og:image" content="([^"]+)"/i);
  if (!og) return { status: 'FAILED', reason: 'no og:image on device page', matched: match.name };
  return { status: 'OK', imageUrl: og[1], matched: match.name, deviceUrl: match.href };
}

function xformUrl(secureUrl) {
  return secureUrl.replace('/upload/', '/upload/' + XFORM + '/');
}

async function run() {
  await connectDB();
  fs.mkdirSync(TMP, { recursive: true });
  const ledger = loadLedger();

  let list = MODELS;
  if (ONLY) list = list.filter((m) => m.name.toLowerCase() === ONLY.toLowerCase());
  if (LIMIT) list = list.slice(0, LIMIT);

  const stats = { requested: list.length, matched: 0, downloaded: 0, attached: 0, missing: 0, failed: 0, skipped: 0 };
  const report = { SUCCESS: [], MISSING: [], FAILED: [] };

  for (const model of list) {
    const product = await Product.findOne({ name: model.name });
    if (!product) { stats.failed++; report.FAILED.push(`${model.name} — no DB product`); ledger[model.name] = { status: 'FAILED', reason: 'no product', ts: Date.now() }; continue; }

    const prev = ledger[model.name];
    const currentImg = (product.images || [])[0] || '';
    const alreadyGood = currentImg.includes(FOLDER);
    if (!FORCE && prev && prev.status === 'SUCCESS' && alreadyGood) {
      stats.skipped++;
      report.SUCCESS.push(`${model.name} — (skipped, already imported) — ${prev.source || 'GSMArena'}`);
      continue;
    }

    process.stdout.write(`\n▶ ${model.name} ... `);
    try {
      const r = await resolveImage(model);
      if (r.status === 'MISSING') { stats.missing++; report.MISSING.push(`${model.name} — ${r.reason}`); ledger[model.name] = { status: 'MISSING', reason: r.reason, ts: Date.now() }; process.stdout.write('MISSING'); await sleep(DELAY_MS); continue; }
      if (r.status === 'FAILED') { stats.failed++; report.FAILED.push(`${model.name} — ${r.reason}`); ledger[model.name] = { status: 'FAILED', reason: r.reason, ts: Date.now() }; process.stdout.write('FAILED'); await sleep(DELAY_MS); continue; }

      stats.matched++;
      const slug = product.slug || norm(model.name).replace(/ /g, '-');
      const tmpFile = path.join(TMP, slug + path.extname(new URL(r.imageUrl).pathname) || '.jpg');
      const bytes = await downloadImage(r.imageUrl, tmpFile);
      stats.downloaded++;

      const up = await cloudinary.uploader.upload(tmpFile, { folder: FOLDER, public_id: slug, overwrite: true, resource_type: 'image' });
      const finalUrl = xformUrl(up.secure_url);
      product.images = [finalUrl];
      await product.save();
      stats.attached++;

      ledger[model.name] = { status: 'SUCCESS', source: 'GSMArena', matched: r.matched, deviceUrl: r.deviceUrl, imageUrl: r.imageUrl, cloudinary: finalUrl, bytes, ts: Date.now() };
      report.SUCCESS.push(`${model.name} — image imported (matched "${r.matched}") — GSMArena`);
      process.stdout.write(`OK → ${r.matched}`);
      try { fs.unlinkSync(tmpFile); } catch {}
      saveLedger(ledger);
      await sleep(DELAY_MS);
    } catch (e) {
      stats.failed++;
      report.FAILED.push(`${model.name} — ${e.message}`);
      ledger[model.name] = { status: 'FAILED', reason: e.message, ts: Date.now() };
      process.stdout.write('FAILED: ' + e.message);
      await sleep(DELAY_MS);
    }
  }

  saveLedger(ledger);

  console.log('\n\n========== FINAL REPORT ==========');
  console.log('\nSUCCESS'); report.SUCCESS.forEach((s) => console.log('  ✓ ' + s));
  console.log('\nMISSING'); report.MISSING.forEach((s) => console.log('  ✗ ' + s));
  console.log('\nFAILED'); report.FAILED.forEach((s) => console.log('  ! ' + s));
  console.log('\n---- Totals ----');
  console.log('Requested:            ' + stats.requested);
  console.log('Matched (verified):   ' + stats.matched);
  console.log('Downloaded:           ' + stats.downloaded);
  console.log('Attached to DB:       ' + stats.attached);
  console.log('Missing:              ' + stats.missing);
  console.log('Failed:               ' + stats.failed);
  console.log('Skipped (had image):  ' + stats.skipped);

  await mongoose.disconnect();
}

run().catch(async (e) => { console.error('\nFATAL:', e); await mongoose.disconnect().catch(() => {}); process.exit(1); });
