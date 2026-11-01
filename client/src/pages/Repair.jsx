import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Card, Input, Textarea, Select, Icon } from '@/components/ui';
import { repairWhatsappLink } from '@/utils/whatsapp';
import { DEVICE_TYPES, REPAIR_CATEGORIES, repairImage } from '@/data/repairServices';
import { RepairPromises } from '@/components/repair/RepairBlocks';
import '@/styles/repairJourney.css';

const STEPS = [
  { title: 'Describe the problem', text: 'Choose a device type and tell us what is happening.' },
  { title: 'Send the WhatsApp message', text: 'Open the prefilled chat, review the details, and tap Send in WhatsApp.' },
  { title: 'The team replies', text: 'We discuss next steps and an estimate in the conversation.' },
];

export default function Repair() {
  const [params] = useSearchParams();
  const device = params.get('device');
  const service = params.get('service');
  const prefix = service ? `${service}: ` : '';
  const [form, setForm] = useState({
    deviceType: DEVICE_TYPES[0].value, brandModel: '', issue: '', name: '',
  });
  const [errors, setErrors] = useState({});

  // Picking a repair (here or from a repair page) prefills the form and jumps to it.
  useEffect(() => {
    if (!service) return;
    setForm((f) => ({
      ...f,
      deviceType: DEVICE_TYPES.some(({ value }) => value === device) ? device : f.deviceType,
      issue: `${service}: `,
    }));
    requestAnimationFrame(() => document.getElementById('repair-request')?.scrollIntoView({ behavior: 'smooth' }));
  }, [device, service]);

  function validate() {
    const next = {};
    if (!DEVICE_TYPES.some(({ value }) => value === form.deviceType)) next.deviceType = 'Choose a device type';
    // The prefilled "Service: " label alone is not a description.
    const issue = form.issue.trim();
    if (!issue || issue === prefix.trim()) next.issue = 'Tell us what is happening with the device';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const url = repairWhatsappLink(form);
    const chat = window.open(url, '_blank');
    if (chat) chat.opener = null;
    else window.location.assign(url);
  }

  return (
    <main className="repair-page">
      <section className="rp-hero" aria-labelledby="repair-title">
        <img src="/assets/repair/repair-workbench-hero-1440.webp" srcSet="/assets/repair/repair-workbench-hero-720.webp 720w, /assets/repair/repair-workbench-hero-1440.webp 1440w" sizes="100vw" alt="" width="1440" height="810" fetchPriority="high" />
        <div className="rp-hero-copy">
          <h1 id="repair-title">Tell us what needs fixing.</h1>
          <p>Phones, tablets, laptops and gaming consoles. Describe the problem, send it on WhatsApp, and we reply with next steps and an estimate.</p>
          <div className="rp-hero-actions">
            <a className="rp-button" href="#repair-request">Request a repair <Icon name="arrow-right" size={18} /></a>
            <a className="rp-hero-link" href="#repair-devices">Browse repairs</a>
          </div>
        </div>
      </section>

      <section className="rp-section" id="repair-devices" aria-labelledby="repair-devices-title">
        <div className="rp-section-head">
          <h2 id="repair-devices-title">Start with your device.</h2>
          <p>Share the model and symptoms, even if you are unsure what caused the problem.</p>
        </div>
        <ul className="rp-devices rp-swipe">
          {REPAIR_CATEGORIES.map(({ slug, title, image, repairs }) => (
            <li key={slug}>
              <Link to={`/repair/${slug}`}>
                <img src={repairImage(image)} alt="" width="900" height="675" loading="lazy" />
                <span className="rp-device-copy">
                  <strong>{title}</strong>
                  <span>{repairs.slice(0, 3).map((r) => r.name).join(', ')} and more</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <RepairPromises image="laptop-screen-bench" title="Why bring it to us" />

      <section className="rp-section rp-steps" aria-labelledby="repair-steps-title">
        <div className="rp-section-head">
          <h2 id="repair-steps-title">How it works</h2>
        </div>
        <ol>
          {STEPS.map(({ title, text }, i) => (
            <li key={title}><span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p></li>
          ))}
        </ol>
      </section>

      <section className="rp-section rp-request" id="repair-request" aria-labelledby="repair-request-title">
        <div className="rp-request-intro">
          <h2 id="repair-request-title">Request a repair.</h2>
          <p>We open a prefilled WhatsApp chat. Review it and tap Send there to deliver your enquiry.</p>
          <div className="rp-faq">
            <details><summary>Does opening WhatsApp send my request?</summary><p>No. WhatsApp opens with a draft. Review it and tap Send there to contact our team.</p></details>
            <details><summary>Will I see a repair price here?</summary><p>No. Send the device details and issue first; our team will reply to discuss next steps and an estimate.</p></details>
            <details><summary>What if my device is not listed?</summary><p>Select “Other electronics” and describe the device in the problem field. The team can then assess your enquiry.</p></details>
          </div>
        </div>
        <Card className="rp-request-card">
          <form onSubmit={handleSubmit} noValidate className="repair-request-form">
            <div className="repair-form-row">
              <Select label="Device type" options={DEVICE_TYPES} value={form.deviceType} error={errors.deviceType} onChange={(e) => setForm({ ...form, deviceType: e.target.value })} />
              <Input label="Brand and model (if known)" placeholder="e.g. Samsung Galaxy S23 or PlayStation 5" value={form.brandModel} onChange={(e) => setForm({ ...form, brandModel: e.target.value })} />
            </div>
            <Textarea label="Describe the problem" placeholder="What is happening? For other electronics, please describe the device too." rows={5} value={form.issue} error={errors.issue} onChange={(e) => setForm({ ...form, issue: e.target.value })} />
            <Input label="Your name (optional)" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <p className="repair-whatsapp-note">WhatsApp will open with a draft. Your request reaches us only after you tap Send there.</p>
            <Button type="submit" variant="service" iconRight={<Icon name="arrow-up-right" size={18} />}>Open WhatsApp draft</Button>
          </form>
        </Card>
      </section>
    </main>
  );
}
