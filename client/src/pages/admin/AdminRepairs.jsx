import { useEffect, useState } from 'react';
import { Select, Table, tdStyle, trStyle } from '@/components/ui';
import api from '@/services/api';

const STATUSES = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];

export default function AdminRepairs() {
  const [requests, setRequests] = useState([]);

  function load() {
    api.get('/repairs').then((res) => setRequests(res.data));
  }

  useEffect(load, []);

  async function handleStatus(id, status) {
    await api.put(`/repairs/${id}`, { status });
    load();
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', marginBottom: '24px' }}>
        Repair Requests
      </h1>
      <Table headers={['Customer', 'Device', 'Issue', 'Available', 'Status']}>
        {requests.map((r) => (
          <tr key={r._id} style={trStyle}>
            <td style={tdStyle}>
              <div>{r.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-xs)' }}>{r.phone}</div>
            </td>
            <td style={tdStyle}>{r.deviceType}</td>
            <td style={{ ...tdStyle, maxWidth: '260px' }}>{r.issue}</td>
            <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>
              {new Date(r.availableDate).toLocaleDateString()} · {r.availableTime}
            </td>
            <td style={tdStyle}>
              <Select value={r.status} onChange={(e) => handleStatus(r._id, e.target.value)} options={STATUSES} style={{ height: 'var(--control-h-sm)', fontSize: 'var(--fs-sm)' }} />
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
