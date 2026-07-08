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

            {/* Primary CTA: Shop Now. Repair is demoted to a secondary text link so the two
                actions don't compete for equal attention (ecommerce is the primary funnel). */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap', alignItems: 'center' }}>
                <Button as={Link} to="/shop" variant="secondary" size="lg" iconRight={<Icon name="arrow-right" size={18} />} style={{ textDecoration: 'none' }}>
                  Shop Now
                </Button>
                <Link
                  to="/repair"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--fs-sm)',
                    fontWeight: 'var(--fw-semibold)',
                    color: 'var(--brand-service)',
                    textDecoration: 'none',
                  }}
                >
                  <Icon name="wrench" size={16} />
                  Need a repair instead?
                  <Icon name="arrow-right" size={14} />
                </Link>
              </div>

              {/* Trust strip — claims already used elsewhere on the site (Repair page, TrustBadges) */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-5)' }}>
                {['Free Diagnostics', 'Same-Day Service', '90-Day Warranty'].map((item) => (
                  <span
                    key={item}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--fs-sm)',
                      color: 'var(--graphite-300)',
                    }}
                  >
                    <Icon name="check" size={16} color="var(--orange-500)" strokeWidth={3} />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Hero visual — ambient glow + image-ready placeholder.
              Swap the placeholder <div> below for a real product/lifestyle photo, e.g.:
              <img src="/assets/hero-product.jpg" alt="Cellular Solutions phones and accessories"
                   style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '320px', position: 'relative' }}>
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                width: '360px',
                height: '360px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(234,88,12,0.35) 0%, rgba(234,88,12,0) 70%)',
                filter: 'blur(20px)',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '340px',
                aspectRatio: '1 / 1',
                borderRadius: 'var(--radius-card)',
                overflow: 'hidden',
                background: 'var(--graphite-800)',
                border: '1px solid var(--border-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
                <Icon name="smartphone" size={88} color="var(--graphite-600)" strokeWidth={1} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-xs)', color: 'var(--graphite-600)', letterSpacing: 'var(--ls-wide)' }}>
                  HERO PRODUCT PHOTO
                </span>
              </div>
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
