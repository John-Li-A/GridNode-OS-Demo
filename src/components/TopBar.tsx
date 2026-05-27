import { useState, useEffect } from 'react';

const METRICS = [
  { label: 'GRID FREQUENCY', value: '49.997', unit: 'Hz' },
  { label: 'SYSTEM LOAD', value: '72.4', unit: '%' },
  { label: 'TOTAL ACTIVE POWER', value: '7.245', unit: 'MW' },
  { label: 'REACTIVE POWER', value: '-0.342', unit: 'MVAr' },
  { label: 'DC BUS VOLTAGE', value: '750.2', unit: 'V' },
  { label: 'ENVIRONMENT', value: '24.3', unit: '°C / 45.2 %' },
];

export function TopBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const h = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const ms = String(now.getMilliseconds()).padStart(3, '0');
      setTime(`${y}-${m}-${d} ${h}:${min}:${s}.${ms}`);
    };
    update();
    const interval = setInterval(update, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        height: '48px',
        backgroundColor: '#0a0a0a',
        borderBottom: '1px solid #1a1a2e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        fontFamily: '"Consolas", "Monaco", "Courier New", monospace',
        fontSize: '11px',
        flexShrink: 0,
      }}
    >
      {/* Left: Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 'fit-content' }}>
        <span
          style={{
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
          }}
        >
          HPC-MICROGRID CONTROL SYSTEM
        </span>
        <span
          style={{
            color: '#00ff66',
            fontSize: '10px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#00ff66',
              boxShadow: '0 0 4px #00ff66',
              display: 'inline-block',
            }}
          />
          RUNNING
        </span>
      </div>

      {/* Center: Metrics */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        {METRICS.map((m) => (
          <div key={m.label} style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
            <div style={{ color: '#5a5a6a', fontSize: '9px', letterSpacing: '0.06em', marginBottom: '2px' }}>
              {m.label}
            </div>
            <div style={{ color: '#ffffff', fontSize: '11px', fontWeight: 600 }}>
              {m.value} <span style={{ color: '#5a5a6a' }}>{m.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Right: Time + Event Log */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 'fit-content' }}>
        <span style={{ color: '#00aaff', fontSize: '11px' }}>{time}</span>
        <button
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #00aaff',
            color: '#00aaff',
            padding: '3px 12px',
            fontSize: '10px',
            fontFamily: 'inherit',
            cursor: 'pointer',
            letterSpacing: '0.06em',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0,170,255,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          EVENT LOG
        </button>
      </div>
    </div>
  );
}
