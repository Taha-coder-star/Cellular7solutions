const { useState } = React;
const { Icon, Button, RepairCard, Input, Select, Checkbox, Card } = window.CellularSolutionsDesignSystem_a109cf;

const REPAIRS = [
  { deviceType: 'iPhone', repairType: 'Screen Replacement', time: '45 min', startingPrice: 89, icon: 'smartphone' },
  { deviceType: 'Any Device', repairType: 'Battery Replacement', time: '30 min', startingPrice: 49, icon: 'battery-charging' },
  { deviceType: 'Any Device', repairType: 'Water Damage', time: '1–2 days', startingPrice: 79, icon: 'droplets' },
  { deviceType: 'Laptop', repairType: 'Keyboard Repair', time: '2–3 hrs', startingPrice: 99, icon: 'laptop' },
  { deviceType: 'Carrier', repairType: 'Device Unlock', time: '1–2 days', startingPrice: 25, icon: 'unlock' },
  { deviceType: 'Console', repairType: 'HDMI Port Repair', time: '1 day', startingPrice: 69, icon: 'gamepad-2' },
];
const STEPS = [
  ['calendar-check', 'Book online', 'Pick a service and time — or walk in.'],
  ['search', 'Free diagnosis', 'We inspect and quote before any work.'],
  ['wrench', 'Expert repair', 'Genuine parts, done by certified techs.'],
  ['shield-check', 'Guaranteed', 'Backed by our workmanship warranty.'],
];

function ServicesScreen() {
  const [sent, setSent] = useState(false);
  return (
    <div>
      <section style={{ background: 'var(--graphite-900)', color: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--fs-xs)', fontWeight: 700, letterSpacing: 'var(--ls-wider)', textTransform: 'uppercase', color: 'var(--orange-500)' }}>
            <Icon name="wrench" size={14} color="var(--orange-500)" /> Repair & Services
          </span>
          <h1 style={{ fontSize: 'var(--fs-h1)', fontWeight: 800, letterSpacing: 'var(--ls-tight)', margin: '16px 0 12px', maxWidth: 640 }}>Fast, reliable repairs with a workmanship guarantee.</h1>
          <p style={{ fontSize: 'var(--fs-lg)', color: 'var(--graphite-300)', maxWidth: 560, lineHeight: 'var(--lh-relaxed)' }}>Free diagnostics · Same-day turnaround on most repairs · Genuine parts.</p>
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--gap-grid)' }}>
          {STEPS.map(([ic, t, d], i) => (
            <div key={t} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-btn)', background: 'var(--orange-50)', color: 'var(--orange-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={ic} size={22} color="var(--orange-600)" /></span>
              <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 600, color: 'var(--text-strong)' }}>{i + 1}. {t}</div>
              <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', lineHeight: 'var(--lh-relaxed)' }}>{d}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px 0' }}>
        <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 700, letterSpacing: 'var(--ls-tight)', margin: '0 0 28px', color: 'var(--text-strong)' }}>Popular repairs</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--gap-grid)' }}>
          {REPAIRS.map((r, i) => <RepairCard key={i} repair={r} onBook={() => document.getElementById('booking').scrollTo?.(0,0)} />)}
        </div>
      </section>

      <section id="booking" style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--orange-600)', marginBottom: 10 }}>Get a free quote</div>
            <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 700, letterSpacing: 'var(--ls-tight)', margin: '0 0 14px', color: 'var(--text-strong)' }}>Book your repair</h2>
            <p style={{ fontSize: 'var(--fs-body)', color: 'var(--text-body)', lineHeight: 'var(--lh-relaxed)', maxWidth: 420 }}>Tell us about your device and we'll confirm a time and an up-front quote — usually within an hour.</p>
          </div>
          <Card padding="var(--space-8)">
            {sent ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <Icon name="check-circle" size={44} color="var(--success-500)" />
                <div style={{ fontSize: 'var(--fs-h4)', fontWeight: 700, color: 'var(--text-strong)', margin: '12px 0 6px' }}>Request received</div>
                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', marginBottom: 20 }}>We'll text you a confirmation and quote shortly.</div>
                <Button variant="secondary" onClick={() => setSent(false)}>Book another</Button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Select label="Device" options={['iPhone', 'Android Phone', 'Laptop', 'Tablet', 'Console']} />
                  <Select label="Repair type" options={['Screen', 'Battery', 'Water damage', 'Unlock', 'Other']} />
                </div>
                <Input label="Your name" placeholder="Jordan Rivera" required />
                <Input label="Phone number" type="tel" icon={<Icon name="phone" size={16} />} placeholder="+1 555 0100" required />
                <Checkbox label="I agree the device may be taken to the store if it can't be fixed on-site." />
                <Button type="submit" variant="service" fullWidth size="lg" iconLeft={<Icon name="calendar-check" size={18} />}>Get Free Quote</Button>
              </form>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { ServicesScreen });
