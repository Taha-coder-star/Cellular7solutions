import { useState } from 'react';

export function Input({ label, hint, error, id, type = 'text', icon = null, rightElement = null, style = {}, ...rest }) {
  const [focus, setFocus] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const hintId = (hint || error) && inputId ? `${inputId}-hint` : undefined;

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
          aria-invalid={error ? true : undefined}
          aria-describedby={hintId}
          style={{
            width: '100%',
            height: 'var(--control-h)',
            paddingLeft: icon ? '42px' : '14px',
            paddingRight: rightElement ? '44px' : '14px',
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
        {rightElement && (
          <span style={{ position: 'absolute', right: '12px', display: 'inline-flex' }}>
            {rightElement}
          </span>
        )}
      </div>
      {(hint || error) && (
        <span id={hintId} style={{ fontSize: 'var(--fs-xs)', color: error ? 'var(--danger-500)' : 'var(--text-muted)' }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
