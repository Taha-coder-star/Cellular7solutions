import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui';

const SERVICES = [
  { title: 'Phones', detail: 'Screens, batteries, and charging issues.', icon: 'smartphone' },
  { title: 'Laptops', detail: 'Power, performance, and hardware concerns.', icon: 'wrench' },
  { title: 'Gaming consoles', detail: 'Describe the fault for assessment.', icon: 'search' },
];

export default function RepairCTA() {
  return (
    <section className="repair-showcase storefront-section" aria-labelledby="repair-heading">
      <div className="repair-showcase-media">
        <img src="/assets/repair/electronics-diagnostics-720.webp" alt="Illustration of electronics undergoing diagnostics" loading="lazy" width="720" height="540" data-scroll-image />
      </div>
      <div className="repair-showcase-copy">
        <p className="storefront-eyebrow">Made to last longer</p>
        <h2 id="repair-heading">A little care goes a long way.</h2>
        <p>From a phone that will not charge to a laptop or console with an unfamiliar fault, describe the issue and send our team a WhatsApp enquiry.</p>
        <ul className="repair-service-accordion" aria-label="Repair services">
          {SERVICES.map(({ title, detail, icon }) => (
            <li className="repair-service-panel" key={title}>
              <Icon name={icon} size={24} />
              <div><strong>{title}</strong><span>{detail}</span></div>
            </li>
          ))}
        </ul>
        <Link className="storefront-button storefront-button-dark" to="/repair">Request a repair <Icon name="arrow-up-right" size={18} /></Link>
      </div>
    </section>
  );
}
