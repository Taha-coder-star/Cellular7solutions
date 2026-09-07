import { useEffect, useState } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';
import { getPaginationRange } from '@/utils/pagination';

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [breakpoint]);

  return isMobile;
}

/** Compact page-number pagination: first/last page, a window around the
 *  current page, and '...' for skipped ranges. Reuse this everywhere a
 *  page-number list is rendered instead of mapping 1..totalPages directly. */
export function Pagination({ page, totalPages, onChange }) {
  const isMobile = useIsMobile();
  if (totalPages <= 1) return null;

  const items = getPaginationRange(page, totalPages, isMobile ? 1 : 2);

  return (
    <nav aria-label="Pagination" style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'nowrap', overflowX: 'auto' }}>
      <Button
        variant="secondary"
        size="sm"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
      >
        <Icon name="chevron-left" size={16} />
      </Button>

      {items.map((item, i) =>
        item === '...' ? (
          <span
            key={`ellipsis-${i}`}
            aria-hidden="true"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 'var(--control-h-sm)', color: 'var(--text-muted)' }}
          >
            …
          </span>
        ) : (
          <Button
            key={item}
            variant={item === page ? 'product' : 'secondary'}
            size="sm"
            onClick={() => onChange(item)}
            aria-current={item === page ? 'page' : undefined}
            aria-label={`Page ${item}`}
          >
            {item}
          </Button>
        )
      )}

      <Button
        variant="secondary"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
      >
        <Icon name="chevron-right" size={16} />
      </Button>
    </nav>
  );
}
