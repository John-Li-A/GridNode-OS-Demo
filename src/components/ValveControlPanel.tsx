import { useState, useEffect } from 'react';
import type { ValveState } from '@/types/pnid';

interface ValveControlPanelProps {
  valve: ValveState | null;
  onClose: () => void;
  onChange: (valveId: string, openPercent: number) => void;
}

export function ValveControlPanel({ valve, onClose, onChange }: ValveControlPanelProps) {
  const [localValue, setLocalValue] = useState(valve?.openPercent ?? 50);

  useEffect(() => {
    if (valve) {
      setLocalValue(valve.openPercent);
    }
  }, [valve?.id]);

  if (!valve) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#0f0f12',
          border: '1px solid #00aaff',
          padding: '24px',
          width: '320px',
          fontFamily: '"Consolas", "Monaco", "Courier New", monospace',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '8px',
            right: '12px',
            background: 'none',
            border: 'none',
            color: '#5a5a6a',
            fontSize: '18px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          x
        </button>

        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: 700, letterSpacing: '0.08em' }}>
            {valve.name}
          </div>
          <div style={{ color: '#5a5a6a', fontSize: '10px', marginTop: '4px' }}>
            CONTROL VALVE — {valve.autoControlled ? 'AUTO' : 'MANUAL'} MODE
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'rgba(0,170,255,0.2)', marginBottom: '20px' }} />

        {/* Valve graphic */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <svg width="120" height="80" viewBox="0 0 120 80">
            {/* Motor */}
            <circle cx={60} cy={12} r={10} fill="none" stroke="#00aaff" strokeWidth={1} />
            <text x={60} y={15} textAnchor="middle" fill="#00aaff" fontSize={8} fontFamily="Consolas,monospace">M</text>
            {/* Stem */}
            <line x1={60} y1={22} x2={60} y2={30} stroke="#00aaff" strokeWidth={1} />
            {/* Actuator */}
            <rect x={52} y={30} width={16} height={10} fill="none" stroke="#00aaff" strokeWidth={1} />
            {/* Valve body */}
            <polygon points="60,40 45,55 60,70 75,55" fill="none" stroke="#00aaff" strokeWidth={1.5} />
            {/* Flow path */}
            <line x1={30} y1={55} x2={90} y2={55} stroke="#00aaff" strokeWidth={1} opacity={0.4} />
            {/* Opening indicator */}
            <rect x={30} y={72} width={60} height={6} fill="none" stroke="#3a506b" strokeWidth={1} />
            <rect x={30} y={72} width={60 * (localValue / 100)} height={6} fill="#00aaff" opacity={0.6} />
          </svg>
        </div>

        {/* Slider control */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#5a5a6a', fontSize: '10px' }}>VALVE OPENING</span>
            <span style={{ color: '#00aaff', fontSize: '14px', fontWeight: 700 }}>{localValue}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={localValue}
            onChange={(e) => setLocalValue(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: '#00aaff',
              cursor: 'pointer',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ color: '#5a5a6a', fontSize: '9px' }}>CLOSED</span>
            <span style={{ color: '#5a5a6a', fontSize: '9px' }}>FULL OPEN</span>
          </div>
        </div>

        {/* Preset buttons */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
          {[0, 25, 50, 75, 100].map((pct) => (
            <button
              key={pct}
              onClick={() => setLocalValue(pct)}
              style={{
                flex: 1,
                backgroundColor: localValue === pct ? 'rgba(0,170,255,0.2)' : 'transparent',
                border: `1px solid ${localValue === pct ? '#00aaff' : '#3a506b'}`,
                color: localValue === pct ? '#00aaff' : '#5a5a6a',
                padding: '4px',
                fontSize: '9px',
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              {pct}%
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'rgba(0,170,255,0.2)', marginBottom: '16px' }} />

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onChange(valve.id, localValue)}
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,170,255,0.15)',
              border: '1px solid #00aaff',
              color: '#00aaff',
              padding: '8px',
              fontSize: '11px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              letterSpacing: '0.06em',
              fontWeight: 600,
            }}
          >
            APPLY
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: '1px solid #3a506b',
              color: '#5a5a6a',
              padding: '8px',
              fontSize: '11px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              letterSpacing: '0.06em',
            }}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
