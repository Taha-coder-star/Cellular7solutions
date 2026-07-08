import { useState } from 'react';
import { Button, Card, Input, Textarea, Icon } from '@/components/ui';

// ⚑ Hours are still a placeholder — confirm real hours with client before launch
const INFO = [
  { icon: 'truck',  label: 'Address', lines: ['520 West Main St.', 'Glencoe, AL 35905'] },
  { icon: 'smartphone', label: 'Phone', lines: ['(256) 515-9620'] },
  { icon: 'mail',   label: 'Email',   lines: ['Rambocityalabama@gmail.com'] },
  { icon: 'clock',  label: 'Hours',   lines: ['Mon–Sat: 10:00 AM – 8:00 PM', 'Sun: 12:00 PM – 6:00 PM'] },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (!form.message.trim()) next.message = 'Message is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    // No backend endpoint for general contact yet — log and confirm to the user
    console.log('Contact form submission:', form);
    setSent(true);
  }

  return (
    <div className="max-w-7xl mx-auto" style={{ padding: 'var(--space-10) var(--space-6) var(--pad-section)', fontFamily: 'var(--font-sans)' }}>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-10)' }}>
        <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', letterSpacing: 'var(--ls-wider)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Get in Touch
        </span>
        <h1 style={{ margin: 0, fontSize: 'var(--fs-h1)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>
          Contact Us
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Form */}
        <Card className="lg:col-span-2">
          {sent ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-10) var(--space-6)', textAlign: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'var(--success-50)' }}>
                <Icon name="check" size={28} color="var(--success-500)" strokeWidth={2.5} />
              </span>
              <p style={{ margin: 0, fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>
                Message sent
              </p>
              <p style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                Thanks for reaching out — we'll get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Name"
                  autoComplete="name"
                  value={form.name}
                  error={errors.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  error={errors.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <Textarea
                label="Message"
                rows={6}
                value={form.message}
                error={errors.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <div>
                <Button type="submit" variant="product">
                  Send Message
                </Button>
              </div>
            </form>
          )}
        </Card>

        {/* Static info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {INFO.map(({ icon, label, lines }) => (
            <Card key={label} padding="var(--space-5)">
              <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', flexShrink: 0, borderRadius: 'var(--radius-sm)', background: 'var(--graphite-100)', color: 'var(--graphite-900)' }}>
                  <Icon name={icon} size={20} />
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>{label}</span>
                  {lines.map((line) => (
                    <span key={line} style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>{line}</span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
