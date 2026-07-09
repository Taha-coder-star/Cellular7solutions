import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui';

const CATEGORIES = [
  { icon: 'smartphone', label: 'Phones',      count: '120+ models', to: '/shop?category=phones' },
  { icon: 'gamepad-2',  label: 'Consoles',    count: '40+ models',  to: '/shop?category=consoles' },
  { icon: 'laptop',     label: 'Laptops',     count: '80+ models',  to: '/shop?category=laptops' },
  { icon: 'headphones', label: 'Accessories', count: '300+ items',  to: '/shop?category=accessories' },
];

function CategoryCard({ icon, label, count, to }) {
  return (
    <Link
      to={to}
      style={{
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        padding: 'var(--space-7, 28px)',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'var(--transition-base)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '52px',
          height: '52px',
          borderRadius: 'var(--radius-btn)',
          background: 'var(--graphite-100)',
          color: 'var(--graphite-900)',
        }}
      >
        <Icon name={icon} size={26} />
      </span>
      <div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>
          {label}
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', marginTop: '2px' }}>
          {count}
        </div>
      </div>
    </Link>
  );
}

export default function Categories() {
  return (
    <section style={{ padding: '80px var(--space-6) 64px', maxWidth: '1280px', margin: '0 auto', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '36px', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-xs)',
              fontWeight: 'var(--fw-semibold)',
              letterSpacing: 'var(--ls-wider)',
              textTransform: 'uppercase',
              color: 'var(--cobalt-600)',
              marginBottom: '10px',
            }}
          >
            Browse the store
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-h2)',
              fontWeight: 'var(--fw-extrabold)',
              letterSpacing: 'var(--ls-tight)',
              color: 'var(--text-strong)',
            }}
          >
            Shop by category
          </h2>
        </div>
        <Link
          to="/shop"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-sm)',
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--text-strong)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          View all products <Icon name="arrow-right" size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '24px' }}>
        {CATEGORIES.map((c) => (
          <CategoryCard key={c.label} {...c} />
        ))}
      </div>
    </section>
  );
}
