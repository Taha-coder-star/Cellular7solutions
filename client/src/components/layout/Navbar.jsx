import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Logo, Icon } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import ShopMegaMenu, { ShopMenuAccordion } from '@/components/ShopMegaMenu';

const NAV_LINKS = [
  { to: '/buysell', label: 'Buy & Sell' },
  { to: '/repair',  label: 'Repairs' },
  { to: '/about',   label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const FOCUS_RING = { outline: '2px solid var(--brand-primary)', outlineOffset: '2px' };
const NO_RING = { outline: 'none' };

function NavTextLink({ to, label }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <NavLink
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={({ isActive }) => ({
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--fs-sm)',
        fontWeight: isActive ? 'var(--fw-semibold)' : 'var(--fw-medium)',
        color: isActive || hovered || focused ? 'var(--text-strong)' : 'var(--text-muted)',
        textDecoration: 'none',
        transition: 'color 0.15s ease',
        paddingBottom: '2px',
        borderBottom: isActive ? '2px solid var(--brand-primary)' : '2px solid transparent',
        ...(focused ? { ...FOCUS_RING, outlineOffset: '4px' } : NO_RING),
      })}
    >
      {label}
    </NavLink>
  );
}

/** "Deals" leads to the general shop, not a service action — graphite per the Reserved Accent Rule, not a discount-sticker amber. */
function DealsLink({ mobile = false, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const active = hovered || focused;

  return (
    <Link
      to="/shop"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={
        mobile
          ? {
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-body)',
              fontWeight: 'var(--fw-bold)',
              color: active ? 'var(--graphite-700)' : 'var(--brand-primary)',
              textDecoration: 'none',
              padding: 'var(--space-3) 0',
              borderBottom: '1px solid var(--border-subtle)',
              transition: 'color 0.15s ease',
              ...(focused ? FOCUS_RING : NO_RING),
            }
          : {
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-sm)',
              fontWeight: 'var(--fw-bold)',
              color: active ? 'var(--graphite-700)' : 'var(--brand-primary)',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
              paddingBottom: '2px',
              borderBottom: '2px solid transparent',
              ...(focused ? { ...FOCUS_RING, outlineOffset: '4px' } : NO_RING),
            }
      }
    >
      Deals
    </Link>
  );
}

function CartBadge({ count }) {
  if (!count) return null;
  return (
    // Intentionally off the fs- scale: a numeral counter-badge is conventionally 9-11px, distinct from body type sizes.
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
      {count}
    </span>
  );
}

function NavIconLink({ to, ariaLabel, children }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const active = hovered || focused;

  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '44px',
        height: '44px',
        borderRadius: 'var(--radius-sm)',
        color: active ? 'var(--text-strong)' : 'var(--text-muted)',
        background: hovered ? 'var(--graphite-100)' : 'transparent',
        transition: 'var(--transition-base)',
        ...(focused ? FOCUS_RING : NO_RING),
      }}
    >
      {children}
    </Link>
  );
}

/** Search icon that expands into an inline input in place — submits into
 *  the Shop page's existing ?search= filter rather than a separate search flow. */
function NavSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function submit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    setOpen(false);
    setQuery('');
  }

  if (!open) {
    return (
      <button
        type="button"
        aria-label="Search"
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', background: hovered ? 'var(--graphite-100)' : 'transparent',
          transition: 'var(--transition-base)',
        }}
      >
        <Icon name="search" size={20} />
      </button>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
        onBlur={() => { if (!query) setOpen(false); }}
        placeholder="Search products…"
        aria-label="Search products"
        style={{
          width: '220px', height: '40px', padding: '0 14px',
          border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-btn)',
          fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', color: 'var(--text-strong)',
          background: 'var(--white)', outline: 'none', transition: 'var(--transition-base)',
        }}
      />
      <button
        type="button"
        aria-label="Close search"
        onClick={() => { setOpen(false); setQuery(''); }}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '36px', height: '36px', borderRadius: '50%', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', background: 'transparent', transition: 'var(--transition-base)',
        }}
      >
        <Icon name="x" size={18} />
      </button>
    </form>
  );
}

function MobileSearch({ onNavigate }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    onNavigate?.();
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <Icon name="search" size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products…"
        aria-label="Search products"
        style={{
          flex: 1, height: '40px', border: 'none', outline: 'none',
          fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body)', color: 'var(--text-strong)', background: 'transparent',
        }}
      />
    </form>
  );
}

function MenuToggle({ open, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      style={{
        background: hovered ? 'var(--graphite-100)' : 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-strong)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '44px',
        height: '44px',
        borderRadius: 'var(--radius-sm)',
        transition: 'var(--transition-base)',
        ...(focused ? FOCUS_RING : NO_RING),
      }}
    >
      <Icon name={open ? 'x' : 'menu'} size={24} />
    </button>
  );
}

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
      {/* Tagline bar */}
      <div
        style={{
          background: 'var(--graphite-900)',
          padding: '11px 24px',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-sm)',
            fontWeight: 'var(--fw-bold)',
            letterSpacing: '0.05em',
            color: 'var(--white)',
          }}
        >
          You Break It. We Make It Again.
        </span>
      </div>

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
            <NavTextLink key={label} to={to} label={label} />
          ))}
          <DealsLink />
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 'var(--space-2)' }}>
          <NavSearch />

          <NavIconLink to="/cart" ariaLabel={`Cart (${cartCount} items)`}>
            <Icon name="shopping-cart" size={20} />
            <CartBadge count={cartCount} />
          </NavIconLink>

          <NavIconLink to={user ? '/account' : '/login'} ariaLabel={user ? 'My Account' : 'Sign In'}>
            <Icon name="user" size={20} />
          </NavIconLink>
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="flex md:hidden" style={{ alignItems: 'center', gap: 'var(--space-2)' }}>
          <NavIconLink to="/cart" ariaLabel="Cart">
            <Icon name="shopping-cart" size={20} />
            <CartBadge count={cartCount} />
          </NavIconLink>
          <MenuToggle open={mobileOpen} onClick={() => setMobileOpen((o) => !o)} />
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
          <MobileSearch onNavigate={() => setMobileOpen(false)} />
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
          <DealsLink mobile onClick={() => setMobileOpen(false)} />
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
