import { HeroPill, Icon } from '@/components/ui';
import { unsplashSrcSet } from '@/utils/image';

const REPAIR_PHOTO = 'https://images.unsplash.com/photo-1639776739297-f7e1f21526f4';

const STATS = [
  { value: '45 min',  label: 'Avg. screen repair' },
  { value: 'from $89', label: 'Screen replacement' },
  { value: 'Free',     label: 'Device diagnostics' },
];

export default function RepairCTA() {
  return (
    <section
      className="flex items-center justify-center md:justify-start"
      style={{ position: 'relative', minHeight: '560px', background: 'var(--cobalt-900)', overflow: 'hidden' }}
    >
      <img
        src={`${REPAIR_PHOTO}?auto=format&fit=crop&w=1600&q=80`}
        srcSet={unsplashSrcSet(REPAIR_PHOTO)}
        sizes="100vw"
        loading="lazy"
        alt="A technician in blue gloves using tweezers to repair the internal components of a disassembled phone"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* Legibility gradient — bottom-weighted on mobile, side-weighted on desktop (copy sits left, mirrors the storefront hero's right-weighted copy for page rhythm) */}
      <div
        aria-hidden="true"
        className="block md:hidden"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(30,58,138,.35) 0%, rgba(30,58,138,.62) 45%, rgba(30,58,138,.93) 100%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        className="hidden md:block"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(270deg, rgba(30,58,138,0) 35%, rgba(30,58,138,.85) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="relative text-center md:text-left px-6 md:px-0 md:ml-16"
        style={{ zIndex: 1, maxWidth: '460px' }}
      >
        <div
          className="hero-fade-up"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: 'var(--fs-xs)',
            fontWeight: 'var(--fw-semibold)',
            letterSpacing: 'var(--ls-wider)',
            textTransform: 'uppercase',
            color: 'var(--cobalt-300)',
            marginBottom: '14px',
            animationDelay: '80ms',
          }}
        >
          <Icon name="wrench" size={16} aria-hidden="true" />
          Repair &amp; Service
        </div>
        <h2
          className="hero-fade-up"
          style={{
            margin: '0 0 14px',
            fontSize: 'clamp(2.25rem, 5vw, 56px)',
            lineHeight: 1.05,
            fontWeight: 'var(--fw-extrabold)',
            letterSpacing: 'var(--ls-tight)',
            color: 'var(--white)',
            textShadow: '0 2px 18px rgba(0,0,0,.35)',
            textWrap: 'balance',
            animationDelay: '160ms',
          }}
        >
          Need a Repair?
        </h2>
        <p
          className="hero-fade-up"
          style={{
            margin: '0 0 28px',
            fontSize: 'var(--fs-body)',
            lineHeight: 'var(--lh-relaxed)',
            color: 'rgba(255,255,255,0.82)',
            textShadow: '0 1px 10px rgba(0,0,0,.3)',
            animationDelay: '220ms',
          }}
        >
          Cracked screens, dead batteries, water damage, unlocks. Walk in or book online — most repairs are done same-day, with a free diagnostic quote before any work begins.
        </p>
        <div
          className="hero-fade-up flex justify-center md:justify-start"
          style={{ gap: '32px', flexWrap: 'wrap', marginBottom: '32px', animationDelay: '280ms' }}
        >
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <div style={{ fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-extrabold)', color: 'var(--white)' }}>
                {value}
              </div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.68)' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
        <div className="hero-fade-up" style={{ display: 'inline-block', animationDelay: '340ms' }}>
          <HeroPill to="/repair" textColor="var(--cobalt-700)">Book a Repair</HeroPill>
        </div>
      </div>
    </section>
  );
}
