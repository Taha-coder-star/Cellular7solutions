import { useState } from 'react';

export function Card({ padding = 'var(--pad-card)', hover = false, dark = false, onClick, style = {}, children, ...rest }) {
  const [h, setH] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: dark ? 'var(--surface-dark)' : 'var(--surface-card)',
        color: dark ? 'var(--text-on-dark)' : 'inherit',
        border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-card)',
        boxShadow: hover && h ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
        padding,
        transition: 'var(--transition-base)',
        transform: hover && h ? 'translateY(-2px)' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
