import { Link } from 'react-router-dom';
import { Button, Icon } from '@/components/ui';

const STATS = [
  { value: '45 min',  label: 'Avg. screen repair' },
  { value: 'from $89', label: 'Screen replacement' },
  { value: 'Free',     label: 'Device diagnostics' },
];

export default function RepairCTA() {
  return (
    <section style={{ padding: '0 var(--space-6) 80px', maxWidth: '1280px', margin: '0 auto', boxSizing: 'border-box' }}>
      <div
        className="grid grid-cols-1 lg:grid-cols-2"
        style={{
          alignItems: 'stretch',
          background: 'var(--cobalt-50)',
          border: '1px solid var(--cobalt-100)',
          borderRadius: 'var(--radius-modal)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '48px var(--space-8, 52px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-xs)',
              fontWeight: 'var(--fw-semibold)',
              letterSpacing: 'var(--ls-wider)',
              textTransform: 'uppercase',
              color: 'var(--cobalt-700)',
              marginBottom: '14px',
            }}
          >
            <Icon name="wrench" size={16} />
            Repair &amp; Service
          </div>
          <h2
            style={{
              margin: '0 0 12px',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-h1)',
              fontWeight: 'var(--fw-extrabold)',
              letterSpacing: 'var(--ls-tight)',
              color: 'var(--text-strong)',
            }}
          >
            Need a Repair?
          </h2>
          <p style={{ margin: '0 0 24px', fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-body)', maxWidth: '460px' }}>
            Cracked screens, dead batteries, water damage, unlocks. Walk in or book online and most repairs are done same-day — with free diagnostics.
          </p>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-extrabold)', color: 'var(--text-strong)' }}>
                  {value}
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button as={Link} to="/repair" variant="service" size="lg" style={{ textDecoration: 'none' }}>
              Book Repair
            </Button>
            <Button as={Link} to="/repair" variant="secondary" size="lg" style={{ textDecoration: 'none' }}>
              Get a Free Quote
            </Button>
          </div>
        </div>

        {/* Repair photo — swap this placeholder for a real technician/repair photo when available */}
        <div style={{ position: 'relative', minHeight: '280px', background: 'var(--cobalt-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Icon name="wrench" size={56} color="var(--cobalt-500)" strokeWidth={1.25} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-xs)', color: 'var(--cobalt-700)', letterSpacing: 'var(--ls-wide)' }}>
              REPAIR PHOTO
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
