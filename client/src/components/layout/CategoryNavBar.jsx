import { useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui';
import { useCategoryTree } from '@/hooks/useCategoryTree';
import { BY_CATEGORY_LINKS } from '@/data/byCategoryLinks';

const OPEN_DELAY = 180;
const CLOSE_DELAY = 300;

function pathFor(ancestorSlugs, slug) {
  return `/categories/${[...ancestorSlugs, slug].join('/')}`;
}

function MegaPanelColumns({ columns, buildPath }) {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6"
      style={{ maxHeight: '70vh', overflowY: 'auto' }}
    >
      {columns.map((col) => (
        <div key={col._id || col.label} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <Link
            to={col.path ?? buildPath(col.slug)}
            style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', textDecoration: 'none' }}
          >
            {col.name ?? col.label}
          </Link>
          {col.children?.length > 0 && (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              {col.children.map((grand) => (
                <li key={grand._id}>
                  <Link
                    to={buildPath(col.slug, grand.slug)}
                    style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-strong)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    {grand.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function NavItem({ node, isOpen, onOpenRequest, onCloseRequest, onOpenNow, onCloseNow }) {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const panelRef = useRef(null);
  const [alignRight, setAlignRight] = useState(false);
  const isByCategory = node.__byCategory;
  const hasChildren = isByCategory || node.children?.length > 0;
  const targetPath = isByCategory ? '#' : pathFor([], node.slug);

  // Nav items near the right edge (Repair Tools, Screen Protectors, By
  // Category) would otherwise push their panel off-screen since it's
  // anchored left to the trigger — flip to right-anchored when it overflows.
  useLayoutEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    setAlignRight(rect.right > window.innerWidth);
  }, [isOpen]);

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      onCloseNow();
      wrapperRef.current?.querySelector('a,button')?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (hasChildren && !isOpen) {
        e.preventDefault();
        onOpenNow();
      }
    } else if (e.key === 'ArrowDown' && isOpen) {
      e.preventDefault();
      const focusables = wrapperRef.current?.querySelectorAll('[data-panel] a');
      focusables?.[0]?.focus();
    }
  }

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'relative' }}
      onMouseEnter={() => hasChildren && onOpenRequest()}
      onMouseLeave={() => hasChildren && onCloseRequest()}
      onKeyDown={handleKeyDown}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
        {isByCategory ? (
          <button
            type="button"
            onClick={() => hasChildren && (isOpen ? onCloseNow() : onOpenNow())}
            style={navLabelStyle(isOpen)}
          >
            {node.name}
          </button>
        ) : (
          <Link to={targetPath} style={navLabelStyle(isOpen)}>
            {node.name}
          </Link>
        )}
        {hasChildren && (
          <button
            type="button"
            aria-label={`Toggle ${node.name} menu`}
            aria-expanded={isOpen}
            onClick={(e) => { e.stopPropagation(); isOpen ? onCloseNow() : onOpenNow(); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'inline-flex', padding: '2px' }}
          >
            <Icon name="chevron-down" size={12} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)' }} />
          </button>
        )}
      </div>

      {isOpen && hasChildren && (
        <div
          ref={panelRef}
          data-panel
          style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            ...(alignRight ? { right: 0 } : { left: 0 }),
            zIndex: 60,
            minWidth: '560px',
            maxWidth: 'calc(100vw - 32px)',
            background: 'var(--white)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-card)',
            boxShadow: 'var(--shadow-lg)',
            padding: 'var(--space-6)',
          }}
        >
          {isByCategory ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
              {BY_CATEGORY_LINKS.map((l) => (
                <Link
                  key={l.label}
                  to={l.path}
                  style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', color: 'var(--text-body)', textDecoration: 'none' }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ) : (
            <MegaPanelColumns columns={node.children} buildPath={(slug, grandSlug) => pathFor([node.slug], slug) + (grandSlug ? `/${grandSlug}` : '')} />
          )}
        </div>
      )}
    </div>
  );
}

function navLabelStyle(active) {
  return {
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--fs-xs)',
    fontWeight: active ? 'var(--fw-bold)' : 'var(--fw-medium)',
    color: active ? 'var(--text-strong)' : 'var(--text-muted)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    transition: 'color 0.15s ease',
  };
}

/** Desktop row-2 nav — entirely DB-driven via /categories/tree, one mega menu open at a time. */
export default function CategoryNavBar() {
  const { tree } = useCategoryTree();
  const [openId, setOpenId] = useState(null);
  const openTimer = useRef(null);
  const closeTimer = useRef(null);

  function clearTimers() {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
  }

  function requestOpen(id) {
    clearTimers();
    openTimer.current = setTimeout(() => setOpenId(id), OPEN_DELAY);
  }
  function requestClose() {
    clearTimers();
    closeTimer.current = setTimeout(() => setOpenId(null), CLOSE_DELAY);
  }
  function openNow(id) {
    clearTimers();
    setOpenId(id);
  }
  function closeNow() {
    clearTimers();
    setOpenId(null);
  }

  if (!tree?.length) return null;

  const navItems = [...tree.filter((n) => n.navOrder != null), { _id: 'by-category', name: 'By Category', __byCategory: true }];

  return (
    <nav
      aria-label="Category navigation"
      className="hidden md:flex"
      style={{
        gap: 'var(--space-6)',
        alignItems: 'center',
        height: '44px',
        padding: '0 var(--space-6)',
        borderTop: '1px solid var(--border-subtle)',
        flexWrap: 'wrap',
      }}
    >
      {navItems.map((node) => (
        <NavItem
          key={node._id}
          node={node}
          isOpen={openId === node._id}
          onOpenRequest={() => requestOpen(node._id)}
          onCloseRequest={requestClose}
          onOpenNow={() => openNow(node._id)}
          onCloseNow={closeNow}
        />
      ))}
    </nav>
  );
}
