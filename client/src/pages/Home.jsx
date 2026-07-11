import { HeroPill } from '@/components/ui';
import TrustStrip    from '@/components/home/TrustStrip';
import Categories    from '@/components/home/Categories';
import RepairCTA      from '@/components/home/RepairCTA';
import TopProducts   from '@/components/home/TopProducts';
import { unsplashSrcSet } from '@/utils/image';

const HERO_PHOTO = 'https://images.unsplash.com/photo-1628911771730-881503b8e9c9';

export default function Home() {
  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ── Hero — editorial full-bleed ── */}
      <section
        className="flex items-center justify-center md:justify-end"
        style={{ position: 'relative', minHeight: '560px', background: 'var(--graphite-900)', overflow: 'hidden' }}
      >
        {/* Hero photo */}
        <img
          src={`${HERO_PHOTO}?auto=format&fit=crop&w=1600&q=80`}
          srcSet={unsplashSrcSet(HERO_PHOTO)}
          sizes="100vw"
          alt="A dark flat-lay spread of a laptop, smartphone, wireless headphones, camera, and watch, representing the full range of devices Cellular Solutions sells, repairs, and trades in"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Legibility gradient — bottom-weighted on mobile (copy sits centered/lower), side-weighted on desktop (copy sits right) */}
        <div
          aria-hidden="true"
          className="block md:hidden"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(24,24,27,.35) 0%, rgba(24,24,27,.6) 45%, rgba(24,24,27,.92) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden="true"
          className="hidden md:block"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(24,24,27,0) 35%, rgba(24,24,27,.8) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Copy */}
        <div
          className="relative text-center md:text-right px-6 md:px-0 md:mr-16"
          style={{ zIndex: 1, maxWidth: '440px' }}
        >
          <div
            className="hero-fade-up"
            style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', letterSpacing: 'var(--ls-wider)', textTransform: 'uppercase', color: 'var(--graphite-300)', marginBottom: '14px', animationDelay: '80ms' }}
          >
            Just Landed
          </div>
          <h1
            className="hero-fade-up"
            style={{
              margin: '0 0 14px',
              fontSize: 'clamp(2.25rem, 5vw, 64px)',
              lineHeight: 1.02,
              fontWeight: 'var(--fw-extrabold)',
              letterSpacing: '-.03em',
              color: 'var(--white)',
              textShadow: '0 2px 18px rgba(0,0,0,.35)',
              textWrap: 'balance',
              animationDelay: '160ms',
            }}
          >
            Everything Tech.
          </h1>
          <p
            className="hero-fade-up"
            style={{
              margin: '0 0 28px',
              fontSize: 'var(--fs-lg)',
              fontWeight: 'var(--fw-semibold)',
              letterSpacing: '.02em',
              color: 'rgba(255,255,255,0.9)',
              textShadow: '0 1px 10px rgba(0,0,0,.4)',
              animationDelay: '240ms',
            }}
          >
            Buy &nbsp;•&nbsp; Repair &nbsp;•&nbsp; Trade-In
          </p>
          <div className="hero-fade-up" style={{ display: 'inline-block', animationDelay: '320ms' }}>
            <HeroPill to="/shop">Shop New Arrivals</HeroPill>
          </div>
        </div>
      </section>

      <TrustStrip />
      <Categories />
      <RepairCTA />
      <TopProducts />

    </div>
  );
}
