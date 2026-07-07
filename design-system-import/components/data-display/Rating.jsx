import React from 'react';

/** Star rating display. Renders 5 stars with fractional fill via clip. */
export function Rating({ value = 0, count, size = 16, showValue = false, style = {} }) {
  const stars = [1, 2, 3, 4, 5];
  const Star = ({ fill }) => (
    <span style={{ position: 'relative', display: 'inline-block', width: size, height: size, lineHeight: 0 }}>
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: 'absolute', inset: 0 }}>
        <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.6 5.9 20.4l1.5-6.8L2.2 9l6.9-.7z" fill="var(--graphite-200)" />
      </svg>
      <span style={{ position: 'absolute', inset: 0, width: `${fill * 100}%`, overflow: 'hidden' }}>
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.6 5.9 20.4l1.5-6.8L2.2 9l6.9-.7z" fill="var(--orange-500)" />
        </svg>
      </span>
    </span>
  );
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-sans)', ...style }}>
      <span style={{ display: 'inline-flex', gap: '2px' }}>
        {stars.map((s) => <Star key={s} fill={Math.max(0, Math.min(1, value - (s - 1)))} />)}
      </span>
      {showValue && <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{value.toFixed(1)}</span>}
      {count != null && <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>({count})</span>}
    </span>
  );
}
