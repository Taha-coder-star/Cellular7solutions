const WIDTHS = [640, 960, 1280, 1600, 1920];

// Unsplash serves any width via the `w` query param — swap it in per
// candidate size instead of shipping one fixed-width image to every viewport.
export function unsplashSrcSet(url) {
  const base = url.split('?')[0];
  return WIDTHS.map((w) => `${base}?auto=format&fit=crop&w=${w}&q=80 ${w}w`).join(', ');
}

const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/;
const CLOUDINARY_WIDTHS = [400, 600, 800, 1200];

// Cloudinary serves any transform via path segments right after `/upload/` —
// inject format/quality auto-negotiation and a target width instead of
// shipping the original upload (often several MB) at every display size.
export function cloudinaryUrl(url, width) {
  const match = url.match(CLOUDINARY_UPLOAD);
  if (!match) return url;
  const [, base, rest] = match;
  return `${base}f_auto,q_auto,w_${width}/${rest}`;
}

function cloudinarySrcSet(url) {
  const match = url.match(CLOUDINARY_UPLOAD);
  if (!match) return null;
  return CLOUDINARY_WIDTHS.map((w) => `${cloudinaryUrl(url, w)} ${w}w`).join(', ');
}

// Dispatches by provider so product images (a mix of Cloudinary uploads and
// Unsplash placeholders) both get a real srcset instead of one fixed image.
export function productImageSrcSet(url) {
  if (!url) return undefined;
  if (url.includes('res.cloudinary.com')) return cloudinarySrcSet(url) ?? undefined;
  if (url.includes('images.unsplash.com')) return unsplashSrcSet(url);
  return undefined;
}

// Reasonable-width fallback for the plain `src` attribute (browsers/crawlers
// that ignore srcset still get a sanely-sized image, not the raw original).
export function productImageSrc(url, width) {
  if (!url) return url;
  if (url.includes('res.cloudinary.com')) return cloudinaryUrl(url, width);
  return url;
}
