import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FluidTunnelProps {
  path1: THREE.CatmullRomCurve3;
  path2: THREE.CatmullRomCurve3;
  color1: string;
  color2: string;
  speed?: number;
}

const PARTICLE_COUNT = 400;
const PARTICLES_PER_PATH = 200;

export function FluidTunnel({ path1, path2, color1, color2, speed = 0.5 }: FluidTunnelProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const progressRef = useRef(new Float32Array(PARTICLE_COUNT));

  // Initialize random progress offsets
  useMemo(() => {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      progressRef.current[i] = Math.random();
    }
  }, []);

  const colors = useMemo(() => {
    const c1 = new THREE.Color(color1);
    const c2 = new THREE.Color(color2);
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const c = i < PARTICLES_PER_PATH ? c1 : c2;
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    }
    return arr;
  }, [color1, color2]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const time = delta * speed;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const path = i < PARTICLES_PER_PATH ? path1 : path2;

      progressRef.current[i] = (progressRef.current[i] + time * 0.1) % 1;
      const progress = progressRef.current[i];

      const point = path.getPointAt(progress);
      const tangent = path.getTangentAt(progress);

      // Add turbulence
      const turbulence = Math.sin(progress * 50 + performance.now() * 0.005) * 0.03;
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * turbulence,
        (Math.random() - 0.5) * turbulence,
        (Math.random() - 0.5) * turbulence
      );

      dummy.position.copy(point).add(offset);
      dummy.lookAt(point.clone().add(tangent));
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <icosahedronGeometry args={[0.06, 1]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
      <instancedBufferAttribute
        attach="instanceColor"
        args={[colors, 3]}
      />
    </instancedMesh>
  );
}

export function FluidTunnelInner({ path, color }: { path: THREE.CatmullRomCurve3; color: string }) {
  const tubeGeo = useMemo(() => new THREE.TubeGeometry(path, 128, 0.15, 8, false), [path]);

  return (
    <mesh geometry={tubeGeo}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.06}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export function FluidTunnelWireframe({ path, color }: { path: THREE.CatmullRomCurve3; color: string }) {
  const tubeGeo = useMemo(() => new THREE.TubeGeometry(path, 64, 0.15, 6, false), [path]);
  const edges = useMemo(() => new THREE.EdgesGeometry(tubeGeo), [tubeGeo]);

  return (
    <lineSegments geometry={edges}>
      <lineBasicMaterial color={color} transparent opacity={0.15} />
    </lineSegments>
  );
}
