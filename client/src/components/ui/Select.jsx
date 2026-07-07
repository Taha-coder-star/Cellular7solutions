export function Select({ label, hint, id, options = [], style = {}, children, ...rest }) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-sans)' }}>
      {label && (
        <label htmlFor={selectId} style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--text-strong)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <select
          id={selectId}
          style={{
            width: '100%',
            height: 'var(--control-h)',
            padding: '0 40px 0 14px',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-body)',
            color: 'var(--text-strong)',
            background: 'var(--white)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-input)',
            outline: 'none',
            appearance: 'none',
            cursor: 'pointer',
            boxSizing: 'border-box',
            ...style,
          }}
          {...rest}
        >
          {children || options.map((o) => {
            const val = typeof o === 'string' ? o : o.value;
            const lbl = typeof o === 'string' ? o : o.label;
            return <option key={val} value={val}>{lbl}</option>;
          })}
        </select>
        <span style={{ position: 'absolute', right: '14px', pointerEvents: 'none', color: 'var(--text-muted)', fontSize: '12px' }}>▾</span>
      </div>
      {hint && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>{hint}</span>}
    </div>
  );
}
