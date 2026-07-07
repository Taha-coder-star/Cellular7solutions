const { useState } = React;
const { Icon, Badge, StatusBadge, Button, Card, Select } = window.CellularSolutionsDesignSystem_a109cf;

const ALL = [
  ['#RQ-308', 'Jordan Rivera', 'iPhone 14', 'Screen Replacement', 'repair', '$89', 'in-progress'],
  ['#RQ-307', 'Amara Okafor', 'Pixel 8', 'Battery Replacement', 'repair', '$49', 'pending'],
  ['#RQ-306', 'Liam Chen', 'AT&T iPhone 13', 'Carrier Unlock', 'unlock', '$25', 'confirmed'],
  ['#RQ-305', 'Sofia Martins', 'Xbox Series X', 'HDMI Port Repair', 'repair', '$69', 'completed'],
  ['#RQ-304', 'Noah Patel', 'MacBook Pro', 'Keyboard Repair', 'repair', '$99', 'rejected'],
  ['#RQ-303', 'Mia Rossi', 'Galaxy S22', 'Sell Device', 'buysell', '$220', 'confirmed'],
];
const TABS = [['all', 'All'], ['repair', 'Repairs'], ['unlock', 'Unlocks'], ['buysell', 'Buy / Sell']];

function TypeTag({ t }) {
  const map = { repair: ['orange', 'Repair'], unlock: ['dark', 'Unlock'], buysell: ['neutral', 'Buy/Sell'] };
  const [tone, label] = map[t] || map.repair;
  return <Badge tone={tone}>{label}</Badge>;
}

function ServiceRequests() {
  const [tab, setTab] = useState('all');
  const rows = ALL.filter(r => tab === 'all' || r[4] === tab);
  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 4, background: 'var(--graphite-100)', padding: 4, borderRadius: 'var(--radius-btn)' }}>
          {TABS.map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', fontWeight: 600, color: tab === k ? 'var(--text-strong)' : 'var(--text-muted)', background: tab === k ? '#fff' : 'transparent', boxShadow: tab === k ? 'var(--shadow-sm)' : 'none' }}>{l}</button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ width: 180 }}><Select options={['All statuses', 'Pending', 'In Progress', 'Completed']} /></div>
        <Button variant="service" iconLeft={<Icon name="plus" size={16} />}>New Request</Button>
      </div>
      <Card padding="0">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Request', 'Customer', 'Device', 'Service', 'Type', 'Est.', 'Status', ''].map((h, i) => <th key={i} style={{ textAlign: i === 5 ? 'right' : 'left', padding: '13px 20px', fontSize: 'var(--fs-xs)', fontWeight: 600, letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-faint)', borderBottom: '1px solid var(--border-subtle)' }}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r[0]}>
                <td style={{ padding: '15px 20px', fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text-strong)', borderBottom: '1px solid var(--border-subtle)' }}>{r[0]}</td>
                <td style={{ padding: '15px 20px', fontSize: 'var(--fs-sm)', color: 'var(--text-body)', borderBottom: '1px solid var(--border-subtle)' }}>{r[1]}</td>
                <td style={{ padding: '15px 20px', fontSize: 'var(--fs-sm)', color: 'var(--text-body)', borderBottom: '1px solid var(--border-subtle)' }}>{r[2]}</td>
                <td style={{ padding: '15px 20px', fontSize: 'var(--fs-sm)', color: 'var(--text-body)', borderBottom: '1px solid var(--border-subtle)' }}>{r[3]}</td>
                <td style={{ padding: '15px 20px', borderBottom: '1px solid var(--border-subtle)' }}><TypeTag t={r[4]} /></td>
                <td style={{ padding: '15px 20px', fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text-strong)', textAlign: 'right', borderBottom: '1px solid var(--border-subtle)' }}>{r[5]}</td>
                <td style={{ padding: '15px 20px', borderBottom: '1px solid var(--border-subtle)' }}><StatusBadge status={r[6]} /></td>
                <td style={{ padding: '15px 20px', borderBottom: '1px solid var(--border-subtle)' }}><button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', display: 'flex' }}><Icon name="more-horizontal" size={18} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

Object.assign(window, { ServiceRequests });
