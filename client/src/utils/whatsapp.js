export const WHATSAPP_NUMBER = '12565159620';

export function whatsappMessageLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function whatsappLink(product) {
  const lines = [`Hi, I'm interested in: ${product?.name ?? 'this product'}`];
  // brand is a string on Shop's normalized product, a populated object elsewhere
  const brandName = typeof product?.brand === 'string' ? product.brand : product?.brand?.name;
  if (brandName) lines.push(`Brand: ${brandName}`);
  if (product?.image) lines.push(product.image);
  return whatsappMessageLink(lines.join('\n\n'));
}

export function repairWhatsappLink({ deviceType, brandModel, issue, name }) {
  const deviceLabels = {
    Phone: 'Phone',
    Laptop: 'Laptop',
    'Game Console': 'Gaming console',
    Other: 'Other electronics',
  };
  const lines = [
    'Hi Cellular Solutions, I would like to request a repair.',
    '',
    `Device type: ${deviceLabels[deviceType] || deviceType}`,
  ];
  if (brandModel?.trim()) lines.push(`Brand and model: ${brandModel.trim()}`);
  lines.push('Problem:', issue.trim());
  if (name?.trim()) lines.push('', `Name: ${name.trim()}`);
  return whatsappMessageLink(lines.join('\n'));
}
