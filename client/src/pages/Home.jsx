import { Link } from 'react-router-dom';
import { Button, Icon } from '@/components/ui';
import QuickServices  from '@/components/home/QuickServices';
import TopProducts    from '@/components/home/TopProducts';
import PopularRepairs from '@/components/home/PopularRepairs';
import TrustBadges    from '@/components/home/TrustBadges';
import StoreShowcase  from '@/components/home/StoreShowcase';

export default function Home() {
  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ── Hero ── */}
      <section style={{ background: 'var(--surface-dark)', padding: 'var(--pad-section) var(--space-6)' }}>
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
                <Link to="/repair" style={{ textDecoration: 'none', color: 'inherit' }}>Book Repair</Link>
              </Button>
            </div>
          </div>

          {/* Hero visual — replace inner content with <img> when hero photo is ready */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '320px' }}>
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

      <QuickServices />
      <TopProducts />
      <PopularRepairs />
      <TrustBadges />
      <StoreShowcase />

    </div>
  );
}
