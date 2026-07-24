export const usd = (n) =>
  '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// "Various" is a catch-all seed value for products with no specific brand —
// it reads as a real brand name (VARIOUS) if rendered, so treat it like no brand at all.
export const normalizeBrandName = (name) =>
  name?.trim().toLowerCase() === 'various' ? '' : (name ?? '');
