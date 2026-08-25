import { useEffect, useState } from 'react';
import api from '@/services/api';

let treePromise = null;

function loadCategoryTree() {
  if (!treePromise) {
    treePromise = api.get('/categories/tree').then((res) => res.data).catch((err) => {
      treePromise = null;
      throw err;
    });
  }
  return treePromise;
}

export function useCategoryTree() {
  const [tree, setTree] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    loadCategoryTree()
      .then((data) => { if (alive) setTree(data); })
      .catch(() => { if (alive) setError(true); });
    return () => { alive = false; };
  }, []);

  return { tree, loading: tree === null && !error, error };
}
