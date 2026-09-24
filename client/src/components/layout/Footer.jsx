import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui';
import { useCategoryTree } from '@/hooks/useCategoryTree';

// Real top-level category names as they exist in the DB (verified against
// /categories/tree) — resolved to ids at render time so the links can't drift
// out of sync with category ids the way a hardcoded slug/id would. `label` is
// the display name shown in the footer, which can differ from the DB `name`
// used to find the category (e.g. DB "Phones" displays as "Smartphones" to
// match the rest of the site's terminology).
const SHOP_LINKS = [
  { name: 'Phones', label: 'Smartphones' },
  { name: 'Gaming', label: 'Gaming' },
  { name: 'Laptops', label: 'Laptops' },
  { name: 'Accessories', label: 'Accessories' },
];

function useShopLinks() {
  const { tree } = useCategoryTree();
  return SHOP_LINKS.map(({ name, label }) => {
    const cat = tree?.find((n) => n.name === name);
    return { to: cat ? `/shop?category=${cat._id}` : '/shop', label };
  });
}

const SERVICE_LINKS = [
  { to: '/repair',  label: 'Request a repair' },
  { to: '/buysell', label: 'Sell Your Device' },
];

const SUPPORT_LINKS = [
  { to: '/contact', label: 'Store details' },
  { to: '/shop',    label: 'Product inquiries' },
  { to: '/contact', label: 'Ask about warranty' },
  { to: '/contact', label: 'Contact Us' },
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
  const shopLinks = useShopLinks();

  return (
    <footer className="storefront-footer" style={{ background: 'var(--surface-dark)', color: 'var(--text-on-dark)' }}>
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
              Your local shop for phones, consoles, laptops and accessories — with repair enquiries for the tech you own.
            </p>
          </div>

          {/* Link columns */}
          <FooterColumn heading="Shop" links={shopLinks} />
          <FooterColumn heading="Service" links={SERVICE_LINKS} />
          <FooterColumn heading="Support" links={SUPPORT_LINKS} />
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
              color: 'var(--graphite-400)',
            }}
          >
            © {year} Cellular Solutions. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <Link to="/privacy" style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-xs)', color: 'var(--graphite-400)', textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            <Link to="/terms" style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-xs)', color: 'var(--graphite-400)', textDecoration: 'none' }}>
              Terms &amp; Conditions
            </Link>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-xs)',
              letterSpacing: 'var(--ls-wider)',
              textTransform: 'uppercase',
              color: 'var(--graphite-400)',
            }}
          >
            YOU BREAK IT · WE FIX IT
          </span>
        </div>
      </div>
    </footer>
  );
}
