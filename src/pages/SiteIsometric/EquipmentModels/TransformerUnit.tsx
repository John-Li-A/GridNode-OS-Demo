import { useState, useMemo } from 'react';
import * as THREE from 'three';

const L = 2.6;
const W = 1.8;
const H = 2.18;

interface EquipmentProps {
  position?: [number, number, number];
}

export function TransformerUnit({ position = [0, 0, 0] }: EquipmentProps) {
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
      <mesh material={faceMat} position={[L / 2, H / 2 + 0.15, W / 2]}>
        <boxGeometry args={[L, H, W]} />
      </mesh>
      <lineSegments geometry={edges} position={[L / 2, H / 2 + 0.15, W / 2]}>
        <lineBasicMaterial color={hovered ? '#33ccff' : '#00aaff'} transparent opacity={hovered ? 1 : 0.6} />
      </lineSegments>

      {/* Base platform */}
      <mesh position={[L / 2, 0.075, W / 2]}>
        <boxGeometry args={[L + 0.2, 0.15, W + 0.2]} />
        <meshBasicMaterial color="#00aaff" transparent opacity={0.04} depthWrite={false} />
      </mesh>
      <lineSegments position={[L / 2, 0.075, W / 2]}>
        <edgesGeometry>
          <boxGeometry args={[L + 0.2, 0.15, W + 0.2]} />
        </edgesGeometry>
        <lineBasicMaterial color="#00aaff" transparent opacity={0.25} />
      </lineSegments>

      {/* Cooling fins - horizontal */}
      {Array.from({ length: 10 }, (_, i) => (
        <group key={`fin-${i}`}>
          {/* Front face fins */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([0.2, 0.3 + i * 0.18, W + 0.002, L - 0.2, 0.3 + i * 0.18, W + 0.002]), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#00aaff" transparent opacity={0.2} />
          </line>
          {/* Back face fins */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([0.2, 0.3 + i * 0.18, -0.002, L - 0.2, 0.3 + i * 0.18, -0.002]), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#00aaff" transparent opacity={0.15} />
          </line>
        </group>
      ))}

      {/* High voltage bushings - 6 on top */}
      {[
        [0.5, 0], [1.0, 0], [1.5, 0], [0.7, 0.4], [1.3, 0.4], [1.0, -0.4],
      ].map(([bx, bz], i) => (
        <group key={`bushing-${i}`} position={[bx, H + 0.15, W / 2 + bz]}>
          {/* Main cylinder */}
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.05, 0.06, 0.3, 8]} />
            <meshBasicMaterial color="#00aaff" transparent opacity={0.1} depthWrite={false} />
          </mesh>
          <lineSegments position={[0, 0.15, 0]}>
            <edgesGeometry>
              <cylinderGeometry args={[0.05, 0.06, 0.3, 8]} />
            </edgesGeometry>
            <lineBasicMaterial color="#00aaff" transparent opacity={0.5} />
          </lineSegments>
          {/* Umbrella skirts (2) */}
          {[0.08, 0.2].map((sy, j) => (
            <mesh key={`skirt-${j}`} position={[0, sy, 0]}>
              <cylinderGeometry args={[0.1, 0.05, 0.02, 8]} />
              <meshBasicMaterial color="#00aaff" transparent opacity={0.08} depthWrite={false} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
