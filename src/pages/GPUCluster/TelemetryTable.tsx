import type { GPUUnit } from './useGPUData';

interface Props {
  gpus: GPUUnit[];
  onGPUClick: (gpu: GPUUnit) => void;
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'OK': return '#00ff66';
    case 'HIGH': return '#ffcc00';
    case 'FAULT': return '#ff3333';
    case 'PAUSED': return '#ffcc00';
    default: return '#5a5a6a';
  }
}

export function TelemetryTable({ gpus, onGPUClick }: Props) {
  // Group by node
  const nodes = [1, 2, 3, 4, 5];

  return (
    <div style={{
      width: '480px', minWidth: '480px', height: '100%',
      backgroundColor: '#0a0a0a', borderLeft: '1px solid #1a1a2e',
      fontFamily: '"Consolas", "Monaco", "Courier New", monospace',
      fontSize: '11px', overflowY: 'auto', display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '8px 12px', borderBottom: '1px solid #1a1a2e',
        fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: '#ffffff',
      }}>
        GPU TELEMETRY STREAM
      </div>

      {/* Column headers */}
      <div style={{
        display: 'grid', gridTemplateColumns: '130px 80px 90px 80px 60px',
        padding: '4px 12px', borderBottom: '1px solid #1a1a2e',
        fontSize: '9px', color: '#5a5a6a', position: 'sticky', top: 0, backgroundColor: '#0a0a0a', zIndex: 2,
      }}>
        <span>ID</span>
        <span style={{ textAlign: 'right' }}>Temperature</span>
        <span style={{ textAlign: 'right' }}>VRAM Usage</span>
        <span style={{ textAlign: 'right' }}>Pump_PWM</span>
        <span style={{ textAlign: 'center' }}>Status</span>
      </div>

      {/* GPU rows grouped by node */}
      {nodes.map(nodeId => {
        const nodeGPUs = gpus.filter(g => g.nodeId === nodeId);
        return (
          <div key={nodeId}>
            {/* Node header */}
            <div style={{
              padding: '2px 12px', backgroundColor: '#0f0f12',
              fontSize: '8px', color: '#3a506b', letterSpacing: '0.04em',
              borderBottom: '1px solid #1a1a2e',
            }}>
              NODE 0{nodeId}
            </div>
            {nodeGPUs.map(gpu => {
              const isHigh = gpu.status === 'HIGH' || gpu.status === 'FAULT';
              return (
                <div
                  key={gpu.id}
                  onClick={() => onGPUClick(gpu)}
                  style={{
                    display: 'grid', gridTemplateColumns: '130px 80px 90px 80px 60px',
                    padding: '3px 12px', borderBottom: '1px solid #0f0f12',
                    fontSize: '11px', cursor: 'pointer',
                    backgroundColor: isHigh ? 'rgba(255,204,0,0.05)' : 'transparent',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(0,170,255,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = isHigh ? 'rgba(255,204,0,0.05)' : 'transparent'; }}
                >
                  <span style={{ color: '#8a8a9a', fontSize: '10px' }}>{gpu.id}</span>
                  <span style={{
                    textAlign: 'right',
                    color: gpu.temperature > 80 ? '#ff3333' : gpu.temperature > 70 ? '#ffcc00' : '#00aaff',
                    fontWeight: isHigh ? 700 : 400,
                  }}>
                    {gpu.temperature.toFixed(0)}&deg;C
                  </span>
                  <span style={{
                    textAlign: 'right',
                    color: gpu.vramUsage > 95 ? '#ff3333' : '#00aaff',
                    fontWeight: isHigh ? 700 : 400,
                  }}>
                    VRAM: {gpu.vramUsage}%
                  </span>
                  <span style={{ textAlign: 'right', color: '#00aaff' }}>
                    Pump_PWM: {gpu.pumpPWM}%
                  </span>
                  <span style={{
                    textAlign: 'center', color: getStatusColor(gpu.status),
                    fontWeight: 700, fontSize: '10px',
                  }}>
                    {gpu.status}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
