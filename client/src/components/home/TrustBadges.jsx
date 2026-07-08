import { Icon } from '@/components/ui';

const BADGES = [
  {
    icon: 'shield-check',
    label: '90-Day Warranty',
    description: 'Every repair backed by a 90-day parts and labour guarantee.',
  },
  {
    icon: 'dollar-sign',
    label: 'Price Match',
    description: "Found it cheaper locally? We'll match any verified competitor quote.",
  },
  {
    icon: 'wrench',
    label: 'Free Diagnostics',
    description: 'No fix, no fee — we diagnose your device for free, always.',
  },
  {
    icon: 'users',
    label: 'Customer First',
    description: 'Hundreds of 5-star reviews from customers who keep coming back.',
  },
];

export default function TrustBadges() {
  return (
    <section
      style={{
        background: 'var(--surface-page)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: 'var(--pad-section) var(--space-6)',
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {BADGES.map(({ icon, label, description }) => (
          <div
            key={label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--graphite-100)',
                color: 'var(--graphite-900)',
                flexShrink: 0,
              }}
            >
              <Icon name={icon} size={24} color="var(--graphite-900)" />
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <span
                style={{
                  fontSize: 'var(--fs-body)',
                  fontWeight: 'var(--fw-bold)',
                  color: 'var(--text-strong)',
                  lineHeight: 'var(--lh-snug)',
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontSize: 'var(--fs-sm)',
                  color: 'var(--text-muted)',
                  lineHeight: 'var(--lh-relaxed)',
                }}
              >
                {description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
