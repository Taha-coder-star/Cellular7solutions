import { Navigate, useParams } from 'react-router-dom';
import { Icon } from '@/components/ui';
import { findRepair, repairRequestPath } from '@/data/repairServices';
import { RepairCtaBand, RepairHeader, RepairPromises, RepairTiles } from '@/components/repair/RepairBlocks';
import '@/styles/repairJourney.css';

export default function RepairDetail() {
  const { category: categorySlug, repair: repairSlug } = useParams();
  const { category, repair } = findRepair(categorySlug, repairSlug);
  if (!category) return <Navigate to="/repair" replace />;
  if (!repair) return <Navigate to={`/repair/${categorySlug}`} replace />;

  const { device, title, warranty, repairs } = category;
  const service = categorySlug === 'hdmi' ? repair.name : `${title} - ${repair.name}`;
  const related = repairs.filter((r) => r.slug !== repair.slug);
  const requestPath = repairRequestPath(device, service);

  return (
    <main className="repair-page">
      <RepairHeader
        trail={[{ to: '/repair', label: 'Repairs' }, { to: `/repair/${categorySlug}`, label: title }, { label: repair.name }]}
        title={repair.name}
        intro={repair.summary}
        cta={{ to: requestPath, label: 'Request this repair' }}
        image={repair.image}
      />

      <section className="rp-section rp-signs" aria-labelledby="rp-signs-title">
        <h2 id="rp-signs-title">Sounds familiar?</h2>
        <ul>
          {repair.symptoms.map((s) => <li key={s}><Icon name="wrench" size={18} />{s}</li>)}
        </ul>
      </section>

      <RepairPromises image={category.image} warranty={warranty} />

      {related.length > 0 && (
        <section className="rp-section" aria-labelledby="rp-related-title">
          <div className="rp-section-head"><h2 id="rp-related-title">More {title.toLowerCase()}</h2></div>
          <RepairTiles categorySlug={categorySlug} repairs={related} swipe />
        </section>
      )}

      <RepairCtaBand
        to={requestPath}
        label="Request this repair"
        text="Tell us the model and what is happening. We reply on WhatsApp with next steps and an estimate."
      />
    </main>
  );
}
