import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Table, tdStyle, trStyle } from '@/components/ui';
import api from '@/services/api';

export default function AdminCategories() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function load() {
    api.get('/categories').then((res) => setItems(res.data));
  }

  useEffect(load, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/categories', { name });
      setName('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this category?')) return;
    await api.delete(`/categories/${id}`);
    load();
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', marginBottom: '24px' }}>
        Categories
      </h1>
      <form onSubmit={handleCreate} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '24px', maxWidth: '400px' }}>
        <div style={{ flex: 1 }}>
          <Input placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} error={error} required />
        </div>
        <Button type="submit">Add</Button>
      </form>
      <Table headers={['Name', 'Slug', '']}>
        {items.map((c) => (
          <tr key={c._id} style={trStyle}>
            <td style={tdStyle}>{c.name}</td>
            <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{c.slug}</td>
            <td style={{ ...tdStyle, textAlign: 'right', whiteSpace: 'nowrap' }}>
              <Button as={Link} to={`/admin/products?category=${c._id}&categoryName=${encodeURIComponent(c.name)}`} variant="ghost" size="sm">View Products</Button>
              <Button variant="ghost" size="sm" style={{ color: 'var(--danger-500)' }} onClick={() => handleDelete(c._id)}>Delete</Button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
