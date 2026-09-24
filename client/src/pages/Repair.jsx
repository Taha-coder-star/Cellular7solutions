import { useState } from 'react';
import { Button, Card, Input, Textarea, Select, Icon } from '@/components/ui';
import { repairWhatsappLink } from '@/utils/whatsapp';
import '@/styles/repairJourney.css';

const DEVICE_TYPES = [
  { value: 'Phone', label: 'Phone' },
  { value: 'Laptop', label: 'Laptop' },
  { value: 'Game Console', label: 'Gaming console' },
  { value: 'Other', label: 'Other electronics' },
];
const SERVICES = [
  { title: 'Phones', image: 'phone-repair-720.webp', alt: 'Illustration of a phone being serviced', text: 'Tell us about a damaged screen, battery, charging issue, or another phone fault.' },
  { title: 'Laptops', image: 'laptop-repair-720.webp', alt: 'Illustration of a laptop being serviced', text: 'Describe power, display, performance, or other laptop concerns.' },
  { title: 'Gaming consoles', image: 'gaming-console-repair-720.webp', alt: 'Illustration of a gaming console being serviced', text: 'PlayStation and other consoles: share the model and what is going wrong.' },
];
const STEPS = [
  { number: '01', title: 'Describe the problem', text: 'Choose a device type and tell us what is happening.' },
  { number: '02', title: 'Send the WhatsApp message', text: 'Open the prefilled chat, review the details, and tap Send in WhatsApp.' },
  { number: '03', title: 'The team replies', text: 'We discuss next steps and an estimate in the conversation.' },
];

export default function Repair() {
  const [form, setForm] = useState({
    deviceType: DEVICE_TYPES[0].value, brandModel: '', issue: '', name: '',
  });
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};
    if (!DEVICE_TYPES.some(({ value }) => value === form.deviceType)) next.deviceType = 'Choose a device type';
    if (!form.issue.trim()) next.issue = 'Please describe the problem';
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
    <main className="repair-page storefront-service-page">
      <section className="repair-page-hero" aria-labelledby="repair-title">
        <div className="repair-page-hero-copy">
          <p className="storefront-eyebrow">Repair enquiries</p>
          <h1 id="repair-title">Tell us what needs fixing.</h1>
          <p>Ask us about phones, laptops, gaming consoles, and other electronics. Describe the problem, send your enquiry on WhatsApp, and our team will reply to discuss next steps and an estimate.</p>
          <a className="storefront-button repair-page-primary-cta" href="#repair-request">Request a repair <Icon name="arrow-right" size={18} /></a>
        </div>
        <div className="repair-page-hero-image">
          <img src="/assets/repair/repair-workbench-hero-720.webp" srcSet="/assets/repair/repair-workbench-hero-720.webp 720w, /assets/repair/repair-workbench-hero-1440.webp 1440w" sizes="(max-width: 767px) 100vw, 55vw" alt="Illustration of a phone, laptop, and gaming console on a repair workbench" width="1440" height="810" fetchPriority="high" />
        </div>
      </section>

      <section className="repair-page-section repair-page-services" aria-labelledby="repair-services-title">
        <div className="repair-page-section-heading">
          <p className="storefront-eyebrow">What can I enquire about?</p>
          <h2 id="repair-services-title">Start with your device.</h2>
          <p>Share the model and symptoms, even if you are unsure what caused the problem.</p>
        </div>
        <div className="repair-service-grid">
          {SERVICES.map(({ title, image, alt, text }) => (
            <article className="repair-device-card" key={title}>
              <img src={`/assets/repair/${image}`} alt={alt} width="720" height="720" loading="lazy" />
              <div><h3>{title}</h3><p>{text}</p></div>
            </article>
          ))}
          <article className="repair-device-card repair-device-card-other">
            <img src="/assets/repair/electronics-diagnostics-720.webp" alt="Illustration of electronics diagnostics" width="720" height="540" loading="lazy" />
            <div><h3>Other electronics</h3><p>Have another device? Describe it in your request so our team can assess whether we can help.</p></div>
          </article>
        </div>
      </section>

      <section className="repair-page-section repair-process" aria-labelledby="repair-process-title">
        <div className="repair-page-section-heading">
          <p className="storefront-eyebrow">How it works</p>
          <h2 id="repair-process-title">A clear next step.</h2>
        </div>
        <ol className="repair-process-grid">
          {STEPS.map(({ number, title, text }) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></li>)}
        </ol>
      </section>

      <section className="repair-page-section repair-faq" aria-labelledby="repair-faq-title">
        <div className="repair-page-section-heading">
          <p className="storefront-eyebrow">Good to know</p>
          <h2 id="repair-faq-title">Before you send a request.</h2>
        </div>
        <div className="repair-faq-list">
          <details><summary>Does opening WhatsApp send my request?</summary><p>No. WhatsApp opens with a draft. Review it and tap Send there to contact our team.</p></details>
          <details><summary>Will I see a repair price here?</summary><p>No. Send the device details and issue first; our team will reply to discuss next steps and an estimate.</p></details>
          <details><summary>What if my device is not listed?</summary><p>Select “Other electronics” and describe the device in the problem field. The team can then assess your enquiry.</p></details>
        </div>
      </section>

      <section className="repair-page-section repair-request-section" id="repair-request" aria-labelledby="repair-request-title">
        <div className="repair-page-section-heading">
          <p className="storefront-eyebrow">Send your enquiry</p>
          <h2 id="repair-request-title">Request a repair.</h2>
          <p>Tell us about the device and issue. We will open a prefilled WhatsApp chat; review it and tap Send there to deliver your enquiry.</p>
        </div>
        <Card className="repair-request-card">
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
