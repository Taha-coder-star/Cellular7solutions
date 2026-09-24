import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui';
import { productImageSrc, productImageSrcSet } from '@/utils/image';
import { whatsappLink } from '@/utils/whatsapp';
import { useTopCategories } from '@/hooks/useTopCategories';

// Mobile-only (below `md`) redesign of the product listing content area, matching
// the reference screenshot's structure. Rendered by Shop.jsx inside a `md:hidden`
// wrapper; desktop/tablet keep the existing layout untouched. All product data,
// filters, and pagination are driven by Shop's real state via props — no mock data.
//
// Accent rules: near-black (--graphite-900) is the primary action colour,
// including the WhatsApp CTAs — recognizability comes from the icon/label, not
// a green block. Cobalt (--cobalt-600) is reserved strictly for the selected
// category pill. Green is used only as a subtle "in stock" indicator.

// Wishlist is client-only — there's no favorites field on the User model or a
// wishlist endpoint. ponytail: localStorage set; move to an API when it needs
// to sync across devices. Shared key with CatalogGrid so favourites persist.
const WISHLIST_KEY = 'cs_wishlist';
const readWishlist = () => {
  try { return new Set(JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []); }
  catch { return new Set(); }
};

const WhatsappGlyph = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.5 9.5 0 0 1-4.83-1.32l-.35-.2-3.59.94.96-3.5-.23-.36a9.46 9.46 0 0 1-1.45-5.05c0-5.24 4.27-9.5 9.51-9.5a9.44 9.44 0 0 1 6.72 2.79 9.44 9.44 0 0 1 2.78 6.72c0 5.24-4.27 9.5-9.5 9.5zm5.6-15.1A11.42 11.42 0 0 0 12.04.5C5.74.5.6 5.64.6 11.94c0 2.02.53 4 1.53 5.74L.5 23.5l6-1.57a11.4 11.4 0 0 0 5.54 1.41h.01c6.3 0 11.44-5.14 11.44-11.44 0-3.06-1.19-5.94-3.35-8.1z" />
  </svg>
);

function ProductTile({ product, saved, onToggle }) {
  const soldOut = product.stock === 0;
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ position: 'relative', aspectRatio: '1 / 1', padding: '18px', background: '#f5f5f7', borderRadius: 'var(--radius-card)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
          {product.image ? (
            <img
              src={productImageSrc(product.image, 400)}
              srcSet={productImageSrcSet(product.image)}
              sizes="45vw"
              alt={product.name}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
            />
          ) : (
            <Icon name="smartphone" size={64} strokeWidth={1.25} color="var(--graphite-300)" />
          )}
        </div>
      </Link>

      {/* Favourite toggle */}
      <button
        type="button"
        onClick={() => onToggle(product._id)}
        aria-pressed={saved}
        aria-label={saved ? 'Remove from favourites' : 'Add to favourites'}
        style={{
          position: 'absolute', top: '8px', right: '8px',
          display: 'grid', placeItems: 'center', width: '32px', height: '32px',
          borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: saved ? 'var(--graphite-900)' : 'rgba(255,255,255,0.92)',
          color: saved ? '#fff' : 'var(--graphite-500)',
          boxShadow: '0 1px 4px rgba(24,24,27,0.10)', transition: 'var(--transition-base)',
        }}
      >
        <Icon name="heart" size={14} fill={saved ? 'currentColor' : 'none'} />
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {product.brand && (
          <span style={{ fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            {product.brand}
          </span>
        )}
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
          <span title={product.name} style={{
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            fontSize: '13.5px', fontWeight: 700, lineHeight: 1.35, color: 'var(--text-strong)', minHeight: '36px',
          }}>
            {product.name}
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: '2px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 500, minWidth: 0 }}>
            {soldOut ? (
              <span style={{ color: 'var(--danger-500)' }}>Out of stock</span>
            ) : (
              <>
                <span aria-hidden="true" style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--success-500)', flexShrink: 0 }} />
                <span style={{ color: 'var(--success-700)', fontWeight: 600 }}>In stock</span>
              </>
            )}
          </span>
          <a
            href={whatsappLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={soldOut}
            aria-label={soldOut ? 'Sold out' : 'Ask on WhatsApp'}
            title={soldOut ? 'Sold out' : 'Ask on WhatsApp'}
            style={{
              flexShrink: 0, display: 'grid', placeItems: 'center', width: '34px', height: '34px',
              borderRadius: '50%', textDecoration: 'none',
              background: soldOut ? 'var(--graphite-200)' : 'var(--graphite-900)',
              color: soldOut ? 'var(--graphite-500)' : '#fff',
              pointerEvents: soldOut ? 'none' : 'auto',
            }}
          >
            <WhatsappGlyph size={15} />
          </a>
        </div>
      </div>
    </div>
  );
}

function TileSkeleton() {
  return (
    <div style={{ borderRadius: '10px', overflow: 'hidden', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}>
      <div className="animate-pulse" style={{ aspectRatio: '1 / 1', background: 'var(--graphite-100)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px' }}>
        <div className="animate-pulse" style={{ height: '9px', width: '40%', background: 'var(--graphite-100)', borderRadius: '4px' }} />
        <div className="animate-pulse" style={{ height: '13px', width: '85%', background: 'var(--graphite-100)', borderRadius: '4px' }} />
        <div className="animate-pulse" style={{ height: '34px', width: '100%', background: 'var(--graphite-100)', borderRadius: '7px', marginTop: '4px' }} />
      </div>
    </div>
  );
}

const CONDITIONS = [
  { value: '', label: 'Any condition' },
  { value: 'new', label: 'New' },
  { value: 'used', label: 'Used' },
];

function FilterChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flexShrink: 0, padding: '7px 14px', borderRadius: 'var(--radius-pill)',
        fontSize: '12.5px', fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer',
        background: active ? 'var(--graphite-900)' : 'var(--surface-card)',
        color: active ? '#fff' : 'var(--text-body)',
        border: `1px solid ${active ? 'var(--graphite-900)' : 'var(--border-subtle)'}`,
      }}
    >
      {label}
    </button>
  );
}

