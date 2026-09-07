const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'F:/excell_catalogue_downloader_windows/excell_catalogue_downloader/output';
const IMAGE_EXT_RE = /\.(jpe?g|png|webp)$/i;
const EXCLUDE_SIZES = new Set(['42184']); // outlier shared by 35 assets, likely a generic placeholder

const items = JSON.parse(fs.readFileSync(path.join(SOURCE_DIR, 'products.json'), 'utf-8'));
const cloudAssets = JSON.parse(fs.readFileSync('_tmp_cloudinary_assets.json', 'utf-8'));

const cloudBytes = new Set();
for (const a of cloudAssets) {
  if (!EXCLUDE_SIZES.has(String(a.bytes))) cloudBytes.add(a.bytes);
}
console.log('distinct cloudinary byte-sizes (excluding outlier):', cloudBytes.size);

let missingFile = 0;
let checkedImgs = 0;
const newItems = [];
const dupItems = [];

for (const it of items) {
  const localImgs = (it.local_images || []).filter((p) => IMAGE_EXT_RE.test(p));
  let isDup = false;
  for (const rel of localImgs) {
    const full = path.join(SOURCE_DIR, rel.replace(/\\/g, path.sep));
    if (!fs.existsSync(full)) { missingFile++; continue; }
    checkedImgs++;
    const size = fs.statSync(full).size;
    if (cloudBytes.has(size)) { isDup = true; break; }
  }
  if (isDup) dupItems.push(it);
  else newItems.push(it);
}

console.log('total source items:', items.length);
console.log('images checked:', checkedImgs, '| missing on disk:', missingFile);
console.log('DUPLICATE (image already on cloudinary):', dupItems.length);
console.log('NEW (no image match found):', newItems.length);

fs.writeFileSync('_tmp_new_items_by_image.json', JSON.stringify(newItems));
console.log('\nsample of 20 NEW items:');
newItems.slice(0, 20).forEach((it) => console.log(' -', it.name));
