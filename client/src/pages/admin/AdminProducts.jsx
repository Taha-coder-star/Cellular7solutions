import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Input, Table, tdStyle, trStyle } from '@/components/ui';
import api from '@/services/api';

export default function AdminProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const categoryName = searchParams.get('categoryName');
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');

  function load() {
    const q = search ? `&search=${encodeURIComponent(search)}` : '';
    const c = categoryId ? `&category=${categoryId}` : '';
    api.get(`/products?page=${page}&limit=20${q}${c}`).then((res) => {
      setProducts(res.data.products);
      setPages(res.data.pages);
    });
  }

  useEffect(load, [page, categoryId]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      load();
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    load();
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
      <Table headers={['Name', 'Category', 'Brand', 'Price', 'Stock', '']}>
        {products.map((p) => (
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
      {pages > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Button key={n} variant={n === page ? 'product' : 'secondary'} size="sm" onClick={() => setPage(n)}>
              {n}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
