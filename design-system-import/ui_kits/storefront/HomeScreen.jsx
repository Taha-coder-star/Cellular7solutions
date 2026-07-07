const { Icon, Button, ProductCard, RepairCard, Badge } = window.CellularSolutionsDesignSystem_a109cf;

const FEATURED = [
  { id: 1, name: 'iPhone 15 Pro', brand: 'Apple', price: 999, condition: 'new', rating: 4.8, reviews: 214, stock: 8, icon: 'smartphone' },
  { id: 2, name: 'Galaxy S24 Ultra', brand: 'Samsung', price: 1199, condition: 'new', rating: 4.7, reviews: 168, stock: 5, icon: 'smartphone' },
  { id: 3, name: 'MacBook Air M3', brand: 'Apple', price: 1099, condition: 'new', rating: 4.9, reviews: 92, stock: 4, icon: 'laptop' },
  { id: 4, name: 'iPhone 13', brand: 'Apple', price: 549, condition: 'used', rating: 4.5, reviews: 340, stock: 12, icon: 'smartphone' },
];

const SERVICES = [
  { deviceType: 'iPhone', repairType: 'Screen Replacement', time: '45 min', startingPrice: 89, icon: 'smartphone' },
  { deviceType: 'Any Device', repairType: 'Battery Replacement', time: '30 min', startingPrice: 49, icon: 'battery-charging' },
  { deviceType: 'Carrier', repairType: 'Device Unlock', time: '1–2 days', startingPrice: 25, icon: 'unlock' },
];

function Hero({ onNav }) {
  return (
    <section style={{ background: 'var(--graphite-900)', color: 'var(--white)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 48, alignItems: 'center' }}>
        <div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--fs-xs)', fontWeight: 700, letterSpacing: 'var(--ls-wider)', textTransform: 'uppercase', color: 'var(--orange-500)' }}>
            <Icon name="zap" size={14} color="var(--orange-500)" /> You Break It · We Fix It
          </span>
          <h1 style={{ fontSize: 'var(--fs-display)', fontWeight: 800, letterSpacing: 'var(--ls-tight)', lineHeight: 1.05, margin: '18px 0 0' }}>
            Premium devices.<br/>Expert repair.
          </h1>
          <p style={{ fontSize: 'var(--fs-lg)', color: 'var(--graphite-300)', lineHeight: 'var(--lh-relaxed)', margin: '20px 0 32px', maxWidth: 460 }}>
            Shop the latest phones, laptops and consoles — or book a same-day repair with genuine parts and a workmanship guarantee.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="secondary" onClick={() => onNav('shop')} iconLeft={<Icon name="shopping-cart" size={18} />}>Shop Devices</Button>
            <Button variant="service" onClick={() => onNav('services')} iconLeft={<Icon name="wrench" size={18} />}>Book a Repair</Button>
          </div>
          <div style={{ display: 'flex', gap: 28, marginTop: 40 }}>
            {[['shield-check','Genuine parts'],['clock','Same-day service'],['truck','Free shipping $99+']].map(([ic,t]) => (
              <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--fs-sm)', color: 'var(--graphite-300)' }}>
                <Icon name={ic} size={18} color="var(--orange-500)" /> {t}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 300, height: 300, borderRadius: 'var(--radius-modal)', background: 'linear-gradient(160deg, var(--graphite-800), var(--graphite-900))', border: '1px solid var(--graphite-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="smartphone" size={140} strokeWidth={1} color="var(--orange-500)" />
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, action, onAction }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
      <div>
        {eyebrow && <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--orange-600)', marginBottom: 8 }}>{eyebrow}</div>}
        <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 700, letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)', margin: 0 }}>{title}</h2>
      </div>
      {action && <Button variant="ghost" onClick={onAction} iconRight={<Icon name="arrow-right" size={16} />}>{action}</Button>}
    </div>
  );
}

function HomeScreen({ onNav, onAdd, onOpenProduct }) {
  return (
    <div>
      <Hero onNav={onNav} />
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px 0' }}>
        <SectionHead eyebrow="Shop" title="Featured devices" action="View all" onAction={() => onNav('shop')} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--gap-grid)' }}>
          {FEATURED.map(p => <ProductCard key={p.id} product={p} onAdd={() => onAdd(p)} />)}
        </div>
      </section>
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px 0' }}>
        <SectionHead eyebrow="Repair & Services" title="Book a repair" action="All services" onAction={() => onNav('services')} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gap-grid)' }}>
          {SERVICES.map((s, i) => <RepairCard key={i} repair={s} onBook={() => onNav('services')} />)}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { HomeScreen, FEATURED, SERVICES, SectionHead });
