import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@/components/ui';
import api from '@/services/api';

/**
 * Data: one fetch for categories + brands + all products (limit=100, the
 * backend cap), then counts per category+brand are computed client-side.
 * Cached at module level so the menu never refetches on hover/reopen.
 * NOTE: revisit with a backend aggregation endpoint once the catalog
 * approaches ~100 products (see getProducts' limit cap).
 */
let dataPromise = null;

function loadShopMenuData() {
  if (!dataPromise) {
    dataPromise = Promise.all([
      api.get('/categories'),
      api.get('/brands'),
      api.get('/products', { params: { limit: 100 } }),
    ])
      .then(([catRes, brandRes, prodRes]) => {
        const categories = Array.isArray(catRes.data) ? catRes.data : [];
        const brands = Array.isArray(brandRes.data) ? brandRes.data : [];
        const products = prodRes.data?.products ?? [];

        // counts[categoryId][brandId] = number of products
        const counts = {};
        for (const p of products) {
          const c = p.category?._id ?? p.category;
          const b = p.brand?._id ?? p.brand;
          if (!c || !b) continue;
          if (!counts[c]) counts[c] = {};
          counts[c][b] = (counts[c][b] || 0) + 1;
        }

        return categories
          .map((cat) => {
            const brandCounts = counts[cat._id] || {};
            return {
              _id: cat._id,
              name: cat.name,
              total: Object.values(brandCounts).reduce((sum, n) => sum + n, 0),
              brands: brands
                .filter((b) => brandCounts[b._id] > 0)
                .map((b) => ({ _id: b._id, name: b.name, count: brandCounts[b._id] })),
            };
          })
          .filter((cat) => cat.total > 0); // no empty columns
      })
      .catch((err) => {
        dataPromise = null; // allow retry on next mount
        throw err;
      });
  }
  return dataPromise;
}

function useShopMenuData() {
  const [columns, setColumns] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    loadShopMenuData()
      .then((data) => { if (alive) setColumns(data); })
      .catch(() => { if (alive) setError(true); });
    return () => { alive = false; };
  }, []);

  return { columns, loading: columns === null && !error, error };
}

function PanelSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-pulse" style={{ padding: 'var(--space-2)' }}>
      {[1, 2, 3, 4].map((col) => (
        <div key={col} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ height: '14px', width: '70%', background: 'var(--graphite-100)', borderRadius: '4px' }} />
          {[1, 2, 3].map((row) => (
            <div key={row} style={{ height: '10px', width: `${45 + row * 12}%`, background: 'var(--graphite-100)', borderRadius: '4px' }} />
          ))}
        </div>
      ))}
    </div>
  );
}

const brandLinkStyle = {
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--fs-sm)',
  color: 'var(--text-muted)',
  textDecoration: 'none',
  transition: 'color var(--dur-fast) var(--ease-out)',
};

