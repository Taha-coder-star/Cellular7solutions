import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { Badge } from './Badge';
import { Rating } from './Rating';
import { Icon } from './Icon';
import { productImageSrc, productImageSrcSet } from '@/utils/image';
import { whatsappLink } from '@/utils/whatsapp';

/** `to`, when given, wraps the image/title region in a Link — kept
 *  outside the WhatsApp button so no interactive element gets nested. */
export function ProductCard({ product = {}, to, style = {} }) {
  const {
    name = 'Product',
    brand = '',
    image,
    condition = 'new',
    rating,
    reviews,
    stock,
    icon = 'smartphone',
  } = product;

  const [h, setH] = useState(false);
  const outOfStock = stock === 0;
  const ClickArea = to ? Link : 'div';

  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        maxWidth: '100%',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-card)',
        boxShadow: h ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
        transform: h ? 'translateY(-2px)' : 'none',
        transition: 'var(--transition-base)',
        overflow: 'hidden',
        fontFamily: 'var(--font-sans)',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <ClickArea to={to} style={{ display: 'contents', color: 'inherit', textDecoration: 'none' }}>
        <div style={{ position: 'relative', aspectRatio: '4 / 5', background: 'var(--graphite-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {image
            ? <img
                src={productImageSrc(image, 400)}
                srcSet={productImageSrcSet(image)}
                sizes="(max-width: 640px) 45vw, 280px"
                alt={name}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'var(--transition-base)', transform: h ? 'scale(1.03)' : 'none' }}
              />
            : <Icon name={icon} size={96} strokeWidth={1.25} color="var(--graphite-300)" style={{ transition: 'var(--transition-base)', transform: h ? 'scale(1.05)' : 'none' }} />
          }
          <span style={{ position: 'absolute', top: '12px', left: '12px' }}>
            <Badge tone={condition === 'used' ? 'used' : 'new'}>{condition}</Badge>
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: 'var(--pad-card)', paddingBottom: 0 }}>
          {brand && (
            <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              {brand}
            </span>
          )}
          <span
            title={name}
            style={{
              fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', lineHeight: 'var(--lh-snug)',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}
          >
            {name}
          </span>
          {rating != null && <Rating value={rating} count={reviews} size={14} />}
        </div>
      </ClickArea>

      <div style={{ padding: 'var(--pad-card)', paddingTop: '14px', boxSizing: 'border-box', maxWidth: '100%' }}>
        <Button
          as="a"
          href={whatsappLink(product)}
          target="_blank"
          rel="noopener noreferrer"
          variant="product"
          size="sm"
          fullWidth
          disabled={outOfStock}
          iconLeft={<Icon name="message-square" size={16} style={{ flexShrink: 0 }} />}
          style={{
            height: 'auto',
            minHeight: '44px',
            maxWidth: '100%',
            boxSizing: 'border-box',
            padding: '10px 12px',
            whiteSpace: 'normal',
            textAlign: 'center',
            lineHeight: '1.25',
          }}
        >
          {outOfStock ? 'Out of Stock' : 'Inquire on WhatsApp'}
        </Button>
      </div>
    </div>
  );
}
