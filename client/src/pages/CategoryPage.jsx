import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/services/api';
import Shop from './Shop';

/** Resolves a nested /categories/a/b/c slug path against the DB tree, then
 *  renders the existing Shop page filtered by the resolved category —
 *  reuses all of Shop's fetch/filter/pagination logic instead of duplicating it. */
export default function CategoryPage() {
  const params = useParams();
  const path = params['*'] || '';
  const [state, setState] = useState({ loading: true, error: false, category: null, ancestors: [] });

  useEffect(() => {
    let alive = true;
    setState({ loading: true, error: false, category: null, ancestors: [] });
    api
      .get('/categories/resolve', { params: { path } })
      .then(({ data }) => {
        if (alive) setState({ loading: false, error: false, category: data.category, ancestors: data.ancestors });
      })
      .catch(() => { if (alive) setState({ loading: false, error: true, category: null, ancestors: [] }); });
    return () => { alive = false; };
  }, [path]);

  if (state.loading) {
    return <div style={{ padding: '96px 24px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>Loading…</div>;
  }
  if (state.error || !state.category) {
    return (
      <div style={{ padding: '96px 24px', textAlign: 'center', fontFamily: 'var(--font-sans)' }}>
        <p style={{ color: 'var(--text-muted)' }}>Category not found.</p>
      </div>
    );
  }

  return <Shop forcedCategoryId={state.category._id} breadcrumbOverride={state.ancestors} />;
}