/** Desktop trigger + dropdown panel. Render inside the sticky header (it is the positioned ancestor). */
export default function ShopMegaMenu() {
  const [open, setOpen] = useState(false);
  const { columns, loading, error } = useShopMenuData();
  const location = useLocation();
  const rootRef = useRef(null);
  const closeTimer = useRef(null);

  // Close on navigation
  useEffect(() => { setOpen(false); }, [location]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function onDocClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }
  function cancelClose() {
    clearTimeout(closeTimer.current);
  }

  const isActive = location.pathname === '/shop';

  return (
    <div ref={rootRef} style={{ display: 'contents' }}>
      {/* Trigger */}
      <button
        type="button"
        onMouseEnter={() => { cancelClose(); setOpen(true); }}
        onMouseLeave={scheduleClose}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-sm)',
          fontWeight: isActive ? 'var(--fw-semibold)' : 'var(--fw-medium)',
          color: open || isActive ? 'var(--text-strong)' : 'var(--text-muted)',
          paddingBottom: '2px',
          borderBottom: isActive ? '2px solid var(--text-strong)' : '2px solid transparent',
          transition: 'color 0.15s ease',
        }}
      >
        Shop
        <Icon
          name="chevron-down"
          size={14}
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)' }}
        />
      </button>

      {/* Panel — anchored to the sticky header */}
      {open && (
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 60 }}
        >
          <div className="max-w-7xl mx-auto" style={{ padding: '0 var(--space-6)' }}>
            <div
              style={{
                background: 'var(--white)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-card)',
                boxShadow: 'var(--shadow-lg)',
                padding: 'var(--space-8)',
                marginTop: 'var(--space-2)',
              }}
            >
              {loading && <PanelSkeleton />}

              {error && (
                <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                  Couldn't load categories.{' '}
                  <Link to="/shop" style={{ color: 'var(--text-strong)', fontWeight: 'var(--fw-medium)' }}>
                    Browse all products →
                  </Link>
                </p>
              )}

              {!loading && !error && columns?.length === 0 && (
                <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                  No products yet — check back soon.
                </p>
              )}

              {!loading && !error && columns?.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10">
                  {columns.map((cat) => (
                    <div key={cat._id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontFamily: 'var(--font-sans)' }}>
                      <Link
                        to={`/shop?category=${cat._id}`}
                        style={{
                          fontSize: 'var(--fs-sm)',
                          fontWeight: 'var(--fw-bold)',
                          color: 'var(--text-strong)',
                          textDecoration: 'none',
                        }}
                      >
                        {cat.name}
                      </Link>

                      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        {cat.brands.map((b) => (
                          <li key={b._id}>
                            <Link
                              to={`/shop?category=${cat._id}&brand=${b._id}`}
                              style={brandLinkStyle}
                              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-strong)')}
                              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                            >
                              {b.name} ({b.count})
                            </Link>
                          </li>
                        ))}
                      </ul>

                      <Link
                        to={`/shop?category=${cat._id}`}
                        style={{
                          fontSize: 'var(--fs-xs)',
                          fontWeight: 'var(--fw-semibold)',
                          color: 'var(--text-strong)',
                          textDecoration: 'none',
                          marginTop: 'var(--space-1)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        View All {cat.name} <Icon name="arrow-right" size={12} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Mobile accordion version — same data, rendered inside the mobile menu. */
export function ShopMenuAccordion({ onNavigate }) {
  const [expanded, setExpanded] = useState(false);
  const [openCat, setOpenCat] = useState(null);
  const { columns, loading, error } = useShopMenuData();

  const rowStyle = {
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--fs-body)',
    color: 'var(--text-body)',
    padding: 'var(--space-3) 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    background: 'none',
    border: 'none',
    borderBottom: '1px solid var(--border-subtle)',
    cursor: 'pointer',
    textAlign: 'left',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Top-level Shop row */}
      <button type="button" onClick={() => setExpanded((e) => !e)} aria-expanded={expanded} style={{ ...rowStyle, fontWeight: 'var(--fw-medium)' }}>
        Shop
        <Icon name="chevron-down" size={16} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)' }} />
      </button>

      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 'var(--space-4)' }}>
          {loading && (
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', padding: 'var(--space-3) 0' }}>
              Loading…
            </span>
          )}

          {error && (
            <Link to="/shop" onClick={onNavigate} style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', color: 'var(--text-body)', textDecoration: 'none', padding: 'var(--space-3) 0' }}>
              Browse all products →
            </Link>
          )}

          {!loading && !error && columns?.map((cat) => (
            <div key={cat._id} style={{ display: 'flex', flexDirection: 'column' }}>
              <button
                type="button"
                onClick={() => setOpenCat(openCat === cat._id ? null : cat._id)}
                aria-expanded={openCat === cat._id}
                style={{ ...rowStyle, fontSize: 'var(--fs-sm)' }}
              >
                {cat.name}
                <Icon name="chevron-down" size={14} style={{ transform: openCat === cat._id ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)' }} />
              </button>

              {openCat === cat._id && (
                <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 'var(--space-4)' }}>
                  {cat.brands.map((b) => (
                    <Link
                      key={b._id}
                      to={`/shop?category=${cat._id}&brand=${b._id}`}
                      onClick={onNavigate}
                      style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', textDecoration: 'none', padding: 'var(--space-2) 0' }}
                    >
                      {b.name} ({b.count})
                    </Link>
                  ))}
                  <Link
                    to={`/shop?category=${cat._id}`}
                    onClick={onNavigate}
                    style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', textDecoration: 'none', padding: 'var(--space-2) 0 var(--space-3)' }}
                  >
                    View All {cat.name} →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
