const WIDTHS = [640, 960, 1280, 1600, 1920];

// Unsplash serves any width via the `w` query param — swap it in per
// candidate size instead of shipping one fixed-width image to every viewport.
export function unsplashSrcSet(url) {
  const base = url.split('?')[0];
  return WIDTHS.map((w) => `${base}?auto=format&fit=crop&w=${w}&q=80 ${w}w`).join(', ');
}
