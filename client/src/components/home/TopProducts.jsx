import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui';
import api from '@/services/api';

const usd = (n) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// brand is a populated object { _id, name, slug } after the backend fix,
// images[0] maps to `image`, wasPrice/compareAtPrice not on the model yet.
function normalizeProduct(p) {
  return {
    _id: p._id,
    name: p.name,
    price: p.price,
    wasPrice: p.compareAtPrice ?? null,
    image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
  };
}

function GalleryCardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div className="animate-pulse" style={{ aspectRatio: '1 / 1', background: 'var(--graphite-100)' }} />
      <div className="animate-pulse" style={{ height: '14px', width: '60%', margin: '0 auto', background: 'var(--graphite-100)', borderRadius: '4px' }} />
    </div>
  );
}

export default function TopProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get('/products', { params: { isFeatured: true, limit: 5 } })
      .then(({ data }) => {
        setProducts((data.products ?? []).map(normalizeProduct));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      style={{
        background: 'var(--white)',
        backgroundImage: 'radial-gradient(circle, var(--graphite-200) 1px, transparent 1px)',
        backgroundSize: '52px 52px',
      }}
    >
      <div style={{ padding: '80px var(--space-6) 88px', maxWidth: '1360px', margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-xs)',
                fontWeight: 'var(--fw-bold)',
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: 'var(--graphite-500)',
                marginBottom: '12px',
              }}
            >
              Just Landed
            </div>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-h2)',
                fontWeight: 'var(--fw-extrabold)',
                letterSpacing: 'var(--ls-tight)',
                color: 'var(--text-strong)',
              }}
            >
              Featured this Week
            </h2>
          </div>
          <Link
            to="/shop"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-sm)',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--text-strong)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            View all <Icon name="arrow-right" size={16} />
          </Link>
        </div>

        {error && (
          <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', textAlign: 'center' }}>
            Could not load featured products.{' '}
            <Link to="/shop" style={{ color: 'var(--text-strong)', fontWeight: 'var(--fw-medium)' }}>
              Browse all products →
            </Link>
          </p>
        )}

        {!error && !loading && products.length === 0 && (
          <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', textAlign: 'center' }}>
            New arrivals coming soon — check back shortly.
          </p>
        )}

        {!error && (loading || products.length > 0) && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" style={{ gap: '28px' }}>
            {loading && [1, 2, 3, 4, 5].map((n) => <GalleryCardSkeleton key={n} />)}
            {!loading && products.map((p) => (
              <Link key={p._id} to={`/product/${p._id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ aspectRatio: '1 / 1', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.image
                    ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    : <Icon name="smartphone" size={72} strokeWidth={1} color="var(--graphite-300)" />}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', marginBottom: '8px' }}>
                    {p.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>
                      {usd(p.price)}
                    </span>
                    {p.wasPrice && (
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-xs)', color: 'var(--graphite-400)', textDecoration: 'line-through' }}>
                        {usd(p.wasPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
