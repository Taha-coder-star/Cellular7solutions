import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui';

export default function RepairIntro() {
  return (
    <section className="home-repair-intro" aria-labelledby="home-repair-intro-title">
      <div className="home-repair-intro-inner">
        <div className="home-repair-intro-image">
          <img
            src="/assets/repair/repair-workbench-hero-720.webp"
            srcSet="/assets/repair/repair-workbench-hero-720.webp 720w, /assets/repair/repair-workbench-hero-1440.webp 1440w"
            sizes="(max-width: 767px) 100vw, 36vw"
            alt="Illustration of phones, a laptop, and a gaming console on a repair workbench"
            loading="lazy"
            width="1440"
            height="810"
          />
        </div>
        <div className="home-repair-intro-copy">
          <p className="storefront-eyebrow">Repair enquiries</p>
          <h2 id="home-repair-intro-title">Help for the tech you already own.</h2>
          <p>Phones, laptops, gaming consoles, and other electronics: describe the issue and send a WhatsApp enquiry. Our team can then reply about next steps and an estimate.</p>
          <Link className="storefront-button home-repair-intro-cta" to="/repair">Request a repair <Icon name="arrow-right" size={18} /></Link>
        </div>
      </div>
    </section>
  );
}
