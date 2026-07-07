import React from 'react';

/** Labelled text input with the brand's 12px radius and orange focus ring. */
export function Input({
  label,
  hint,
  error,
  id,
  type = 'text',
  icon = null,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-sans)' }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--text-strong)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <span style={{ position: 'absolute', left: '14px', display: 'inline-flex', color: 'var(--text-muted)', pointerEvents: 'none' }}>
            {icon}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            width: '100%',
            height: 'var(--control-h)',
            padding: icon ? '0 14px 0 42px' : '0 14px',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-body)',
            color: 'var(--text-strong)',
            background: 'var(--white)',
            border: `1px solid ${error ? 'var(--danger-500)' : focus ? 'var(--orange-600)' : 'var(--border-strong)'}`,
            borderRadius: 'var(--radius-input)',
            outline: 'none',
            boxShadow: focus ? '0 0 0 3px rgba(234, 88, 12, 0.15)' : 'none',
            transition: 'var(--transition-base)',
            boxSizing: 'border-box',
            ...style,
          }}
          {...rest}
        />
      </div>
      {(hint || error) && (
        <span style={{ fontSize: 'var(--fs-xs)', color: error ? 'var(--danger-500)' : 'var(--text-muted)' }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
