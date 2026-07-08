import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui';

// ⚑ PLACEHOLDER PRICES — confirm all with client before launch
const SERVICES = [
  { icon: 'monitor',  label: 'Screen Repair',       price: 'From $89', to: '/repair' },
  { icon: 'battery',  label: 'Battery Replacement', price: 'From $49', to: '/repair' },
  { icon: 'plug',     label: 'Charging Port',        price: 'From $59', to: '/repair' },
  { icon: 'camera',   label: 'Camera Repair',        price: 'From $69', to: '/repair' },
  { icon: 'droplets', label: 'Water Damage',         price: 'From $99', to: '/repair' },
];

function ServiceTile({ icon, label, price, to }) {
  return (
    <Link
      to={to}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)', textAlign: 'center' }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'var(--graphite-100)',
          color: 'var(--graphite-700)',
          transition: 'var(--transition-base)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--orange-50)';
          e.currentTarget.style.color = 'var(--orange-600)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--graphite-100)';
          e.currentTarget.style.color = 'var(--graphite-700)';
        }}
      >
        <Icon name={icon} size={28} color="currentColor" />
      </span>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', lineHeight: 'var(--lh-snug)' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
        {price}
      </span>
    </Link>
  );
}

export default function QuickServices() {
  return (
    <section
      style={{
        background: 'var(--surface-page)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: 'var(--space-10) var(--space-6)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <p
          style={{
            margin: '0 0 var(--space-8)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-xs)',
            fontWeight: 'var(--fw-semibold)',
            letterSpacing: 'var(--ls-wider)',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}
        >
          Quick Repairs
        </p>

        {/* Tiles row — horizontally scrollable on small screens */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-6)',
            overflowX: 'auto',
            paddingBottom: 'var(--space-2)',
            scrollbarWidth: 'none',
          }}
        >
          {SERVICES.map((s) => (
            <div
              key={s.label}
              style={{
                flex: '0 0 calc((100% - 5 * var(--space-6)) / 6)',
                minWidth: '96px',
              }}
            >
              <ServiceTile {...s} />
            </div>
          ))}

          {/* See All tile */}
          <div style={{ flex: '0 0 calc((100% - 5 * var(--space-6)) / 6)', minWidth: '96px' }}>
            <Link
              to="/repair"
              style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)', textAlign: 'center' }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'var(--orange-600)',
                  color: 'var(--white)',
                  transition: 'var(--transition-base)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--orange-700)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--orange-600)'; }}
              >
                <Icon name="arrow-right" size={28} color="var(--white)" />
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', lineHeight: 'var(--lh-snug)' }}>
                See All<br />Repairs
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                &nbsp;
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
