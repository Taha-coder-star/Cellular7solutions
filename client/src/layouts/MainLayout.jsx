import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function MainLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 'auto',
          zIndex: 100,
          padding: '12px 20px',
          background: 'var(--brand-primary)',
          color: 'var(--text-on-brand)',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-body)',
          fontWeight: 'var(--fw-semibold)',
          borderRadius: 'var(--radius-btn)',
          textDecoration: 'none',
        }}
        onFocus={(e) => {
          e.target.style.left = '16px';
          e.target.style.top = '16px';
        }}
        onBlur={(e) => {
          e.target.style.left = '-9999px';
          e.target.style.top = 'auto';
        }}
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
