import { NavLink, useLocation } from 'react-router-dom';
import { Icon } from '@/components/ui';

// The three primary things customers come to Cellular Solutions for.
// Routes are the real existing ones: no /buy or /sell — buying is the shop,
// selling/trade-in is the buysell page.
// "Buy" also covers category browsing and product pages, which live outside
// /shop, so it needs its own prefix match instead of NavLink's default (exact-to-`to`) matching.
const ACTIONS = [
  { to: '/repair', label: 'Repair', icon: 'wrench' },
  { to: '/shop', label: 'Buy', icon: 'shopping-cart', activePrefixes: ['/shop', '/categories', '/product'] },
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
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Services"
      className={fixed ? 'flex md:hidden' : 'flex'}
      style={{
        ...(fixed
          ? { position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 40 }
          : { position: 'relative' }),
        background: 'var(--surface-page)',
        borderTop: '1px solid var(--border-subtle)',
        paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
      }}
    >
      {ACTIONS.map(({ to, label, icon, activePrefixes }) => {
        const forcedActive = activePrefixes?.some((p) => pathname.startsWith(p));
        return (
          <NavLink
            key={label}
            to={to}
            onClick={onNavigate}
            style={({ isActive }) => ({
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: 'var(--space-2) 0',
              color: (isActive || forcedActive) ? 'var(--graphite-900)' : 'rgba(17,17,17,0.45)',
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
            })}
          >
            {({ isActive }) => (
              <>
                <span style={{ width: '20px', height: '3px', borderRadius: '2px', background: (isActive || forcedActive) ? 'var(--cobalt-600)' : 'transparent' }} />
                <Icon name={icon} size={22} strokeWidth={1.75} />
                <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-medium)', letterSpacing: '0.02em', lineHeight: 1.3 }}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
