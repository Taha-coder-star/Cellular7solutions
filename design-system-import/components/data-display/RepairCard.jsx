import React from 'react';
import { Button } from '../forms/Button';
import { Icon } from '../media/Icon';

const usd = (n) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 0 });

/**
 * Repair service card: device type, repair type, estimated time, starting
 * price, and a "Book Repair" button. This is a SERVICE surface, so it uses
 * the orange button and an orange accent.
 */
export function RepairCard({ repair = {}, onBook, style = {} }) {
  const { deviceType = 'Device', repairType = 'Repair', time = '', startingPrice = 0, icon = 'wrench' } = repair;
  const [h, setH] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'flex', flexDirection: 'column', gap: '16px',
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
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: 'var(--radius-btn)', background: 'var(--orange-50)', color: 'var(--orange-600)' }}>
          <Icon name={icon} size={24} color="var(--orange-600)" />
        </span>
        <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{deviceType}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>{repairType}</span>
        {time && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
            <Icon name="clock" size={15} /> {time}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>from</span>
        <span style={{ fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)' }}>{usd(startingPrice)}</span>
      </div>

      <Button variant="service" fullWidth onClick={onBook} iconLeft={<Icon name="calendar-check" size={18} />}>
        Book Repair
      </Button>
    </div>
  );
}
