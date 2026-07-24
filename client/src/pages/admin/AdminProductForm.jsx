import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Checkbox, Input, Select, Textarea } from '@/components/ui';
import api from '@/services/api';

const EMPTY = { name: '', description: '', price: '', category: '', brand: '', condition: 'new', stock: 0, isFeatured: false };

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
    api.get('/brands').then((res) => setBrands(res.data));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/products/${id}`).then((res) => {
      const p = res.data;
      setForm({
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category?._id || '',
        brand: p.brand?._id || '',
        condition: p.condition,
        stock: p.stock,
        isFeatured: p.isFeatured,
      });
      setExistingImages(p.images || []);
    });
  }, [id]);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleRemove(url) {
    setRemoveImages((prev) => (prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    removeImages.forEach((url) => data.append('removeImages', url));
    newFiles.forEach((file) => data.append('images', file));

    try {
      if (isEdit) {
        await api.put(`/products/${id}`, data);
      } else {
        await api.post('/products', data);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', marginBottom: '24px' }}>
        {isEdit ? 'Edit Product' : 'New Product'}
      </h1>
      <Card>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
          <Textarea label="Description" value={form.description} onChange={(e) => update('description', e.target.value)} required />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input label="Price" type="number" min="0" step="0.01" value={form.price} onChange={(e) => update('price', e.target.value)} required />
            <Input label="Stock" type="number" min="0" value={form.stock} onChange={(e) => update('stock', e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Select label="Category" value={form.category} onChange={(e) => update('category', e.target.value)} required>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </Select>
            <Select label="Brand" value={form.brand} onChange={(e) => update('brand', e.target.value)} required>
              <option value="">Select brand</option>
              {brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
            </Select>
          </div>

          <Select label="Condition" value={form.condition} onChange={(e) => update('condition', e.target.value)} options={['new', 'used']} />

          <Checkbox label="Featured product" checked={form.isFeatured} onChange={(e) => update('isFeatured', e.target.checked)} />

          {existingImages.length > 0 && (
            <div>
              <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--text-strong)', marginBottom: '8px' }}>
                Existing images (check to remove)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {existingImages.map((url) => (
                  <label key={url} style={{ position: 'relative', cursor: 'pointer' }}>
                    <img src={url} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-input)', opacity: removeImages.includes(url) ? 0.4 : 1, border: '1px solid var(--border-subtle)' }} />
                    <input type="checkbox" checked={removeImages.includes(url)} onChange={() => toggleRemove(url)} style={{ position: 'absolute', top: '4px', right: '4px' }} />
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--text-strong)', display: 'block', marginBottom: '8px' }}>
              Add images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const picked = Array.from(e.target.files);
                setNewFiles((prev) => [...prev, ...picked]);
                e.target.value = '';
              }}
            />
            {newFiles.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
                {newFiles.map((file, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-input)', border: '1px solid var(--border-subtle)' }}
                    />
                    <button
                      type="button"
                      onClick={() => setNewFiles((prev) => prev.filter((_, idx) => idx !== i))}
                      style={{ position: 'absolute', top: '4px', right: '4px', border: 'none', background: 'var(--surface-dark)', color: 'var(--white)', borderRadius: '999px', width: '18px', height: '18px', lineHeight: 1, cursor: 'pointer' }}
                      aria-label={`Remove ${file.name}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <span style={{ color: 'var(--danger-500)', fontSize: 'var(--fs-sm)' }}>{error}</span>}

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Product'}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/admin/products')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
