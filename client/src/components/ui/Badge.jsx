export function Badge({ tone = 'neutral', children, style = {}, ...rest }) {
  const tones = {
    neutral: { bg: 'var(--graphite-100)', fg: 'var(--graphite-700)' },
    dark:    { bg: 'var(--graphite-900)', fg: 'var(--white)' },
    cobalt:  { bg: 'var(--cobalt-50)',    fg: 'var(--cobalt-700)' },
    new:     { bg: 'var(--graphite-900)', fg: 'var(--white)' },
    used:    { bg: 'var(--graphite-100)', fg: 'var(--graphite-600)' },
    outline: { bg: 'transparent',         fg: 'var(--graphite-700)', border: 'var(--border-strong)' },
  };
  const t = tones[tone] || tones.neutral;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        height: '24px',
        padding: '0 10px',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--fs-xs)',
        fontWeight: 'var(--fw-semibold)',
        letterSpacing: 'var(--ls-wide)',
        textTransform: 'uppercase',
        color: t.fg,
        background: t.bg,
        border: t.border ? `1px solid ${t.border}` : '1px solid transparent',
        borderRadius: 'var(--radius-pill)',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
