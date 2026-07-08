import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export function AuthShell({ children }) {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 20px',
        boxSizing: 'border-box',
        background: 'var(--surface-subtle)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div
        style={{
          width: '400px',
          maxWidth: '100%',
          background: 'var(--white)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden',
        }}
      >
        <Link
          to="/"
          style={{
            background: 'var(--graphite-900)',
            padding: '28px 32px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <Logo variant="icon" tone="dark" height={40} />
          <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '.18em', color: 'var(--graphite-400)' }}>
            YOU BREAK IT · WE FIX IT
          </span>
        </Link>

        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function AuthHead({ title, subtitle }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ margin: '0 0 5px', fontSize: '23px', fontWeight: 800, letterSpacing: '-.02em', color: 'var(--text-strong)' }}>
        {title}
      </h1>
      {subtitle && <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>{subtitle}</p>}
    </div>
  );
}

export function AuthDivider({ text = 'OR' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
      <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '.12em', color: 'var(--text-muted)' }}>{text}</span>
      <span style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
    </div>
  );
}

export function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
