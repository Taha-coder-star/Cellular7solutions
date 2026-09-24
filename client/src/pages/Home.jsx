import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Icon } from '@/components/ui';
import TrustStrip from '@/components/home/TrustStrip';
import Categories from '@/components/home/Categories';
import RepairCTA from '@/components/home/RepairCTA';
import RepairIntro from '@/components/home/RepairIntro';
import '@/styles/repairJourney.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STATEMENT = 'The right device changes what you can do. The right people keep it working.';

export default function Home() {
  const pageRef = useRef(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.utils.toArray('.repair-showcase [data-scroll-image]').forEach((image) => {
      gsap.fromTo(image, { scale: 0.8, opacity: 0.55 }, {
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger: image, start: 'top 95%', end: 'center 48%', scrub: true },
      });
    });

    gsap.fromTo('[data-reveal-word]', { opacity: 0.13 }, {
      opacity: 1,
      stagger: 0.06,
      ease: 'none',
      scrollTrigger: { trigger: '[data-statement]', start: 'top 88%', end: 'bottom 35%', scrub: true },
    });
  }, { scope: pageRef });

  return (
    <div ref={pageRef} className="storefront-home overflow-x-hidden w-full max-w-full">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <p className="home-hero-mobile-only home-hero-eyebrow">New &amp; used phones</p>
            <h1 id="home-title"><span className="home-hero-desktop-only">Better tech.<br />Better every day<span className="home-hero-period">.</span></span><span className="home-hero-mobile-only">Shop a phone.<br />Repair yours.</span></h1>
            <p className="home-hero-desktop-only">Discover devices worth keeping, a clear path to ask about repairs, and an easier way to trade what you no longer use.</p>
            <div className="home-hero-actions">
              <Link className="storefront-button storefront-button-light" to="/shop">Explore the shop <Icon name="arrow-up-right" size={18} /></Link>
              <Link className="storefront-button storefront-button-outline" to="/repair">Request a repair <Icon name="arrow-right" size={18} /></Link>
            </div>
            <p className="home-hero-mobile-only home-hero-services">Phones <span>•</span> Repairs <span>•</span> Trade-ins</p>
            <div className="home-hero-mobile-only home-hero-mobile-actions">
              <Link className="home-hero-mobile-cta" to="/categories/smartphones">Browse smartphones <Icon name="arrow-right" size={22} /></Link>
              <Link className="home-hero-mobile-cta home-hero-mobile-repair" to="/repair">Request a repair <Icon name="arrow-right" size={20} /></Link>
            </div>
          </div>
          <div className="home-hero-art" aria-hidden="true">
            <div className="home-hero-orbit" />
            <img src="https://images.unsplash.com/photo-1628911771730-881503b8e9c9?auto=format&fit=crop&w=1100&q=85" alt="" fetchPriority="high" />
          </div>
        </div>
        <div className="home-hero-bottom"><span>Cellular Solutions</span><span>Shop · Repair · Trade</span></div>
      </section>

      <RepairIntro />
      <TrustStrip />
      <Categories />

      <section className="home-statement" data-statement>
        <p>{STATEMENT.split(' ').map((word, index) => <span data-reveal-word key={`${word}-${index}`}>{word}{' '}</span>)}</p>
        <Link to="/about">Meet Cellular Solutions <Icon name="arrow-up-right" size={18} /></Link>
      </section>

      <RepairCTA />
    </div>
  );
}
