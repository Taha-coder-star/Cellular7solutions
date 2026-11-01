import { Navigate, useParams } from 'react-router-dom';
import { REPAIR_CATEGORIES, repairRequestPath } from '@/data/repairServices';
import { RepairCtaBand, RepairHeader, RepairPromises, RepairTiles } from '@/components/repair/RepairBlocks';
import '@/styles/repairJourney.css';

export default function RepairCategory() {
  const { category: slug } = useParams();
  const category = REPAIR_CATEGORIES.find((c) => c.slug === slug);
  if (!category) return <Navigate to="/repair" replace />;
  const { device, title, heading, image, warranty, repairs } = category;
  const requestPath = repairRequestPath(device, title);

  return (
    <main className="repair-page">
      <RepairHeader
        trail={[{ to: '/repair', label: 'Repairs' }, { label: title }]}
        title={title}
        intro={`${heading}. Pick the repair that matches the fault, or describe it and we will tell you what is involved.`}
        cta={{ to: requestPath, label: 'Get a quote' }}
        image={image}
      />

      <section className="rp-section" aria-labelledby="rp-repairs-title">
        <div className="rp-section-head">
          <h2 id="rp-repairs-title">Repairs we do</h2>
          <p>Each repair has its own page with the common signs and a request button.</p>
        </div>
        <RepairTiles categorySlug={slug} repairs={repairs} />
      </section>

      {/* A bench photo that is not already one of this page's tiles. */}
      <RepairPromises image={slug === 'hdmi' ? 'device-screwdriver' : 'board-solder'} warranty={warranty} />

      <RepairCtaBand
        to={requestPath}
        label="Request a repair"
        text="Send the model and what is happening. We reply on WhatsApp with next steps and an estimate."
      />
    </main>
  );
}
