function range(start, end) {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i);
}

/**
 * Builds a compact page-number list with '...' placeholders, e.g.
 * [1, 2, 3, 4, 5, '...', 100] or [1, '...', 48, 49, 50, 51, 52, '...', 100].
 * siblingCount controls how many pages are shown on each side of `current`.
 */
export function getPaginationRange(current, total, siblingCount = 2) {
  if (total <= 0) return [];

  const windowSize = siblingCount * 2 + 1;
  if (total <= windowSize + 2) return range(1, total);

  const leftSibling = Math.max(current - siblingCount, 1);
  const rightSibling = Math.min(current + siblingCount, total);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < total - 1;

  if (!showLeftDots && showRightDots) {
    return [...range(1, windowSize), '...', total];
  }

  if (showLeftDots && !showRightDots) {
    return [1, '...', ...range(total - windowSize + 1, total)];
  }

  return [1, '...', ...range(leftSibling, rightSibling), '...', total];
}
