import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Logo, Icon } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import ShopMegaMenu, { ShopMenuAccordion } from '@/components/ShopMegaMenu';

const NAV_LINKS = [
  { to: '/buysell', label: 'Buy & Sell' },
  { to: '/unlock',  label: 'Unlock' },
  { to: '/repair',  label: 'Repairs' },
  { to: '/about',   label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const navLinkStyle = ({ isActive }) => ({
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--fs-sm)',
  fontWeight: isActive ? 'var(--fw-semibold)' : 'var(--fw-medium)',
  color: isActive ? 'var(--text-strong)' : 'var(--text-muted)',
  textDecoration: 'none',
  transition: 'color 0.15s ease',
  paddingBottom: '2px',
  borderBottom: isActive ? '2px solid var(--text-strong)' : '2px solid transparent',
});

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const { cartCount } = useCart();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--surface-page)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div
        className="max-w-7xl mx-auto"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
          padding: '0 var(--space-6)',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <Logo variant="full" tone="light" height={36} />
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex" style={{ gap: 'var(--space-8)', alignItems: 'center' }}>
          <ShopMegaMenu />
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={label} to={to} style={navLinkStyle}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 'var(--space-5)' }}>
          <Link
            to="/shop"
            style={{ color: 'var(--text-muted)', display: 'inline-flex', transition: 'color 0.15s ease' }}
            aria-label="Search"
          >
            <Icon name="search" size={20} />
          </Link>

          <Link
            to="/cart"
            style={{ position: 'relative', color: 'var(--text-muted)', display: 'inline-flex', transition: 'color 0.15s ease' }}
            aria-label={`Cart (${cartCount} items)`}
          >
            <Icon name="shopping-cart" size={20} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-8px',
                  minWidth: '18px',
                  height: '18px',
                  padding: '0 4px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--brand-primary)',
                  color: 'var(--text-on-brand)',
                  fontSize: '10px',
                  fontWeight: 'var(--fw-bold)',
                  fontFamily: 'var(--font-sans)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to={user ? '/account' : '/login'}
            style={{ color: 'var(--text-muted)', display: 'inline-flex', transition: 'color 0.15s ease' }}
            aria-label={user ? 'My Account' : 'Sign In'}
          >
            <Icon name="user" size={20} />
          </Link>
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="flex md:hidden" style={{ alignItems: 'center', gap: 'var(--space-4)' }}>
          <Link
            to="/cart"
            style={{ position: 'relative', color: 'var(--text-muted)', display: 'inline-flex' }}
            aria-label="Cart"
          >
            <Icon name="shopping-cart" size={20} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-8px',
                  minWidth: '18px',
                  height: '18px',
                  padding: '0 4px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--brand-primary)',
                  color: 'var(--text-on-brand)',
                  fontSize: '10px',
                  fontWeight: 'var(--fw-bold)',
                  fontFamily: 'var(--font-sans)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-strong)',
              display: 'inline-flex',
              padding: 'var(--space-1)',
            }}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <Icon name={mobileOpen ? 'x' : 'menu'} size={24} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div
          style={{
            background: 'var(--surface-page)',
            borderTop: '1px solid var(--border-subtle)',
            padding: 'var(--space-4) var(--space-6) var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-1)',
          }}
        >
          <ShopMenuAccordion onNavigate={() => setMobileOpen(false)} />
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={label}
              to={to}
              onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-body)',
                fontWeight: isActive ? 'var(--fw-semibold)' : 'var(--fw-regular)',
                color: isActive ? 'var(--text-strong)' : 'var(--text-body)',
                textDecoration: 'none',
                padding: 'var(--space-3) 0',
                borderBottom: '1px solid var(--border-subtle)',
              })}
            >
              {label}
            </NavLink>
          ))}
          <Link
            to={user ? '/account' : '/login'}
            onClick={() => setMobileOpen(false)}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-body)',
              fontWeight: 'var(--fw-medium)',
              color: 'var(--text-body)',
              textDecoration: 'none',
              padding: 'var(--space-3) 0',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              marginTop: 'var(--space-2)',
            }}
          >
            <Icon name="user" size={18} />
            {user ? 'My Account' : 'Sign In'}
          </Link>
        </div>
      )}
    </header>
  );
}
