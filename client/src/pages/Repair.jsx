import { useState } from 'react';
import { Button, Card, Input, Textarea, Select, Checkbox, Icon } from '@/components/ui';
import api from '@/services/api';

const DEVICE_TYPES = ['Phone', 'Tablet', 'Laptop', 'Desktop', 'Game Console', 'Other'];

// ⚑ Time slots are placeholders — confirm real booking windows with client
const TIME_SLOTS = ['Morning (10 AM – 1 PM)', 'Afternoon (1 PM – 5 PM)', 'Evening (5 PM – 8 PM)'];

const POINTS = [
  { icon: 'wrench',       title: 'Free diagnostics', text: "We find the problem for free — you only pay if we fix it." },
  { icon: 'clock',        title: 'Same-day service', text: 'Most screen and battery repairs are done the same day.' },
  { icon: 'shield-check', title: '90-day warranty',  text: 'Parts and labour covered on every repair we complete.' },
];

export default function Repair() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    deviceType: DEVICE_TYPES[0],
    issue: '',
    availableDate: '',
    availableTime: TIME_SLOTS[0],
    agreedToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.phone.trim()) next.phone = 'Phone number is required';
    if (!form.address.trim()) next.address = 'Address is required';
    if (!form.issue.trim()) next.issue = 'Please describe the issue';
    if (!form.availableDate) next.availableDate = 'Pick a date that works for you';
    if (!form.agreedToTerms) next.agreedToTerms = 'You must agree to the terms to book a repair';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Field names match RepairRequest model exactly.
      // images: [] until an upload endpoint exists for this route (no multer on POST /repairs).
      await api.post('/repairs', {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        deviceType: form.deviceType,
        issue: form.issue.trim(),
        availableDate: form.availableDate,
        availableTime: form.availableTime,
        images: [],
        agreedToTerms: form.agreedToTerms,
      });
      setDone(true);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not book your repair. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto" style={{ padding: 'var(--space-10) var(--space-6) var(--pad-section)', fontFamily: 'var(--font-sans)' }}>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-10)' }}>
        <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', letterSpacing: 'var(--ls-wider)', textTransform: 'uppercase', color: 'var(--cobalt-700)' }}>
          You Break It · We Fix It
        </span>
        <h1 style={{ margin: 0, fontSize: 'var(--fs-h1)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>
          Book a Repair
        </h1>
        <p style={{ margin: 0, fontSize: 'var(--fs-body)', color: 'var(--text-muted)', maxWidth: '560px' }}>
          Tell us what's broken and when you're available — we'll confirm your booking and get it fixed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Form */}
        <Card className="lg:col-span-2">
          {done ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-10) var(--space-6)', textAlign: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'var(--success-50)' }}>
                <Icon name="calendar-check" size={28} color="var(--success-500)" strokeWidth={2.5} />
              </span>
              <p style={{ margin: 0, fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>
                Repair booked
              </p>
              <p style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', maxWidth: '360px' }}>
                Your request is pending confirmation. We'll call you to confirm your slot and give you an estimate.
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

              <Input
                label="Address"
                autoComplete="street-address"
                value={form.address}
                error={errors.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Select
                  label="Device Type"
                  options={DEVICE_TYPES}
                  value={form.deviceType}
                  onChange={(e) => setForm({ ...form, deviceType: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-5">
                  <Input
                    label="Available Date"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={form.availableDate}
                    error={errors.availableDate}
                    onChange={(e) => setForm({ ...form, availableDate: e.target.value })}
                  />
                  <Select
                    label="Time"
                    options={TIME_SLOTS}
                    value={form.availableTime}
                    onChange={(e) => setForm({ ...form, availableTime: e.target.value })}
                  />
                </div>
              </div>

              <Textarea
                label="What's the issue?"
                placeholder="e.g. Cracked screen on iPhone 13, touch still works"
                rows={4}
                value={form.issue}
                error={errors.issue}
                onChange={(e) => setForm({ ...form, issue: e.target.value })}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <Checkbox
                  label="I agree to the repair terms: diagnostics are free, and I'll approve any quoted cost before work begins."
                  checked={form.agreedToTerms}
                  onChange={(e) => setForm({ ...form, agreedToTerms: e.target.checked })}
                />
                {errors.agreedToTerms && (
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--danger-500)' }}>{errors.agreedToTerms}</span>
                )}
              </div>

              <div>
                <Button
                  type="submit"
                  variant="service"
                  disabled={submitting || !form.agreedToTerms}
                  iconLeft={<Icon name="calendar-check" size={18} />}
                >
                  {submitting ? 'Booking…' : 'Book Repair'}
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
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', flexShrink: 0, borderRadius: 'var(--radius-sm)', background: 'var(--cobalt-50)', color: 'var(--cobalt-600)' }}>
                  <Icon name={icon} size={20} color="var(--cobalt-600)" />
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
