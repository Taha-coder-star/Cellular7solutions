import { useState } from 'react';
import { Button, Card, Input, Icon } from '@/components/ui';
import api from '@/services/api';

const POINTS = [
  { icon: 'shield-check', title: 'Safe & official', text: 'Carrier-approved unlocking — your warranty stays intact.' },
  { icon: 'clock',        title: 'Fast turnaround', text: 'Most unlocks are completed within 1–3 business days.' },
  { icon: 'smartphone',   title: 'All major carriers', text: 'AT&T, T-Mobile, Verizon, and most international networks.' },
];

export default function Unlock() {
  const [form, setForm] = useState({ name: '', phone: '', device: '', imei: '', carrier: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.phone.trim()) next.phone = 'Phone number is required';
    if (!form.device.trim()) next.device = 'Device is required';
    if (!form.carrier.trim()) next.carrier = 'Carrier is required';
    if (form.imei.trim() && !/^\d{14,16}$/.test(form.imei.trim())) next.imei = 'IMEI should be 14–16 digits';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Field names match UnlockRequest model exactly; imei is optional.
      await api.post('/unlock', {
        name: form.name.trim(),
        phone: form.phone.trim(),
        device: form.device.trim(),
        imei: form.imei.trim() || undefined,
        carrier: form.carrier.trim(),
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
          Any Carrier · Any Phone
        </span>
        <h1 style={{ margin: 0, fontSize: 'var(--fs-h1)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>
          Unlock Your Device
        </h1>
        <p style={{ margin: 0, fontSize: 'var(--fs-body)', color: 'var(--text-muted)', maxWidth: '560px' }}>
          Switch carriers freely. Send us your device details and we'll handle the unlock.
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
                Unlock request received
              </p>
              <p style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', maxWidth: '360px' }}>
                We'll verify your device details and contact you with the next steps.
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
                  placeholder="e.g. iPhone 14, Galaxy S23"
                  value={form.device}
                  error={errors.device}
                  onChange={(e) => setForm({ ...form, device: e.target.value })}
                />
                <Input
                  label="Current Carrier"
                  placeholder="e.g. AT&T, T-Mobile"
                  value={form.carrier}
                  error={errors.carrier}
                  onChange={(e) => setForm({ ...form, carrier: e.target.value })}
                />
              </div>

              <Input
                label="IMEI (optional)"
                hint="Dial *#06# on your phone to find your IMEI."
                inputMode="numeric"
                value={form.imei}
                error={errors.imei}
                onChange={(e) => setForm({ ...form, imei: e.target.value })}
              />

              <div>
                <Button type="submit" variant="service" disabled={submitting} iconLeft={<Icon name="shield-check" size={18} />}>
                  {submitting ? 'Submitting…' : 'Request Unlock'}
                </Button>
              </div>
            </form>
          )}
        </Card>

        {/* Why us */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {POINTS.map(({ icon, title, text }) => (
            <Card key={title} padding="var(--space-5)">
              <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', flexShrink: 0, borderRadius: 'var(--radius-sm)', background: 'var(--orange-50)', color: 'var(--orange-600)' }}>
                  <Icon name={icon} size={20} color="var(--orange-600)" />
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>{title}</span>
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
