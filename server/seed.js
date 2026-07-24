/**
 * One-time database seed script — NOT part of the app's runtime.
 *
 * Populates categories, brands, and sample products so the storefront has
 * data to render during development. Safe to re-run: existing documents
 * (matched by name) are skipped, never duplicated or overwritten.
 *
 * Run from server/:  npm run seed
 */
require('dotenv').config({ override: true });
const dns = require('dns');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Category = require('./models/Category');
const Brand = require('./models/Brand');
const Product = require('./models/Product');

// Same DNS workaround as server.js — required on this network for mongodb+srv:// SRV lookups
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const CATEGORY_NAMES = [
  'Phones',
  'Phone Accessories',
  'Cases',
  'Chargers',
  'Headphones',
  'Bluetooth',
  'AirPods',
  'Tempered Glass',
  'Speakers',
  'Laptops',
  'Gaming',
  'iPad',
  'Tablet',
  'Toys & Gadgets',
];

// "Various" is a generic placeholder brand for accessories where the
// specific brand hasn't been confirmed with the client yet.
const BRAND_NAMES = [
  'Apple',
  'Samsung',
  'Motorola',
  'Nokia',
  'Microsoft',
  'Sony',
  'Nintendo',
  'Anker',
  'JBL',
  'Various',
];

// Random stock between 5 and 50
const stock = () => 5 + Math.floor(Math.random() * 46);

