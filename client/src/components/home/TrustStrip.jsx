import { Link } from 'react-router-dom';

export default function TrustStrip() {
  return (
    <section className="home-proof" aria-label="What to expect when you shop">
      <div className="home-proof-inner">
        <p className="home-proof-intro">Know what you’re buying.</p>
        <div className="home-proof-item"><strong>Condition is clear</strong><span>Every product is labelled new or used.</span></div>
        <div className="home-proof-item"><strong>Check availability</strong><span>See the stock status on each product page.</span></div>
        <div className="home-proof-item"><strong>Ask before you buy</strong><span>Message us about a specific item.</span></div>
        <Link to="/contact" className="home-proof-link">Contact the store <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}
