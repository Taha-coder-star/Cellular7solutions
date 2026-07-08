import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Icon } from '@/components/ui';
import { useCart } from '@/context/CartContext';
import { usd } from '@/utils/format';

function QuantityStepper({ value, onChange }) {
  const btn = {
    width: '36px',
    height: '36px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--white)',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--fs-body)',
    color: 'var(--text-strong)',
  };
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-btn)', overflow: 'hidden' }}>
      <button type="button" style={btn} onClick={() => onChange(value - 1)} aria-label="Decrease quantity">−</button>
      <span style={{ minWidth: '36px', textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>
        {value}
      </span>
      <button type="button" style={btn} onClick={() => onChange(value + 1)} aria-label="Increase quantity">+</button>
    </div>
  );
}

function EmptyCart() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-5)', padding: 'var(--pad-section) var(--space-6)', textAlign: 'center' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', borderRadius: 'var(--radius-card)', background: 'var(--graphite-100)' }}>
        <Icon name="shopping-cart" size={32} color="var(--graphite-400)" />
      </span>
      <div>
        <p style={{ margin: '0 0 var(--space-2)', fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>
          Your cart is empty
        </p>
        <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
          Browse the shop and add something you like.
        </p>
      </div>
      <Button variant="product" iconRight={<Icon name="arrow-right" size={16} />}>
        <Link to="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>Start Shopping</Link>
      </Button>
    </div>
  );
}

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  function handleQtyChange(id, next) {
    if (next < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, next);
    }
  }

  return (
    <div className="max-w-7xl mx-auto" style={{ padding: 'var(--space-10) var(--space-6) var(--pad-section)', fontFamily: 'var(--font-sans)' }}>
      <h1 style={{ margin: '0 0 var(--space-8)', fontSize: 'var(--fs-h1)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>
        Cart{cartCount > 0 ? ` (${cartCount})` : ''}
      </h1>

      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Items */}
          <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {cartItems.map((item) => (
              <Card key={item._id} padding="var(--space-4)">
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>

                  {/* Thumb */}
                  <div style={{ width: '80px', height: '80px', flexShrink: 0, borderRadius: 'var(--radius-sm)', background: 'var(--graphite-50)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {item.image
                      ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <Icon name="smartphone" size={32} strokeWidth={1.5} color="var(--graphite-300)" />}
                  </div>

                  {/* Name / brand / unit price */}
                  <div style={{ flex: '1 1 160px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                    <Link to={`/product/${item._id}`} style={{ fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', textDecoration: 'none' }}>
                      {item.name}
                    </Link>
                    {item.brand && (
                      <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                        {item.brand}
                      </span>
                    )}
                    <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>{usd(item.price)} each</span>
                  </div>

                  {/* Qty + line total + remove */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                    <QuantityStepper value={item.quantity} onChange={(next) => handleQtyChange(item._id, next)} />
                    <span style={{ fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', minWidth: '84px', textAlign: 'right' }}>
                      {usd(item.price * item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id)}
                      aria-label={`Remove ${item.name} from cart`}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'inline-flex', padding: 'var(--space-1)' }}
                    >
                      <Icon name="x" size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <h2 style={{ margin: 0, fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>
                Order Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                  <span>Subtotal ({cartCount} item{cartCount !== 1 ? 's' : ''})</span>
                  <span style={{ color: 'var(--text-strong)', fontWeight: 'var(--fw-semibold)' }}>{usd(cartTotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>Total</span>
                <span style={{ fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>{usd(cartTotal)}</span>
              </div>

              <Button variant="product" fullWidth size="lg" onClick={() => navigate('/checkout')} iconRight={<Icon name="arrow-right" size={18} />}>
                Proceed to Checkout
              </Button>

              <Link to="/shop" style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--text-muted)', textDecoration: 'none', textAlign: 'center' }}>
                Continue shopping
              </Link>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
