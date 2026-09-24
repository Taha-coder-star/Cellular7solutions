import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui';
import { useTopCategories } from '@/hooks/useTopCategories';

const PHOTO_BY_NAME = {
  'samsung cases': '/assets/category-samsung-cases-reference.webp',
  'apple parts': '/assets/category-apple-parts-reference.webp',
  smartphones: '/assets/category-smartphones-reference.webp',
  accessories: '/assets/category-accessories-reference.webp',
};

export default function Categories() {
  const { categories, error } = useTopCategories(4);
  const preferredOrder = ['smartphones', 'samsung cases', 'apple parts', 'accessories'];
  const rank = (name) => {
    const index = preferredOrder.indexOf(name.toLowerCase());
    return index < 0 ? preferredOrder.length : index;
  };
  const orderedCategories = categories?.slice().sort((a, b) => rank(a.name) - rank(b.name));

  return (
    <section className="home-categories storefront-section" aria-labelledby="categories-heading">
      <div className="storefront-section-heading">
        <div>
          <p className="storefront-eyebrow">Shop by category</p>
          <h2 id="categories-heading">Find what moves you</h2>
        </div>
        <Link className="storefront-text-link" to="/shop">Shop all products <Icon name="arrow-right" size={17} /></Link>
      </div>

      {error && <p className="storefront-muted">Categories are unavailable right now. <Link to="/shop">Browse the shop</Link>.</p>}
      {!error && (
        <div className="home-category-grid grid-flow-dense">
          {Array.from({ length: 4 }).map((_, index) => {
            const category = orderedCategories?.[index];
            const image = category ? PHOTO_BY_NAME[category.name.toLowerCase()] : null;
            return category ? (
              <Link className={`home-category-card home-category-card-${index + 1}`} to={`/shop?category=${category._id}`} key={category._id}>
                {image ? <img src={image} alt="" loading="lazy" /> : <span className="home-category-fallback" aria-hidden="true"><Icon name="smartphone" size={72} strokeWidth={1} /></span>}
                <span className="home-category-shade" />
                <span className="home-category-content"><strong>{category.name}</strong><small>{category.count} {category.count === 1 ? 'product' : 'products'}</small></span>
                <span className="home-category-arrow"><Icon name="arrow-right" size={20} /></span>
              </Link>
            ) : <div className={`home-category-card home-category-card-${index + 1} home-category-placeholder`} key={index} aria-hidden="true" />;
          })}
          <Link className="home-category-card home-category-card-service" to="/buysell">
            <span className="home-category-service-glow" aria-hidden="true" />
            <img className="home-category-trade-image" src="/assets/category-smartphones-reference.webp" alt="" loading="lazy" />
            <span className="home-category-service-copy">
              <Icon name="recycle" size={28} strokeWidth={2.4} />
              <strong>Give great tech<br />a second life.</strong>
              <small>Trade in your device</small>
              <span className="home-category-service-button">Trade in now <Icon name="arrow-right" size={15} /></span>
            </span>
          </Link>
        </div>
      )}
    </section>
  );
}