// NOTE: images are intentionally empty — no Cloudinary uploads exist yet.
// The frontend falls back to a device icon when a product has no images.
// Products reference category/brand by NAME here; resolved to ObjectIds below.
const PRODUCTS = [
  // Phones
  { name: 'iPhone 15 Pro Max 256GB', brand: 'Apple', category: 'Phones', price: 1199.00, condition: 'new', isFeatured: true, description: 'Titanium design, A17 Pro chip, 48MP camera system, USB-C.' },
  { name: 'iPhone 13 128GB', brand: 'Apple', category: 'Phones', price: 449.00, condition: 'used', description: 'Quality-checked used unit — battery health 88%+, unlocked, 30-day guarantee.' },
  { name: 'Galaxy S24 Ultra 256GB', brand: 'Samsung', category: 'Phones', price: 1299.99, condition: 'new', isFeatured: true, description: 'Snapdragon 8 Gen 3, 200MP camera, built-in S Pen, titanium frame.' },
  { name: 'Galaxy A15 128GB', brand: 'Samsung', category: 'Phones', price: 199.99, condition: 'new', description: 'Big 6.5" AMOLED display, 50MP camera, two-day battery — unbeatable value.' },
  { name: 'Moto G Power 5G', brand: 'Motorola', category: 'Phones', price: 249.99, condition: 'new', description: '6.7" 120Hz display, 5000mAh battery, 50MP camera, 5G ready.' },
  { name: 'Nokia G42 5G', brand: 'Nokia', category: 'Phones', price: 189.99, condition: 'new', description: 'QuickFix repairable design, 3 days of battery, clean Android experience.' },

  // Phone Accessories
  { name: 'MagSafe Car Mount', brand: 'Anker', category: 'Phone Accessories', price: 25.99, condition: 'new', description: 'Magnetic car vent mount with strong MagSafe alignment for iPhone 12 and newer.' },
  { name: 'Universal Phone Grip & Stand', brand: 'Various', category: 'Phone Accessories', price: 11.99, condition: 'new', description: 'Collapsible grip and kickstand that sticks to any phone or case.' },
  { name: 'Phone Camera Lens Protector Kit', brand: 'Various', category: 'Phone Accessories', price: 14.99, condition: 'new', description: 'Scratch-resistant camera lens covers with alignment tray, 3-pack.' },

  // Cases
  { name: 'iPhone 15 Pro Silicone Case', brand: 'Apple', category: 'Cases', price: 29.99, condition: 'new', description: 'Official silky-soft silicone case with MagSafe, microfiber lining.' },
  { name: 'Galaxy S24 Clear Case', brand: 'Samsung', category: 'Cases', price: 19.99, condition: 'new', description: 'Slim transparent case that shows off your phone while guarding against drops.' },
  { name: 'Heavy-Duty Rugged Case', brand: 'Various', category: 'Cases', price: 16.99, condition: 'new', description: 'Shockproof dual-layer case with raised edges and built-in kickstand.' },

  // Chargers
  { name: 'Anker Nano 20W USB-C Charger', brand: 'Anker', category: 'Chargers', price: 21.99, condition: 'new', description: 'Compact 20W fast charger — full-speed charging for iPhone and Android.' },
  { name: 'Samsung 45W Super Fast Charger', brand: 'Samsung', category: 'Chargers', price: 34.99, condition: 'new', description: 'Official 45W USB-C wall charger with Super Fast Charging 2.0.' },
  { name: 'Anker 735 65W GaN Charger', brand: 'Anker', category: 'Chargers', price: 39.99, condition: 'new', description: 'Three-port 65W GaN charger — powers a laptop, tablet, and phone at once.' },

  // Headphones
  { name: 'Sony WH-1000XM5', brand: 'Sony', category: 'Headphones', price: 349.99, condition: 'new', isFeatured: true, description: 'Industry-leading noise cancelling over-ear headphones with 30-hour battery.' },
  { name: 'Sony WH-CH520 Wireless Headphones', brand: 'Sony', category: 'Headphones', price: 49.99, condition: 'new', description: 'Lightweight on-ear wireless headphones with 50-hour battery life.' },
  { name: 'Wired Earbuds with Mic', brand: 'Various', category: 'Headphones', price: 12.99, condition: 'new', description: 'USB-C wired earbuds with in-line mic and volume control.' },

  // Bluetooth
  { name: 'Soundcore Life P2 Mini Earbuds', brand: 'Anker', category: 'Bluetooth', price: 49.99, condition: 'new', description: 'True wireless earbuds with big bass, 32-hour total playtime.' },
  { name: 'Bluetooth 5.3 Audio Transmitter', brand: 'Various', category: 'Bluetooth', price: 18.99, condition: 'new', description: 'Adds Bluetooth audio to TVs, cars, and older stereos via 3.5mm jack.' },

  // AirPods
  { name: 'AirPods Pro (2nd Gen)', brand: 'Apple', category: 'AirPods', price: 249.99, condition: 'new', isFeatured: true, description: 'Active noise cancellation, adaptive audio, USB-C MagSafe charging case.' },
  { name: 'AirPods (4th Gen)', brand: 'Apple', category: 'AirPods', price: 129.99, condition: 'new', description: 'Redesigned fit, personalized spatial audio, USB-C charging case.' },
  { name: 'AirPods Max', brand: 'Apple', category: 'AirPods', price: 399.99, condition: 'used', description: 'Over-ear high-fidelity audio with ANC — quality-checked used unit, excellent condition.' },

  // Tempered Glass
  { name: 'iPhone 15 Tempered Glass (2-Pack)', brand: 'Various', category: 'Tempered Glass', price: 12.99, condition: 'new', description: '9H hardness screen protectors with easy-align installation frame.' },
  { name: 'Galaxy S24 Ultra Tempered Glass', brand: 'Various', category: 'Tempered Glass', price: 15.99, condition: 'new', description: 'Full-coverage curved glass with fingerprint-sensor cutout.' },

  // Speakers
  { name: 'Sony SRS-XB100 Portable Speaker', brand: 'Sony', category: 'Speakers', price: 59.99, condition: 'new', description: 'Compact waterproof Bluetooth speaker with 16-hour battery.' },
  { name: 'Power Max Party Speaker', brand: 'Various', category: 'Speakers', price: 79.99, condition: 'new', description: 'Loud portable party speaker with LED lights, mic input, and deep bass.' },

  // Laptops
  { name: 'MacBook Air 13" M3', brand: 'Apple', category: 'Laptops', price: 1099.00, condition: 'new', isFeatured: true, description: 'Apple M3 chip, 13.6" Liquid Retina display, 18-hour battery, fanless design.' },
  { name: 'MacBook Pro 14" M3 Pro', brand: 'Apple', category: 'Laptops', price: 1499.00, condition: 'used', description: 'M3 Pro power in like-new condition — fully tested, battery health 95%+.' },
  { name: 'Surface Laptop Go 3', brand: 'Microsoft', category: 'Laptops', price: 699.99, condition: 'new', description: '12.4" touchscreen, Intel i5, all-day battery — light and portable.' },

  // Gaming
  { name: 'PlayStation 5 Console', brand: 'Sony', category: 'Gaming', price: 499.99, condition: 'new', isFeatured: true, description: 'PS5 disc edition with DualSense controller — lightning-fast SSD loading.' },
  { name: 'Nintendo Switch OLED', brand: 'Nintendo', category: 'Gaming', price: 349.99, condition: 'new', description: '7" OLED screen, enhanced audio, dock with wired LAN port.' },
  { name: 'Xbox Series S', brand: 'Microsoft', category: 'Gaming', price: 239.99, condition: 'used', description: 'Compact all-digital console — quality-checked used unit with controller.' },

  // iPad
  { name: 'iPad Pro 11" M4', brand: 'Apple', category: 'iPad', price: 999.00, condition: 'new', isFeatured: true, description: 'Ultra Retina XDR display, M4 chip, Apple Pencil Pro support.' },
  { name: 'iPad (10th Gen)', brand: 'Apple', category: 'iPad', price: 349.00, condition: 'new', description: '10.9" Liquid Retina display, A14 Bionic, USB-C, all-day battery.' },

  // Tablet
  { name: 'Galaxy Tab S9', brand: 'Samsung', category: 'Tablet', price: 799.99, condition: 'new', isFeatured: true, description: '11" Dynamic AMOLED 2X, S Pen included, IP68 water resistance.' },
  { name: 'Galaxy Tab A9+', brand: 'Samsung', category: 'Tablet', price: 169.99, condition: 'new', description: '11" 90Hz display, quad speakers — great everyday family tablet.' },
  { name: 'Nokia T21 Tablet', brand: 'Nokia', category: 'Tablet', price: 179.99, condition: 'new', description: '10.4" 2K display, 3 years of security updates, tough aluminum body.' },

  // ===== Imported from master_inventory_catalog (INV-*), price 0 placeholders =====
  { name: "French Bulldog Speaker", brand: "Various", category: "Speakers", price: 0, condition: "new", description: "Novelty bulldog speaker with sunglasses (available in Black, White, Red)." },  // INV-019
  { name: "Hifi Tower Speaker", brand: "Various", category: "Speakers", price: 0, condition: "new", description: "Ultra-tall tower cabinet speaker with integrated top mixing console." },  // INV-027
  { name: "JBL Tune 520BT Headphones", brand: "JBL", category: "Headphones", price: 0, condition: "new", description: "JBL Pure Bass Wireless on-ear headphones in Black." },  // INV-028
  { name: "Kakusiga 12H Headphones", brand: "Various", category: "Headphones", price: 0, condition: "new", description: "12-Hour continuous play / 300-Hour standby Bluetooth headphones (Blue)." },  // INV-030
  { name: "Kakusiga 60H Headphones", brand: "Various", category: "Headphones", price: 0, condition: "new", description: "60-Hour long battery life, flexible headband, supports Aux/TF card (Navy Blue)." },  // INV-029
  { name: "Kakusiga Touch-Screen Earbuds", brand: "Various", category: "Bluetooth", price: 0, condition: "new", description: "Wireless earbuds with smart touch-screen display on the charging case." },  // INV-021
  { name: "Maxpower 15\" Dual-Woofer", brand: "Various", category: "Speakers", price: 0, condition: "new", description: "10,000W Peak power, dual woofer party speaker with TWS and Mic support." },  // INV-024
  { name: "Maxpower LED Tripod Speaker", brand: "Various", category: "Speakers", price: 0, condition: "new", description: "Active rainbow LED light ring speaker with EQ mixer panel and tripod stand." },  // INV-025
  { name: "Maxpower Octagonal Speaker", brand: "Various", category: "Speakers", price: 0, condition: "new", description: "Heavy-duty, single-woofer portable party speaker with octagonal housing." },  // INV-026
  { name: "Openear Duo Headphones", brand: "Various", category: "Headphones", price: 0, condition: "new", description: "Bone/Air conduction wireless sports headphones." },  // INV-020
  { name: "Premium Over-Ear Headphones", brand: "Various", category: "Headphones", price: 0, condition: "new", description: "High-end over-ear headphones featuring a sleek mesh canopy design." },  // INV-023
  { name: "Sleep TWS Headset", brand: "Various", category: "Bluetooth", price: 0, condition: "new", description: "Ultra-comfortable, low-profile earbuds optimized for sleeping." },  // INV-022
  { name: "Sport Pro SY-BT85 Neckband", brand: "Various", category: "Bluetooth", price: 0, condition: "new", description: "Premium on-the-neck sports headset with BT 5.3 interface." },  // INV-031
  { name: "i9S-TWS Wireless Earbuds", brand: "Various", category: "Bluetooth", price: 0, condition: "new", description: "Classic compact white wireless charging earbuds." },  // INV-032
  { name: "22.5W Quick Charge Power Bank", brand: "Various", category: "Chargers", price: 0, condition: "new", description: "Portable high-capacity power bank with a digital power level display." },  // INV-040
  { name: "Cyberdock 3-in-1 Charger", brand: "Various", category: "Chargers", price: 0, condition: "new", description: "Magnetic wireless charging dock for phone, watch, and earbuds simultaneously." },  // INV-041
  { name: "MusicTuner FM Transmitter", brand: "Various", category: "Chargers", price: 0, condition: "new", description: "Bluetooth car FM transmitter and quick charger." },  // INV-038
  { name: "Vlog Screen Ultra (RK-X40B)", brand: "Various", category: "Phone Accessories", price: 0, condition: "new", description: "7-in-1 wireless screen-sharing and Bluetooth selfie tripod kit." },  // INV-039
  { name: "Pink Dior Monogram Case", brand: "Various", category: "Cases", price: 0, condition: "new", description: "Pink & white oblique monogram print with 'CD' logo for iPhone 17 Pro Max." },  // INV-011
  { name: "Chanel-Inspired Pink Pearl Case", brand: "Various", category: "Cases", price: 0, condition: "new", description: "Pink rhinestone bed, large pearl flower emblem, pearl 'Chanel' script for iPhone 17 Pro Max." },  // INV-004
  { name: "Pink Rose & Pearl Flower Case", brand: "Various", category: "Cases", price: 0, condition: "new", description: "Pink crystals, peach roses, and a stunning pearl-bow centerpiece for iPhone 16 Pro/Max." },  // INV-003
  { name: "Purple Rhinestone Bow Case", brand: "Various", category: "Cases", price: 0, condition: "new", description: "Crystal-studded case with gold bows & pearl accent for iPhone 17 Pro Max." },  // INV-001
  { name: "SafePlug 3D Floral Case", brand: "Various", category: "Cases", price: 0, condition: "new", description: "3D pearlescent flowers, gold roses & crystals for iPhone 16 Pro Max." },  // INV-002
  { name: "SafePlug Black Cameo Case", brand: "Various", category: "Cases", price: 0, condition: "new", description: "Silver rhinestones, gold-trimmed black rose cameo, and square pearl for iPhone 17 Pro Max." },  // INV-005
  { name: "Spring Meadow Bejeweled Case", brand: "Various", category: "Cases", price: 0, condition: "new", description: "Clear rhinestones, 3D blue flower, white daisy, and gold butterfly for iPhone 17 Pro Max." },  // INV-006
  { name: "3D Sneakerhead Pink Nike Case", brand: "Various", category: "Cases", price: 0, condition: "new", description: "3D pink high-top sneaker and raised blue Nike lettering for iPhone 12/13 Pro Max." },  // INV-010
  { name: "Pink Stitch Cartoon Case", brand: "Various", category: "Cases", price: 0, condition: "new", description: "Pink silicone case with a 3D Stitch character for iPhone 17 Pro Max." },  // INV-009
  { name: "Pre-Owned MacBook Laptop", brand: "Apple", category: "Laptops", price: 0, condition: "used", description: "Space Gray sleek laptop with a braided USB-C cable." },  // INV-018
  { name: "Pre-Owned iPad", brand: "Apple", category: "iPad", price: 0, condition: "used", description: "Classic tablet with white bezel and gold/silver back." },  // INV-017
  { name: "Pre-Owned iPhone (Purple)", brand: "Apple", category: "Phones", price: 0, condition: "used", description: "Pastel Purple dual-camera iPhone in excellent condition." },  // INV-015
  { name: "Pre-Owned iPhone 11 Pro", brand: "Apple", category: "Phones", price: 0, condition: "used", description: "Midnight Green triple-camera premium iPhone in excellent condition." },  // INV-016
  { name: "Heavy-Duty Bumper Cases", brand: "Various", category: "Cases", price: 0, condition: "new", description: "Tough dual-layer cases in Red or Camo for iPhone 17 Pro Max." },  // INV-007
  { name: "Sport Rugged Contrast-Bezel", brand: "Various", category: "Cases", price: 0, condition: "new", description: "Dual-tone drop protection: Mint/Pink or Pink/White for iPhone 17 Pro." },  // INV-008
  { name: "Streetwear Companion Red Case", brand: "Various", category: "Cases", price: 0, condition: "new", description: "3D streetwear companion figure design for iPhone 17 Pro Max." },  // INV-012
  { name: "360° Rotatable Handle Case", brand: "Various", category: "iPad", price: 0, condition: "new", description: "Purple/Green heavy-duty protective case with a rotatable hand grip for iPad 10.2\"." },  // INV-043
  { name: "Premium Tab Armor Case", brand: "Various", category: "Tablet", price: 0, condition: "new", description: "Tactical shockproof casing designed for Galaxy Tab models (A9 Plus, etc.)." },  // INV-045
  { name: "Pro-Series Rugged iPad Case", brand: "Apple", category: "iPad", price: 0, condition: "new", description: "Armored case with heavy-duty hand strap and built-in pencil holder (iPad Pro 12.9\")." },  // INV-044
  { name: "Spider-Man iPad Case", brand: "Apple", category: "iPad", price: 0, condition: "new", description: "Blue & Red kid-proof protective silicone case with dual kickstands (for iPad 10.2\"/10.9\")." },  // INV-042
  { name: "Gesture Twist Stunt Car", brand: "Various", category: "Toys & Gadgets", price: 0, condition: "new", description: "Hand-gesture control wearable stunt car with lighting and music (Pink/Blue)." },  // INV-034
  { name: "Tank Armor 4x4 RC Car", brand: "Various", category: "Toys & Gadgets", price: 0, condition: "new", description: "Chameleon/rainbow metallic stunt RC car with multi-directional drift tires." },  // INV-033
  { name: "Midnight Blue Cardholder Case", brand: "Various", category: "Cases", price: 0, condition: "new", description: "Navy leatherette backing with integrated card slot for iPhone 16 Plus." },  // INV-014
  { name: "Vintage Brown Wallet Case", brand: "Various", category: "Cases", price: 0, condition: "new", description: "Tan brown leatherette folio with front card slot for iPhone 16 Pro." },  // INV-013
  { name: "H30 7-in-1 Smartwatch Set", brand: "Various", category: "Phone Accessories", price: 0, condition: "new", description: "Apple Watch Ultra style smartwatch, wireless earbuds, and 7 interchangeable straps." },  // INV-035
  { name: "Luxury Smartwatch Gift Set", brand: "Various", category: "Phone Accessories", price: 0, condition: "new", description: "Rectangular smartwatch case complete with premium metal and leather straps." },  // INV-036
  { name: "Smart Video Calling Camera", brand: "Various", category: "Phone Accessories", price: 0, condition: "new", description: "Two-way video calling camera for real-time home monitoring and connection." },  // INV-037
];

