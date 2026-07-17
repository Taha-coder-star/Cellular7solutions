import { useRef } from 'react';
import { Icon } from '@/components/ui';
import { useRevealOnView } from '@/hooks/useReveal';

const ITEMS = ['Trusted Local Repairs', 'Same Day Service', 'Genuine Parts'];

export default function TrustStrip() {
  const gridRef = useRef(null);
  useRevealOnView(gridRef, { stagger: 80 });

  return (
    <section style={{ background: 'var(--white)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-3"
        style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px var(--space-6)', boxSizing: 'border-box', gap: '24px' }}
      >
        {ITEMS.map((label) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Icon name="check-circle" size={22} color="var(--graphite-900)" aria-hidden="true" />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
