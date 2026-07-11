import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';

/** Full-bleed hero CTA pill — shared by every dark photographic hero so all
 *  of them read as one interaction language, recolored per section accent. */
export function HeroPill({ to, children, textColor = 'var(--graphite-900)' }) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const active = focused || hovered;
  const release = () => setPressed(false);

  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); release(); }}
      onFocus={() => setFocused(true)}
      onBlur={() => { setFocused(false); release(); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={release}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={release}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        height: '54px',
        padding: '0 32px',
        borderRadius: 'var(--radius-pill)',
        fontWeight: 'var(--fw-semibold)',
        fontSize: 'var(--fs-body)',
        textDecoration: 'none',
        background: active ? 'var(--graphite-100)' : 'var(--white)',
        color: textColor,
        transition: 'var(--transition-base)',
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
        outline: focused ? `2px solid ${textColor}` : 'none',
        outlineOffset: focused ? '3px' : '0',
        boxShadow: focused ? '0 0 0 5px rgba(255,255,255,0.5)' : 'none',
      }}
    >
      {children}
      <Icon
        name="arrow-right"
        size={18}
        aria-hidden="true"
        style={{ transition: 'var(--transition-base)', transform: active ? 'translateX(3px)' : 'translateX(0)' }}
      />
    </Link>
  );
}
