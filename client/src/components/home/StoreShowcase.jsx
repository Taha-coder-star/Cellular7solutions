import { Link } from 'react-router-dom';
import { Button, Icon, Rating } from '@/components/ui';

// ⚑ PLACEHOLDER STATS — confirm all numbers with client before launch
const STATS = [
  { value: '10,000+', label: 'Devices Repaired' },
  { value: '5,000+',  label: 'Happy Customers'  },
  { value: '50+',     label: 'Years Combined Experience' },
  { value: '4.9',     label: 'Average Rating',   isRating: true },
];

const BULLETS = [
  { icon: 'check', text: 'Expert technicians — certified, experienced, vetted' },
  { icon: 'check', text: 'Fast turnaround — same-day repairs on most devices' },
  { icon: 'check', text: 'Quality parts — genuine or OEM-grade components only' },
  { icon: 'check', text: 'Transparent process — updates from drop-off to pick-up' },
];

export default function StoreShowcase() {
  return (
    <section style={{ background: 'var(--surface-dark)', padding: 'var(--pad-section) var(--space-6)' }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left — copy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
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
              Why Cellular Solutions
            </span>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(1.5rem, 3vw, var(--fs-h1))',
                fontWeight: 'var(--fw-bold)',
                letterSpacing: 'var(--ls-tight)',
                lineHeight: 'var(--lh-snug)',
                color: 'var(--white)',
              }}
            >
              Experience the Best in Service &amp; Technology
            </h2>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-body)',
                lineHeight: 'var(--lh-relaxed)',
                color: 'var(--graphite-400)',
              }}
            >
              Whether you're shopping for a new device or bringing in a broken one, we treat every customer and every repair with the same care.
            </p>
          </div>

          {/* Bullet list */}
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {BULLETS.map(({ icon, text }) => (
              <li
                key={text}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'var(--orange-600)',
                    flexShrink: 0,
                    marginTop: '1px',
                  }}
                >
                  <Icon name={icon} size={13} color="var(--white)" strokeWidth={3} />
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--fs-sm)',
                    color: 'var(--graphite-300)',
                    lineHeight: 'var(--lh-snug)',
                  }}
                >
                  {text}
                </span>
              </li>
            ))}
          </ul>

          <div>
            {/* "Shop Now" is a product/shopping action → secondary variant (white bg on dark) */}
            <Button variant="secondary" size="lg" iconRight={<Icon name="arrow-right" size={18} />}>
              <Link to="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>Shop Now</Link>
            </Button>
          </div>
        </div>

        {/* Right — stats + store image placeholder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-6">
            {STATS.map(({ value, label, isRating }) => (
              <div
                key={label}
                style={{
                  padding: 'var(--pad-card)',
                  background: 'var(--graphite-800)',
                  borderRadius: 'var(--radius-card)',
                  border: '1px solid var(--border-dark)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-2)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(1.5rem, 3vw, var(--fs-h1))',
                    fontWeight: 'var(--fw-extrabold)',
                    color: 'var(--white)',
                    letterSpacing: 'var(--ls-tight)',
                    lineHeight: 1,
                  }}
                >
                  {value}
                </span>
                {isRating && (
                  <Rating value={4.9} size={14} style={{ marginBottom: 'var(--space-1)' }} />
                )}
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--fs-xs)',
                    fontWeight: 'var(--fw-medium)',
                    color: 'var(--graphite-400)',
                    lineHeight: 'var(--lh-snug)',
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Store image placeholder — swap the <img> src when a real photo is available */}
          <div
            style={{
              borderRadius: 'var(--radius-card)',
              overflow: 'hidden',
              border: '1px solid var(--border-dark)',
              aspectRatio: '16 / 9',
              background: 'var(--graphite-800)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Replace this entire div content with: <img src="/assets/store-photo.jpg" alt="Cellular Solutions store" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Icon name="camera" size={36} color="var(--graphite-600)" />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-xs)', color: 'var(--graphite-600)', letterSpacing: 'var(--ls-wide)' }}>
                STORE PHOTO
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
