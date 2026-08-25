import { useState, useEffect } from 'react';
import api from '@/services/api';

// Catch-all/overflow buckets the import pipeline creates for anything that
// doesn't fit a real leaf category (e.g. "Other Galaxy S", "Other Parts") —
// consistently named with an "Other " prefix across the whole tree, plus the
// legacy flat "Store" root. High product counts make these bubble to the top
// of a naive by-count ranking, but they're meaningless as a browsing entry
// point, so they're excluded before ranking rather than allow-listing names.
const isBucketCategory = (name) => /^other\b/i.test(name) || name.toLowerCase() === 'store';

/** Categories ranked by product count (descending), via the /products/facets aggregation. */
export function useTopCategories(limit) {
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/categories'), api.get('/products/facets')])
      .then(([{ data: cats }, { data: facets }]) => {
        const counts = facets.categories ?? {};
        const ranked = (cats ?? [])
          .filter((c) => !isBucketCategory(c.name))
          .map((c) => ({ ...c, count: counts[c._id] ?? 0 }))
          .sort((a, b) => b.count - a.count)
          .slice(0, limit);
        setCategories(ranked);
      })
      .catch(() => setError(true));
  }, [limit]);

  return { categories, loading: categories === null && !error, error };
}
