import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui';

// The three primary things customers come to Cellular Solutions for.
// Routes are the real existing ones: no /buy or /sell — buying is the shop,
// selling/trade-in is the buysell page.
const ACTIONS = [
  { to: '/repair', label: 'Repair', icon: 'wrench' },
  { to: '/shop', label: 'Buy', icon: 'shopping-cart' },
  { to: '/buysell', label: 'Sell', icon: 'dollar-sign' },
];

/**
 * Repair / Buy / Sell bottom bar. Two placements:
 *   variant="fixed"  — global, pinned to the viewport bottom on mobile
 *   variant="static" — sits at the bottom of the open nav drawer (Option A)
 * Both respect the iOS home-indicator safe area.
 */
export default function ServiceActionBar({ variant = 'fixed', onNavigate }) {
  const fixed = variant === 'fixed';

  return (
    <nav
      aria-label="Services"
      className={fixed ? 'md:hidden' : undefined}
      style={{
        ...(fixed
          ? { position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 40 }
          : { position: 'relative' }),
        display: 'flex',
        background: 'var(--surface-page)',
        borderTop: '1px solid var(--border-subtle)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {ACTIONS.map(({ to, label, icon }) => (
        <Link
          key={label}
          to={to}
          onClick={onNavigate}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            minHeight: '58px',
            padding: 'var(--space-2) 0',
            color: 'var(--text-strong)',
            textDecoration: 'none',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <Icon name={icon} size={22} strokeWidth={1.75} />
          <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-medium)', letterSpacing: '0.02em' }}>
            {label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
