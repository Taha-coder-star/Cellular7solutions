import { useEffect } from 'react';

const EASE = 'cubic-bezier(0.19, 1, 0.22, 1)';

/** Staggers a translateY+fade entrance across `ref`'s children when the
 *  container scrolls into view. Children keep their normal CSS opacity (1)
 *  the whole time — the entrance is a WAAPI animation layered on top, not a
 *  visibility gate — so a JS/observer failure just skips the effect instead
 *  of shipping blank content (see impeccable animate.md). */
export function useRevealOnView(ref, { stagger = 60, deps = [] } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      Array.from(el.children).forEach((item, i) => {
        item.animate(
          [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }],
          { duration: 450, delay: i * stagger, easing: EASE, fill: 'both' }
        );
      });
      io.disconnect();
    }, { threshold: 0.2 });

    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, stagger, ...deps]);
}
