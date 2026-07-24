import { useEffect, useState } from 'react';
import { Button, Input, Table, tdStyle, trStyle } from '@/components/ui';
import api from '@/services/api';

export default function AdminBrands() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function load() {
    api.get('/brands').then((res) => setItems(res.data));
  }

  useEffect(load, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/brands', { name });
      setName('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create brand');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this brand?')) return;
    await api.delete(`/brands/${id}`);
    load();
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', marginBottom: '24px' }}>
        Brands
      </h1>
      <form onSubmit={handleCreate} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '24px', maxWidth: '400px' }}>
        <div style={{ flex: 1 }}>
          <Input placeholder="New brand name" value={name} onChange={(e) => setName(e.target.value)} error={error} required />
        </div>
        <Button type="submit">Add</Button>
      </form>
      <Table headers={['Name', 'Slug', '']}>
        {items.map((b) => (
          <tr key={b._id} style={trStyle}>
            <td style={tdStyle}>{b.name}</td>
            <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{b.slug}</td>
            <td style={{ ...tdStyle, textAlign: 'right' }}>
              <Button variant="ghost" size="sm" style={{ color: 'var(--danger-500)' }} onClick={() => handleDelete(b._id)}>Delete</Button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
