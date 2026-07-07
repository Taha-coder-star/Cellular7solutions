const { useState } = React;
const { Logo, Icon, Button } = window.CellularSolutionsDesignSystem_a109cf;

const NAV = [
  { key: 'home', label: 'Home' },
  { key: 'shop', label: 'Shop' },
  { key: 'services', label: 'Repair & Services' },
  { key: 'product', label: 'Sell / Unlock' },
];

function Header({ route, onNav, cartCount = 0 }) {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', height: 72, padding: '0 24px', display: 'flex', alignItems: 'center', gap: 32 }}>
        <button onClick={() => onNav('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <Logo variant="full" basePath="../../assets" height={38} />
        </button>
        <nav style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
          {NAV.map(n => (
            <button key={n.key} onClick={() => onNav(n.key)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 14px', borderRadius: 'var(--radius-btn)',
                fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', fontWeight: 600,
                color: route === n.key ? 'var(--text-strong)' : 'var(--text-muted)',
                background: route === n.key ? 'var(--graphite-100)' : 'transparent' }}>
              {n.label}
            </button>
          ))}
        </nav>
        <div style={{ flex: 1 }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: 220, height: 40, background: 'var(--graphite-100)', borderRadius: 'var(--radius-pill)', padding: '0 14px', gap: 8, color: 'var(--text-muted)' }}>
          <Icon name="search" size={16} />
          <span style={{ fontSize: 'var(--fs-sm)' }}>Search devices…</span>
        </div>
        <button onClick={() => onNav('shop')} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-strong)', display: 'flex' }}>
          <Icon name="shopping-cart" size={22} />
          {cartCount > 0 && (
            <span style={{ position: 'absolute', top: -6, right: -8, minWidth: 18, height: 18, padding: '0 5px', background: 'var(--orange-600)', color: '#fff', borderRadius: 'var(--radius-pill)', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>
          )}
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-strong)', display: 'flex' }}>
          <Icon name="user" size={22} />
        </button>
      </div>
    </header>
  );
}

function Footer() {
  const cols = [
    { h: 'Shop', items: ['Phones', 'Laptops', 'Consoles', 'Accessories'] },
    { h: 'Services', items: ['Book Repair', 'Device Unlock', 'Sell Your Device', 'Track Repair'] },
    { h: 'Company', items: ['About Us', 'Store Locations', 'Warranty', 'Contact'] },
  ];
  return (
    <footer style={{ background: 'var(--graphite-900)', color: 'var(--graphite-300)', marginTop: 64 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px 40px', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40 }}>
        <div>
          <Logo variant="full" tone="dark" basePath="../../assets" height={36} />
          <p style={{ fontSize: 'var(--fs-sm)', lineHeight: 'var(--lh-relaxed)', marginTop: 16, maxWidth: 260 }}>
            Premium devices and expert repair. You break it, we fix it — with genuine parts and a workmanship guarantee.
          </p>
        </div>
        {cols.map(c => (
          <div key={c.h}>
            <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--white)', marginBottom: 14 }}>{c.h}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {c.items.map(i => <li key={i} style={{ fontSize: 'var(--fs-sm)', cursor: 'pointer' }}>{i}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid var(--graphite-700)', padding: '20px 24px', maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-xs)', color: 'var(--graphite-500)' }}>
        <span>© 2026 Cellular Solutions. All rights reserved.</span>
        <span style={{ letterSpacing: 'var(--ls-wider)', textTransform: 'uppercase' }}>You Break It · We Fix It</span>
      </div>
    </footer>
  );
}

Object.assign(window, { Header, Footer, NAV });
