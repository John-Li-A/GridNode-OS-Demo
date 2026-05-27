import { useState, useEffect } from 'react';
import { useGPUData } from './useGPUData';
import { LeftPanel } from './LeftPanel';
import { CabinetView } from './CabinetView';
import { TelemetryTable } from './TelemetryTable';
import { GPUDetail } from './GPUDetail';
import type { GPUUnit } from './useGPUData';

export function GPUClusterPage() {
  const { gpus, cooling, pue, escapePhase, triggerEscape, resetEscape } = useGPUData();
  const [selectedGPU, setSelectedGPU] = useState<GPUUnit | null>(null);
  const [clock, setClock] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClock(
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ` +
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`
      );
    };
    update();
    const interval = setInterval(update, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      width: '100vw', height: '100vh', backgroundColor: '#0a0a0a',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      paddingTop: '26px', boxSizing: 'border-box',
    }}>
      {/* Top bar */}
      <div style={{
        height: '48px', backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a2e',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', fontFamily: 'Consolas,monospace', fontSize: '11px', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em' }}>
            GPU CLUSTER LIQUID COOLING MANAGEMENT
          </span>
          <span style={{ color: '#00ff66', fontSize: '10px', fontWeight: 600 }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00ff66',
              display: 'inline-block', marginRight: '4px',
            }} />
            CLUSTER-ALPHA
          </span>
          {escapePhase !== 'idle' && escapePhase !== 'complete' && (
            <span style={{ color: '#ffcc00', fontSize: '10px', fontWeight: 700, animation: 'blink 0.5s infinite' }}>
              &#9888; ESCAPE {escapePhase.toUpperCase().replace('PHASE', 'PHASE ')}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          {[
            { l: 'PUE (Cluster)', v: pue.toFixed(2) },
            { l: 'Supply Temp', v: `${cooling.supplyTemp.toFixed(1)} \u00B0C` },
            { l: 'Return Temp', v: `${cooling.returnTemp.toFixed(1)} \u00B0C` },
            { l: 'Flow Rate', v: `${cooling.flowRate.toFixed(1)} L/min` },
            { l: 'GPU Count', v: `${gpus.filter(g => g.status === 'OK' || g.status === 'HIGH').length} / 40` },
            { l: 'CDU Status', v: 'OK' },
          ].map(m => (
            <div key={m.l} style={{ textAlign: 'center' }}>
              <div style={{ color: '#5a5a6a', fontSize: '8px' }}>{m.l}</div>
              <div style={{ color: '#00aaff', fontSize: '10px', fontWeight: 600 }}>{m.v}</div>
            </div>
          ))}
          <span style={{ color: '#00aaff', fontSize: '10px' }}>{clock}</span>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <LeftPanel
          cooling={cooling}
          pue={pue}
          escapePhase={escapePhase}
          onTriggerEscape={triggerEscape}
          onResetEscape={resetEscape}
        />
        <CabinetView gpus={gpus} onGPUClick={setSelectedGPU} />
        <TelemetryTable gpus={gpus} onGPUClick={setSelectedGPU} />
      </div>

      {/* GPU Detail overlay */}
      <GPUDetail gpu={selectedGPU} onClose={() => setSelectedGPU(null)} />

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
