import { forwardRef, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo, Icon } from '@/components/ui';
import { useCategoryTree } from '@/hooks/useCategoryTree';
import ServiceActionBar from '@/components/layout/ServiceActionBar';
import { buildShopEntries, stripGroupWord } from '@/components/layout/shopNav';

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * A "view" pushed onto the drill stack:
 *   { title, children: [node], basePath: [slug], groupLabel?: string }
 * basePath is the accumulated slug path used to build /categories/... URLs.
 * A virtual group contributes nothing to basePath (its members are real
 * top-level nodes carrying their own slug), so URLs stay intact.
 */
function viewForGroup(group) {
  return { title: group.label, children: group.members, basePath: [], groupLabel: group.label };
}
function viewForNode(node, basePath) {
  return { title: node.name, children: node.children, basePath: [...basePath, node.slug] };
}

export default function MobileNav({ open, onClose, onOpenSearch, isAdmin }) {
  const { tree } = useCategoryTree();
  const overlayRef = useRef(null);
  const firstFocusRef = useRef(null);
  const lastFocused = useRef(null);

  const [stack, setStack] = useState([]); // drilled views (levels 1..n)
  const [level, setLevel] = useState(0); // active panel index; 0 = root
  const [shopOpen, setShopOpen] = useState(true);

  const shopEntries = tree ? buildShopEntries(tree) : [];

  function drill(view) {
    const base = stack.slice(0, level); // drop any deeper branch from a prior path
    setStack([...base, view]);
    setLevel(level + 1);
  }
  function back() {
    if (level === 0) return;
    const nl = level - 1;
    setLevel(nl);
    // trim after the slide finishes so the outgoing panel animates out cleanly
    window.setTimeout(() => setStack((s) => s.slice(0, nl)), 320);
  }

  // Reset to the root level whenever the drawer closes.
  useEffect(() => {
    if (!open) {
      setLevel(0);
      setStack([]);
    }
  }, [open]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Focus in on open, trap Tab, Escape closes, restore focus on close.
  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement;
    firstFocusRef.current?.focus();

    function onKeyDown(e) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const nodes = overlayRef.current?.querySelectorAll('a[href], button:not([disabled])');
      if (!nodes?.length) return;
      const list = Array.from(nodes).filter((n) => n.offsetParent !== null);
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      lastFocused.current?.focus?.();
    };
  }, [open, onClose]);

  const activeView = level > 0 ? stack[level - 1] : null;

  return (
    <div
      ref={overlayRef}
      className="md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'var(--surface-page)',
        display: 'flex',
        flexDirection: 'column',
        transform: prefersReduced ? 'none' : open ? 'translateX(0)' : 'translateX(-100%)',
        opacity: open ? 1 : 0,
        visibility: open ? 'visible' : 'hidden',
        pointerEvents: open ? 'auto' : 'none',
        transition: prefersReduced ? 'none' : 'transform 0.3s var(--ease-out), opacity 0.3s var(--ease-out)',
      }}
    >
      {/* Header — logo+search at root, back+title inside a submenu */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: 'var(--space-3) var(--space-4)',
          borderBottom: '1px solid var(--border-subtle)',
          minHeight: '64px',
        }}
      >
        {level === 0 ? (
          <>
            <Link to="/" onClick={onClose} aria-label="Cellular Solutions home">
              <Logo variant="full" tone="light" height={30} />
            </Link>
            <span aria-hidden="true" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              {onOpenSearch && (
                <IconButton ref={firstFocusRef} label="Search" icon="search" onClick={onOpenSearch} />
              )}
              <IconButton
                ref={onOpenSearch ? undefined : firstFocusRef}
                label="Close menu"
                icon="x"
                onClick={onClose}
              />
            </div>
          </>
        ) : (
          <>
            <button
              ref={firstFocusRef}
              type="button"
              onClick={back}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                padding: 'var(--space-2)',
                marginLeft: 'calc(-1 * var(--space-2))',
                color: 'var(--text-strong)',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-body)',
                fontWeight: 'var(--fw-semibold)',
              }}
            >
              <Icon name="chevron-left" size={22} />
              {activeView?.title}
            </button>
            <span aria-hidden="true" />
            <IconButton label="Close menu" icon="x" onClick={onClose} />
          </>
        )}
      </div>

      {/* Sliding panel track */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            height: '100%',
            // Track stays one viewport wide; each panel is exactly one viewport
            // (flex: 0 0 100%) and overflows to the right. Translate one full
            // viewport per drilled level.
            transform: `translateX(-${level * 100}%)`,
            transition: prefersReduced ? 'none' : 'transform 0.28s var(--ease-out)',
          }}
        >
          {/* Root panel: Home + Shop accordion + secondary links */}
          <Panel>
            <RowLink to="/" onClick={onClose} label="Home" />

            <button
              type="button"
              onClick={() => setShopOpen((o) => !o)}
              aria-expanded={shopOpen}
              style={rowStyle}
            >
              <span style={{ fontWeight: 'var(--fw-semibold)' }}>Shop</span>
              <Icon
                name="chevron-down"
                size={18}
                style={{ transform: shopOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast, 0.15s) var(--ease-out)', color: 'var(--text-muted)' }}
              />
            </button>

            {shopOpen && (
              <div style={{ paddingLeft: 'var(--space-3)' }}>
                {shopEntries.map((entry) =>
                  entry.kind === 'group' ? (
                    <RowButton key={`g-${entry.label}`} label={entry.label} onClick={() => drill(viewForGroup(entry))} />
                  ) : entry.node.children?.length ? (
                    <RowButton key={entry.node._id} label={entry.node.name} onClick={() => drill(viewForNode(entry.node, []))} />
                  ) : (
                    <RowLink key={entry.node._id} to={`/categories/${entry.node.slug}`} onClick={onClose} label={entry.node.name} muted />
                  )
                )}
              </div>
            )}

            <div style={{ height: 'var(--space-4)' }} />
            <div style={{ borderTop: '1px solid var(--border-subtle)' }} />
            <RowLink to="/about" onClick={onClose} label="About" small />
            <RowLink to="/contact" onClick={onClose} label="Contact" small />
            {isAdmin && <RowLink to="/admin" onClick={onClose} label="Admin" small />}
          </Panel>

          {/* One panel per drilled view */}
          {stack.map((view, i) => (
            <Panel key={i}>
              {view.children?.map((child) => {
                const label = view.groupLabel ? stripGroupWord(child.name, view.groupLabel) : child.name;
                return child.children?.length ? (
                  <RowButton
                    key={child._id}
                    label={label}
                    onClick={() => drill(viewForNode(child, view.basePath))}
                  />
                ) : (
                  <RowLink
                    key={child._id}
                    to={`/categories/${[...view.basePath, child.slug].join('/')}`}
                    onClick={onClose}
                    label={label}
                    muted
                  />
                );
              })}
            </Panel>
          ))}
        </div>
      </div>

      {/* Primary service actions — kept visible at the drawer bottom (Option A) */}
      <ServiceActionBar variant="static" onNavigate={onClose} />
    </div>
  );
}

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  minHeight: '52px',
  padding: 'var(--space-3) 0',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  textDecoration: 'none',
  borderBottom: '1px solid var(--border-subtle)',
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--fs-body)',
  fontWeight: 'var(--fw-medium)',
  color: 'var(--text-strong)',
};

function Panel({ children }) {
  return (
    <div
      style={{
        flex: '0 0 100%',
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
        padding: '0 var(--space-5)',
      }}
    >
      {children}
    </div>
  );
}

function RowButton({ label, onClick }) {
  return (
    <button type="button" onClick={onClick} style={rowStyle}>
      <span>{label}</span>
      <Icon name="chevron-right" size={18} style={{ color: 'var(--text-muted)' }} />
    </button>
  );
}

function RowLink({ to, onClick, label, muted, small }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        ...rowStyle,
        fontWeight: small ? 'var(--fw-regular)' : 'var(--fw-medium)',
        fontSize: small ? 'var(--fs-sm)' : 'var(--fs-body)',
        color: muted || small ? 'var(--text-body)' : 'var(--text-strong)',
        borderBottom: small ? 'none' : '1px solid var(--border-subtle)',
        minHeight: small ? '44px' : '52px',
      }}
    >
      {label}
    </Link>
  );
}

const IconButton = forwardRef(function IconButton({ label, icon, onClick }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '44px',
        height: '44px',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        color: 'var(--text-strong)',
        borderRadius: 'var(--radius-sm)',
      }}
    >
      <Icon name={icon} size={22} />
    </button>
  );
});
