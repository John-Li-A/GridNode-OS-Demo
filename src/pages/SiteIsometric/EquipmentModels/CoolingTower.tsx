import { useState, useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const L = 2.3;
const W = 4.6;
const H = 5.0;
const FAN_H = 1.14;

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

export function CoolingTower({ position = [0, 0, 0], onClick, deviceName = 'COOLING TOWER', status = 'normal' }: EquipmentProps) {
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

      {/* Front panel vertical stripes */}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`stripe-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([0.3 + i * 0.22, 0.5, W + 0.002, 0.3 + i * 0.22, H - 0.3, W + 0.002]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00aaff" transparent opacity={0.12} />
        </line>
      ))}

      {/* Dual fans on top */}
      {[
        [L / 2 - 0.4, W / 2 - 0.7],
        [L / 2 + 0.4, W / 2 + 0.7],
      ].map(([fx, fz], i) => (
        <group key={`fan-${i}`} position={[fx, H, fz]}>
          {/* Fan cylinder housing */}
          <mesh position={[0, FAN_H / 2, 0]}>
            <cylinderGeometry args={[0.5, 0.5, FAN_H, 16]} />
            <meshBasicMaterial color="#00aaff" transparent opacity={0.04} depthWrite={false} />
          </mesh>
          <lineSegments position={[0, FAN_H / 2, 0]}>
            <edgesGeometry>
              <cylinderGeometry args={[0.5, 0.5, FAN_H, 16]} />
            </edgesGeometry>
            <lineBasicMaterial color="#00aaff" transparent opacity={0.35} />
          </lineSegments>
          {/* Fan blades */}
          {[0, Math.PI / 4, Math.PI / 2, Math.PI * 3 / 4].map((angle, j) => (
            <line key={`blade-${j}`}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([
                    -Math.cos(angle) * 0.45, FAN_H, -Math.sin(angle) * 0.45,
                    Math.cos(angle) * 0.45, FAN_H, Math.sin(angle) * 0.45,
                  ]), 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#00aaff" transparent opacity={0.4} />
            </line>
          ))}
        </group>
      ))}

      {/* Side ladder */}
      <group position={[L + 0.05, 0, W * 0.75]}>
        {/* Vertical rails */}
        {[0, 0.4].map((lx, i) => (
          <line key={`rail-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([lx, 0.3, 0, lx, H * 0.8, 0]), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#00aaff" transparent opacity={0.3} />
          </line>
        ))}
        {/* Rungs */}
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`rung-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([0, 0.4 + i * 0.3, 0, 0.4, 0.4 + i * 0.3, 0]), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#00aaff" transparent opacity={0.2} />
          </line>
        ))}
      </group>

      {/* Base support structure (X-braces) */}
      {[
        [[0.1, 0, 0.1], [L - 0.1, 0, W - 0.1]],
        [[L - 0.1, 0, 0.1], [0.1, 0, W - 0.1]],
      ].map(([start, end], i) => (
        <line key={`brace-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([start[0], 0.05, start[2], end[0], 0.05, end[2]]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00aaff" transparent opacity={0.2} />
        </line>
      ))}

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

      {/* Warning triangle on front */}
      <group position={[L / 2, H * 0.35, W + 0.01]}>
        <Html center style={{ pointerEvents: 'none' }}>
          <div style={{
            width: 0, height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '14px solid rgba(0,170,255,0.3)',
            position: 'relative',
          }}>
            <span style={{
              position: 'absolute',
              top: '5px', left: '-2px',
              color: '#00aaff', fontSize: '8px', fontWeight: 700,
            }}>!</span>
          </div>
        </Html>
      </group>
    </group>
  );
}
