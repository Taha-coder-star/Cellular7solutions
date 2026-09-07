// "By Category" is an explicitly cross-cutting browse view, not a DB hierarchy —
// links point at existing category paths already created by the tree migration.
export const BY_CATEGORY_LINKS = [
  { label: 'Cases', path: '/categories/cases' },
  { label: 'Parts', path: '/categories/apple-parts' },
  { label: 'Accessories', path: '/categories/accessories' },
  { label: 'Chargers & Cables', path: '/categories/accessories/chargers' },
  { label: 'Audio', path: '/categories/accessories/audio' },
  { label: 'Repair Tools', path: '/categories/repair-tools' },
  { label: 'Screen Protectors', path: '/categories/accessories/screen-protectors' },
  { label: 'Power', path: '/categories/accessories/power-banks' },
  { label: 'Car Accessories', path: '/categories/accessories/car-accessories' },
  { label: 'Other Accessories', path: '/categories/accessories/other' },
];
