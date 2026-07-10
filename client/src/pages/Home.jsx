import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui';
import TrustStrip    from '@/components/home/TrustStrip';
import Categories    from '@/components/home/Categories';
import RepairCTA      from '@/components/home/RepairCTA';
import TopProducts   from '@/components/home/TopProducts';

function HeroCTA() {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const active = focused || hovered;

  const release = () => setPressed(false);

  return (
    <Link
      to="/shop"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); release(); }}
      onFocus={() => setFocused(true)}
      onBlur={() => { setFocused(false); release(); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={release}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={release}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        height: '54px',
        padding: '0 32px',
        borderRadius: 'var(--radius-pill)',
        fontWeight: 'var(--fw-semibold)',
        fontSize: 'var(--fs-body)',
        textDecoration: 'none',
        background: active ? 'var(--graphite-100)' : 'var(--white)',
        color: 'var(--graphite-900)',
        transition: 'var(--transition-base)',
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
        outline: focused ? '2px solid var(--graphite-900)' : 'none',
        outlineOffset: focused ? '3px' : '0',
        boxShadow: focused ? '0 0 0 5px rgba(255,255,255,0.5)' : 'none',
      }}
    >
      Shop New Arrivals
      <Icon
        name="arrow-right"
        size={18}
        style={{ transition: 'var(--transition-base)', transform: active ? 'translateX(3px)' : 'translateX(0)' }}
      />
    </Link>
  );
}

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
          src="https://images.unsplash.com/photo-1592832122594-c0c6bad718b1?auto=format&fit=crop&w=1600&q=80"
          alt="Close-up of a dark-toned smartphone's camera module, representing the phones, laptops, and devices Cellular Solutions sells, repairs, and trades in"
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
            style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--graphite-300)', marginBottom: '14px', animationDelay: '80ms' }}
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
            <HeroCTA />
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
