import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui';
import { useCategoryTree } from '@/hooks/useCategoryTree';
import { BY_CATEGORY_LINKS } from '@/data/byCategoryLinks';

const rowStyle = (depth) => ({
  fontFamily: 'var(--font-sans)',
  fontSize: depth === 0 ? 'var(--fs-body)' : 'var(--fs-sm)',
  fontWeight: depth === 0 ? 'var(--fw-medium)' : 'var(--fw-regular)',
  color: 'var(--text-body)',
  padding: 'var(--space-3) 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  background: 'none',
  border: 'none',
  borderBottom: '1px solid var(--border-subtle)',
  cursor: 'pointer',
  textAlign: 'left',
  textDecoration: 'none',
});

function CategoryRow({ node, path, depth, expanded, toggle, onNavigate }) {
  const isOpen = expanded.has(node._id);
  const hasChildren = node.children?.length > 0;
  const fullPath = `/categories/${[...path, node.slug].join('/')}`;

  if (!hasChildren) {
    return (
      <Link to={fullPath} onClick={onNavigate} style={rowStyle(depth)}>
        {node.name}
      </Link>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <button type="button" onClick={() => toggle(node._id)} aria-expanded={isOpen} style={rowStyle(depth)}>
        {node.name}
        <Icon name="chevron-down" size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)' }} />
      </button>
      {isOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 'var(--space-4)' }}>
          <Link
            to={fullPath}
            onClick={onNavigate}
            style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', textDecoration: 'none', padding: 'var(--space-2) 0' }}
          >
            View all {node.name} →
          </Link>
          {node.children.map((child) => (
            <CategoryRow
              key={child._id}
              node={child}
              path={[...path, node.slug]}
              depth={depth + 1}
              expanded={expanded}
              toggle={toggle}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Mobile slide-out accordion — same DB tree as CategoryNavBar, arbitrary depth. */
export default function MobileCategoryMenu({ onNavigate }) {
  const { tree, loading, error } = useCategoryTree();
  const [byCategoryOpen, setByCategoryOpen] = useState(false);
  const [expanded, setExpanded] = useState(() => new Set());

  function toggle(id) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  if (loading) {
    return <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', padding: 'var(--space-3) 0', display: 'block' }}>Loading…</span>;
  }
  if (error || !tree?.length) {
    return (
      <Link to="/shop" onClick={onNavigate} style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', color: 'var(--text-body)', textDecoration: 'none', padding: 'var(--space-3) 0', display: 'block' }}>
        Browse all products →
      </Link>
    );
  }

  const navItems = tree.filter((n) => n.navOrder != null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {navItems.map((node) => (
        <CategoryRow key={node._id} node={node} path={[]} depth={0} expanded={expanded} toggle={toggle} onNavigate={onNavigate} />
      ))}

      <button type="button" onClick={() => setByCategoryOpen((o) => !o)} aria-expanded={byCategoryOpen} style={rowStyle(0)}>
        By Category
        <Icon name="chevron-down" size={14} style={{ transform: byCategoryOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)' }} />
      </button>
      {byCategoryOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 'var(--space-4)' }}>
          {BY_CATEGORY_LINKS.map((l) => (
            <Link key={l.label} to={l.path} onClick={onNavigate} style={rowStyle(1)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
