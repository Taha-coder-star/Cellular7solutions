import { useState } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';

const usd = (n) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 0 });

export function RepairCard({ repair = {}, onBook, style = {} }) {
  const {
    deviceType = 'Device',
    repairType = 'Repair',
    time = '',
    startingPrice = 0,
    icon = 'wrench',
  } = repair;

  const [h, setH] = useState(false);

  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-card)',
        boxShadow: h ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
        transform: h ? 'translateY(-2px)' : 'none',
        transition: 'var(--transition-base)',
        padding: 'var(--pad-card)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: 'var(--radius-btn)', background: 'var(--cobalt-50)', color: 'var(--cobalt-600)' }}>
          <Icon name={icon} size={24} color="var(--cobalt-600)" />
        </span>
        <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          {deviceType}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>
          {repairType}
        </span>
        {time && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
            <Icon name="clock" size={15} /> {time}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>from</span>
        <span style={{ fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>
          {usd(startingPrice)}
        </span>
      </div>

      <Button variant="service" fullWidth onClick={onBook} iconLeft={<Icon name="calendar-check" size={18} />}>
        Book Repair
      </Button>
    </div>
  );
}
