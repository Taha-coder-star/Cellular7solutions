const WHATSAPP_NUMBER = '12564792094';

export function whatsappLink(product) {
  const lines = [`Hi, I'm interested in: ${product?.name ?? 'this product'}`];
  if (product?.description) lines.push(product.description);
  if (product?.image) lines.push(product.image);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n\n'))}`;
}
