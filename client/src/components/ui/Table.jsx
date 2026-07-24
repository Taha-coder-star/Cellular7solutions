export const tdStyle = { padding: '12px 16px', verticalAlign: 'middle' };
export const trStyle = { borderBottom: '1px solid var(--border-subtle)' };

export function Table({ headers, children }) {
  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', background: 'var(--surface-card)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)' }}>
        <thead>
          <tr style={trStyle}>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  color: 'var(--text-muted)',
                  fontWeight: 'var(--fw-semibold)',
                  fontSize: 'var(--fs-xs)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--ls-wide)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
