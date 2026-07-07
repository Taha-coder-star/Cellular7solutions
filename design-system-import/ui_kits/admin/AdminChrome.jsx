const { useState } = React;
const { Logo, Icon, Badge, StatusBadge, Button, Card } = window.CellularSolutionsDesignSystem_a109cf;

const MENU = [
  ['overview', 'layout-dashboard', 'Overview'],
  ['orders', 'shopping-bag', 'Orders'],
  ['products', 'package', 'Products'],
  ['requests', 'wrench', 'Service Requests'],
  ['customers', 'users', 'Customers'],
];

function Sidebar({ route, onNav }) {
  return (
    <aside style={{ width: 248, flexShrink: 0, background: 'var(--graphite-900)', color: 'var(--graphite-300)', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0 }}>
      <div style={{ padding: '22px 20px', borderBottom: '1px solid var(--graphite-700)' }}>
        <Logo variant="full" tone="dark" basePath="../../assets" height={32} />
      </div>
      <nav style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {MENU.map(([k, ic, l]) => (
          <button key={k} onClick={() => onNav(k)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 'var(--radius-btn)', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', fontWeight: 600, color: route === k ? 'var(--white)' : 'var(--graphite-400)', background: route === k ? 'var(--graphite-800)' : 'transparent' }}>
            <Icon name={ic} size={18} color={route === k ? 'var(--orange-500)' : 'var(--graphite-500)'} /> {l}
          </button>
        ))}
      </nav>
      <div style={{ padding: 16, borderTop: '1px solid var(--graphite-700)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 34, height: 34, borderRadius: 'var(--radius-pill)', background: 'var(--graphite-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>TA</span>
        <div style={{ fontSize: 'var(--fs-sm)' }}><div style={{ color: '#fff', fontWeight: 600 }}>Taha A.</div><div style={{ fontSize: 11, color: 'var(--graphite-500)' }}>Store Admin</div></div>
      </div>
    </aside>
  );
}

function Topbar({ title }) {
  return (
    <div style={{ height: 68, borderBottom: '1px solid var(--border-subtle)', background: '#fff', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 16, position: 'sticky', top: 0, zIndex: 10 }}>
      <h1 style={{ fontSize: 'var(--fs-h3)', fontWeight: 700, letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)', margin: 0, flex: 1 }}>{title}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 240, height: 40, background: 'var(--graphite-100)', borderRadius: 'var(--radius-pill)', padding: '0 14px', color: 'var(--text-muted)' }}>
        <Icon name="search" size={16} /><span style={{ fontSize: 'var(--fs-sm)' }}>Search…</span>
      </div>
      <button style={{ background: 'none', border: '1px solid var(--border-subtle)', width: 40, height: 40, borderRadius: 'var(--radius-btn)', cursor: 'pointer', color: 'var(--text-body)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="bell" size={18} /></button>
    </div>
  );
}

Object.assign(window, { Sidebar, Topbar });
