import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Input, Pagination, Table, tdStyle, trStyle } from '@/components/ui';
import api from '@/services/api';

export default function AdminProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const categoryName = searchParams.get('categoryName');
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadTick, setReloadTick] = useState(0);

  // Debounce the raw input so we don't fire a request per keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  // A new search term or category filter always starts back at page 1.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryId]);

  // Single source of truth for fetching — no stale-closure double-fetch,
  // and an abort controller so a slow earlier request can't overwrite a
  // newer one's results.
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    const q = debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : '';
    const c = categoryId ? `&category=${categoryId}` : '';
    api.get(`/products?page=${page}&limit=20${q}${c}`, { signal: controller.signal })
      .then((res) => {
        setProducts(res.data.products);
        setPages(res.data.pages);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err.response?.data?.message || 'Failed to load products');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [page, debouncedSearch, categoryId, reloadTick]);

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return;
    setError('');
    try {
      await api.delete(`/products/${id}`);
      setReloadTick((t) => t + 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>
            Products
          </h1>
          {categoryId && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', background: 'var(--surface-subtle)', padding: '4px 10px', borderRadius: '999px' }}>
              {categoryName || 'Category'}
              <button
                onClick={() => { setPage(1); setSearchParams({}); }}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, lineHeight: 1 }}
                aria-label="Clear category filter"
              >
                ✕
              </button>
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Input placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '240px' }} />
          <Button as={Link} to="/admin/products/new">New Product</Button>
        </div>
      </div>
      {error && <div style={{ color: 'var(--danger-500)', fontSize: 'var(--fs-sm)', marginBottom: '16px' }}>{error}</div>}
      {!loading && !error && products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
          {debouncedSearch ? `No products match "${debouncedSearch}".` : 'No products found.'}
        </div>
      )}
      <Table headers={['Name', 'Category', 'Brand', 'Price', 'Stock', '']}>
        {loading && (
          <tr>
            <td style={{ ...tdStyle, color: 'var(--text-muted)' }} colSpan={6}>Loading…</td>
          </tr>
        )}
        {!loading && products.map((p) => (
          <tr key={p._id} style={trStyle}>
            <td style={tdStyle}>{p.name}</td>
            <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{p.category?.name}</td>
            <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{p.brand?.name}</td>
            <td style={tdStyle}>Rs. {p.price?.toLocaleString()}</td>
            <td style={tdStyle}>{p.stock}</td>
            <td style={{ ...tdStyle, textAlign: 'right', whiteSpace: 'nowrap' }}>
              <Button as={Link} to={`/admin/products/${p._id}`} variant="ghost" size="sm">Edit</Button>
              <Button variant="ghost" size="sm" style={{ color: 'var(--danger-500)' }} onClick={() => handleDelete(p._id)}>Delete</Button>
            </td>
          </tr>
        ))}
      </Table>
      <Pagination page={page} totalPages={pages} onChange={setPage} />
    </div>
  );
}
