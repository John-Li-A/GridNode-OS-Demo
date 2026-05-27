import { useState, useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const L = 0.8;
const W = 0.8;
const H = 2.0;

interface EquipmentProps {
  position?: [number, number, number];
  onClick?: () => void;
  deviceName?: string;
  status?: 'normal' | 'warning' | 'alarm';
}

function statusColor(s: 'normal' | 'warning' | 'alarm') {
  return s === 'normal' ? '#00ff66' : s === 'warning' ? '#ffcc00' : '#ff3333';
}
function statusLabel(s: 'normal' | 'warning' | 'alarm') {
  return s === 'normal' ? 'NORMAL' : s === 'warning' ? 'WARNING' : 'ALARM';
}

export function ControlCabinet({ position = [0, 0, 0], onClick, deviceName = 'CONTROL CABINET', status = 'normal' }: EquipmentProps) {
  const [hovered, setHovered] = useState(false);

  const faceMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: hovered ? '#33ccff' : '#00aaff',
    transparent: true,
    opacity: hovered ? 0.25 : 0.12,
    depthWrite: false,
  }), [hovered]);

  const bodyGeo = useMemo(() => new THREE.BoxGeometry(L, H, W), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(bodyGeo), [bodyGeo]);

  return (
    <group
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Main body */}
      <mesh material={faceMat} position={[L / 2, H / 2, W / 2]}>
        <boxGeometry args={[L, H, W]} />
      </mesh>
      <lineSegments geometry={edges} position={[L / 2, H / 2, W / 2]}>
        <lineBasicMaterial color={hovered ? '#33ccff' : '#00aaff'} transparent opacity={hovered ? 1 : 0.6} />
      </lineSegments>

      {/* Single door frame */}
      <lineSegments position={[L / 2, H / 2, W + 0.001]}>
        <edgesGeometry>
          <boxGeometry args={[L * 0.75, H * 0.8, 0]} />
        </edgesGeometry>
        <lineBasicMaterial color="#00aaff" transparent opacity={0.25} />
      </lineSegments>

      {/* Door handle */}
      <mesh position={[L * 0.75, H * 0.5, W + 0.02]}>
        <boxGeometry args={[0.02, 0.06, 0.03]} />
        <meshBasicMaterial color="#00aaff" transparent opacity={0.4} />
      </mesh>

      {/* Base platform */}
      <mesh position={[L / 2, 0.05, W / 2]}>
        <boxGeometry args={[L + 0.1, 0.1, W + 0.1]} />
        <meshBasicMaterial color="#00aaff" transparent opacity={0.04} depthWrite={false} />
      </mesh>
      <lineSegments position={[L / 2, 0.05, W / 2]}>
        <edgesGeometry>
          <boxGeometry args={[L + 0.1, 0.1, W + 0.1]} />
        </edgesGeometry>
        <lineBasicMaterial color="#00aaff" transparent opacity={0.2} />
      </lineSegments>

      {/* Hover tooltip */}
      {hovered && (
        <Html position={[L / 2, H + 0.3, W / 2]} center style={{ pointerEvents: 'none' }}>
          <div style={{
            backgroundColor: 'rgba(10,10,12,0.94)',
            border: `1px solid ${statusColor(status)}`,
            padding: '6px 10px',
            fontFamily: 'Consolas,monospace',
            whiteSpace: 'nowrap',
          }}>
            <div style={{ color: '#ffffff', fontSize: '10px', fontWeight: 600, marginBottom: '4px' }}>
              {deviceName}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                backgroundColor: statusColor(status),
                boxShadow: `0 0 5px ${statusColor(status)}`,
              }} />
              <span style={{ color: statusColor(status), fontSize: '9px', fontWeight: 600 }}>
                {statusLabel(status)}
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
