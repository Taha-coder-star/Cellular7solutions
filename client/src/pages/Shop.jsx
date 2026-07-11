import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '@/services/api';
import { useCart } from '@/context/CartContext';
import { Button, Input, Select, Badge, Icon, ProductCard } from '@/components/ui';

const PAGE_SIZE = 12;

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const groupLabelStyle = {
  fontSize: 'var(--fs-xs)',
  fontWeight: 'var(--fw-bold)',
  letterSpacing: 'var(--ls-wide)',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  marginBottom: '10px',
};

function normalizeProduct(p) {
  return {
    _id: p._id,
    name: p.name,
    brand: p.brand?.name ?? '',
    price: p.price,
    image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
    condition: p.condition,
    stock: p.stock,
  };
}

function sortProducts(products, sort) {
  if (sort === 'price-asc') return [...products].sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') return [...products].sort((a, b) => b.price - a.price);
  return products; // 'newest' — server already returns createdAt desc
}

function ProductCardSkeleton() {
  return (
    <div
      className="animate-pulse"
      style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}
    >
      <div style={{ aspectRatio: '1 / 1', background: 'var(--graphite-100)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: 'var(--pad-card)' }}>
        <div style={{ height: '11px', width: '35%', background: 'var(--graphite-100)', borderRadius: '4px' }} />
        <div style={{ height: '18px', width: '85%', background: 'var(--graphite-100)', borderRadius: '4px' }} />
        <div style={{ height: '22px', width: '45%', background: 'var(--graphite-100)', borderRadius: '4px' }} />
        <div style={{ height: 'var(--control-h)', width: '100%', background: 'var(--graphite-100)', borderRadius: 'var(--radius-btn)', marginTop: '6px' }} />
      </div>
    </div>
  );
}

/** Presentational custom radio — real `<input type="radio">` under the hood
 *  (grouped by `name`) so keyboard/AT semantics come for free. */
function RadioRow({ name, label, count, selected, onSelect }) {
  const [hover, setHover] = useState(false);
  return (
    <label
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        padding: '7px 8px',
        margin: '0 -8px',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        fontSize: 'var(--fs-sm)',
        color: selected ? 'var(--text-strong)' : 'var(--text-body)',
        fontWeight: selected ? 'var(--fw-semibold)' : 'var(--fw-regular)',
        background: hover ? 'var(--surface-subtle)' : 'transparent',
        transition: 'var(--transition-base)',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="radio"
          name={name}
          checked={selected}
          onChange={onSelect}
          style={{ margin: 0, accentColor: 'var(--graphite-900)', width: '16px', height: '16px', flexShrink: 0 }}
        />
        {label}
      </span>
      {count != null && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-faint)' }}>{count}</span>}
    </label>
  );
}

function Chip({ label, onRemove }) {
  const [hover, setHover] = useState(false);
  return (
    <span
      className="chip-pop"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        height: '30px',
        padding: '0 6px 0 12px',
        borderRadius: 'var(--radius-pill)',
        background: 'var(--graphite-100)',
        fontSize: 'var(--fs-xs)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)',
      }}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-label={`Remove ${label} filter`}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px',
          borderRadius: '50%', border: 'none', cursor: 'pointer', transition: 'var(--transition-base)',
          background: hover ? 'var(--graphite-300)' : 'transparent',
          color: hover ? 'var(--text-strong)' : 'var(--text-muted)',
        }}
      >
        <Icon name="x" size={12} />
      </button>
    </span>
  );
}

function FiltersTriggerButton({ onClick, activeCount }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      className="lg:hidden"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px', height: 'var(--control-h-sm)', padding: '0 16px',
        border: `1px solid ${hover ? 'var(--graphite-900)' : 'var(--border-strong)'}`, borderRadius: 'var(--radius-btn)',
        background: hover ? 'var(--surface-subtle)' : 'var(--white)',
        fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', cursor: 'pointer',
        transition: 'var(--transition-base)',
      }}
    >
      Filters
      {activeCount > 0 && <Badge tone="dark">{activeCount}</Badge>}
    </button>
  );
}

function SheetCloseButton({ onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label="Close filters"
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px',
        borderRadius: '50%', border: 'none', cursor: 'pointer', transition: 'var(--transition-base)',
        background: hover ? 'var(--graphite-300)' : 'var(--graphite-100)',
      }}
    >
      <Icon name="x" size={18} />
    </button>
  );
}

/** Native <details>/<summary> accordion — collapse/expand, keyboard toggle,
 *  and focus handling all come from the platform for free. `defaultOpen` is
 *  read once at mount (native <details> semantics); after that the user's
 *  own toggle wins, which is the behavior a disclosure widget should have. */
