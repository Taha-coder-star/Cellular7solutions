// Runs after `vite build`. Writes one HTML file per route so crawlers and link previews get a real
// title, description, canonical URL and text without running JS; React replaces the text on load.
// Also writes sitemap.xml and robots.txt, so the domain only lives in SITE_URL.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { REPAIR_CATEGORIES, repairImage } from '../src/data/repairServices.js';
import { cloudinaryUrl } from '../src/utils/image.js';
import { BUSINESS, REPAIR_PATHS, SITE_URL, STATIC_PATHS, categoryMeta, pageMeta, productMeta } from '../src/utils/seo.js';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const DEFAULT_IMAGE = '/assets/iphone-lineup-hero.webp';
const template = readFileSync(join(DIST, 'index.html'), 'utf8');
const catalog = JSON.parse(readFileSync(join(DIST, 'catalog.json'), 'utf8'));

// vercel.json falls back to this for unknown URLs: no canonical, so they can't claim to be the homepage.
writeFileSync(join(DIST, 'shell.html'), template);

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const absolute = (url) => (url.startsWith('http') ? url : `${SITE_URL}${url}`);
const link = (to, label) => `<a href="${esc(to)}">${esc(label)}</a>`;
const list = (items) => (items.length ? `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>` : '');

const LOCAL_BUSINESS = {
  '@context': 'https://schema.org',
  '@type': 'ElectronicsStore',
  '@id': `${SITE_URL}/#store`,
  name: BUSINESS.name,
  alternateName: BUSINESS.alternateName,
  url: `${SITE_URL}/`,
  image: absolute(DEFAULT_IMAGE),
  logo: absolute('/assets/cs-icon-512.png'),
  telephone: BUSINESS.phoneE164,
  email: BUSINESS.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS.street,
    addressLocality: BUSINESS.city,
    addressRegion: BUSINESS.region,
    postalCode: BUSINESS.zip,
    addressCountry: 'US',
  },
};

function breadcrumbs(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: absolute(path) })),
  };
}

const footer = `<nav>${[['/shop', 'Shop'], ['/repair', 'Repair'], ['/buysell', 'Sell your device'], ['/about', 'About'], ['/contact', 'Contact']]
  .map(([to, label]) => link(to, label)).join(' · ')}</nav>
<p>${esc(`${BUSINESS.name}, ${BUSINESS.street}, ${BUSINESS.city}, ${BUSINESS.region} ${BUSINESS.zip}`)} · ${link(`tel:${BUSINESS.phoneE164}`, BUSINESS.phone)}</p>`;

const sitemap = [];

