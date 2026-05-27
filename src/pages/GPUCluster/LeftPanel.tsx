import type { CoolingLoop } from './useGPUData';

interface Props {
  cooling: CoolingLoop;
  pue: number;
  escapePhase: string;
  onTriggerEscape: () => void;
  onResetEscape: () => void;
}

export function LeftPanel({ cooling, pue, escapePhase, onTriggerEscape, onResetEscape }: Props) {
  return (
    <div style={{
      width: '260px', minWidth: '260px', height: '100%',
      backgroundColor: '#0a0a0a', borderRight: '1px solid #1a1a2e',
      fontFamily: '"Consolas", "Monaco", "Courier New", monospace',
      fontSize: '11px', color: '#ffffff', overflowY: 'auto',
      display: 'flex', flexDirection: 'column', gap: '1px',
    }}>
      {/* Title */}
      <div style={{ padding: '12px 16px', border: '1px solid #ffffff', margin: '8px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', lineHeight: '1.5' }}>
          CLUSTER-ALPHA<br />LIQUID COOLING<br />MICRO MANAGEMENT SYSTEM
        </div>
      </div>

      {/* Cabinet Overview */}
      <div style={{ padding: '12px 16px', border: '1px solid #ffffff', margin: '0 8px 8px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '8px' }}>CABINET OVERVIEW</div>
        {[
          ['Cabinet ID', 'CAB-01'],
          ['Standard', '42U'],
          ['View', 'Section View'],
          ['Servers', '5 x 4U'],
          ['GPUs Total', '40'],
          ['Coolant Type', 'PG25'],
          ['CDU Status', 'OK'],
          ['PUE (Cluster)', pue.toFixed(2)],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontSize: '11px' }}>
            <span style={{ color: '#5a5a6a' }}>{k}</span>
            <span style={{ color: k === 'CDU Status' ? '#00ff66' : '#00aaff' }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Cooling Loop */}
      <div style={{ padding: '12px 16px', border: '1px solid #ffffff', margin: '0 8px 8px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '8px' }}>COOLING LOOP</div>
        {[
          ['Supply Temp', `${cooling.supplyTemp.toFixed(1)} \u00B0C`],
          ['Return Temp', `${cooling.returnTemp.toFixed(1)} \u00B0C`],
          ['Flow Rate', `${cooling.flowRate.toFixed(1)} L/min`],
          ['System \u0394T', `${cooling.deltaT.toFixed(1)} \u00B0C`],
          ['Pressure', `${cooling.pressure.toFixed(2)} Bar`],
          ['Pump PWM', `${cooling.pumpPWM} %`],
          ['Fan PWM', `${cooling.fanPWM} %`],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontSize: '11px' }}>
            <span style={{ color: '#5a5a6a' }}>{k}</span>
            <span style={{ color: '#00aaff' }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ padding: '12px 16px', border: '1px solid #ffffff', margin: '0 8px 8px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '8px' }}>LEGEND</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <span style={{ color: '#00aaff', fontSize: '14px' }}>+</span>
          <span style={{ color: '#5a5a6a', fontSize: '10px' }}>HEALTHY ({'<'}= 70&deg;C)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <span style={{ color: '#ffcc00', fontSize: '14px' }}>+</span>
          <span style={{ color: '#5a5a6a', fontSize: '10px' }}>HIGH LOAD (70-85&deg;C)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#ff3333', fontSize: '14px' }}>+</span>
          <span style={{ color: '#5a5a6a', fontSize: '10px' }}>FAULT ({'>'}85&deg;C)</span>
        </div>
      </div>

      {/* Rear Section View */}
      <div style={{ padding: '12px 16px', border: '1px solid #ffffff', margin: '0 8px 8px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '8px' }}>REAR SECTION VIEW</div>
        <svg width="180" height="100" viewBox="0 0 180 100">
          {/* Cabinet outline */}
          <rect x="20" y="10" width="60" height="80" fill="none" stroke="#3a506b" strokeWidth="1" />
          {/* GPU Tray labels */}
          <line x1="85" y1="20" x2="100" y2="20" stroke="#3a506b" strokeWidth="0.5" />
          <text x="105" y="23" fill="#5a5a6a" fontSize="7" fontFamily="Consolas,monospace">GPU Tray</text>
          <line x1="85" y1="40" x2="100" y2="40" stroke="#3a506b" strokeWidth="0.5" />
          <text x="105" y="43" fill="#5a5a6a" fontSize="7" fontFamily="Consolas,monospace">CDU In/Out</text>
          <line x1="85" y1="60" x2="100" y2="60" stroke="#3a506b" strokeWidth="0.5" />
          <text x="105" y="63" fill="#5a5a6a" fontSize="7" fontFamily="Consolas,monospace">Power Feed</text>
          <line x1="85" y1="75" x2="100" y2="75" stroke="#3a506b" strokeWidth="0.5" />
          <text x="105" y="78" fill="#5a5a6a" fontSize="7" fontFamily="Consolas,monospace">Manifold</text>
          <line x1="85" y1="88" x2="100" y2="88" stroke="#3a506b" strokeWidth="0.5" />
          <text x="105" y="91" fill="#5a5a6a" fontSize="7" fontFamily="Consolas,monospace">Rear Door</text>
        </svg>
      </div>

      {/* Notes */}
      <div style={{ padding: '12px 16px', border: '1px solid #ffffff', margin: '0 8px 8px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '8px' }}>NOTES</div>
        {[
          '1. All temperatures in \u00B0C',
          '2. VRAM usage in %',
          '3. Pump_PWM in %',
          '4. Update interval: 1s',
        ].map(n => (
          <div key={n} style={{ color: '#5a5a6a', fontSize: '9px', marginBottom: '3px' }}>{n}</div>
        ))}
      </div>

      {/* Escape button */}
      <div style={{ padding: '12px 16px', margin: '0 8px 8px' }}>
        {escapePhase === 'idle' ? (
          <button
            onClick={onTriggerEscape}
            style={{
              width: '100%', backgroundColor: 'rgba(255,51,51,0.15)', border: '1px solid #ff3333',
              color: '#ff3333', padding: '8px', fontSize: '10px', fontFamily: 'inherit',
              cursor: 'pointer', fontWeight: 700, letterSpacing: '0.04em',
            }}
          >
            &#9888; 触发算电逃生
          </button>
        ) : escapePhase === 'complete' ? (
          <button
            onClick={onResetEscape}
            style={{
              width: '100%', backgroundColor: 'rgba(0,170,255,0.1)', border: '1px solid #00aaff',
              color: '#00aaff', padding: '8px', fontSize: '10px', fontFamily: 'inherit',
              cursor: 'pointer', fontWeight: 700,
            }}
          >
            RESET
          </button>
        ) : (
          <div style={{ color: '#ffcc00', fontSize: '10px', textAlign: 'center', fontWeight: 700 }}>
            ESCAPE {escapePhase.toUpperCase().replace('PHASE', 'PHASE ')}
          </div>
        )}
      </div>
    </div>
  );
}
