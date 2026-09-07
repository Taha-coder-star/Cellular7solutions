import { useEffect, useState } from 'react';
import { Button, Select, StatusBadge, Table, tdStyle, trStyle } from '@/components/ui';
import api from '@/services/api';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  function load() {
    api.get('/orders').then((res) => setOrders(res.data));
  }

  useEffect(load, []);

  async function handleStatus(id, status) {
    setError('');
    try {
      await api.put(`/orders/${id}/status`, { status });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
    }
  }

  async function handleMarkPaid(id) {
    setError('');
    try {
      await api.put(`/orders/${id}/pay`, {});
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark order as paid');
    }
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', marginBottom: '24px' }}>
        Orders
      </h1>
      {error && <div style={{ color: 'var(--danger-500)', fontSize: 'var(--fs-sm)', marginBottom: '16px' }}>{error}</div>}
      <Table headers={['Customer', 'Total', 'Paid', 'Status', 'Placed']}>
        {orders.map((o) => (
          <tr key={o._id} style={trStyle}>
            <td style={tdStyle}>
              <div>{o.shippingAddress?.fullName || 'Unknown'}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-xs)' }}>{o.shippingAddress?.email}</div>
            </td>
            <td style={tdStyle}>Rs. {o.totalPrice?.toLocaleString()}</td>
            <td style={tdStyle}>
              {o.isPaid ? <StatusBadge status="paid" /> : (
                <Button variant="ghost" size="sm" onClick={() => handleMarkPaid(o._id)}>Mark paid</Button>
              )}
            </td>
            <td style={tdStyle}>
              <Select value={o.status} onChange={(e) => handleStatus(o._id, e.target.value)} options={STATUSES} style={{ height: 'var(--control-h-sm)', fontSize: 'var(--fs-sm)' }} />
            </td>
            <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>
              {new Date(o.createdAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
