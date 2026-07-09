export function StatusBadge({ status, style = {} }) {
  const map = {
    pending:       { fg: 'var(--warning-500)', bg: 'var(--warning-50)', label: 'Pending' },
    processing:    { fg: 'var(--info-500)',    bg: 'var(--info-50)',    label: 'Processing' },
    confirmed:     { fg: 'var(--info-500)',    bg: 'var(--info-50)',    label: 'Confirmed' },
    'in-progress': { fg: 'var(--cobalt-700)',  bg: 'var(--cobalt-50)',  label: 'In Progress' },
    shipped:       { fg: 'var(--info-500)',    bg: 'var(--info-50)',    label: 'Shipped' },
    delivered:     { fg: 'var(--success-500)', bg: 'var(--success-50)', label: 'Delivered' },
    completed:     { fg: 'var(--success-500)', bg: 'var(--success-50)', label: 'Completed' },
    paid:          { fg: 'var(--success-500)', bg: 'var(--success-50)', label: 'Paid' },
    cancelled:     { fg: 'var(--danger-500)',  bg: 'var(--danger-50)',  label: 'Cancelled' },
    rejected:      { fg: 'var(--danger-500)',  bg: 'var(--danger-50)',  label: 'Rejected' },
  };
  const s = map[status] || map.pending;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        height: '24px',
        padding: '0 10px',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--fs-xs)',
        fontWeight: 'var(--fw-semibold)',
        color: s.fg,
        background: s.bg,
        borderRadius: 'var(--radius-pill)',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.fg }} />
      {s.label}
    </span>
  );
}
