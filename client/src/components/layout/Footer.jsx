import { Link } from 'react-router-dom';
import { Logo, Icon } from '@/components/ui';

const SHOP_LINKS = [
  { to: '/shop',    label: 'All Products' },
  { to: '/shop?category=phones',      label: 'Phones' },
  { to: '/shop?category=laptops',     label: 'Laptops' },
  { to: '/shop?category=accessories', label: 'Accessories' },
  { to: '/shop?category=consoles',    label: 'Consoles' },
];

const SERVICE_LINKS = [
  { to: '/buysell', label: 'Buy & Sell Devices' },
  { to: '/unlock',  label: 'Unlock Device' },
  { to: '/repair', label: 'Book Repair' },
];

const COMPANY_LINKS = [
  { to: '/about',   label: 'About Us' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms',   label: 'Terms of Service' },
];

// Lucide has no brand icons; using generic stand-ins until real social SVGs are swapped in
const SOCIAL = [
  { name: 'globe',           href: '#', label: 'Facebook' },
  { name: 'message-square',  href: '#', label: 'Instagram' },
  { name: 'share-2',         href: '#', label: 'Twitter / X' },
];

function FooterColumn({ heading, links }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-xs)',
          fontWeight: 'var(--fw-semibold)',
          letterSpacing: 'var(--ls-wider)',
          textTransform: 'uppercase',
          color: 'var(--graphite-400)',
        }}
      >
        {heading}
      </span>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {links.map(({ to, label }) => (
          <li key={label}>
            <Link
              to={to}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-sm)',
                fontWeight: 'var(--fw-regular)',
                color: 'var(--graphite-400)',
                textDecoration: 'none',
                transition: 'color var(--dur-fast) var(--ease-out)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--white)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--graphite-400)')}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: 'var(--surface-dark)', color: 'var(--text-on-dark)' }}>
      {/* Main footer body */}
      <div
        className="max-w-7xl mx-auto"
        style={{ padding: 'var(--pad-section) var(--space-6)' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <Logo variant="full" tone="dark" height={36} />
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-sm)',
                color: 'var(--graphite-400)',
                lineHeight: 'var(--lh-relaxed)',
                margin: 0,
                maxWidth: '240px',
              }}
            >
              Premium devices, expert repairs, and trusted service — your local electronics partner.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
              {SOCIAL.map(({ name, href, label }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--graphite-800)',
                    color: 'var(--graphite-400)',
                    transition: 'var(--transition-base)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--graphite-700)';
                    e.currentTarget.style.color = 'var(--white)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--graphite-800)';
                    e.currentTarget.style.color = 'var(--graphite-400)';
                  }}
                >
                  <Icon name={name} size={16} color="currentColor" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <FooterColumn heading="Shop" links={SHOP_LINKS} />
          <FooterColumn heading="Services" links={SERVICE_LINKS} />
          <FooterColumn heading="Company" links={COMPANY_LINKS} />
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid var(--border-dark)' }}>
        <div
          className="max-w-7xl mx-auto"
          style={{
            padding: 'var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-xs)',
              color: 'var(--graphite-500)',
            }}
          >
            © {year} Cellular Solutions. All rights reserved.
          </span>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-xs)',
              letterSpacing: 'var(--ls-wider)',
              textTransform: 'uppercase',
              color: 'var(--graphite-600)',
            }}
          >
            YOU BREAK IT · WE FIX IT
          </span>
        </div>
      </div>
    </footer>
  );
}
