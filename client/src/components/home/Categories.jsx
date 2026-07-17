import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui';
import api from '@/services/api';
import { useRevealOnView } from '@/hooks/useReveal';

const CARD_COUNT = 4;

// Category model has no icon field — map by name, fall back to a generic
// device icon for anything unmapped rather than guessing a new category.
const ICON_BY_NAME = {
  laptops: 'laptop',
  gaming: 'gamepad-2',
  headphones: 'headphones',
  airpods: 'headphones',
  bluetooth: 'headphones',
  tablet: 'tablet-smartphone',
  ipad: 'tablet-smartphone',
  cases: 'shield-check',
  'tempered glass': 'shield-check',
  chargers: 'plug',
  'phone accessories': 'smartphone',
  speakers: 'speaker',
};

// Same verified Unsplash photos already used for the product catalog —
// reused here (not re-sourced) so the two surfaces stay visually consistent.
const PHOTO_BY_NAME = {
  laptops: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
  gaming: 'https://images.unsplash.com/photo-1612036781124-847f8939b154',
  headphones: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb',
  airpods: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7',
  bluetooth: 'https://images.unsplash.com/photo-1573706519066-6c0611466bb7',
  tablet: 'https://images.unsplash.com/photo-1654852360714-3899af1f5be7',
  ipad: 'https://images.unsplash.com/photo-1557825835-a526494be845',
  cases: 'https://images.unsplash.com/photo-1583291023438-41cef6453b1f',
  'tempered glass': 'https://images.unsplash.com/photo-1726900303636-fb7447fce40d',
  chargers: 'https://images.unsplash.com/photo-1731616103600-3fe7ccdc5a59',
  'phone accessories': 'https://images.unsplash.com/photo-1701856270353-403069731ce5',
  speakers: 'https://images.unsplash.com/photo-1582978571763-2d039e56f0c3',
};

function CategoryCard({ photo, icon, label, count, to }) {
  const [hover, setHover] = useState(false);

  return (
    <Link
      to={to}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'block',
        aspectRatio: '4 / 5',
        borderRadius: 'var(--radius-card)',
        overflow: 'hidden',
        background: 'var(--graphite-100)',
        textDecoration: 'none',
        boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transform: hover ? 'translateY(-4px)' : 'none',
        transition: 'var(--transition-base)',
      }}
    >
      {photo ? (
        <img
          src={`${photo}?auto=format&fit=crop&w=800&q=80`}
          alt=""
          loading="lazy"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            transform: hover ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
          }}
        />
      ) : (
        <span aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--graphite-300)' }}>
          <Icon name={icon} size={48} strokeWidth={1.25} />
        </span>
      )}

      {/* Legibility gradient — same recipe as the site's photographic heroes */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(24,24,27,0) 40%, rgba(24,24,27,.82) 100%)' }} />

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 'var(--space-5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)', color: 'var(--white)' }}>
            {label}
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', color: 'rgba(255,255,255,.75)', marginTop: '2px' }}>
            {count} {count === 1 ? 'item' : 'items'}
          </div>
        </div>
        <span
          aria-hidden="true"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px',
            borderRadius: '50%', background: 'var(--white)', color: 'var(--graphite-900)', flexShrink: 0,
            opacity: hover ? 1 : 0,
            transform: hover ? 'scale(1) translateX(0)' : 'scale(0.8) translateX(-4px)',
            transition: 'var(--transition-base)',
          }}
        >
          <Icon name="arrow-right" size={16} />
        </span>
      </div>
    </Link>
  );
}

function CategoryCardSkeleton() {
  return (
    <div
      className="animate-pulse"
      style={{ aspectRatio: '4 / 5', borderRadius: 'var(--radius-card)', background: 'var(--graphite-100)' }}
    />
  );
}

export default function Categories() {
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState(false);
  const gridRef = useRef(null);
  useRevealOnView(gridRef, { stagger: 70, deps: [categories] });

  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/products', { params: { limit: 100 } }),
    ])
      .then(([{ data: cats }, { data: prodData }]) => {
        const counts = {};
        for (const p of prodData.products ?? []) {
          const catId = p.category?._id ?? p.category;
          if (catId) counts[catId] = (counts[catId] ?? 0) + 1;
        }
        const ranked = (cats ?? [])
          .map((c) => ({ ...c, count: counts[c._id] ?? 0 }))
          .sort((a, b) => b.count - a.count)
          .slice(0, CARD_COUNT);
        setCategories(ranked);
      })
      .catch(() => setError(true));
  }, []);

  if (error) return null;

  return (
    <section style={{ padding: '80px var(--space-6) 64px', maxWidth: '1280px', margin: '0 auto', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '36px', gap: '20px', flexWrap: 'wrap' }}>
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
          Shop by category
        </h2>
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
          View all products <Icon name="arrow-right" size={16} aria-hidden="true" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '24px' }}>
        {categories === null && Array.from({ length: CARD_COUNT }).map((_, i) => <CategoryCardSkeleton key={i} />)}
        {categories?.map((c) => {
          const key = c.name.toLowerCase();
          return (
            <CategoryCard
              key={c._id}
              photo={PHOTO_BY_NAME[key]}
              icon={ICON_BY_NAME[key] ?? 'smartphone'}
              label={c.name}
              count={c.count}
              to={`/shop?category=${c._id}`}
            />
          );
        })}
      </div>
    </section>
  );
}
