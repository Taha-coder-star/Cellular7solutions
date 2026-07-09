import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui';
import TrustStrip    from '@/components/home/TrustStrip';
import Categories    from '@/components/home/Categories';
import RepairCTA      from '@/components/home/RepairCTA';
import TopProducts   from '@/components/home/TopProducts';
import Testimonials  from '@/components/home/Testimonials';

const SOCIALS = [
  { icon: 'globe',          label: 'Facebook' },
  { icon: 'share-2',        label: 'X' },
  { icon: 'message-square', label: 'Instagram' },
];

export default function Home() {
  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ── Hero — editorial full-bleed ── */}
      <section style={{ position: 'relative', height: '600px', background: 'var(--graphite-900)', overflow: 'hidden' }}>

        {/* Vertical social rail */}
        <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '18px', zIndex: 5 }}>
          {SOCIALS.map(({ icon, label }) => (
            <a key={label} href="#" aria-label={label} style={{ color: 'rgba(255,255,255,0.75)' }}>
              <Icon name={icon} size={17} />
            </a>
          ))}
        </div>

        {/* Lifestyle photo — swap this placeholder for a real hero photo when available */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 30% 40%, var(--graphite-700) 0%, var(--graphite-900) 70%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="smartphone" size={140} color="var(--graphite-700)" strokeWidth={0.75} />
        </div>

        {/* Legibility gradient */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(24,24,27,0) 40%, rgba(24,24,27,.72) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Copy */}
        <div style={{ position: 'absolute', right: '64px', top: '50%', transform: 'translateY(-50%)', maxWidth: '440px', textAlign: 'right' }}>
          <div style={{ fontSize: '12px', fontWeight: 'var(--fw-semibold)', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--cobalt-300)', marginBottom: '14px' }}>
            Just Landed
          </div>
          <h1
            style={{
              margin: '0 0 14px',
              fontSize: 'clamp(2.25rem, 5vw, 64px)',
              lineHeight: 1.02,
              fontWeight: 'var(--fw-extrabold)',
              letterSpacing: '-.03em',
              color: 'var(--white)',
              textShadow: '0 2px 18px rgba(0,0,0,.35)',
            }}
          >
            Everything Tech.
          </h1>
          <p
            style={{
              margin: '0 0 28px',
              fontSize: 'var(--fs-lg)',
              fontWeight: 'var(--fw-semibold)',
              letterSpacing: '.02em',
              color: 'rgba(255,255,255,0.9)',
              textShadow: '0 1px 10px rgba(0,0,0,.4)',
            }}
          >
            Buy &nbsp;•&nbsp; Repair &nbsp;•&nbsp; Trade-In
          </p>
          <Link
            to="/shop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              height: '54px',
              padding: '0 32px',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 'var(--fw-semibold)',
              fontSize: '15px',
              textDecoration: 'none',
              background: 'var(--white)',
              color: 'var(--graphite-900)',
              transition: 'var(--transition-base)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--graphite-100)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--white)')}
          >
            Shop New Arrivals
            <Icon name="arrow-right" size={18} />
          </Link>
        </div>
      </section>

      <TrustStrip />
      <Categories />
      <RepairCTA />
      <TopProducts />
      <Testimonials />

    </div>
  );
}
