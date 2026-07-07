import { useState } from 'react';
import { Button } from './Button';
import { Badge } from './Badge';
import { Rating } from './Rating';
import { Icon } from './Icon';

const usd = (n) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function ProductCard({ product = {}, onAdd, style = {} }) {
  const {
    name = 'Product',
    brand = '',
    price = 0,
    image,
    condition = 'new',
    rating,
    reviews,
    stock,
    icon = 'smartphone',
  } = product;

  const [h, setH] = useState(false);
  const outOfStock = stock === 0;

  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-card)',
        boxShadow: h ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
        transform: h ? 'translateY(-2px)' : 'none',
        transition: 'var(--transition-base)',
        overflow: 'hidden',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '1 / 1', background: 'var(--graphite-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {image
          ? <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-base)', transform: h ? 'scale(1.03)' : 'none' }} />
          : <Icon name={icon} size={72} strokeWidth={1.25} color="var(--graphite-300)" style={{ transition: 'var(--transition-base)', transform: h ? 'scale(1.05)' : 'none' }} />
        }
        <span style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <Badge tone={condition === 'used' ? 'used' : 'new'}>{condition}</Badge>
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 'var(--pad-card)' }}>
        {brand && (
          <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            {brand}
          </span>
        )}
        <span style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', lineHeight: 'var(--lh-snug)' }}>
          {name}
        </span>
        {rating != null && <Rating value={rating} count={reviews} size={14} />}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>
            {usd(price)}
          </span>
        </div>
        <Button variant="product" fullWidth disabled={outOfStock} onClick={onAdd} style={{ marginTop: '8px' }}>
          {outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
}
