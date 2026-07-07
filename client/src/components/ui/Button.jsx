import { useState } from 'react';

export function Button({
  variant = 'product',
  size = 'md',
  fullWidth = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  type = 'button',
  onClick,
  children,
  style = {},
  ...rest
}) {
  const heights = { sm: 'var(--control-h-sm)', md: 'var(--control-h)', lg: 'var(--control-h-lg)' };
  const pads   = { sm: '0 16px', md: '0 22px', lg: '0 28px' };
  const fonts  = { sm: 'var(--fs-sm)', md: 'var(--fs-body)', lg: 'var(--fs-lg)' };

  const variants = {
    product:   { background: 'var(--brand-primary)', color: 'var(--text-on-brand)', border: '1px solid var(--brand-primary)' },
    service:   { background: 'var(--brand-service)', color: 'var(--text-on-brand)', border: '1px solid var(--brand-service)' },
    secondary: { background: 'var(--white)', color: 'var(--text-strong)', border: '1px solid var(--border-strong)' },
    ghost:     { background: 'transparent', color: 'var(--text-body)', border: '1px solid transparent' },
  };

  const hoverBg = {
    product:   'var(--brand-primary-hover)',
    service:   'var(--brand-service-hover)',
    secondary: 'var(--surface-subtle)',
    ghost:     'var(--surface-subtle)',
  };

  const [hover, setHover] = useState(false);
  const base = variants[variant] || variants.product;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        height: heights[size],
        padding: pads[size],
        width: fullWidth ? '100%' : 'auto',
        fontFamily: 'var(--font-sans)',
        fontSize: fonts[size],
        fontWeight: 'var(--fw-semibold)',
        lineHeight: 1,
        borderRadius: 'var(--radius-btn)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'var(--transition-base)',
        whiteSpace: 'nowrap',
        ...base,
        ...(hover && !disabled
          ? {
              background: hoverBg[variant],
              borderColor: hoverBg[variant] === 'var(--surface-subtle)' ? 'var(--border-strong)' : hoverBg[variant],
            }
          : {}),
        ...style,
      }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
