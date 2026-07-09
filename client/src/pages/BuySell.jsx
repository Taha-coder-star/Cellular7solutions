import { useState } from 'react';
import { Button, Card, Input, Textarea, Select, Icon } from '@/components/ui';
import api from '@/services/api';

// ⚑ Condition options are placeholders (backend stores a free string) — confirm wording with client
const CONDITIONS = ['Like New', 'Good', 'Fair', 'Broken / For Parts'];

const STEPS = [
  { icon: 'smartphone', title: 'Tell us about your device', text: 'Model, condition, and anything we should know.' },
  { icon: 'search',     title: 'We review your request',    text: 'Our team checks the details and prepares an offer.' },
  { icon: 'dollar-sign', title: 'Get your quote',           text: 'We contact you with a fair cash offer — no obligation.' },
];

export default function BuySell() {
  const [form, setForm] = useState({ name: '', phone: '', device: '', condition: CONDITIONS[0], description: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.phone.trim()) next.phone = 'Phone number is required';
    if (!form.device.trim()) next.device = 'Device is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Field names match BuySellRequest model exactly.
      // images: [] until an upload endpoint exists for this route (no multer on POST /buysell).
      await api.post('/buysell', {
        name: form.name.trim(),
        phone: form.phone.trim(),
        device: form.device.trim(),
        condition: form.condition,
        description: form.description.trim(),
        images: [],
      });
      setDone(true);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not submit your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto" style={{ padding: 'var(--space-10) var(--space-6) var(--pad-section)', fontFamily: 'var(--font-sans)' }}>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-10)' }}>
        <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', letterSpacing: 'var(--ls-wider)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Trade In · Cash Out
        </span>
        <h1 style={{ margin: 0, fontSize: 'var(--fs-h1)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>
          Buy &amp; Sell Used Phones
        </h1>
        <p style={{ margin: 0, fontSize: 'var(--fs-body)', color: 'var(--text-muted)', maxWidth: '560px' }}>
          Selling your device? Tell us what you've got and we'll get back to you with a fair offer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Form */}
        <Card className="lg:col-span-2">
          {done ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-10) var(--space-6)', textAlign: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'var(--success-50)' }}>
                <Icon name="check" size={28} color="var(--success-500)" strokeWidth={2.5} />
              </span>
              <p style={{ margin: 0, fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>
                Request received
              </p>
              <p style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', maxWidth: '360px' }}>
                We'll review your device details and call you with a quote — usually within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {serverError && (
                <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--danger-50)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-sm)', color: 'var(--danger-500)' }}>
                  {serverError}
                </div>
              )}

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
                <Button type="submit" variant="service" disabled={submitting} iconLeft={<Icon name="dollar-sign" size={18} />}>
                  {submitting ? 'Submitting…' : 'Get Free Quote'}
                </Button>
              </div>
            </form>
          )}
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
