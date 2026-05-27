import { useState, useMemo } from 'react';
import * as THREE from 'three';

const L = 1.2;
const W = 1.0;
const H = 2.0;

interface EquipmentProps {
  position?: [number, number, number];
}

export function PowerCabinet({ position = [0, 0, 0] }: EquipmentProps) {
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
    >
      {/* Main body */}
      <mesh material={faceMat} position={[L / 2, H / 2, W / 2]}>
        <boxGeometry args={[L, H, W]} />
      </mesh>
      <lineSegments geometry={edges} position={[L / 2, H / 2, W / 2]}>
        <lineBasicMaterial color={hovered ? '#33ccff' : '#00aaff'} transparent opacity={hovered ? 1 : 0.6} />
      </lineSegments>

      {/* Double doors - center line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([L / 2, 0.1, W + 0.002, L / 2, H - 0.1, W + 0.002]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00aaff" transparent opacity={0.3} />
      </line>

      {/* Door handles */}
      {[L / 2 - 0.12, L / 2 + 0.12].map((x, i) => (
        <mesh key={`handle-${i}`} position={[x, H * 0.5, W + 0.02]}>
          <boxGeometry args={[0.02, 0.06, 0.03]} />
          <meshBasicMaterial color="#00aaff" transparent opacity={0.4} />
        </mesh>
      ))}

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
    </group>
  );
}
