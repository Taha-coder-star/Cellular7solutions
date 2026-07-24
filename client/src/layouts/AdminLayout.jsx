import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Icon } from '@/components/ui';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: 'monitor', end: true },
  { to: '/admin/products', label: 'Products', icon: 'smartphone' },
  { to: '/admin/orders', label: 'Orders', icon: 'shopping-cart' },
  { to: '/admin/repairs', label: 'Repairs', icon: 'wrench', service: true },
  { to: '/admin/buysell', label: 'Buy & Sell', icon: 'dollar-sign', service: true },
  { to: '/admin/categories', label: 'Categories', icon: 'menu' },
  { to: '/admin/brands', label: 'Brands', icon: 'shield-check' },
];

export default function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-subtle)' }}>
      <aside style={{ width: '240px', flexShrink: 0, background: 'var(--surface-dark)', padding: '24px 16px' }}>
        <div style={{ color: 'var(--text-on-dark)', fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-lg)', padding: '0 8px 24px' }}>
          Admin
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-btn)',
                color: isActive ? 'var(--white)' : 'var(--graphite-400)',
                background: isActive ? (item.service ? 'var(--cobalt-600)' : 'var(--graphite-700)') : 'transparent',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-sm)',
                fontWeight: 'var(--fw-medium)',
                textDecoration: 'none',
              })}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '32px', minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}
