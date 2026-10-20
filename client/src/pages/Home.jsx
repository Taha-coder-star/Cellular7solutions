import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Icon } from '@/components/ui';
import TrustStrip from '@/components/home/TrustStrip';
import Categories from '@/components/home/Categories';
import RepairCTA from '@/components/home/RepairCTA';
import RepairIntro from '@/components/home/RepairIntro';
import '@/styles/repairJourney.css';
import '@/styles/iphoneHero.css';
import '@/styles/homePolish.css';

gsap.registerPlugin(useGSAP);

const STATEMENT = 'The right device changes what you can do. The right people keep it working.';

export default function Home() {
  const pageRef = useRef(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.from('.home-hero-copy', { y: 14, duration: 0.7, ease: 'expo.out' });
  }, { scope: pageRef });

  return (
    <div ref={pageRef} className="storefront-home overflow-x-hidden w-full max-w-full">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <h1 id="home-title">Better tech.<br />For every day.</h1>
            <p className="home-hero-description">New and used phones, laptops, gaming, and accessories—all in one place. Explore our latest arrivals or ask us about a repair.</p>
            <p className="home-hero-availability">New iPhones now available</p>
            <div className="home-hero-actions">
              <Link className="storefront-button storefront-button-light" to="/shop">Explore the shop <Icon name="arrow-up-right" size={18} /></Link>
              <Link className="storefront-button storefront-button-outline" to="/categories/smartphones?brand=apple&condition=new">Shop new iPhones <Icon name="arrow-right" size={18} /></Link>
            </div>
          </div>
          <div className="home-hero-art" aria-hidden="true">
            <img src="/assets/iphone-lineup-hero.png" alt="" width="1774" height="887" fetchPriority="high" />
          </div>
        </div>
      </section>

      <RepairIntro />
      <TrustStrip />
      <Categories />

      <section className="home-statement" aria-label="Our approach">
        <p>{STATEMENT}</p>
        <Link to="/about">Meet Cellular Solutions <Icon name="arrow-up-right" size={18} /></Link>
      </section>

      <RepairCTA />
    </div>
  );
}
