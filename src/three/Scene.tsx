import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { FluidTunnel, FluidTunnelInner, FluidTunnelWireframe } from './FluidTunnel';

function generateHelixPath(
  radius: number,
  height: number,
  turns: number,
  points: number,
  phaseOffset: number
): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const angle = t * Math.PI * 2 * turns + phaseOffset;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = -height / 2 + t * height;
    pts.push(new THREE.Vector3(x, y, z));
  }
  return new THREE.CatmullRomCurve3(pts);
}

export function Scene() {
  const { camera } = useThree();

  // Position camera
  useMemo(() => {
    camera.position.set(4, 2, 6);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const path1 = useMemo(() => generateHelixPath(1.8, 5, 4, 40, 0), []);
  const path2 = useMemo(() => generateHelixPath(1.8, 5, 4, 40, Math.PI), []);

  return (
    <>
      {/* Ambient environment */}
      <color attach="background" args={['#0a0a0a']} />

      {/* Two intertwining fluid tunnels */}
      <FluidTunnel
        path1={path1}
        path2={path2}
        color1="#00aaff"
        color2="#ff6b35"
        speed={0.8}
      />

      {/* Inner tube surfaces */}
      <FluidTunnelInner path={path1} color="#00aaff" />
      <FluidTunnelInner path={path2} color="#ff6b35" />

      {/* Wireframe outlines */}
      <FluidTunnelWireframe path={path1} color="#00aaff" />
      <FluidTunnelWireframe path={path2} color="#ff6b35" />

      {/* Center axis line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, -2.5, 0, 0, 2.5, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#3a506b" transparent opacity={0.2} />
      </line>

      {/* Orbit point light */}
      <pointLight position={[5, 5, 5]} intensity={0.3} color="#00aaff" />
      <pointLight position={[-5, -3, -5]} intensity={0.15} color="#ff6b35" />
    </>
  );
}
