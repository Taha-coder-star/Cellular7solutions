import { useEffect, useState } from 'react';
import { Button, Select, Table, tdStyle, trStyle } from '@/components/ui';
import api from '@/services/api';

const STATUSES = ['pending', 'reviewing', 'accepted', 'rejected'];

export default function AdminBuySell() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  function load() {
    api.get('/buysell').then((res) => setRequests(res.data));
  }

  useEffect(load, []);

  async function handleStatus(id, status) {
    setError('');
    try {
      await api.put(`/buysell/${id}/status`, { status });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update request status');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this buy & sell request?')) return;
    setError('');
    try {
      await api.delete(`/buysell/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete request');
    }
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', marginBottom: '24px' }}>
        Buy &amp; Sell Requests
      </h1>
      {error && <div style={{ color: 'var(--danger-500)', fontSize: 'var(--fs-sm)', marginBottom: '16px' }}>{error}</div>}
      <Table headers={['Customer', 'Device', 'Condition', 'Description', 'Status', '']}>
        {requests.map((r) => (
          <tr key={r._id} style={trStyle}>
            <td style={tdStyle}>
              <div>{r.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-xs)' }}>{r.phone}</div>
            </td>
            <td style={tdStyle}>{r.device}</td>
            <td style={tdStyle}>{r.condition}</td>
            <td style={{ ...tdStyle, maxWidth: '260px', color: 'var(--text-muted)' }}>{r.description}</td>
            <td style={tdStyle}>
              <Select value={r.status} onChange={(e) => handleStatus(r._id, e.target.value)} options={STATUSES} style={{ height: 'var(--control-h-sm)', fontSize: 'var(--fs-sm)' }} />
            </td>
            <td style={{ ...tdStyle, textAlign: 'right', whiteSpace: 'nowrap' }}>
              <Button variant="ghost" size="sm" style={{ color: 'var(--danger-500)' }} onClick={() => handleDelete(r._id)}>Delete</Button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
