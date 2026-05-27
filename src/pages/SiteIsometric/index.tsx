import { useState } from 'react';
import { Scene } from './Scene';
import { Toolbar } from './Toolbar';
import { EquipmentPanel } from './EquipmentPanel';
import { EquipmentDetail } from './EquipmentDetail';

export function SiteIsometricPage() {
  const [viewMode, setViewMode] = useState<'iso' | 'top' | 'front'>('iso');
  const [selectedDevice, setSelectedDevice] = useState<number | null>(null);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Toolbar viewMode={viewMode} onViewChange={setViewMode} />

      {/* 3D Viewport */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Scene viewMode={viewMode} />

        {/* Right panel overlay */}
        <EquipmentPanel />
      </div>

      {/* Device detail overlay */}
      <EquipmentDetail deviceId={selectedDevice} onClose={() => setSelectedDevice(null)} />

      {/* Bottom status bar */}
      <div
        style={{
          height: '28px',
          backgroundColor: '#0a0a0a',
          borderTop: '1px solid #1a1a2e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          fontFamily: '"Consolas", "Monaco", "Courier New", monospace',
          fontSize: '10px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', gap: '20px' }}>
          <span><span style={{ color: '#5a5a6a' }}>SITE: </span><span style={{ color: '#00aaff' }}>HPC-DC BASE STATION</span></span>
          <span><span style={{ color: '#5a5a6a' }}>EQUIPMENT: </span><span style={{ color: '#00aaff' }}>6 UNITS</span></span>
          <span><span style={{ color: '#5a5a6a' }}>SCALE: </span><span style={{ color: '#00aaff' }}>1:100</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#5a5a6a' }}>ALL SYSTEMS</span>
          <span style={{ color: '#00ff66', fontWeight: 700 }}>● NORMAL</span>
        </div>
      </div>
    </div>
  );
}
