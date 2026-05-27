import { useRef, useState, useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const L = 6.058;
const W = 2.438;
const H = 2.896;

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

export function ComputeContainer({ position = [0, 0, 0], onClick, deviceName = 'COMPUTE CONTAINER', status = 'normal' }: EquipmentProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const faceMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: hovered ? '#33ccff' : '#00aaff',
    transparent: true,
    opacity: hovered ? 0.25 : 0.12,
    depthWrite: false,
  }), [hovered]);

  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(L, H, W)), []);

  return (
    <group
      ref={groupRef}
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

      {/* Roof corrugation lines */}
      {Array.from({ length: 14 }, (_, i) => (
        <line key={`roof-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([0.3 + i * 0.4, H + 0.001, 0.1, 0.3 + i * 0.4, H + 0.001, W - 0.1]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00aaff" transparent opacity={0.25} />
        </line>
      ))}

      {/* Double doors - front */}
      <lineSegments position={[L / 2, H / 2, W + 0.001]}>
        <edgesGeometry>
          <boxGeometry args={[L * 0.5, H * 0.7, 0]} />
        </edgesGeometry>
        <lineBasicMaterial color="#00aaff" transparent opacity={0.4} />
      </lineSegments>
      {/* Door center line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([L / 2, H * 0.15, W + 0.002, L / 2, H * 0.85, W + 0.002]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00aaff" transparent opacity={0.3} />
      </line>
      {/* Door handles */}
      {[L / 2 - 0.15, L / 2 + 0.15].map((x, i) => (
        <mesh key={`handle-${i}`} position={[x, H * 0.5, W + 0.03]}>
          <boxGeometry args={[0.02, 0.08, 0.04]} />
          <meshBasicMaterial color="#00aaff" transparent opacity={0.5} />
        </mesh>
      ))}

      {/* Side vent louvers */}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`louver-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([0.5 + i * 0.65, 0.5, -0.002, 0.5 + i * 0.65, 2.2, -0.002]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00aaff" transparent opacity={0.15} />
        </line>
      ))}

      {/* Bottom steps */}
      {[-0.15, L + 0.15].map((x, i) => (
        <group key={`step-${i}`} position={[x + (i === 0 ? -0.3 : 0), 0, W / 2 - 0.3]}>
          <mesh position={[0.15, 0.1, 0.15]}>
            <boxGeometry args={[0.3, 0.2, 0.3]} />
            <meshBasicMaterial color="#00aaff" transparent opacity={0.04} depthWrite={false} />
          </mesh>
          <lineSegments>
            <edgesGeometry>
              <boxGeometry args={[0.3, 0.2, 0.3]} />
            </edgesGeometry>
            <lineBasicMaterial color="#00aaff" transparent opacity={0.3} />
          </lineSegments>
        </group>
      ))}

      {/* Bottom equipment boxes */}
      {[0.8, L - 1.5].map((x, i) => (
        <group key={`box-${i}`} position={[x, 0.2, W + 0.15]}>
          <mesh position={[0.4, 0.1, 0]}>
            <boxGeometry args={[0.8, 0.2, 0.3]} />
            <meshBasicMaterial color="#00aaff" transparent opacity={0.04} depthWrite={false} />
          </mesh>
          <lineSegments position={[0.4, 0.1, 0]}>
            <edgesGeometry>
              <boxGeometry args={[0.8, 0.2, 0.3]} />
            </edgesGeometry>
            <lineBasicMaterial color="#00aaff" transparent opacity={0.3} />
          </lineSegments>
        </group>
      ))}

      {/* Door text */}
      <Html position={[L / 2, H * 0.65, W + 0.05]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          color: '#00aaff',
          fontSize: '7px',
          fontFamily: 'Consolas,monospace',
          textAlign: 'center',
          lineHeight: '1.3',
          opacity: 0.5,
        }}>
          HPC-DC<br />LIQUID COOLED<br />COMPUTE SYSTEM
        </div>
      </Html>

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
