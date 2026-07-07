import { useCart } from '@/context/CartContext';
import { Button, ProductCard, Icon } from '@/components/ui';
import { Link } from 'react-router-dom';

const FEATURED_PRODUCTS = [
  { _id: '1', name: 'iPhone 15 Pro Max',          brand: 'Apple',   price: 1199, condition: 'new',  rating: 4.9, reviews: 218, icon: 'smartphone' },
  { _id: '2', name: 'Samsung Galaxy S24 Ultra',   brand: 'Samsung', price: 1299, condition: 'new',  rating: 4.7, reviews: 156, icon: 'smartphone' },
  { _id: '3', name: 'MacBook Air M3',             brand: 'Apple',   price: 1099, condition: 'new',  rating: 4.9, reviews: 94,  icon: 'laptop' },
  { _id: '4', name: 'Sony WH-1000XM5',           brand: 'Sony',    price: 349,  condition: 'new',  rating: 4.8, reviews: 312, icon: 'headphones' },
  { _id: '5', name: 'iPad Pro 11"',              brand: 'Apple',   price: 799,  condition: 'new',  rating: 4.8, reviews: 87,  icon: 'tablet-smartphone' },
  { _id: '6', name: 'PlayStation 5',             brand: 'Sony',    price: 449,  condition: 'used', rating: 4.6, reviews: 43,  icon: 'gamepad-2' },
  { _id: '7', name: 'Dell XPS 15',               brand: 'Dell',    price: 1399, condition: 'new',  rating: 4.5, reviews: 29,  icon: 'laptop' },
  { _id: '8', name: 'Samsung 65W USB-C Charger', brand: 'Samsung', price: 49,   condition: 'new',  rating: 4.7, reviews: 521, icon: 'plug' },
];

const REPAIR_FEATURES = [
  { icon: 'clock',         label: 'Same-day turnaround on most repairs' },
  { icon: 'shield-check',  label: 'Free diagnostics — no fix, no fee' },
  { icon: 'wrench',        label: 'Expert technicians, genuine parts' },
  { icon: 'truck',         label: 'Mail-in repair service available' },
];

export default function Home() {
  const { addToCart } = useCart();

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ── Hero ── */}
      <section
        style={{
          background: 'var(--surface-dark)',
          padding: 'var(--pad-section) var(--space-6)',
        }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Copy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-xs)',
                fontWeight: 'var(--fw-semibold)',
                letterSpacing: 'var(--ls-wider)',
                textTransform: 'uppercase',
                color: 'var(--orange-500)',
              }}
            >
              YOU BREAK IT · WE FIX IT
            </span>

            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(2rem, 5vw, var(--fs-display))',
                fontWeight: 'var(--fw-extrabold)',
                letterSpacing: 'var(--ls-tight)',
                lineHeight: 'var(--lh-tight)',
                color: 'var(--white)',
              }}
            >
              Premium Devices.<br />Expert Repairs.
            </h1>

            <p
              style={{
                margin: 0,
                fontSize: 'var(--fs-lg)',
                lineHeight: 'var(--lh-relaxed)',
                color: 'var(--graphite-400)',
                maxWidth: '480px',
              }}
            >
              Shop the latest phones, laptops, and accessories — or let our certified technicians fix what you've got. Same-day service, genuine parts, free diagnostics.
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <Button variant="secondary" size="lg" iconRight={<Icon name="arrow-right" size={18} />}>
                <Link to="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>Shop Now</Link>
              </Button>
              <Button variant="service" size="lg" iconLeft={<Icon name="wrench" size={18} />}>
                <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>Book Repair</Link>
              </Button>
            </div>
          </div>

          {/* Hero visual — placeholder for product hero image */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '320px',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '280px',
                height: '280px',
                borderRadius: 'var(--radius-card)',
                background: 'var(--graphite-800)',
                border: '1px solid var(--border-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="smartphone" size={100} color="var(--graphite-600)" strokeWidth={1} />
              {/* Small decorative badge */}
              <span
                style={{
                  position: 'absolute',
                  bottom: '-12px',
                  right: '-12px',
                  width: '72px',
                  height: '72px',
                  borderRadius: 'var(--radius-card)',
                  background: 'var(--orange-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="wrench" size={32} color="var(--white)" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Repair trust bar ── */}
      <section style={{ background: 'var(--surface-subtle)', padding: 'var(--space-10) var(--space-6)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REPAIR_FEATURES.map(({ icon, label }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  flexShrink: 0,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--orange-50)',
                  color: 'var(--orange-600)',
                }}
              >
                <Icon name={icon} size={20} color="var(--orange-600)" />
              </span>
              <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--text-body)', lineHeight: 'var(--lh-snug)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured products ── */}
      <section style={{ padding: 'var(--pad-section) var(--space-6)' }}>
        <div className="max-w-7xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>

          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <span
                style={{
                  fontSize: 'var(--fs-xs)',
                  fontWeight: 'var(--fw-semibold)',
                  letterSpacing: 'var(--ls-wider)',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                }}
              >
                Featured
              </span>
              <h2
                style={{
                  margin: 0,
                  fontSize: 'var(--fs-h2)',
                  fontWeight: 'var(--fw-bold)',
                  letterSpacing: 'var(--ls-tight)',
                  color: 'var(--text-strong)',
                }}
              >
                Top Picks
              </h2>
            </div>
            <Link
              to="/shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-sm)',
                fontWeight: 'var(--fw-semibold)',
                color: 'var(--text-strong)',
                textDecoration: 'none',
              }}
            >
              View all <Icon name="arrow-right" size={16} />
            </Link>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAdd={() => addToCart(product, 1)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Repair service CTA ── */}
      <section
        style={{
          background: 'var(--surface-subtle)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: 'var(--pad-section) var(--space-6)',
        }}
      >
        <div
          className="max-w-3xl mx-auto"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 'var(--space-6)',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-card)',
              background: 'var(--orange-50)',
            }}
          >
            <Icon name="wrench" size={28} color="var(--orange-600)" />
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <h2
              style={{
                margin: 0,
                fontSize: 'var(--fs-h2)',
                fontWeight: 'var(--fw-bold)',
                letterSpacing: 'var(--ls-tight)',
                color: 'var(--text-strong)',
              }}
            >
              Device broken? We'll fix it.
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 'var(--fs-lg)',
                color: 'var(--text-muted)',
                lineHeight: 'var(--lh-relaxed)',
              }}
            >
              Screens, batteries, charging ports, water damage — our certified technicians handle it all. Free diagnostics, no fix no fee.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button variant="service" size="lg" iconLeft={<Icon name="calendar-check" size={18} />}>
              <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>Book a Repair</Link>
            </Button>
            <Button variant="ghost" size="lg">
              <Link to="/unlock" style={{ textDecoration: 'none', color: 'inherit' }}>Unlock My Device</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
