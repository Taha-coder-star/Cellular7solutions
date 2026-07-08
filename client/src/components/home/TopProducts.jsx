import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard, Button, Icon } from '@/components/ui';
import { useCart } from '@/context/CartContext';
import api from '@/services/api';

// Shape the API product into what ProductCard expects.
// brand is a populated object { _id, name, slug } after the backend fix,
// images[0] maps to `image`, rating/reviews are not on the model yet.
function normalizeProduct(p) {
  return {
    _id: p._id,
    name: p.name,
    brand: p.brand?.name ?? '',
    price: p.price,
    image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
    condition: p.condition ?? 'new',
    stock: p.stock ?? 0,
    rating: p.rating,
    reviews: p.reviews,
    icon: 'smartphone',
  };
}

function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        background: 'var(--surface-card)',
      }}
    >
      <div
        className="animate-pulse"
        style={{ aspectRatio: '1 / 1', background: 'var(--graphite-100)' }}
      />
      <div
        className="animate-pulse"
        style={{ padding: 'var(--pad-card)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
      >
        <div style={{ height: '12px', background: 'var(--graphite-100)', borderRadius: '4px', width: '40%' }} />
        <div style={{ height: '18px', background: 'var(--graphite-100)', borderRadius: '4px', width: '75%' }} />
        <div style={{ height: '12px', background: 'var(--graphite-100)', borderRadius: '4px', width: '50%' }} />
        <div style={{ height: '48px', background: 'var(--graphite-100)', borderRadius: 'var(--radius-btn)', marginTop: 'var(--space-2)' }} />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="col-span-full"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-4)',
        padding: 'var(--pad-section) var(--space-6)',
        textAlign: 'center',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '64px',
          height: '64px',
          borderRadius: 'var(--radius-card)',
          background: 'var(--graphite-100)',
        }}
      >
        <Icon name="smartphone" size={28} color="var(--graphite-400)" />
      </span>
      <div>
        <p style={{ margin: '0 0 var(--space-2)', fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>
          New arrivals coming soon
        </p>
        <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
          Check back shortly — we're stocking up.
        </p>
      </div>
      <Button variant="secondary" size="md">
        <Link to="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>Browse All Products</Link>
      </Button>
    </div>
  );
}

function ErrorState() {
  return (
    <div
      className="col-span-full"
      style={{
        padding: 'var(--space-10)',
        textAlign: 'center',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--fs-sm)',
        color: 'var(--text-muted)',
      }}
    >
      Could not load featured products.{' '}
      <Link to="/shop" style={{ color: 'var(--text-strong)', fontWeight: 'var(--fw-medium)' }}>
        Browse all products →
      </Link>
    </div>
  );
}

export default function TopProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    api
      .get('/products', { params: { isFeatured: true, limit: 4 } })
      .then(({ data }) => {
        setProducts((data.products ?? []).map(normalizeProduct));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section style={{ padding: 'var(--pad-section) var(--space-6)', background: 'var(--surface-page)' }}>
      <div className="max-w-7xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-xs)',
                fontWeight: 'var(--fw-semibold)',
                letterSpacing: 'var(--ls-wider)',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}
            >
              Shop the Latest
            </span>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-h2)',
                fontWeight: 'var(--fw-bold)',
                letterSpacing: 'var(--ls-tight)',
                color: 'var(--text-strong)',
              }}
            >
              Top Products
            </h2>
          </div>
          <Link
            to="/shop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-sm)',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--text-strong)',
              textDecoration: 'none',
            }}
          >
            View all <Icon name="arrow-right" size={16} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading && [1, 2, 3, 4].map((n) => <SkeletonCard key={n} />)}
          {!loading && error && <ErrorState />}
          {!loading && !error && products.length === 0 && <EmptyState />}
          {!loading && !error && products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAdd={() => addToCart(product, 1)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        {!loading && !error && products.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="secondary" size="md" iconRight={<Icon name="arrow-right" size={16} />}>
              <Link to="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>View All Products</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
