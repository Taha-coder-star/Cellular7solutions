import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Logo, Icon } from '@/components/ui';
import CategoryNavBar from '@/components/layout/CategoryNavBar';
import MobileNav from '@/components/layout/MobileNav';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

const NAV_LINKS = [
  { to: '/categories/smartphones', label: 'Smartphones' },
  { to: '/categories/laptops', label: 'Laptops' },
  { to: '/categories/gaming', label: 'Gaming' },
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

/** Search icon that expands into an inline input in place — submits into
 *  the Shop page's existing ?search= filter rather than a separate search flow. */
function NavSearch({ open, setOpen }) {
  const [query, setQuery] = useState('');
  const [hovered, setHovered] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // ponytail: reuses the existing /api/products search+limit query instead of a
  // dedicated suggestions endpoint — same relevance ranking, just capped to 5.
  useEffect(() => {
    const q = query.trim();
    if (!q) { setSuggestions([]); return; }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      api.get('/products', { params: { search: q, limit: 5 }, signal: controller.signal })
        .then((res) => setSuggestions(res.data.products || []))
        .catch(() => {});
    }, 200);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);

  function submit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    setOpen(false);
    setQuery('');
  }

  function goToProduct(p) {
    navigate(`/product/${p._id}`);
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
    <div style={{ position: 'relative' }}>
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
            width: '44px', height: '44px', borderRadius: '50%', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', background: 'transparent', transition: 'var(--transition-base)',
          }}
        >
          <Icon name="x" size={18} />
        </button>
      </form>

      {suggestions.length > 0 && (
        <ul
          role="listbox"
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, width: '220px',
            background: 'var(--white)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md, 0 4px 16px rgba(0,0,0,0.1))',
            listStyle: 'none', margin: 0, padding: 'var(--space-1) 0', zIndex: 60,
          }}
        >
          {suggestions.map((p) => (
            <li key={p._id}>
              <button
                type="button"
                // onMouseDown fires before the input's onBlur closes the dropdown
                onMouseDown={() => goToProduct(p)}
                style={{
                  display: 'flex', flexDirection: 'column', width: '100%', textAlign: 'left',
                  padding: 'var(--space-2) 14px', border: 'none', background: 'transparent', cursor: 'pointer',
                }}
              >
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', color: 'var(--text-strong)' }}>
                  {p.name}
                </span>
                {p.category?.name && (
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                    in {p.category.name}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
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
  const [searchOpen, setSearchOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

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
          {NAV_LINKS.map(({ to, label }) => (
            <NavTextLink key={label} to={to} label={label} />
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 'var(--space-2)' }}>
          <NavSearch open={searchOpen} setOpen={setSearchOpen} />
          {isAdmin && <NavTextLink to="/admin" label="Admin" />}
        </div>

        {/* Mobile: search + hamburger */}
        <div className="flex md:hidden" style={{ alignItems: 'center', gap: 'var(--space-2)' }}>
          <NavSearch open={searchOpen} setOpen={setSearchOpen} />
          <MenuToggle open={mobileOpen} onClick={() => setMobileOpen((o) => !o)} />
        </div>
      </div>

      <CategoryNavBar />

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onOpenSearch={() => { setMobileOpen(false); setSearchOpen(true); }}
        isAdmin={isAdmin}
      />
    </header>
  );
}
