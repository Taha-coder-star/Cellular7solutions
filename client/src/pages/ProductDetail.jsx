import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Badge, Rating, Icon, Card } from '@/components/ui';
import { useCart } from '@/context/CartContext';
import api from '@/services/api';
import { usd, normalizeBrandName } from '@/utils/format';
import { productImageSrc, productImageSrcSet } from '@/utils/image';

const label = {
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--fs-xs)',
  fontWeight: 'var(--fw-semibold)',
  letterSpacing: 'var(--ls-wide)',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
};

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="animate-pulse" style={{ aspectRatio: '1 / 1', background: 'var(--graphite-100)', borderRadius: 'var(--radius-card)' }} />
      <div className="animate-pulse" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ height: '14px', width: '30%', background: 'var(--graphite-100)', borderRadius: '4px' }} />
        <div style={{ height: '32px', width: '70%', background: 'var(--graphite-100)', borderRadius: '4px' }} />
        <div style={{ height: '20px', width: '40%', background: 'var(--graphite-100)', borderRadius: '4px' }} />
        <div style={{ height: '48px', width: '100%', background: 'var(--graphite-100)', borderRadius: 'var(--radius-btn)', marginTop: 'var(--space-6)' }} />
      </div>
    </div>
  );
}

function StepButton({ children, disabled, onClick, ariaLabel }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={ariaLabel}
      style={{
        width: '44px',
        height: '44px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: hover && !disabled ? 'var(--surface-subtle)' : 'var(--white)',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--fs-lg)',
        color: 'var(--text-strong)',
        opacity: disabled ? 0.5 : 1,
        transition: 'var(--transition-base)',
      }}
    >
      {children}
    </button>
  );
}

function QuantitySelector({ value, onChange, max }) {
  const atMin = value <= 1;
  const atMax = max != null && value >= max;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-btn)',
        overflow: 'hidden',
      }}
    >
      <StepButton disabled={atMin} onClick={() => onChange(Math.max(1, value - 1))} ariaLabel="Decrease quantity">−</StepButton>
      <span aria-live="polite" style={{ minWidth: '44px', textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>
        {value}
      </span>
      <StepButton disabled={atMax} onClick={() => onChange(Math.min(max || 99, value + 1))} ariaLabel="Increase quantity">+</StepButton>
    </div>
  );
}

function GalleryHero({ image, alt, hasImage, onZoom }) {
  const [hover, setHover] = useState(false);
  const Wrapper = hasImage ? 'button' : 'div';
  return (
    <Wrapper
      {...(hasImage ? { type: 'button', onClick: onZoom, 'aria-label': `Zoom in on ${alt}` } : {})}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        aspectRatio: '1 / 1',
        background: 'var(--graphite-50)',
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        cursor: hasImage ? 'zoom-in' : 'default',
      }}
    >
      {hasImage ? (
        <>
          <img
            src={productImageSrc(image, 800)}
            srcSet={productImageSrcSet(image)}
            sizes="(max-width: 1024px) 90vw, 600px"
            alt={alt}
            style={{
              width: '100%', height: '100%', objectFit: 'contain',
              transform: hover ? 'scale(1.03)' : 'none', transition: 'var(--transition-base)',
            }}
          />
          <span
            style={{
              position: 'absolute', bottom: 'var(--space-4)', right: 'var(--space-4)',
              width: '40px', height: '40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '50%', background: 'rgba(24, 24, 27, 0.6)', color: 'var(--white)',
              opacity: hover ? 1 : 0, transition: 'var(--transition-base)',
            }}
          >
            <Icon name="zoom-in" size={18} />
          </span>
        </>
      ) : (
        <Icon name="smartphone" size={120} strokeWidth={1} color="var(--graphite-300)" />
      )}
    </Wrapper>
  );
}

const LIGHTBOX_EXIT_MS = 200;

/** Native <dialog> lightbox — same instant-pop-then-layer-a-transition
 *  technique used for the Shop page's mobile filter sheet. The image itself
 *  is rendered at a much larger width so pinch/ctrl-scroll zoom (already
 *  enabled by the page's viewport meta) reveals real detail, not just a
 *  scaled-up version of the same small file. */
function ImageLightbox({ dialogRef, open, onDialogClose, onDismiss, src, srcSet, alt }) {
  return (
    <dialog
      ref={dialogRef}
      aria-label={alt}
      onClose={onDialogClose}
      style={{ margin: 0, padding: 0, border: 'none', maxWidth: 'none', width: '100%', height: '100%', maxHeight: 'none', background: 'transparent', overflow: 'hidden' }}
    >
      <div
        onClick={onDismiss}
        style={{
          position: 'absolute', inset: 0, background: 'rgba(24, 24, 27, 0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)',
          opacity: open ? 1 : 0, transition: 'opacity 0.25s ease-out',
        }}
      >
        <img
          src={src}
          srcSet={srcSet}
          sizes="90vw"
          alt={alt}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 'var(--radius-sm)',
            transform: open ? 'scale(1)' : 'scale(0.96)',
            transition: `transform ${LIGHTBOX_EXIT_MS * 1.5}ms cubic-bezier(0.19, 1, 0.22, 1)`,
          }}
        />
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close zoomed image"
          style={{
            position: 'absolute', top: 'var(--space-5)', right: 'var(--space-5)',
            width: '44px', height: '44px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.15)', color: 'var(--white)',
          }}
        >
          <Icon name="x" size={22} />
        </button>
      </div>
    </dialog>
  );
}

function ReviewsSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get(`/reviews/product/${productId}`)
      .then(({ data }) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [productId]);

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <h2 style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>
        Reviews{!loading && !error ? ` (${reviews.length})` : ''}
      </h2>

      {loading && (
        <div className="animate-pulse" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {[1, 2].map((n) => (
            <div key={n} style={{ height: '90px', background: 'var(--graphite-100)', borderRadius: 'var(--radius-card)' }} />
          ))}
        </div>
      )}

      {!loading && error && (
        <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
          Could not load reviews right now.
        </p>
      )}

      {!loading && !error && reviews.length === 0 && (
        <Card>
          <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
            No reviews yet. Reviews appear here after verified purchases.
          </p>
        </Card>
      )}

      {!loading && !error && reviews.map((r) => (
        <Card key={r._id}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>
                {r.user?.name || 'Customer'}
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                {new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <Rating value={r.rating} size={14} />
            <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', color: 'var(--text-body)', lineHeight: 'var(--lh-relaxed)' }}>
              {r.comment}
            </p>
          </div>
        </Card>
      ))}
    </section>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const lightboxRef = useRef(null);
  const lightboxTimeoutRef = useRef(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  function openLightbox() {
    clearTimeout(lightboxTimeoutRef.current);
    lightboxRef.current?.showModal();
    lightboxTimeoutRef.current = setTimeout(() => setLightboxOpen(true), 20);
  }
  function closeLightbox() {
    clearTimeout(lightboxTimeoutRef.current);
    setLightboxOpen(false);
    lightboxTimeoutRef.current = setTimeout(() => lightboxRef.current?.close(), LIGHTBOX_EXIT_MS);
  }

  useEffect(() => {
    setLoading(true);
    setError(false);
    api
      .get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAdd() {
    addToCart(
      {
        _id: product._id,
        name: product.name,
        brand: normalizeBrandName(product.brand?.name),
        price: product.price,
        image: product.images?.[0] ?? null,
        condition: product.condition,
        stock: product.stock,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto" style={{ padding: 'var(--pad-section) var(--space-6)', fontFamily: 'var(--font-sans)' }}>
        <GallerySkeleton />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto" style={{ padding: 'var(--pad-section) var(--space-6)', textAlign: 'center', fontFamily: 'var(--font-sans)' }}>
        <p style={{ margin: '0 0 var(--space-6)', fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>
          Product not found
        </p>
        <Button as={Link} to="/shop" variant="secondary" style={{ textDecoration: 'none' }}>
          Back to Shop
        </Button>
      </div>
    );
  }

  const images = Array.isArray(product.images) ? product.images : [];
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="max-w-7xl mx-auto" style={{ padding: 'var(--space-10) var(--space-6) var(--pad-section)', fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
        <Link to="/shop" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Shop</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-strong)' }}>{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* Gallery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <GalleryHero
            image={images[activeImage]}
            alt={product.name}
            hasImage={images.length > 0}
            onZoom={openLightbox}
          />

          {images.length > 1 && (
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              {images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  style={{
                    width: '72px',
                    height: '72px',
                    padding: 0,
                    borderRadius: 'var(--radius-sm)',
                    border: `2px solid ${i === activeImage ? 'var(--graphite-900)' : 'var(--border-subtle)'}`,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: 'var(--graphite-50)',
                  }}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={productImageSrc(img, 400)} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {normalizeBrandName(product.brand?.name) && <span style={label}>{normalizeBrandName(product.brand?.name)}</span>}

          <h1 style={{ margin: 0, fontSize: 'var(--fs-h1)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--ls-tight)', lineHeight: 'var(--lh-tight)', color: 'var(--text-strong)' }}>
            {product.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <Badge tone={product.condition === 'used' ? 'used' : 'new'}>{product.condition}</Badge>
            {product.rating != null && <Rating value={product.rating} count={product.reviews} size={16} />}
          </div>

          <span style={{ fontSize: 'var(--fs-h2)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>
            {usd(product.price)}
          </span>

          {/* Stock status */}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', color: outOfStock ? 'var(--danger-500)' : lowStock ? 'var(--warning-700)' : 'var(--success-700)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }} />
            {outOfStock ? 'Out of stock' : lowStock ? `Only ${product.stock} left in stock` : 'In stock'}
          </span>

          {/* Quantity + Add to Cart */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
            <QuantitySelector value={qty} onChange={setQty} max={product.stock} />
            <Button
              variant="product"
              size="md"
              disabled={outOfStock}
              onClick={handleAdd}
              iconLeft={<Icon name={added ? 'check' : 'shopping-cart'} size={18} />}
              style={{ flex: '1 1 auto', minWidth: '200px' }}
            >
              {outOfStock ? 'Out of Stock' : added ? 'Added to Cart' : 'Add to Cart'}
            </Button>
          </div>

          {/* Description */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-5)', marginTop: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <span style={label}>Description</span>
            <p style={{ margin: 0, fontSize: 'var(--fs-body)', color: 'var(--text-body)', lineHeight: 'var(--lh-relaxed)', whiteSpace: 'pre-line' }}>
              {product.description}
            </p>
          </div>
        </div>
      </div>

      <ReviewsSection productId={id} />

      {images.length > 0 && (
        <ImageLightbox
          dialogRef={lightboxRef}
          open={lightboxOpen}
          onDialogClose={() => setLightboxOpen(false)}
          onDismiss={closeLightbox}
          src={productImageSrc(images[activeImage], 1600)}
          srcSet={productImageSrcSet(images[activeImage])}
          alt={product.name}
        />
      )}
    </div>
  );
}
