const { useState } = React;
const { Icon, Button, Badge, Checkbox, Select, ProductCard } = window.CellularSolutionsDesignSystem_a109cf;

const CATALOG = [
  { id: 1, name: 'iPhone 15 Pro', brand: 'Apple', price: 999, condition: 'new', rating: 4.8, reviews: 214, stock: 8, icon: 'smartphone', cat: 'Phones' },
  { id: 2, name: 'Galaxy S24 Ultra', brand: 'Samsung', price: 1199, condition: 'new', rating: 4.7, reviews: 168, stock: 5, icon: 'smartphone', cat: 'Phones' },
  { id: 3, name: 'MacBook Air M3', brand: 'Apple', price: 1099, condition: 'new', rating: 4.9, reviews: 92, stock: 4, icon: 'laptop', cat: 'Laptops' },
  { id: 4, name: 'iPhone 13', brand: 'Apple', price: 549, condition: 'used', rating: 4.5, reviews: 340, stock: 12, icon: 'smartphone', cat: 'Phones' },
  { id: 5, name: 'PlayStation 5', brand: 'Sony', price: 499, condition: 'new', rating: 4.8, reviews: 501, stock: 0, icon: 'gamepad-2', cat: 'Consoles' },
  { id: 6, name: 'AirPods Pro 2', brand: 'Apple', price: 249, condition: 'new', rating: 4.6, reviews: 720, stock: 40, icon: 'headphones', cat: 'Accessories' },
  { id: 7, name: 'Pixel 8 Pro', brand: 'Google', price: 799, condition: 'used', rating: 4.4, reviews: 88, stock: 6, icon: 'smartphone', cat: 'Phones' },
  { id: 8, name: 'iPad Air', brand: 'Apple', price: 599, condition: 'new', rating: 4.7, reviews: 133, stock: 9, icon: 'tablet', cat: 'Tablets' },
];
const CATEGORIES = ['Phones', 'Laptops', 'Tablets', 'Consoles', 'Accessories'];

function FilterGroup({ title, children }) {
  return (
    <div style={{ paddingBottom: 20, marginBottom: 20, borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </div>
  );
}

function ShopScreen({ onAdd }) {
  const [cats, setCats] = useState([]);
  const [conds, setConds] = useState([]);
  const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
  let items = CATALOG.filter(p =>
    (cats.length === 0 || cats.includes(p.cat)) &&
    (conds.length === 0 || conds.includes(p.condition)));

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', marginBottom: 6 }}>Shop / All Devices</div>
        <h1 style={{ fontSize: 'var(--fs-h1)', fontWeight: 700, letterSpacing: 'var(--ls-tight)', margin: 0, color: 'var(--text-strong)' }}>All Devices</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 40, alignItems: 'start' }}>
        <aside>
          <FilterGroup title="Category">
            {CATEGORIES.map(c => <Checkbox key={c} label={c} checked={cats.includes(c)} onChange={() => toggle(cats, setCats, c)} />)}
          </FilterGroup>
          <FilterGroup title="Condition">
            <Checkbox label="New" checked={conds.includes('new')} onChange={() => toggle(conds, setConds, 'new')} />
            <Checkbox label="Used" checked={conds.includes('used')} onChange={() => toggle(conds, setConds, 'used')} />
          </FilterGroup>
          <Button variant="ghost" size="sm" onClick={() => { setCats([]); setConds([]); }} iconLeft={<Icon name="x" size={14} />}>Clear filters</Button>
        </aside>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>{items.length} products</span>
            <div style={{ width: 200 }}><Select options={['Sort: Featured', 'Price: Low to High', 'Price: High to Low', 'Top Rated']} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gap-grid)' }}>
            {items.map(p => <ProductCard key={p.id} product={p} onAdd={() => onAdd(p)} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ShopScreen, CATALOG });
