import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui';
import api from '@/services/api';
import { useRevealOnView } from '@/hooks/useReveal';
import { productImageSrc, productImageSrcSet } from '@/utils/image';

// brand is a populated object { _id, name, slug } after the backend fix,
// images[0] maps to `image`.
function normalizeProduct(p) {
  return {
    _id: p._id,
    name: p.name,
    image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
  };
}

function GalleryCardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div className="animate-pulse" style={{ aspectRatio: '1 / 1', background: 'var(--graphite-100)' }} />
      <div className="animate-pulse" style={{ height: '14px', width: '60%', margin: '0 auto', background: 'var(--graphite-100)', borderRadius: 'var(--radius-sm)' }} />
    </div>
  );
}

function ProductCard({ product }) {
  const [hover, setHover] = useState(false);

  return (
    <Link
      to={`/product/${product._id}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '18px' }}
    >
      <div style={{ aspectRatio: '1 / 1', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {product.image
          ? (
            <img
              src={productImageSrc(product.image, 400)}
              srcSet={productImageSrcSet(product.image)}
              sizes="(max-width: 640px) 45vw, 280px"
              alt={product.name}
              loading="lazy"
              style={{
                width: '100%', height: '100%', objectFit: 'contain',
                transform: hover ? 'scale(1.06)' : 'scale(1)',
                transition: 'transform 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
              }}
            />
          )
          : <Icon name="smartphone" size={72} strokeWidth={1} color="var(--graphite-300)" />}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-semibold)',
            color: hover ? 'var(--graphite-600)' : 'var(--text-strong)', marginBottom: '8px',
            transition: 'color 0.2s ease-out',
          }}
        >
          {product.name}
        </div>
      </div>
    </Link>
  );
}

export default function TopProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const gridRef = useRef(null);
  useRevealOnView(gridRef, { stagger: 60, deps: [products] });

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
            View all <Icon name="arrow-right" size={16} aria-hidden="true" />
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
          <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" style={{ gap: '28px' }}>
            {loading && [1, 2, 3, 4, 5].map((n) => <GalleryCardSkeleton key={n} />)}
            {!loading && products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
