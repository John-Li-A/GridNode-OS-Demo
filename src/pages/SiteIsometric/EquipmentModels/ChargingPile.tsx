import { useState, useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const L = 0.8;
const W = 0.6;
const H = 1.8;
const SPACING = 2.5;

interface EquipmentProps {
  position?: [number, number, number];
  count?: number;
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

function SinglePile({ position = [0, 0, 0] as [number, number, number], onClick, deviceName = 'CHARGING PILE', status = 'normal' }: {
  position?: [number, number, number];
  onClick?: () => void;
  deviceName?: string;
  status?: 'normal' | 'warning' | 'alarm';
}) {
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
      <mesh material={faceMat} position={[L / 2, H / 2 + 0.1, W / 2]}>
        <boxGeometry args={[L, H, W]} />
      </mesh>
      <lineSegments geometry={edges} position={[L / 2, H / 2 + 0.1, W / 2]}>
        <lineBasicMaterial color={hovered ? '#33ccff' : '#00aaff'} transparent opacity={hovered ? 1 : 0.6} />
      </lineSegments>

      {/* Arched top */}
      <mesh position={[L / 2, H + 0.1, W / 2]}>
        <cylinderGeometry args={[L / 2, L / 2, W * 0.6, 8, 1, false, 0, Math.PI]} />
        <meshBasicMaterial color="#00aaff" transparent opacity={0.04} depthWrite={false} />
      </mesh>

      {/* Display screen */}
      <mesh position={[L / 2, H * 0.7, W + 0.005]}>
        <planeGeometry args={[L * 0.5, H * 0.2]} />
        <meshBasicMaterial color="#00aaff" transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <lineSegments position={[L / 2, H * 0.7, W + 0.006]}>
        <edgesGeometry>
          <planeGeometry args={[L * 0.5, H * 0.2]} />
        </edgesGeometry>
        <lineBasicMaterial color="#00aaff" transparent opacity={0.35} />
      </lineSegments>

      {/* Charging gun */}
      <group position={[L + 0.1, H * 0.35, W / 2]}>
        <mesh rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.3, 6]} />
          <meshBasicMaterial color="#00aaff" transparent opacity={0.2} />
        </mesh>
        {/* Cable */}
        <mesh position={[0.15, -0.15, 0]}>
          <torusGeometry args={[0.15, 0.015, 4, 8, Math.PI * 0.6]} />
          <meshBasicMaterial color="#00aaff" transparent opacity={0.15} />
        </mesh>
      </group>

      {/* Base */}
      <mesh position={[L / 2, 0.05, W / 2]}>
        <boxGeometry args={[L + 0.15, 0.1, W + 0.15]} />
        <meshBasicMaterial color="#00aaff" transparent opacity={0.04} depthWrite={false} />
      </mesh>
      <lineSegments position={[L / 2, 0.05, W / 2]}>
        <edgesGeometry>
          <boxGeometry args={[L + 0.15, 0.1, W + 0.15]} />
        </edgesGeometry>
        <lineBasicMaterial color="#00aaff" transparent opacity={0.25} />
      </lineSegments>

      {/* Number label */}
      <mesh position={[L / 2, H + 0.35, W / 2]}>
        <planeGeometry args={[0.2, 0.15]} />
        <meshBasicMaterial color="#00aaff" transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Hover tooltip */}
      {hovered && (
        <Html position={[L / 2, H + 0.4, W / 2]} center style={{ pointerEvents: 'none' }}>
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

export function ChargingPile({ position = [0, 0, 0], count = 4, onClick, deviceName = 'LIQUID COOLED CHARGER', status = 'normal' }: EquipmentProps) {
  return (
    <group position={position}>
      {Array.from({ length: count }, (_, i) => (
        <SinglePile
          key={i}
          position={[i * (L + SPACING), 0, 0]}
          onClick={onClick}
          deviceName={deviceName}
          status={status}
        />
      ))}
    </group>
  );
}
