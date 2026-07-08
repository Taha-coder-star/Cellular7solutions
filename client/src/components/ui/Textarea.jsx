import { useState } from 'react';

/** Labelled multiline input matching Input's 12px radius and orange focus ring. */
export function Textarea({ label, hint, error, id, rows = 4, style = {}, ...rest }) {
  const [focus, setFocus] = useState(false);
  const areaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-sans)' }}>
      {label && (
        <label htmlFor={areaId} style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--text-strong)' }}>
          {label}
        </label>
      )}
      <textarea
        id={areaId}
        rows={rows}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: '100%',
          padding: '12px 14px',
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
          resize: 'vertical',
          lineHeight: 'var(--lh-normal)',
          ...style,
        }}
        {...rest}
      />
      {(hint || error) && (
        <span style={{ fontSize: 'var(--fs-xs)', color: error ? 'var(--danger-500)' : 'var(--text-muted)' }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
