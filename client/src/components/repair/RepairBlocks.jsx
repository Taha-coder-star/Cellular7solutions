import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui';
import { PROMISES, repairImage } from '@/data/repairServices';

export function RepairBreadcrumb({ trail }) {
  return (
    <nav className="rp-crumbs" aria-label="Breadcrumb">
      <ol>
        {trail.map(({ to, label }, i) => (
          <li key={label}>
            {i < trail.length - 1 ? <Link to={to}>{label}</Link> : <span aria-current="page">{label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Centered title block over a wide bench photo — shared by category and detail pages. */
export function RepairHeader({ trail, title, intro, cta, image }) {
  return (
    <header className="rp-header">
      <div className="rp-header-copy">
        <RepairBreadcrumb trail={trail} />
        <h1>{title}</h1>
        <p>{intro}</p>
        <Link className="rp-button" to={cta.to}>{cta.label} <Icon name="arrow-right" size={18} /></Link>
      </div>
      <div className="rp-header-photo">
        <img src={repairImage(image)} alt="" width="900" height="675" fetchPriority="high" />
      </div>
    </header>
  );
}

/** `swipe` turns the grid into a horizontal snap row on phones (secondary lists only). */
export function RepairTiles({ categorySlug, repairs, swipe = false }) {
  return (
    <ul className={swipe ? 'rp-tiles rp-swipe' : 'rp-tiles'}>
      {repairs.map((r) => (
        <li key={r.slug}>
          <Link to={`/repair/${categorySlug}/${r.slug}`}>
            <img src={repairImage(r.image)} alt="" width="900" height="675" loading="lazy" />
            <h3>{r.name} <Icon name="arrow-right" size={18} /></h3>
            <p>{r.summary}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Photo + promise grid, the template's "why choose us" split. */
export function RepairPromises({ image, title = 'Why repair with us', warranty }) {
  const items = warranty
    ? PROMISES.map((p) => (p.icon === 'shield-check' ? { ...p, title: `${warranty} warranty`, text: `Every repair is backed by a ${warranty} warranty.` } : p))
    : PROMISES;
  return (
    <section className="rp-section rp-promises" aria-labelledby="rp-promises-title">
      <div className="rp-promises-photo">
        <img src={repairImage(image)} alt="" width="900" height="675" loading="lazy" />
      </div>
      <div>
        <h2 id="rp-promises-title">{title}</h2>
        <ul>
          {items.map(({ icon, title: t, text }) => (
            <li key={t}>
              <span className="rp-promise-icon"><Icon name={icon} size={20} /></span>
              <h3>{t}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function RepairCtaBand({ to, label, title = 'Tell us what is wrong.', text }) {
  return (
    <section className="rp-cta" aria-labelledby="rp-cta-title">
      <img src="/assets/repair/repair-workbench-hero-1440.webp" alt="" width="1440" height="810" loading="lazy" />
      <div>
        <h2 id="rp-cta-title">{title}</h2>
        <p>{text}</p>
        <Link className="rp-button" to={to}>{label} <Icon name="arrow-up-right" size={18} /></Link>
      </div>
    </section>
  );
}
