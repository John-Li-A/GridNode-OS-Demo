import { useMemo } from 'react';
import * as THREE from 'three';

export function ConcretePad() {
  const padGeometry = useMemo(() => new THREE.BoxGeometry(26, 0.2, 16), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(padGeometry), [padGeometry]);

  // Grid lines every 1m
  const gridLines = useMemo(() => {
    const points: THREE.Vector3[] = [];
    // X direction lines
    for (let z = -8; z <= 8; z += 1) {
      points.push(new THREE.Vector3(-13, 0.1, z));
      points.push(new THREE.Vector3(13, 0.1, z));
    }
    // Z direction lines
    for (let x = -13; x <= 13; x += 1) {
      points.push(new THREE.Vector3(x, 0.1, -8));
      points.push(new THREE.Vector3(x, 0.1, 8));
    }
    return points;
  }, []);

  const gridGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(
      gridLines.flatMap(p => [p.x, p.y, p.z]), 3
    ));
    return geo;
  }, [gridLines]);

  return (
    <group>
      {/* Concrete pad surface */}
      <mesh geometry={padGeometry} position={[13, -0.1, 8]}>
        <meshBasicMaterial color="#2a2a3a" transparent opacity={0.12} depthWrite={false} />
      </mesh>
      {/* Pad edges */}
      <lineSegments geometry={edges} position={[13, -0.1, 8]}>
        <lineBasicMaterial color="#00aaff" transparent opacity={0.3} />
      </lineSegments>
      {/* Grid lines */}
      <lineSegments geometry={gridGeometry}>
        <lineBasicMaterial color="#00aaff" transparent opacity={0.06} />
      </lineSegments>
      {/* Cable trench indicator (dashed line) */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([4, 0.11, 2, 4, 0.11, 14]), 3]}
          />
        </bufferGeometry>
        <lineDashedMaterial color="#00aaff" dashSize={0.3} gapSize={0.15} transparent opacity={0.25} />
      </lineSegments>
    </group>
  );
}
