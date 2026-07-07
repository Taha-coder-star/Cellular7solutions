const { useState } = React;
const { Icon, Badge, StatusBadge, Button, Card } = window.CellularSolutionsDesignSystem_a109cf;

const STATS = [
  ['Revenue (30d)', '$48,230', '+12.4%', 'up', 'dollar-sign', 'var(--graphite-900)'],
  ['Orders', '312', '+8.1%', 'up', 'shopping-bag', 'var(--graphite-900)'],
  ['Open Repairs', '27', '+5', 'up', 'wrench', 'var(--orange-600)'],
  ['Low Stock', '6', '−2', 'down', 'alert-triangle', 'var(--warning-500)'],
];
const ORDERS = [
  ['#CS-1042', 'Jordan Rivera', 'iPhone 15 Pro', '$999.00', 'processing'],
  ['#CS-1041', 'Amara Okafor', 'AirPods Pro 2', '$249.00', 'shipped'],
  ['#CS-1040', 'Liam Chen', 'MacBook Air M3', '$1,099.00', 'delivered'],
  ['#CS-1039', 'Sofia Martins', 'Galaxy S24 Ultra', '$1,199.00', 'pending'],
  ['#CS-1038', 'Noah Patel', 'iPad Air', '$599.00', 'cancelled'],
];
const REQS = [
  ['iPhone 14', 'Screen Replacement', 'in-progress'],
  ['Pixel 8', 'Battery', 'pending'],
  ['Xbox Series X', 'HDMI Port', 'completed'],
];

function StatCard({ label, value, delta, dir, icon, tint }) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
        <span style={{ width: 36, height: 36, borderRadius: 'var(--radius-btn)', background: 'var(--graphite-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size={18} color={tint} /></span>
      </div>
      <div style={{ fontSize: 'var(--fs-h2)', fontWeight: 800, letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)', margin: '14px 0 6px' }}>{value}</div>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 'var(--fs-sm)', fontWeight: 600, color: dir === 'up' ? 'var(--success-500)' : 'var(--warning-500)' }}>
        <Icon name={dir === 'up' ? 'trending-up' : 'trending-down'} size={14} /> {delta}
      </span>
    </Card>
  );
}

function AdminOverview() {
  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--gap-grid)' }}>
        {STATS.map(s => <StatCard key={s[0]} label={s[0]} value={s[1]} delta={s[2]} dir={s[3]} icon={s[4]} tint={s[5]} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 'var(--gap-grid)', alignItems: 'start' }}>
        <Card padding="0">
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--fs-h4)', fontWeight: 700, color: 'var(--text-strong)' }}>Recent Orders</span>
            <Button variant="ghost" size="sm" iconRight={<Icon name="arrow-right" size={14} />}>View all</Button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>{['Order', 'Customer', 'Item', 'Total', 'Status'].map(h => <th key={h} style={{ textAlign: h === 'Total' ? 'right' : 'left', padding: '12px 22px', fontSize: 'var(--fs-xs)', fontWeight: 600, letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-faint)', borderBottom: '1px solid var(--border-subtle)' }}>{h}</th>)}</tr></thead>
            <tbody>
              {ORDERS.map(o => (
                <tr key={o[0]}>
                  <td style={{ padding: '14px 22px', fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text-strong)', borderBottom: '1px solid var(--border-subtle)' }}>{o[0]}</td>
                  <td style={{ padding: '14px 22px', fontSize: 'var(--fs-sm)', color: 'var(--text-body)', borderBottom: '1px solid var(--border-subtle)' }}>{o[1]}</td>
                  <td style={{ padding: '14px 22px', fontSize: 'var(--fs-sm)', color: 'var(--text-body)', borderBottom: '1px solid var(--border-subtle)' }}>{o[2]}</td>
                  <td style={{ padding: '14px 22px', fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text-strong)', textAlign: 'right', borderBottom: '1px solid var(--border-subtle)' }}>{o[3]}</td>
                  <td style={{ padding: '14px 22px', borderBottom: '1px solid var(--border-subtle)' }}><StatusBadge status={o[4]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card padding="0">
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 'var(--fs-h4)', fontWeight: 700, color: 'var(--text-strong)' }}>Open Repairs</span>
          </div>
          <div style={{ padding: 12, display: 'flex', flexDirection: 'column' }}>
            {REQS.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 10px' }}>
                <span style={{ width: 38, height: 38, borderRadius: 'var(--radius-btn)', background: 'var(--orange-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="wrench" size={18} color="var(--orange-600)" /></span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text-strong)' }}>{r[0]}</div>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>{r[1]}</div>
                </div>
                <StatusBadge status={r[2]} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { AdminOverview });
