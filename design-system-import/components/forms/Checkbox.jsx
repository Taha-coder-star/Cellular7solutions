import React from 'react';

/** Checkbox with label. Checked state uses graphite fill. */
export function Checkbox({ label, checked, defaultChecked, onChange, disabled = false, id, style = {} }) {
  const boxId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <label
      htmlFor={boxId}
      style={{
        display: 'inline-flex',
        alignItems: 'flex-start',
        gap: '10px',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--fs-sm)',
        color: 'var(--text-body)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        lineHeight: 'var(--lh-snug)',
        ...style,
      }}
    >
      <input
        id={boxId}
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        disabled={disabled}
        style={{
          appearance: 'none',
          width: '20px',
          height: '20px',
          flexShrink: 0,
          marginTop: '1px',
          border: '1px solid var(--border-strong)',
          borderRadius: '6px',
          background: (checked ?? defaultChecked) ? 'var(--graphite-900)' : 'var(--white)',
          backgroundImage: (checked ?? defaultChecked)
            ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E\")"
            : 'none',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          borderColor: (checked ?? defaultChecked) ? 'var(--graphite-900)' : 'var(--border-strong)',
          cursor: 'inherit',
          transition: 'var(--transition-base)',
        }}
      />
      {label && <span>{label}</span>}
    </label>
  );
}