function FilterSection({ title, defaultOpen, children }) {
  return (
    <details className="filter-section" open={defaultOpen}>
      <summary
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '4px 0', ...groupLabelStyle, marginBottom: 0,
        }}
      >
        {title}
        <Icon name="chevron-down" size={14} className="filter-chevron" style={{ transition: 'var(--transition-base)', color: 'var(--text-faint)' }} />
      </summary>
      <div style={{ paddingTop: '10px' }}>{children}</div>
    </details>
  );
}

const sectionDividerStyle = { borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px' };

function FilterPanel({ categories, brands, filters, counts, onFilterChange }) {
  const [minPrice, setMinPrice] = useState(filters.minPrice ?? '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice ?? '');

  useEffect(() => {
    setMinPrice(filters.minPrice ?? '');
    setMaxPrice(filters.maxPrice ?? '');
  }, [filters.minPrice, filters.maxPrice]);

  function submitPrice(e) {
    e.preventDefault();
    onFilterChange({ minPrice: minPrice || undefined, maxPrice: maxPrice || undefined });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Input
        label="Search"
        placeholder="Search products…"
        icon={<Icon name="search" size={16} />}
        defaultValue={filters.search ?? ''}
        onKeyDown={(e) => { if (e.key === 'Enter') onFilterChange({ search: e.currentTarget.value || undefined }); }}
        onBlur={(e) => onFilterChange({ search: e.currentTarget.value || undefined })}
      />

      <FilterSection title="Category" defaultOpen>
        <div style={sectionDividerStyle}>
          <RadioRow name="category" label="All Categories" count={counts.total} selected={!filters.category} onSelect={() => onFilterChange({ category: undefined })} />
          {categories.map((c) => (
            <RadioRow key={c._id} name="category" label={c.name} count={counts.categories[c._id] ?? 0} selected={filters.category === c._id} onSelect={() => onFilterChange({ category: c._id })} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Brand" defaultOpen={Boolean(filters.brand)}>
        <div style={sectionDividerStyle}>
          <RadioRow name="brand" label="All Brands" count={counts.total} selected={!filters.brand} onSelect={() => onFilterChange({ brand: undefined })} />
          {brands.map((b) => (
            <RadioRow key={b._id} name="brand" label={b.name} count={counts.brands[b._id] ?? 0} selected={filters.brand === b._id} onSelect={() => onFilterChange({ brand: b._id })} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Condition" defaultOpen>
        <div style={sectionDividerStyle}>
          <RadioRow name="condition" label="All" count={counts.total} selected={!filters.condition} onSelect={() => onFilterChange({ condition: undefined })} />
          <RadioRow name="condition" label="New" count={counts.new} selected={filters.condition === 'new'} onSelect={() => onFilterChange({ condition: 'new' })} />
          <RadioRow name="condition" label="Used" count={counts.used} selected={filters.condition === 'used'} onSelect={() => onFilterChange({ condition: 'used' })} />
        </div>
      </FilterSection>

      <FilterSection title="Price" defaultOpen>
        <form onSubmit={submitPrice} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Input type="number" inputMode="numeric" min="0" placeholder="Min" aria-label="Minimum price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={{ height: 'var(--control-h-sm)' }} />
            <span style={{ color: 'var(--text-faint)' }}>–</span>
            <Input type="number" inputMode="numeric" min="0" placeholder="Max" aria-label="Maximum price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={{ height: 'var(--control-h-sm)' }} />
          </div>
          <Button type="submit" variant="secondary" size="sm">Apply</Button>
        </form>
      </FilterSection>
    </div>
  );
}

const SHEET_EXIT_MS = 220;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const sheetRef = useRef(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Native <dialog> shows/hides instantly — layer a transform/opacity
  // transition on top by toggling `sheetOpen` shortly after showModal() (so
  // the closed state paints first), and delay the imperative close() until
  // the exit transition finishes. A short timeout rather than
  // requestAnimationFrame — rAF is throttled to near-zero in backgrounded/
  // occluded tabs, and this only needs to land within a perceptibly instant
  // window, not sync to a paint frame.
  function openSheet() {
    sheetRef.current?.showModal();
    setTimeout(() => setSheetOpen(true), 20);
  }
  function closeSheet() {
    setSheetOpen(false);
    setTimeout(() => sheetRef.current?.close(), SHEET_EXIT_MS);
  }

  // Keyed off the query string, not `searchParams` itself — react-router
  // hands back a new URLSearchParams instance most renders, which would
  // otherwise bust this memo (and the products effect below) every render.
  const searchString = searchParams.toString();
  const filters = useMemo(() => ({
    category: searchParams.get('category') || undefined,
    brand: searchParams.get('brand') || undefined,
    condition: searchParams.get('condition') || undefined,
    minPrice: searchParams.get('minPrice') || undefined,
    maxPrice: searchParams.get('maxPrice') || undefined,
    search: searchParams.get('search') || undefined,
  }), [searchString]);

  const [sort, setSort] = useState('newest');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [counts, setCounts] = useState({ total: 0, categories: {}, brands: {}, new: 0, used: 0 });
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  // Filter option lists and their counts — fetched once. A failure here
  // just leaves the sidebar showing "All Categories / All Brands" with no
  // counts; it doesn't block the grid. Counts come from a single unfiltered
  // fetch (the whole catalog fits under the API's 100-item cap) rather than
  // one request per category/brand.
  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data ?? [])).catch(() => {});
    api.get('/brands').then(({ data }) => setBrands(data ?? [])).catch(() => {});
    api.get('/products', { params: { limit: 100 } }).then(({ data }) => {
      const all = data.products ?? [];
      const next = { total: all.length, categories: {}, brands: {}, new: 0, used: 0 };
      for (const p of all) {
        const catId = p.category?._id ?? p.category;
        const brandId = p.brand?._id ?? p.brand;
        if (catId) next.categories[catId] = (next.categories[catId] ?? 0) + 1;
        if (brandId) next.brands[brandId] = (next.brands[brandId] ?? 0) + 1;
        if (p.condition === 'new') next.new += 1;
        else if (p.condition === 'used') next.used += 1;
      }
      setCounts(next);
    }).catch(() => {});
  }, []);

  // Products — refetch from page 1 whenever a filter changes.
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(false);

    api
      .get('/products', { params: { ...filters, page: 1, limit: PAGE_SIZE } })
      .then(({ data }) => {
        if (!alive) return;
        setProducts((data.products ?? []).map(normalizeProduct));
        setPage(1);
        setPages(data.pages ?? 1);
        setTotal(data.total ?? 0);
      })
      .catch(() => { if (alive) setError(true); })
      .finally(() => { if (alive) setLoading(false); });

    return () => { alive = false; };
  }, [filters]);

  function loadMore() {
    const nextPage = page + 1;
    setLoadingMore(true);
    api
      .get('/products', { params: { ...filters, page: nextPage, limit: PAGE_SIZE } })
      .then(({ data }) => {
        setProducts((prev) => [...prev, ...(data.products ?? []).map(normalizeProduct)]);
        setPage(nextPage);
      })
      .catch(() => setError(true))
      .finally(() => setLoadingMore(false));
  }

  function updateFilters(patch) {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value === undefined || value === '') next.delete(key);
      else next.set(key, value);
    });
    setSearchParams(next, { replace: true });
  }

  function clearAllFilters() {
    setSearchParams({}, { replace: true });
  }

  const sortedProducts = useMemo(() => sortProducts(products, sort), [products, sort]);
  const activeCategory = categories.find((c) => c._id === filters.category);
  const activeBrand = brands.find((b) => b._id === filters.brand);
  const activeCount = Object.values(filters).filter(Boolean).length;

  const pageTitle = filters.search
    ? `Results for "${filters.search}"`
    : activeCategory?.name ?? 'All Products';

  const filterPanelProps = { categories, brands, filters, counts, onFilterChange: updateFilters };

  const clearAllLink = activeCount > 0 && (
    <button
      type="button"
      onClick={clearAllFilters}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', textDecoration: 'underline' }}
    >
      Clear all
    </button>
  );

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', padding: '24px var(--space-6) 20px' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginBottom: '14px' }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span aria-hidden="true">/</span>
            <Link
              to="/shop"
              style={{ color: activeCategory ? 'inherit' : 'var(--text-strong)', textDecoration: 'none', fontWeight: activeCategory ? 'var(--fw-regular)' : 'var(--fw-semibold)' }}
            >
              Shop
            </Link>
            {activeCategory && (
              <>
                <span aria-hidden="true">/</span>
                <span style={{ color: 'var(--text-strong)', fontWeight: 'var(--fw-semibold)' }}>{activeCategory.name}</span>
              </>
            )}
          </nav>
          <h1 style={{ margin: '0 0 6px', fontSize: 'var(--fs-h1)', fontWeight: 'var(--fw-extrabold)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>
            {pageTitle}
          </h1>
          <p style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }} aria-live="polite">
            {loading ? 'Loading…' : `${total} result${total === 1 ? '' : 's'}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]" style={{ maxWidth: '1360px', margin: '0 auto', padding: '32px var(--space-6) 96px', gap: '48px', alignItems: 'start' }}>
        {/* Desktop filter rail */}
        <aside className="hidden lg:block" style={{ position: 'sticky', top: '96px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>Filters</span>
            {clearAllLink}
          </div>
          <FilterPanel {...filterPanelProps} />
        </aside>

        <div style={{ minWidth: 0 }}>
          {/* Toolbar: mobile filters trigger + sort (all breakpoints) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <FiltersTriggerButton onClick={openSheet} activeCount={activeCount} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
              <label htmlFor="shop-sort" style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Sort by</label>
              <Select id="shop-sort" value={sort} onChange={(e) => setSort(e.target.value)} options={SORTS} style={{ height: 'var(--control-h-sm)', minWidth: '190px' }} />
            </div>
          </div>

          {/* Active filter chips */}
          {activeCount > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {activeCategory && <Chip label={activeCategory.name} onRemove={() => updateFilters({ category: undefined })} />}
              {activeBrand && <Chip label={activeBrand.name} onRemove={() => updateFilters({ brand: undefined })} />}
              {filters.condition && <Chip label={filters.condition === 'new' ? 'New' : 'Used'} onRemove={() => updateFilters({ condition: undefined })} />}
              {(filters.minPrice || filters.maxPrice) && (
                <Chip
                  label={`$${filters.minPrice || '0'} – ${filters.maxPrice ? `$${filters.maxPrice}` : 'any'}`}
                  onRemove={() => updateFilters({ minPrice: undefined, maxPrice: undefined })}
                />
              )}
              {filters.search && <Chip label={`"${filters.search}"`} onRemove={() => updateFilters({ search: undefined })} />}
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <p style={{ margin: '0 0 16px', fontSize: 'var(--fs-body)', color: 'var(--text-muted)' }}>
                We couldn't load products right now. Check your connection and try again.
              </p>
              <Button variant="secondary" onClick={() => updateFilters({})}>Try again</Button>
            </div>
          )}

          {/* Empty */}
          {!error && !loading && sortedProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <p style={{ margin: '0 0 8px', fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>
                No products match these filters.
              </p>
              <p style={{ margin: '0 0 20px', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                Try widening your search or clearing a filter.
              </p>
              <Button variant="secondary" onClick={clearAllFilters}>Clear all filters</Button>
            </div>
          )}

          {/* Grid */}
          {!error && (loading || sortedProducts.length > 0) && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                {loading && Array.from({ length: PAGE_SIZE }).map((_, i) => <ProductCardSkeleton key={i} />)}
                {!loading && sortedProducts.map((p, i) => (
                  <div key={p._id} className="grid-fade-up" style={{ animationDelay: `${Math.min(i, 9) * 40}ms` }}>
                    <ProductCard product={p} to={`/product/${p._id}`} onAdd={() => addToCart(p)} />
                  </div>
                ))}
              </div>

              {!loading && page < pages && (
                <div style={{ textAlign: 'center', marginTop: '44px' }}>
                  <Button variant="secondary" onClick={loadMore} disabled={loadingMore}>
                    {loadingMore ? 'Loading more…' : 'Load more'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter sheet — dialog pops instantly by nature, so the
          transform/opacity transition is layered on via `sheetOpen`
          (see openSheet/closeSheet above) rather than relying on [open]. */}
      <dialog
        ref={sheetRef}
        aria-label="Filters"
        onClose={() => setSheetOpen(false)}
        style={{ margin: 0, padding: 0, border: 'none', maxWidth: 'none', width: '100%', height: '100%', maxHeight: 'none', background: 'transparent', overflow: 'hidden' }}
      >
        <div
          onClick={closeSheet}
          style={{
            position: 'absolute', inset: 0, background: 'rgba(24, 24, 27, 0.4)',
            opacity: sheetOpen ? 1 : 0, transition: 'opacity 0.25s ease-out',
          }}
        />
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, maxHeight: '85vh', overflowY: 'auto',
            background: 'var(--white)', borderRadius: '20px 20px 0 0', padding: 'var(--space-6)',
            boxShadow: 'var(--shadow-lg)',
            transform: sheetOpen ? 'translateY(0)' : 'translateY(100%)',
            transition: `transform ${SHEET_EXIT_MS * 1.5}ms cubic-bezier(0.19, 1, 0.22, 1)`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{ fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>Filters</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {clearAllLink}
              <SheetCloseButton onClick={closeSheet} />
            </div>
          </div>
          <FilterPanel {...filterPanelProps} />
          <Button fullWidth style={{ marginTop: '28px' }} onClick={closeSheet}>
            Show {loading ? '…' : total} result{total === 1 ? '' : 's'}
          </Button>
        </div>
      </dialog>
    </div>
  );
}
