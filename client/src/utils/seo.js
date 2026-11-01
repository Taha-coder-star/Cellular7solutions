import { REPAIR_CATEGORIES, findRepair } from '../data/repairServices.js';

// Change this one line when the shop gets its own domain.
export const SITE_URL = 'https://cellular7solutions.vercel.app';

export const BUSINESS = {
  name: 'Cellular Solutions',
  alternateName: 'Cellular Seven Solutions',
  street: '520 West Main St.',
  city: 'Glencoe',
  region: 'AL',
  zip: '35905',
  phone: '(256) 515-9620',
  phoneE164: '+12565159620',
  email: 'Rambocityalabama@gmail.com',
};

const BRAND = `| ${BUSINESS.name}`;
const WHERE = `${BUSINESS.city}, ${BUSINESS.region}`;

function clip(text, max = 160) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

const STATIC_PAGES = {
  '/': {
    title: `Phone Store & Device Repair in ${WHERE} ${BRAND}`,
    description: `${BUSINESS.name} (${BUSINESS.alternateName}) in ${WHERE}: new and used phones, laptops, consoles and accessories, plus device repair. Call ${BUSINESS.phone}.`,
  },
  '/shop': {
    title: `Shop Phones, Laptops, Consoles & Accessories ${BRAND}`,
    description: `Browse new and used phones, tablets, laptops, consoles, parts and accessories at ${BUSINESS.name} in ${WHERE}, then ask us about price and availability.`,
  },
  '/repair': {
    title: `Phone, Tablet, Computer & Console Repair in ${WHERE} ${BRAND}`,
    description: `Repairs for phones, tablets, computers, game consoles and HDMI ports in ${WHERE}. Hear what is wrong and what it will cost before we start.`,
  },
  '/buysell': {
    title: `Sell or Trade In Your Phone in ${WHERE} ${BRAND}`,
    description: `Sell or trade in your used phone or device at ${BUSINESS.name} in ${WHERE}. Tell us what you have and get a quote.`,
  },
  '/about': {
    title: `About Us ${BRAND}`,
    description: `${BUSINESS.name} is a local shop in ${WHERE} that sells new and used devices, repairs them and buys them back.`,
  },
  '/contact': {
    title: `Contact Us ${BRAND}`,
    description: `Visit ${BUSINESS.name} at ${BUSINESS.street}, ${WHERE} ${BUSINESS.zip}, or call ${BUSINESS.phone}.`,
  },
  '/privacy': { title: `Privacy Policy ${BRAND}`, description: `How ${BUSINESS.name} handles your information.` },
  '/terms': { title: `Terms & Conditions ${BRAND}`, description: `Terms for using the ${BUSINESS.name} website and services.` },
};

export const STATIC_PATHS = Object.keys(STATIC_PAGES);

export const REPAIR_PATHS = REPAIR_CATEGORIES.flatMap((c) => [
  `/repair/${c.slug}`,
  ...c.repairs.map((r) => `/repair/${c.slug}/${r.slug}`),
]);

/** Title and description for a fixed or repair route; null for catalog routes, which need data. */
export function pageMeta(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (STATIC_PAGES[path]) return STATIC_PAGES[path];
  const [, section, categorySlug, repairSlug, extra] = path.split('/');
  if (section !== 'repair' || extra) return null;
  const { category, repair } = findRepair(categorySlug, repairSlug);
  if (repair) {
    return {
      title: `${repair.name} | ${category.title} in ${WHERE} ${BRAND}`,
      description: clip(`${repair.summary} ${BUSINESS.name}, ${WHERE}.`),
    };
  }
  if (category && !repairSlug) {
    const names = category.repairs.map((r) => r.name.toLowerCase()).join(', ');
    return {
      title: `${category.title} in ${WHERE} ${BRAND}`,
      description: clip(`${category.heading} at ${BUSINESS.name} in ${WHERE}: ${names}.`),
    };
  }
  return null;
}

// '聽' is a mis-decoded non-breaking space left in some imported product text.
const cleanText = (text) => String(text ?? '').replace(/[聽\s]+/g, ' ').trim();

export function productMeta(product) {
  const name = cleanText(product.name);
  const description = cleanText(product.description);
  const lead = description && description !== name ? `${clip(description, 100)} ` : `${name}. `;
  return {
    title: `${name} ${BRAND}`,
    description: clip(`${lead}Ask about price and availability at ${BUSINESS.name} in ${WHERE}.`),
  };
}

/** `trail` runs from the top-level category down to the page's own category. */
export function categoryMeta(trail) {
  const names = trail.map((c) => cleanText(c.name));
  const label = names.slice(-2).reverse().join(' - ');
  return {
    title: `${label} ${BRAND}`,
    description: clip(`Shop ${names.join(' > ')} at ${BUSINESS.name} in ${WHERE}. Ask us about price and availability.`),
  };
}
