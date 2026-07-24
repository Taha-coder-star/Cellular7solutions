import { useEffect, useState } from 'react';
import { Card } from '@/components/ui';
import api from '@/services/api';

const STATS = [
  { key: 'products', label: 'Products', url: '/products?limit=1' },
  { key: 'orders', label: 'Orders', url: '/orders' },
  { key: 'repairs', label: 'Repair Requests', url: '/repairs' },
  { key: 'buysell', label: 'Buy & Sell Requests', url: '/buysell' },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    Promise.all(
      STATS.map((s) =>
        api.get(s.url).then((res) => {
          const data = res.data;
          const count = Array.isArray(data) ? data.length : data.total ?? 0;
          return [s.key, count];
        }).catch(() => [s.key, '—'])
      )
    ).then((pairs) => setCounts(Object.fromEntries(pairs)));
  }, []);

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', marginBottom: '24px' }}>
        Dashboard
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {STATS.map((s) => (
          <Card key={s.key}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', marginBottom: '8px' }}>
              {s.label}
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-h2)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>
              {counts[s.key] ?? '…'}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
