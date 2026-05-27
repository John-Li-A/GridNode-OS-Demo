import type { Equipment } from '@/types/pnid';

interface DeviceDetailOverlayProps {
  equipment: Equipment;
  visible: boolean;
  onClose: () => void;
}

export function DeviceDetailOverlay({ equipment, visible, onClose }: DeviceDetailOverlayProps) {
  if (!visible) return null;

  const statusColor =
    equipment.status === 'normal' ? '#00ff66' :
    equipment.status === 'warning' ? '#ffcc00' : '#ff3333';

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
          minWidth: '360px',
          maxWidth: '480px',
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
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: statusColor,
                boxShadow: `0 0 6px ${statusColor}`,
              }}
            />
            <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 700, letterSpacing: '0.08em' }}>
              {equipment.name}
            </span>
          </div>
          <div style={{ color: '#5a5a6a', fontSize: '10px' }}>{equipment.code}</div>
          <div style={{ color: '#8a8a9a', fontSize: '11px', marginTop: '6px' }}>{equipment.description}</div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'rgba(0,170,255,0.2)', marginBottom: '16px' }} />

        {/* Parameters table */}
        <div style={{ color: '#ffffff', fontSize: '11px' }}>
          <div style={{ display: 'flex', color: '#5a5a6a', fontSize: '10px', marginBottom: '8px', letterSpacing: '0.06em' }}>
            <span style={{ flex: 1 }}>PARAMETER</span>
            <span style={{ textAlign: 'right', minWidth: '80px' }}>VALUE</span>
          </div>
          {Object.entries(equipment.params).map(([key, val]) => (
            <div
              key={key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 0',
                borderBottom: '1px solid rgba(58,80,107,0.2)',
              }}
            >
              <span style={{ color: '#8a8a9a' }}>{key}</span>
              <span style={{ color: '#00aaff' }}>
                {val.value} <span style={{ color: '#5a5a6a' }}>{val.unit}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,170,255,0.1)',
              border: '1px solid #00aaff',
              color: '#00aaff',
              padding: '6px',
              fontSize: '10px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              letterSpacing: '0.06em',
            }}
          >
            VIEW HISTORY
          </button>
          <button
            style={{
              flex: 1,
              backgroundColor: 'rgba(255,51,51,0.1)',
              border: '1px solid #ff3333',
              color: '#ff3333',
              padding: '6px',
              fontSize: '10px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              letterSpacing: '0.06em',
            }}
          >
            SIMULATE FAULT
          </button>
        </div>
      </div>
    </div>
  );
}
