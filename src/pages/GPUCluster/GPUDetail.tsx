import type { GPUUnit } from './useGPUData';

interface Props {
  gpu: GPUUnit | null;
  onClose: () => void;
}

export function GPUDetail({ gpu, onClose }: Props) {
  if (!gpu) return null;

  const statusColor =
    gpu.status === 'OK' ? '#00ff66' :
    gpu.status === 'HIGH' || gpu.status === 'PAUSED' ? '#ffcc00' : '#ff3333';

  const priorityColor =
    gpu.task?.priority === 'high' ? '#ffffff' :
    gpu.task?.priority === 'medium' ? '#8ac8e8' : '#005588';

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#0f0f12', border: '1px solid #00aaff',
          padding: '24px', minWidth: '380px', maxWidth: '440px',
          fontFamily: '"Consolas", "Monaco", "Courier New", monospace',
          position: 'relative',
        }}
      >
        <button onClick={onClose} style={{
          position: 'absolute', top: '8px', right: '12px',
          background: 'none', border: 'none', color: '#5a5a6a',
          fontSize: '18px', cursor: 'pointer', fontFamily: 'inherit',
        }}>x</button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{
            width: '30px', height: '30px', border: `2px solid ${statusColor}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: statusColor, fontSize: '14px', fontWeight: 700,
          }}>+</span>
          <div>
            <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: 700 }}>{gpu.id}</div>
            <div style={{ color: '#5a5a6a', fontSize: '9px' }}>
              NODE 0{gpu.nodeId} &middot; GPU0{gpu.gpuIndex}
            </div>
          </div>
          <span style={{ marginLeft: 'auto', color: statusColor, fontSize: '11px', fontWeight: 700 }}>
            {gpu.status}
          </span>
        </div>

        <div style={{ height: '1px', backgroundColor: 'rgba(0,170,255,0.2)', marginBottom: '12px' }} />

        {/* Real-time params */}
        <div style={{ marginBottom: '16px' }}>
          {[
            ['Temperature', `${gpu.temperature.toFixed(1)} \u00B0C`, gpu.temperature > 70 ? '#ffcc00' : '#00aaff'],
            ['VRAM Usage', `${gpu.vramUsage} %`, gpu.vramUsage > 95 ? '#ff3333' : '#00aaff'],
            ['Pump PWM', `${gpu.pumpPWM} %`, '#00aaff'],
            ['Status', gpu.status, statusColor],
          ].map(([k, v, c]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span style={{ color: '#5a5a6a', fontSize: '11px' }}>{k}</span>
              <span style={{ color: c as string, fontSize: '11px', fontWeight: 700 }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Task info (core business value) */}
        {gpu.task && (
          <>
            <div style={{ height: '1px', backgroundColor: 'rgba(0,170,255,0.2)', marginBottom: '12px' }} />
            <div style={{ marginBottom: '16px' }}>
              <div style={{ color: '#ffffff', fontSize: '11px', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.06em' }}>
                TASK INFORMATION
              </div>
              {[
                ['Task Type', gpu.task.type, '#00aaff'],
                ['Customer', gpu.task.customer, '#00aaff'],
                ['Priority', gpu.task.priority.toUpperCase(), priorityColor],
              ].map(([k, v, c]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span style={{ color: '#5a5a6a', fontSize: '11px' }}>{k}</span>
                  <span style={{ color: c as string, fontSize: '11px', fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            ['POWER OFF', '#ff3333'],
            ['REBOOT', '#ffcc00'],
            ['PAUSE TASK', '#8ac8e8'],
            ['ISOLATE', '#ff6666'],
          ].map(([label, color]) => (
            <button key={label} style={{
              flex: 1, backgroundColor: `${color}15`, border: `1px solid ${color}`,
              color, padding: '6px 4px', fontSize: '9px', fontFamily: 'inherit',
              cursor: 'pointer', fontWeight: 600, letterSpacing: '0.02em',
            }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
