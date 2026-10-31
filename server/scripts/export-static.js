// Dumps the catalog to client/public/catalog.json for the static site.
// Re-run after editing the catalog in Mongo, then redeploy the client.
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env'), override: true });
const dns = require('dns');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const [categories, brands, products] = await Promise.all([
    Category.find().lean(),
    Brand.find().lean(),
    Product.find().populate('brand', 'name slug').populate('category', 'name slug').lean(),
  ]);
  const out = path.join(__dirname, '..', '..', 'client', 'public', 'catalog.json');
  fs.writeFileSync(out, JSON.stringify({ categories, brands, products }));
  console.log(`Wrote ${products.length} products, ${categories.length} categories, ${brands.length} brands to ${out}`);
  await mongoose.disconnect();
})().catch((err) => { console.error(err); process.exit(1); });