function FilterSheet({ filters, brands, onFilter, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(24,24,27,0.45)', display: 'flex', alignItems: 'flex-end' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', background: 'var(--surface-card)', borderRadius: '20px 20px 0 0',
          padding: '12px 18px calc(20px + env(safe-area-inset-bottom))',
          display: 'flex', flexDirection: 'column', gap: '18px', fontFamily: 'var(--font-sans)',
        }}
      >
        <div style={{ width: '36px', height: '4px', borderRadius: '4px', background: 'var(--border-strong)', alignSelf: 'center' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-strong)' }}>Brand</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <FilterChip label="All brands" active={!filters.brand} onClick={() => onFilter({ brand: undefined })} />
            {brands.map((b) => (
              <FilterChip key={b._id} label={b.name} active={filters.brand === b._id} onClick={() => onFilter({ brand: b._id })} />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-strong)' }}>Condition</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {CONDITIONS.map((c) => (
              <FilterChip key={c.value} label={c.label} active={(filters.condition || '') === c.value} onClick={() => onFilter({ condition: c.value || undefined })} />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{ height: '48px', borderRadius: '14px', border: 'none', background: 'var(--graphite-900)', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

/**
 * @param {object[]} products  Shop's normalized products (including brand and image)
 * @param {string}   categoryName  heading text ("Accessories", "All Products"…)
 * @param {string}   activeCategoryId  currently filtered category id (or '')
 * @param {object}   filters  { brand, condition, search, ... } from Shop
 * @param {object[]} brands   brand list for the brand filter
 * @param {function} onFilter  updateFilters(patch) from Shop
 * @param {function} onSearch  (value) => updateFilters({ search })
 */
export default function MobileProductListing({
  products = [], loading, error, total = 0,
  page = 1, pages = 1, loadMore, loadingMore,
  categoryName = 'Products', activeCategoryId = '',
  filters = {}, brands = [], onFilter, onSearch,
}) {
  const { categories } = useTopCategories(8);
  const [wishlist, setWishlist] = useState(readWishlist);
  const [searchDraft, setSearchDraft] = useState(filters.search || '');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [chipsAtEnd, setChipsAtEnd] = useState(false);
  const chipScrollerRef = useRef(null);

  // Collapse the title/count row once the user scrolls past it, so the
  // header doesn't keep spending space on info they've already seen.
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const pills = [{ _id: '', name: 'All' }, ...(categories ?? [])];
  const activeFilterCount = (filters.brand ? 1 : 0) + (filters.condition ? 1 : 0);

  // Re-check overflow once the real category list renders (starts as just "All").
  useEffect(() => { checkChipsEnd(); }, [pills.length]);

  function toggleWishlist(id) {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  function submitSearch(e) {
    e.preventDefault();
    onSearch?.(searchDraft.trim() || undefined);
  }

  // Hides the "more chips" fade once the row is scrolled to its end (or
  // never overflowed in the first place).
  function checkChipsEnd() {
    const el = chipScrollerRef.current;
    if (!el) return;
    setChipsAtEnd(el.scrollWidth - el.scrollLeft - el.clientWidth < 4);
  }

  return (
    <div style={{ background: 'var(--surface-subtle)', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      {/* Header: heading + count + bell. Not sticky — the site Navbar above is
          already sticky at top:0, and a second sticky region at the same
          offset would scroll underneath it and get clipped. */}
      <header style={{ padding: '8px 16px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: compact ? '17px' : '20px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-strong)', lineHeight: 1.15, transition: 'font-size 0.2s ease' }}>
              {categoryName}
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: 'var(--text-muted)', maxHeight: compact ? '0px' : '16px', opacity: compact ? 0 : 1, overflow: 'hidden', transition: 'max-height 0.2s ease, opacity 0.2s ease' }} aria-live="polite">
              {loading ? 'Loading…' : `${products.length} of ${total} product${total === 1 ? '' : 's'}`}
            </p>
          </div>
          <button type="button" className="hdr-btn" aria-label="Notifications" style={{ flexShrink: 0 }}>
            <Icon name="bell" size={18} />
          </button>
        </div>

        {/* Search — the primary way to find a product. */}
        <form onSubmit={submitSearch} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', padding: '0 14px', height: '48px', background: 'var(--surface-card)', border: '1.5px solid var(--graphite-300)', borderRadius: '10px' }}>
          <Icon name="search" size={19} color="var(--graphite-900)" strokeWidth={2.25} />
          <input
            type="search"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder={`Search ${categoryName === 'All Products' ? 'products' : categoryName}`}
            aria-label="Search products"
            style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontSize: '15px', color: 'var(--text-strong)', fontFamily: 'var(--font-sans)' }}
          />
        </form>

        {/* Category pills (scrollable, left) + Filters (fixed, right) share
            one row instead of stacking as separate strips. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <div
              ref={chipScrollerRef}
              onScroll={checkChipsEnd}
              style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingRight: '18px', scrollbarWidth: 'none' }}
            >
              {pills.map((c) => {
                const active = activeCategoryId === c._id || (!activeCategoryId && c._id === '');
                return (
                  <Link
                    key={c._id || 'all'}
                    to={c._id ? `/shop?category=${c._id}` : '/shop'}
                    style={{
                      flexShrink: 0, textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
                      height: '30px', padding: '0 14px', borderRadius: 'var(--radius-pill)', boxSizing: 'border-box',
                      fontSize: '12.5px', fontWeight: 600, whiteSpace: 'nowrap',
                      background: active ? 'var(--graphite-900)' : 'var(--surface-card)',
                      color: active ? '#fff' : 'var(--text-body)',
                      border: `1px solid ${active ? 'var(--graphite-900)' : 'var(--border-subtle)'}`,
                    }}
                  >
                    {c.name}
                  </Link>
                );
              })}
            </div>

            {/* Fade hints that the chip row scrolls further right; fades out
                once the row is scrolled to its end. */}
            {!chipsAtEnd && (
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', top: 0, right: 0, bottom: 0, width: '24px',
                  background: 'linear-gradient(to right, transparent, #fff)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>

          {/* Filters — brand + condition collapse into one sheet instead of
              two dropdown rows, and now sits in the chip row instead of
              its own strip. */}
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px', height: '30px', padding: '0 13px', boxSizing: 'border-box',
              borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-subtle)',
              background: 'var(--surface-card)', cursor: 'pointer',
              fontSize: '12.5px', fontWeight: 600, color: 'var(--text-strong)', fontFamily: 'var(--font-sans)',
            }}
          >
            <Icon name="sliders" size={13} />
            Filters
            {activeFilterCount > 0 && (
              <span style={{ display: 'grid', placeItems: 'center', minWidth: '16px', height: '16px', padding: '0 4px', borderRadius: '8px', background: 'var(--cobalt-600)', color: '#fff', fontSize: '10px', fontWeight: 700 }}>
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {sheetOpen && (
        <FilterSheet filters={filters} brands={brands} onFilter={onFilter} onClose={() => setSheetOpen(false)} />
      )}

      {/* Grid / states */}
      <main style={{ padding: '8px 16px 24px' }}>
        {error ? (
          <p style={{ textAlign: 'center', padding: '64px 16px', fontSize: '14px', color: 'var(--text-muted)' }}>
            Couldn't load products. Check your connection and try again.
          </p>
        ) : !loading && products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '56px 16px' }}>
            <p style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 600, color: 'var(--text-strong)' }}>No products match these filters.</p>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Try clearing a filter or searching something else.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <TileSkeleton key={i} />)
              : products.map((p) => (
                  <ProductTile key={p._id} product={p} saved={wishlist.has(p._id)} onToggle={toggleWishlist} />
                ))}
          </div>
        )}

        {!loading && !error && page < pages && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              style={{ height: '44px', padding: '0 24px', borderRadius: '12px', border: '1px solid var(--border-strong)', background: 'var(--surface-card)', fontSize: '14px', fontWeight: 600, color: 'var(--text-strong)', cursor: 'pointer' }}
            >
              {loadingMore ? 'Loading…' : 'Load more'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
