interface ToolbarProps {
  viewMode: 'iso' | 'top' | 'front';
  onViewChange: (mode: 'iso' | 'top' | 'front') => void;
}

export function Toolbar({ viewMode, onViewChange }: ToolbarProps) {
  const buttons: { label: string; mode: 'iso' | 'top' | 'front' }[] = [
    { label: 'ISO VIEW', mode: 'iso' },
    { label: 'TOP VIEW', mode: 'top' },
    { label: 'FRONT VIEW', mode: 'front' },
  ];

  return (
    <div
      style={{
        height: '44px',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em' }}>
          SITE OVERALL ISOMETRIC
        </span>
        <span style={{ color: '#5a5a6a', fontSize: '10px' }}>SCALE 1:100</span>
      </div>

      {/* Center: View controls */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {buttons.map(b => (
          <button
            key={b.mode}
            onClick={() => onViewChange(b.mode)}
            style={{
              backgroundColor: viewMode === b.mode ? 'rgba(0,170,255,0.15)' : 'transparent',
              border: `1px solid ${viewMode === b.mode ? '#00aaff' : '#3a506b'}`,
              color: viewMode === b.mode ? '#00aaff' : '#5a5a6a',
              padding: '3px 14px',
              fontSize: '10px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              letterSpacing: '0.06em',
            }}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* Right: Status legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {[
          { color: '#00aaff', label: 'NORMAL' },
          { color: '#ffcc00', label: 'WARNING' },
          { color: '#ff3333', label: 'ALARM' },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: s.color, display: 'inline-block' }} />
            <span style={{ color: '#5a5a6a', fontSize: '9px' }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
