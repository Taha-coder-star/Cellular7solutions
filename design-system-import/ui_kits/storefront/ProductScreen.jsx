const { useState } = React;
const { Icon, Button, Badge, Rating } = window.CellularSolutionsDesignSystem_a109cf;

const usd = (n) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function ProductScreen({ product, onAdd, onNav }) {
  const p = product || { name: 'iPhone 15 Pro', brand: 'Apple', price: 999, condition: 'new', rating: 4.8, reviews: 214, stock: 8, icon: 'smartphone' };
  const [qty, setQty] = useState(1);
  const specs = [
    ['Display', '6.1" Super Retina XDR'], ['Chip', 'A17 Pro'], ['Storage', '256 GB'],
    ['Camera', '48MP Main · 3× Tele'], ['Battery', 'Up to 23h video'], ['Warranty', '12-month store warranty'],
  ];
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', marginBottom: 24, cursor: 'pointer' }} onClick={() => onNav('shop')}>
        ← Shop / {p.brand} / {p.name}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
        <div style={{ aspectRatio: '1/1', background: 'var(--graphite-50)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <span style={{ position: 'absolute', top: 16, left: 16 }}><Badge tone={p.condition === 'used' ? 'used' : 'new'}>{p.condition}</Badge></span>
          <Icon name={p.icon || 'smartphone'} size={180} strokeWidth={1} color="var(--graphite-300)" />
        </div>
        <div>
          <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{p.brand}</div>
          <h1 style={{ fontSize: 'var(--fs-h1)', fontWeight: 700, letterSpacing: 'var(--ls-tight)', margin: '8px 0 12px', color: 'var(--text-strong)' }}>{p.name}</h1>
          <Rating value={p.rating || 4.8} count={p.reviews} />
          <div style={{ fontSize: 'var(--fs-display)', fontWeight: 800, letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)', margin: '20px 0 4px' }}>{usd(p.price)}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--fs-sm)', color: p.stock ? 'var(--success-500)' : 'var(--danger-500)', marginBottom: 28 }}>
            <Icon name={p.stock ? 'check-circle' : 'x-circle'} size={16} /> {p.stock ? `In stock · ${p.stock} available` : 'Out of stock'}
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-btn)', height: 48 }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 44, height: 46, border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-body)' }}>−</button>
              <span style={{ width: 32, textAlign: 'center', fontWeight: 600 }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ width: 44, height: 46, border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-body)' }}>+</button>
            </div>
            <Button variant="product" fullWidth disabled={!p.stock} onClick={() => onAdd(p, qty)} iconLeft={<Icon name="shopping-cart" size={18} />} style={{ flex: 1 }}>Add to Cart</Button>
          </div>
          <Button variant="secondary" fullWidth iconLeft={<Icon name="heart" size={18} />}>Add to Wishlist</Button>
          <div style={{ marginTop: 32, borderTop: '1px solid var(--border-subtle)', paddingTop: 24 }}>
            <div style={{ fontSize: 'var(--fs-h4)', fontWeight: 700, color: 'var(--text-strong)', marginBottom: 16 }}>Specifications</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 32px' }}>
              {specs.map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-sm)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span><span style={{ color: 'var(--text-strong)', fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 24, display: 'flex', gap: 16, padding: '16px 18px', background: 'var(--orange-50)', border: '1px solid var(--orange-100)', borderRadius: 'var(--radius-card)' }}>
            <Icon name="wrench" size={22} color="var(--orange-600)" />
            <div>
              <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text-strong)' }}>Cracked screen or battery issue?</div>
              <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-body)' }}>We repair this model in-store. <a href="#" onClick={(e) => { e.preventDefault(); onNav('services'); }} style={{ color: 'var(--orange-700)', fontWeight: 600 }}>Book a repair →</a></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ProductScreen });