function writePage(path, { meta, heading, body = '', image = DEFAULT_IMAGE, schema = [], noindex = false }) {
  const url = absolute(path);
  const jsonLd = schema.map((s) => `<script type="application/ld+json">${JSON.stringify(s).replace(/</g, '\\u003c')}</script>`);
  const head = [
    `<link rel="canonical" href="${esc(url)}" />`,
    noindex ? '<meta name="robots" content="noindex" />' : '',
    `<meta property="og:site_name" content="${esc(BUSINESS.name)}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(absolute(image))}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    ...jsonLd,
  ].filter(Boolean).join('\n    ');

  // Replacer functions keep `$` in product names from being read as a replacement pattern.
  const html = template
    .replace(/<title>.*?<\/title>/s, () => `<title>${esc(meta.title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, () => `<meta name="description" content="${esc(meta.description)}" />`)
    .replace('</head>', () => `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', () => `<div id="root"><div style="max-width:720px;margin:0 auto;padding:24px;font-family:system-ui,sans-serif"><h1>${esc(heading)}</h1>${body}${footer}</div></div>`);

  const file = join(DIST, ...path.split('/').filter(Boolean), 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  if (!noindex) sitemap.push(url);
}

const byId = new Map(catalog.categories.map((c) => [c._id, c]));
const children = new Map();
for (const c of catalog.categories) {
  const key = c.parent ? String(c.parent) : 'root';
  if (!children.has(key)) children.set(key, []);
  children.get(key).push(c);
}

function trailOf(category) {
  const trail = [category];
  while (trail[0].parent && byId.has(String(trail[0].parent))) trail.unshift(byId.get(String(trail[0].parent)));
  return trail;
}
const categoryPath = (category) => `/categories/${trailOf(category).map((c) => c.slug).join('/')}`;
const categoryCrumbs = (trail) => [['Shop', '/shop'], ...trail.map((c) => [c.name, categoryPath(c)])];

const productsByCategory = new Map();
const hasProducts = new Set();
for (const p of catalog.products) {
  const category = byId.get(p.category?._id);
  if (!category) continue;
  if (!productsByCategory.has(category._id)) productsByCategory.set(category._id, []);
  productsByCategory.get(category._id).push(p);
  for (const c of trailOf(category)) hasProducts.add(c._id);
}

const topCategories = (children.get('root') || []).filter((c) => hasProducts.has(c._id));
const categoryLinks = list(topCategories.map((c) => link(categoryPath(c), c.name)));
const repairLinks = list(REPAIR_CATEGORIES.map((c) => link(`/repair/${c.slug}`, c.title)));
const FIXED_LINKS = { '/': `<h2>Shop</h2>${categoryLinks}<h2>Repair</h2>${repairLinks}`, '/shop': categoryLinks, '/repair': repairLinks };
const FIXED_SCHEMA = { '/': [LOCAL_BUSINESS], '/contact': [LOCAL_BUSINESS] };

// Every page reads the Vite shell captured above, so writing `/` over dist/index.html is safe.
for (const path of STATIC_PATHS) {
  const meta = pageMeta(path);
  writePage(path, {
    meta,
    heading: meta.title.split(' | ')[0],
    schema: FIXED_SCHEMA[path] ?? [],
    body: `<p>${esc(meta.description)}</p>${FIXED_LINKS[path] ?? ''}`,
  });
}

for (const path of REPAIR_PATHS) {
  const meta = pageMeta(path);
  const [, , categorySlug, repairSlug] = path.split('/');
  const category = REPAIR_CATEGORIES.find((c) => c.slug === categorySlug);
  const repair = category.repairs.find((r) => r.slug === repairSlug);
  const crumbs = [['Repair', '/repair'], [category.title, `/repair/${category.slug}`]];
  if (repair) crumbs.push([repair.name, path]);
  writePage(path, {
    meta,
    heading: repair ? `${repair.name}: ${category.title}` : category.title,
    image: repairImage(repair?.image ?? category.image),
    schema: [breadcrumbs(crumbs)],
    body: repair
      ? `<p>${esc(repair.summary)}</p>${list(repair.symptoms.map(esc))}<p>${link(`/repair/${category.slug}`, `More ${category.title.toLowerCase()}`)}</p>`
      : `<p>${esc(meta.description)}</p>${list(category.repairs.map((r) => link(`/repair/${category.slug}/${r.slug}`, r.name)))}`,
  });
}

for (const category of catalog.categories) {
  const trail = trailOf(category);
  const meta = categoryMeta(trail);
  const subcategories = (children.get(category._id) || []).filter((c) => hasProducts.has(c._id));
  const products = (productsByCategory.get(category._id) || []).slice(0, 100);
  writePage(categoryPath(category), {
    meta,
    heading: category.name,
    noindex: !hasProducts.has(category._id), // an empty listing shouldn't compete in search
    schema: [breadcrumbs(categoryCrumbs(trail))],
    body: `<p>${esc(meta.description)}</p>${list(subcategories.map((c) => link(categoryPath(c), c.name)))}${list(products.map((p) => link(`/product/${p._id}`, p.name)))}`,
  });
}

for (const product of catalog.products) {
  const category = byId.get(product.category?._id);
  const trail = category ? trailOf(category) : [];
  const path = `/product/${product._id}`;
  // Prices stay off the site, so no Product schema: Google's rich results require an offer or reviews.
  writePage(path, {
    meta: productMeta(product),
    heading: product.name,
    image: product.images?.[0] ? cloudinaryUrl(product.images[0], 1200) : DEFAULT_IMAGE,
    schema: [breadcrumbs([...categoryCrumbs(trail), [product.name, path]])],
    body: `<p>${esc(product.description ?? '')}</p>${category ? `<p>${link(categoryPath(category), category.name)}</p>` : ''}`,
  });
}

writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map((u) => `  <url><loc>${esc(u)}</loc></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log(`prerendered ${sitemap.length} indexable pages`);