async function seed() {
  await connectDB();

  const summary = {
    categories: { created: 0, skipped: 0 },
    brands: { created: 0, skipped: 0 },
    products: { created: 0, skipped: 0 },
  };

  // --- Categories (skip existing by name) ---
  const categoryIds = {};
  for (const name of CATEGORY_NAMES) {
    let doc = await Category.findOne({ name });
    if (doc) {
      summary.categories.skipped++;
    } else {
      doc = await new Category({ name }).save();
      summary.categories.created++;
    }
    categoryIds[name] = doc._id;
  }

  // --- Brands (skip existing by name) ---
  const brandIds = {};
  for (const name of BRAND_NAMES) {
    let doc = await Brand.findOne({ name });
    if (doc) {
      summary.brands.skipped++;
    } else {
      doc = await new Brand({ name }).save();
      summary.brands.created++;
    }
    brandIds[name] = doc._id;
  }

  // --- Products (skip existing by name) ---
  for (const p of PRODUCTS) {
    const exists = await Product.findOne({ name: p.name });
    if (exists) {
      summary.products.skipped++;
      continue;
    }
    await new Product({
      name: p.name,
      description: p.description,
      price: p.price,
      category: categoryIds[p.category],
      brand: brandIds[p.brand],
      condition: p.condition,
      stock: stock(),
      images: [], // no Cloudinary uploads yet — frontend falls back to a device icon
      isFeatured: p.isFeatured || false,
    }).save();
    summary.products.created++;
  }

  console.log('\n===== Seed complete =====');
  console.log(`Categories: ${summary.categories.created} created, ${summary.categories.skipped} skipped`);
  console.log(`Brands:     ${summary.brands.created} created, ${summary.brands.skipped} skipped`);
  console.log(`Products:   ${summary.products.created} created, ${summary.products.skipped} skipped`);

  await mongoose.disconnect();
  console.log('Disconnected.');
}

seed().catch(async (err) => {
  console.error('Seed failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
