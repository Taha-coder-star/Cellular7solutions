import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui';
import { REPAIR_CATEGORIES } from '@/data/repairServices';

const ICONS = { phone: 'smartphone', computer: 'laptop', 'game-console': 'gamepad-2' };

export default function RepairCTA() {
  return (
    <section className="repair-showcase storefront-section" aria-labelledby="repair-heading">
      <div className="repair-showcase-media">
        <img src="/assets/repair/electronics-diagnostics-720.webp" alt="Illustration of electronics undergoing diagnostics" loading="lazy" width="720" height="540" data-scroll-image />
      </div>
      <div className="repair-showcase-copy">
        <h2 id="repair-heading">A little care goes a long way.</h2>
        <p>Cracked screen, tired battery, a console that will not boot. Pick a common repair to see what is involved and request it on WhatsApp.</p>
        <ul className="repair-service-accordion" aria-label="Popular repairs">
          {REPAIR_CATEGORIES.filter(({ slug }) => ICONS[slug]).map(({ slug, title, repairs }) => (
            <li className="repair-service-panel" key={slug}>
              <Icon name={ICONS[slug]} size={24} />
              <div>
                <strong><Link to={`/repair/${slug}`}>{title}</Link></strong>
                <ul className="repair-service-links">
                  {repairs.slice(0, 3).map((r) => (
                    <li key={r.slug}><Link to={`/repair/${slug}/${r.slug}`}>{r.name} <Icon name="arrow-right" size={14} /></Link></li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
        <Link className="storefront-button home-repair-intro-cta" to="/repair">See all repairs <Icon name="arrow-up-right" size={18} /></Link>
      </div>
    </section>
  );
}
