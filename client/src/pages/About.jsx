import { Link } from 'react-router-dom';
import { Button, Card, Icon } from '@/components/ui';

const OFFERINGS = [
  {
    icon: 'smartphone',
    title: 'Phones & Tablets',
    text: 'The latest iPhones, Samsung Galaxy devices, iPads, and tablets — new and quality-checked used.',
  },
  {
    icon: 'laptop',
    title: 'Laptops & Computers',
    text: 'MacBook Air & Pro, iMac, and laptops from HP, Dell, and Microsoft.',
  },
  {
    icon: 'gamepad-2',
    title: 'Consoles & Audio',
    text: 'PlayStation and Xbox (new & used), Power Max speakers, and headphones.',
  },
  {
    icon: 'plug',
    title: 'Accessories',
    text: 'Cases, tempered glass, lens protectors, chargers, cables, and more for every device.',
  },
];

const SERVICES = [
  {
    icon: 'wrench',
    title: 'Device Repair',
    text: 'Screens, batteries, charging ports, cameras, water damage — diagnosed free, fixed fast.',
    to: '/repair',
    cta: 'Book Repair',
  },
  {
    icon: 'shield-check',
    title: 'Mobile Unlock',
    text: 'Carrier unlocking for phones from all major networks, handled safely and quickly.',
    to: '/unlock',
    cta: 'Request Unlock',
  },
  {
    icon: 'truck',
    title: 'Buy & Sell Used Phones',
    text: 'Trade in your old device for cash, or pick up a certified used phone at a fair price.',
    to: '/buysell',
    cta: 'Get a Quote',
  },
];

const sectionHeading = {
  margin: 0,
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--fs-h2)',
  fontWeight: 'var(--fw-bold)',
  letterSpacing: 'var(--ls-tight)',
  color: 'var(--text-strong)',
};

const eyebrow = {
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--fs-xs)',
  fontWeight: 'var(--fw-semibold)',
  letterSpacing: 'var(--ls-wider)',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
};

export default function About() {
  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>

      {/* Intro */}
      <section style={{ background: 'var(--surface-dark)', padding: 'var(--pad-section) var(--space-6)' }}>
        <div className="max-w-3xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', textAlign: 'center', alignItems: 'center' }}>
          <span style={{ ...eyebrow, color: 'var(--orange-500)' }}>YOU BREAK IT · WE FIX IT</span>
          <h1 style={{ margin: 0, fontSize: 'clamp(2rem, 4vw, var(--fs-h1))', fontWeight: 'var(--fw-extrabold)', letterSpacing: 'var(--ls-tight)', lineHeight: 'var(--lh-tight)', color: 'var(--white)' }}>
            About Cellular Solutions
          </h1>
          <p style={{ margin: 0, fontSize: 'var(--fs-lg)', lineHeight: 'var(--lh-relaxed)', color: 'var(--graphite-400)' }}>
            We're a local electronics store and repair shop with one simple promise: sell great devices at fair prices, and fix broken ones fast. Whether you're upgrading, trading in, or rescuing a cracked screen — we've got you.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: 'var(--pad-section) var(--space-6)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <span style={eyebrow}>Our Mission</span>
            <h2 style={sectionHeading}>Technology should work for you — not against you.</h2>
            <p style={{ margin: 0, fontSize: 'var(--fs-body)', color: 'var(--text-body)', lineHeight: 'var(--lh-relaxed)' }}>
              A broken phone shouldn't mean an expensive replacement, and buying a device shouldn't feel like a gamble. That's why every product we sell is checked and backed, every repair starts with a free diagnosis, and every price is upfront — no surprises at the counter.
            </p>
            <p style={{ margin: 0, fontSize: 'var(--fs-body)', color: 'var(--text-body)', lineHeight: 'var(--lh-relaxed)' }}>
              We treat every customer like a neighbor, because most of them are. That's how a repair shop earns repeat visits — and why so much of our business comes from word of mouth.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {OFFERINGS.map(({ icon, title, text }) => (
              <Card key={title}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', background: 'var(--graphite-100)', color: 'var(--graphite-900)' }}>
                    <Icon name={icon} size={22} />
                  </span>
                  <span style={{ fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>{title}</span>
                  <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', lineHeight: 'var(--lh-relaxed)' }}>{text}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: 'var(--pad-section) var(--space-6)', background: 'var(--surface-subtle)' }}>
        <div className="max-w-7xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', textAlign: 'center', alignItems: 'center' }}>
            <span style={eyebrow}>More Than a Store</span>
            <h2 style={sectionHeading}>Our Services</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES.map(({ icon, title, text, to, cta }) => (
              <Card key={title}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', height: '100%' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: 'var(--radius-btn)', background: 'var(--orange-50)', color: 'var(--orange-600)' }}>
                    <Icon name={icon} size={24} color="var(--orange-600)" />
                  </span>
                  <span style={{ fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>{title}</span>
                  <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', lineHeight: 'var(--lh-relaxed)', flex: 1 }}>{text}</span>
                  <Button variant="service" fullWidth>
                    <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>{cta}</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'var(--pad-section) var(--space-6)' }}>
        <div className="max-w-3xl mx-auto" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 'var(--space-6)' }}>
          <h2 style={sectionHeading}>Come see us — or start shopping now.</h2>
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button variant="product" size="lg" iconRight={<Icon name="arrow-right" size={18} />}>
              <Link to="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>Shop Now</Link>
            </Button>
            <Button variant="secondary" size="lg">
              <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
