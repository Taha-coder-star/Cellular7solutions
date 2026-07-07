export function Logo({ variant = 'full', tone = 'light', height, style = {}, ...rest }) {
  const files = {
    full: { light: 'cs-logo-full.svg', dark: 'cs-logo-full-dark.svg' },
    icon: { light: 'cs-icon.svg',      dark: 'cs-icon-white.svg' },
  };
  const file = (files[variant] || files.full)[tone] || files.full.light;
  const h = height || (variant === 'icon' ? 40 : 44);

  return (
    <img
      src={`/assets/${file}`}
      alt="Cellular Solutions"
      style={{ height: h, width: 'auto', display: 'block', ...style }}
      {...rest}
    />
  );
}
