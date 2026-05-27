import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Scene } from '@/three/Scene';

export function Fluid3DViewport() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        border: '1px solid rgba(0,170,255,0.25)',
        backgroundColor: '#0a0a0a',
        overflow: 'hidden',
      }}
    >
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        camera={{ fov: 50, near: 0.1, far: 100 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <Scene />
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.5}
            minDistance={3}
            maxDistance={15}
            autoRotate
            autoRotateSpeed={0.3}
          />
          <EffectComposer>
            <Bloom
              intensity={1.5}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* CRT scanline overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.08) 2px,
            rgba(0,0,0,0.08) 4px
          )`,
          mixBlendMode: 'multiply' as const,
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Panel label */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          left: '12px',
          fontFamily: '"Consolas", "Monaco", "Courier New", monospace',
          fontSize: '10px',
          color: '#5a5a6a',
          letterSpacing: '0.06em',
          pointerEvents: 'none',
        }}
      >
        DIGITAL TWIN — LIQUID COOLING SYSTEM
      </div>

      {/* Bottom status mini-card */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          right: '12px',
          backgroundColor: 'rgba(15,15,18,0.85)',
          border: '1px solid rgba(0,170,255,0.25)',
          padding: '10px 14px',
          fontFamily: '"Consolas", "Monaco", "Courier New", monospace',
          fontSize: '9px',
          pointerEvents: 'none',
          backdropFilter: 'blur(4px)',
        }}
      >
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <span style={{ color: '#5a5a6a' }}>LTWS TEMP </span>
            <span style={{ color: '#00aaff' }}>7.1 °C</span>
          </div>
          <div>
            <span style={{ color: '#5a5a6a' }}>HTWR TEMP </span>
            <span style={{ color: '#ff6b35' }}>55.0 °C</span>
          </div>
          <div>
            <span style={{ color: '#5a5a6a' }}>FLOW </span>
            <span style={{ color: '#00aaff' }}>85 L/min</span>
          </div>
          <div>
            <span style={{ color: '#5a5a6a' }}>PUE </span>
            <span style={{ color: '#00ff66' }}>1.08</span>
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div style={{ position: 'absolute', top: '4px', right: '4px', width: '12px', height: '12px', borderTop: '1px solid #00aaff', borderRight: '1px solid #00aaff', opacity: 0.5, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '4px', left: '4px', width: '12px', height: '12px', borderBottom: '1px solid #00aaff', borderLeft: '1px solid #00aaff', opacity: 0.5, pointerEvents: 'none' }} />
    </div>
  );
}
