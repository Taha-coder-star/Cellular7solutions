import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Logo, Icon } from '@/components/ui';
import CategoryNavBar from '@/components/layout/CategoryNavBar';
import MobileNav from '@/components/layout/MobileNav';
import api from '@/services/api';
import { REPAIR_CATEGORIES } from '@/data/repairServices';
import '@/styles/repairJourney.css';

const NAV_LINKS = [
  { to: '/categories/smartphones', label: 'Smartphones' },
  { to: '/categories/laptops', label: 'Laptops' },
  { to: '/categories/gaming', label: 'Gaming' },
  { to: '/buysell', label: 'Buy & Sell' },
  { to: '/repair',  label: 'Repairs', mega: true },
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

/** Repairs mega menu (disclosure pattern). The "Repairs" link still navigates; the chevron button next to it
 *  toggles the panel for keyboard and touch. A mouse also opens it on hover. Escape, clicking outside, tabbing
 *  away or following a link closes it, and the closed panel stays out of the tab order. */
function RepairsMegaMenu({ to, label }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e) { if (!rootRef.current?.contains(e.target)) setOpen(false); }
    function onKeyDown(e) {
      if (e.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const hover = (next) => (e) => { if (e.pointerType === 'mouse') setOpen(next); };

  return (
    <div
      ref={rootRef}
      className={`nav-mega${open ? ' is-open' : ''}`}
      onPointerEnter={hover(true)}
      onPointerLeave={hover(false)}
      onBlur={(e) => { if (!rootRef.current?.contains(e.relatedTarget)) setOpen(false); }}
    >
      <NavTextLink to={to} label={label} />
      <button
        ref={buttonRef}
        type="button"
        className="nav-mega-toggle"
        aria-expanded={open}
        aria-controls="nav-mega-repairs"
        aria-label={`${open ? 'Hide' : 'Show'} repair services`}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="chevron-down" size={16} />
      </button>
      <div id="nav-mega-repairs" className="nav-mega-panel" onClick={(e) => e.target.closest('a') && setOpen(false)}>
        <div className="nav-mega-grid">
          {REPAIR_CATEGORIES.map(({ slug, title, repairs }) => (
            <div key={slug}>
              <Link className="nav-mega-heading" to={`/repair/${slug}`}>{title}</Link>
              <ul>
                {repairs.map((r) => <li key={r.slug}><Link to={`/repair/${slug}/${r.slug}`}>{r.name}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <Link className="nav-mega-all" to="/repair">All repairs and request form <Icon name="arrow-right" size={16} /></Link>
      </div>
    </div>
  );
}

/** Search icon that expands into an inline input in place — submits into
 *  the Shop page's existing ?search= filter rather than a separate search flow. */
function NavSearch({ open, setOpen }) {
  const [query, setQuery] = useState('');
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
        className="hdr-btn"
        aria-label="Search"
        onClick={() => setOpen(true)}
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
  return (
    <button
      type="button"
      className="hdr-btn"
      onClick={onClick}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
    >
      <Icon name={open ? 'x' : 'menu'} size={24} />
    </button>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Compact header on scroll — collapses the tagline bar and shortens the
  // logo row so the header doesn't eat a fixed 108px+ on every page.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="storefront-navbar"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--surface-page)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* Tagline bar — collapses when scrolled */}
      <div
        style={{
          background: 'var(--graphite-900)',
          padding: scrolled ? '0 24px' : '11px 24px',
          maxHeight: scrolled ? '0px' : '40px',
          overflow: 'hidden',
          textAlign: 'center',
          transition: 'max-height 0.25s ease, padding 0.25s ease',
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
          position: 'relative',
          height: scrolled ? '52px' : '72px',
          padding: '0 var(--space-6)',
          transition: 'height 0.25s ease',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <Logo variant="full" tone="light" height={36} />
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex" style={{ gap: 'var(--space-8)', alignItems: 'center', alignSelf: 'stretch' }}>
          {NAV_LINKS.map(({ to, label, mega }) => mega ? (
            <RepairsMegaMenu key={label} to={to} label={label} />
          ) : (
            <NavTextLink key={label} to={to} label={label} />
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex" style={{ alignItems: 'center', gap: 'var(--space-2)' }}>
          <NavSearch open={searchOpen} setOpen={setSearchOpen} />
        </div>

        {/* Mobile: search + hamburger */}
        <div className="flex lg:hidden" style={{ alignItems: 'center', gap: 'var(--space-2)' }}>
          <NavSearch open={searchOpen} setOpen={setSearchOpen} />
          <MenuToggle open={mobileOpen} onClick={() => setMobileOpen((o) => !o)} />
        </div>
      </div>

      <CategoryNavBar />

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onOpenSearch={() => { setMobileOpen(false); setSearchOpen(true); }}
      />
    </header>
  );
}
