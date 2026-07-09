const TESTIMONIALS = [
  { quote: 'Screen was cracked beyond use and they had it fixed in under an hour. Looks brand new.', name: 'Amina R.', role: 'iPhone 14 repair' },
  { quote: 'Traded in my old laptop and walked out with a great deal on a new one same day.', name: 'Bilal K.', role: 'Trade-in customer' },
  { quote: 'Honest pricing and they explained exactly what was wrong before fixing anything.', name: 'Sara M.', role: 'Console repair' },
];

export default function Testimonials() {
  return (
    <section style={{ padding: 'var(--pad-section) var(--space-6)', maxWidth: '1280px', margin: '0 auto', boxSizing: 'border-box' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-xs)',
            fontWeight: 'var(--fw-semibold)',
            letterSpacing: 'var(--ls-wider)',
            textTransform: 'uppercase',
            color: 'var(--cobalt-600)',
            marginBottom: '10px',
          }}
        >
          Customer Stories
        </div>
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
          What people are saying
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '24px' }}>
        {TESTIMONIALS.map(({ quote, name, role }) => (
          <div
            key={name}
            style={{
              padding: 'var(--space-8)',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ color: 'var(--cobalt-500)', marginBottom: '16px', letterSpacing: '2px' }}>★★★★★</div>
            <p style={{ margin: '0 0 24px', fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-body)' }}>
              {quote}
            </p>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>{name}</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>{role}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
