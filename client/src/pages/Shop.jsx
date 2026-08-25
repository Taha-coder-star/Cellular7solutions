import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '@/services/api';
import { Button, Select, Icon, ProductCard } from '@/components/ui';
import { normalizeBrandName } from '@/utils/format';

const PAGE_SIZE = 12;

function normalizeProduct(p) {
  return {
    _id: p._id,
    name: p.name,
    brand: normalizeBrandName(p.brand?.name),
    description: p.description,
    image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
    condition: p.condition,
    stock: p.stock,
  };
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

const CONDITIONS = [
  { value: '', label: 'Any Condition' },
  { value: 'new', label: 'New' },
  { value: 'used', label: 'Used' },
];

export default function Shop({ forcedCategoryId, breadcrumbOverride } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Keyed off the query string, not `searchParams` itself — react-router
  // hands back a new URLSearchParams instance most renders, which would
  // otherwise bust this memo (and the products effect below) every render.
  const searchString = searchParams.toString();
  const filters = useMemo(() => ({
    category: forcedCategoryId || searchParams.get('category') || undefined,
    brand: searchParams.get('brand') || undefined,
    condition: searchParams.get('condition') || undefined,
    search: searchParams.get('search') || undefined,
  }), [searchString, forcedCategoryId]);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  // Category/brand lists — used to resolve names for the breadcrumb and
  // active-filter chips when a category/brand arrives via the URL.
  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data ?? [])).catch(() => {});
    api.get('/brands').then(({ data }) => setBrands(data ?? [])).catch(() => {});
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

  const activeCategory = categories.find((c) => c._id === filters.category);
  const activeBrand = brands.find((b) => b._id === filters.brand);
  const activeCount = Object.values(filters).filter(Boolean).length;

  const pageTitle = filters.search
    ? `Results for "${filters.search}"`
    : breadcrumbOverride?.length
      ? breadcrumbOverride[breadcrumbOverride.length - 1].name
      : activeCategory?.name ?? 'All Products';

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
          <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginBottom: '14px', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span aria-hidden="true">/</span>
            {breadcrumbOverride?.length ? (
              breadcrumbOverride.map((ancestor, i) => {
                const isLast = i === breadcrumbOverride.length - 1;
                return (
                  <span key={ancestor._id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: isLast ? 'var(--text-strong)' : 'inherit', fontWeight: isLast ? 'var(--fw-semibold)' : 'var(--fw-regular)' }}>
                      {ancestor.name}
                    </span>
                    {!isLast && <span aria-hidden="true">/</span>}
                  </span>
                );
              })
            ) : (
              <>
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

      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '32px var(--space-6) 96px' }}>
        <div style={{ minWidth: 0 }}>
          {/* Toolbar: item count + sort */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }} aria-live="polite">
              {loading ? 'Loading…' : `Showing ${products.length} of ${total} product${total === 1 ? '' : 's'}`}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <Select
                aria-label="Filter by brand"
                value={filters.brand || ''}
                onChange={(e) => updateFilters({ brand: e.target.value || undefined })}
                options={[{ value: '', label: 'All Brands' }, ...brands.map((b) => ({ value: b._id, label: b.name }))]}
                style={{ height: 'var(--control-h-sm)', minWidth: '140px' }}
              />
              <Select
                aria-label="Filter by condition"
                value={filters.condition || ''}
                onChange={(e) => updateFilters({ condition: e.target.value || undefined })}
                options={CONDITIONS}
                style={{ height: 'var(--control-h-sm)', minWidth: '140px' }}
              />
            </div>
          </div>

          {/* Active filter chips */}
          {activeCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {activeCategory && <Chip label={activeCategory.name} onRemove={() => updateFilters({ category: undefined })} />}
              {activeBrand && <Chip label={activeBrand.name} onRemove={() => updateFilters({ brand: undefined })} />}
              {filters.condition && <Chip label={filters.condition === 'new' ? 'New' : 'Used'} onRemove={() => updateFilters({ condition: undefined })} />}
              {filters.search && <Chip label={`"${filters.search}"`} onRemove={() => updateFilters({ search: undefined })} />}
              {clearAllLink}
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
          {!error && !loading && products.length === 0 && (
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
          {!error && (loading || products.length > 0) && (
            <>
              <div
                className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                style={{ gap: '24px' }}
              >
                {loading && Array.from({ length: PAGE_SIZE }).map((_, i) => <ProductCardSkeleton key={i} />)}
                {!loading && products.map((p, i) => (
                  <div key={p._id} className="grid-fade-up" style={{ minWidth: 0, animationDelay: `${Math.min(i, 9) * 40}ms` }}>
                    <ProductCard product={p} to={`/product/${p._id}`} />
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
    </div>
  );
}
