import { useState } from 'react';
import { Button, Card, Input, Textarea, Select, Icon } from '@/components/ui';
import { buySellWhatsappLink } from '@/utils/whatsapp';

const CONDITIONS = ['Like New', 'Good', 'Fair', 'Broken / For Parts'];

const STEPS = [
  { icon: 'smartphone', title: 'Tell us about your device', text: 'Model, condition, and anything we should know.' },
  { icon: 'search',     title: 'Send the WhatsApp message', text: 'Review the prefilled details and tap Send in WhatsApp.' },
  { icon: 'dollar-sign', title: 'Get your quote',           text: 'Our team replies with an offer — no obligation.' },
];

export default function BuySell() {
  const [form, setForm] = useState({ name: '', phone: '', device: '', condition: CONDITIONS[0], description: '' });
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.phone.trim()) next.phone = 'Phone number is required';
    if (!form.device.trim()) next.device = 'Device is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const url = buySellWhatsappLink(form);
    const chat = window.open(url, '_blank');
    if (chat) chat.opener = null;
    else window.location.assign(url);
  }

  return (
    <div className="max-w-7xl mx-auto storefront-service-page" style={{ padding: 'var(--space-10) var(--space-6) var(--pad-section)', fontFamily: 'var(--font-sans)' }}>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-10)' }}>
        <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', letterSpacing: 'var(--ls-wider)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Trade In · Cash Out
        </span>
        <h1 style={{ margin: 0, fontSize: 'var(--fs-h1)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>
          Buy &amp; Sell Used Phones
        </h1>
        <p style={{ margin: 0, fontSize: 'var(--fs-body)', color: 'var(--text-muted)', maxWidth: '560px' }}>
          Selling your device? Tell us what you've got, then send the details on WhatsApp for an offer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Form */}
        <Card className="lg:col-span-2">
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Your Name"
                  autoComplete="name"
                  value={form.name}
                  error={errors.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  error={errors.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Device"
                  placeholder="e.g. iPhone 13 Pro, 256GB"
                  value={form.device}
                  error={errors.device}
                  onChange={(e) => setForm({ ...form, device: e.target.value })}
                />
                <Select
                  label="Condition"
                  options={CONDITIONS}
                  value={form.condition}
                  onChange={(e) => setForm({ ...form, condition: e.target.value })}
                />
              </div>

              <Textarea
                label="Description (optional)"
                hint="Scratches, battery health, included accessories — anything that helps us quote accurately."
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <div>
                <p style={{ margin: '0 0 var(--space-4)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                  WhatsApp will open with a draft. Your request reaches us after you tap Send there.
                </p>
                <Button type="submit" variant="service" iconRight={<Icon name="arrow-up-right" size={18} />}>
                  Open WhatsApp draft
                </Button>
              </div>
          </form>
        </Card>

        {/* How it works */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {STEPS.map(({ icon, title, text }, i) => (
            <Card key={title} padding="var(--space-5)">
              <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', flexShrink: 0, borderRadius: 'var(--radius-sm)', background: 'var(--cobalt-50)', color: 'var(--cobalt-600)' }}>
                  <Icon name={icon} size={20} color="var(--cobalt-600)" />
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>
                    {i + 1}. {title}
                  </span>
                  <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', lineHeight: 'var(--lh-relaxed)' }}>{text}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
