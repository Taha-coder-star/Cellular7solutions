import { Link } from 'react-router-dom';
import { RepairCard, Button, Icon } from '@/components/ui';

// ⚑ PLACEHOLDER PRICES & TIMES — confirm all with client before launch
const REPAIRS = [
  { deviceType: 'iPhone',      repairType: 'Screen Repair',        time: '45 min',   startingPrice: 89,  icon: 'monitor'  },
  { deviceType: 'Android',     repairType: 'Screen Repair',        time: '1 hr',     startingPrice: 79,  icon: 'monitor'  },
  { deviceType: 'Any Device',  repairType: 'Battery Replacement',  time: '30 min',   startingPrice: 49,  icon: 'battery'  },
  { deviceType: 'Any Device',  repairType: 'Charging Port Repair', time: '1 hr',     startingPrice: 59,  icon: 'plug'     },
  { deviceType: 'Any Device',  repairType: 'Camera Repair',        time: '1–2 hrs',  startingPrice: 69,  icon: 'camera'   },
  { deviceType: 'Any Device',  repairType: 'Water Damage',         time: '1–2 days', startingPrice: 99,  icon: 'droplets' },
];

export default function PopularRepairs() {
  return (
    <section
      style={{
        background: 'var(--surface-subtle)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: 'var(--pad-section) var(--space-6)',
      }}
    >
      <div className="max-w-7xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-xs)',
                fontWeight: 'var(--fw-semibold)',
                letterSpacing: 'var(--ls-wider)',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}
            >
              We Fix It All
            </span>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-h2)',
                fontWeight: 'var(--fw-bold)',
                letterSpacing: 'var(--ls-tight)',
                color: 'var(--text-strong)',
              }}
            >
              Popular Repair Services
            </h2>
          </div>
          <Link
            to="/repair"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-sm)',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--text-strong)',
              textDecoration: 'none',
            }}
          >
            View all repairs <Icon name="arrow-right" size={16} />
          </Link>
        </div>

        {/* Repair cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REPAIRS.map((repair) => (
            <RepairCard
              key={`${repair.deviceType}-${repair.repairType}`}
              repair={repair}
              onBook={() => {}}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="service"
            size="md"
            iconLeft={<Icon name="calendar-check" size={16} />}
          >
            <Link to="/repair" style={{ textDecoration: 'none', color: 'inherit' }}>
              Book a Repair
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
