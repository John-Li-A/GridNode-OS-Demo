import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { ComputeContainer } from './EquipmentModels/ComputeContainer';
import { TransformerUnit } from './EquipmentModels/TransformerUnit';
import { CoolingTower } from './EquipmentModels/CoolingTower';
import { ChargingPile } from './EquipmentModels/ChargingPile';
import { PowerCabinet } from './EquipmentModels/PowerCabinet';
import { ControlCabinet } from './EquipmentModels/ControlCabinet';
import { ConcretePad } from './ConcretePad';

const EQS = {
  container:  [0,       0, 0]       as [number,number,number],
  transformer:[8.0,     0, 1.0]     as [number,number,number],
  tower:      [12.5,    0, 0.5]     as [number,number,number],
  chargers:   [4.0,     0, 10.0]    as [number,number,number],
  powerCab:   [1.0,     0, 12.5]    as [number,number,number],
  ctrlCab:    [3.5,     0, 12.5]    as [number,number,number],
};

function CameraController({ viewMode, controlsRef }: { viewMode: 'iso' | 'top' | 'front'; controlsRef: React.RefObject<any> }) {
  const { camera } = useThree();
  const targetPos = useMemo(() => {
    switch (viewMode) {
      case 'top':   return new THREE.Vector3(13, 28, 8);
      case 'front': return new THREE.Vector3(13, 6, 32);
      default:      return new THREE.Vector3(24, 18, 24);
    }
  }, [viewMode]);

  useFrame(() => {
    camera.position.lerp(targetPos, 0.05);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(new THREE.Vector3(13, 1, 8), 0.05);
      controlsRef.current.update();
    }
  });

  return null;
}

function DeviceLabels() {
  const labels = [
    { id: 1, name: '20FT COMPUTE CONTAINER', dims: 'L6058 x W2438 x H2896mm', pos: [-0.5, 3.2, -0.8] as [number,number,number] },
    { id: 2, name: '1600kVA TRANSFORMER',    dims: 'L2600 x W1800 x H2180mm', pos: [8.0, 2.6, -0.8] as [number,number,number] },
    { id: 3, name: 'CLOSED COOLING TOWER',   dims: 'L2300 x W4600 x H6140mm', pos: [12.0, 6.8, -0.8] as [number,number,number] },
    { id: 4, name: 'LIQUID COOLED CHARGER',  dims: 'L800 x W600 x H2000mm',   pos: [4.0, 2.4, 9.2] as [number,number,number] },
    { id: 5, name: 'POWER DISTRIBUTION CABINET', dims: 'L1200 x W1000 x H2000mm', pos: [0.5, 2.4, 11.7] as [number,number,number] },
    { id: 6, name: 'CONTROL CABINET',        dims: 'L800 x W800 x H2000mm',   pos: [3.5, 2.4, 11.7] as [number,number,number] },
  ];

  return (
    <>
      {labels.map(d => (
        <Html key={d.id} position={d.pos} style={{ pointerEvents: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
            <div style={{
              width: '18px', height: '18px',
              border: '1px solid #00aaff', color: '#00aaff',
              fontSize: '10px', fontWeight: 700,
              fontFamily: 'Consolas,monospace',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {d.id}
            </div>
            <div style={{ borderLeft: '1px solid rgba(0,170,255,0.4)', paddingLeft: '5px', whiteSpace: 'nowrap' }}>
              <div style={{ color: '#fff', fontSize: '9px', fontWeight: 600, fontFamily: 'Consolas,monospace' }}>{d.name}</div>
              <div style={{ color: '#5a5a6a', fontSize: '7px', fontFamily: 'Consolas,monospace' }}>{d.dims}</div>
            </div>
          </div>
        </Html>
      ))}
    </>
  );
}

function DimensionLabels() {
  return (
    <>
      <Html position={[3.0, -0.5, -0.8]} style={{ pointerEvents: 'none' }}><div style={{ color: '#5a5a6a', fontSize: '8px', fontFamily: 'Consolas,monospace' }}>6058</div></Html>
      <Html position={[-1.0, 1.4, 1.2]} style={{ pointerEvents: 'none' }}><div style={{ color: '#5a5a6a', fontSize: '8px', fontFamily: 'Consolas,monospace' }}>2896</div></Html>
      <Html position={[9.3, 2.8, -0.8]} style={{ pointerEvents: 'none' }}><div style={{ color: '#5a5a6a', fontSize: '8px', fontFamily: 'Consolas,monospace' }}>2600</div></Html>
      <Html position={[13.8, 6.6, -0.8]} style={{ pointerEvents: 'none' }}><div style={{ color: '#5a5a6a', fontSize: '8px', fontFamily: 'Consolas,monospace' }}>6140</div></Html>
      <Html position={[5.25, -0.5, 9.2]} style={{ pointerEvents: 'none' }}><div style={{ color: '#5a5a6a', fontSize: '8px', fontFamily: 'Consolas,monospace' }}>2500</div></Html>
      <Html position={[13, -0.8, 16.8]} style={{ pointerEvents: 'none' }}><div style={{ color: '#5a5a6a', fontSize: '8px', fontFamily: 'Consolas,monospace', textAlign: 'center' }}>26000</div></Html>
    </>
  );
}

interface SceneProps {
  viewMode: 'iso' | 'top' | 'front';
  onDeviceClick?: (deviceId: number) => void;
}

export function Scene({ viewMode, onDeviceClick }: SceneProps) {
  const controlsRef = useRef<any>(null);

  return (
    <Canvas
      style={{ width: '100%', height: '100%', background: '#0a0a0a' }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
    >
      <PerspectiveCamera
        makeDefault
        position={[24, 18, 24]}
        fov={35}
        near={0.1}
        far={200}
      />

      <CameraController viewMode={viewMode} controlsRef={controlsRef} />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.4}
        zoomSpeed={0.6}
        target={[13, 1, 8]}
        minDistance={5}
        maxDistance={60}
      />

      <color attach="background" args={['#0a0a0a']} />

      <ConcretePad />

      <group>
        <ComputeContainer position={EQS.container} onClick={() => onDeviceClick?.(1)} deviceName="20FT COMPUTE CONTAINER" />
        <TransformerUnit position={EQS.transformer} onClick={() => onDeviceClick?.(2)} deviceName="1600kVA TRANSFORMER" />
        <CoolingTower position={EQS.tower} onClick={() => onDeviceClick?.(3)} deviceName="CLOSED COOLING TOWER" />
        <ChargingPile position={EQS.chargers} count={4} onClick={() => onDeviceClick?.(4)} deviceName="LIQUID COOLED CHARGER" />
        <PowerCabinet position={EQS.powerCab} onClick={() => onDeviceClick?.(5)} deviceName="POWER DISTRIBUTION CABINET" />
        <ControlCabinet position={EQS.ctrlCab} onClick={() => onDeviceClick?.(6)} deviceName="CONTROL CABINET" />
      </group>

      <DeviceLabels />
      <DimensionLabels />
    </Canvas>
  );
}
