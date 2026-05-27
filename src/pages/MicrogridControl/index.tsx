import { useEffect, useState } from 'react';
import { useEscapeEngine } from './useEscapeEngine';
import { SingleLineDiagram } from './SingleLineDiagram';
import { WaveformPanel } from './WaveformPanel';
import { ConfirmDialog } from './ConfirmDialog';
import type { EscapePhase } from './useEscapeEngine';

function EscapeProgress({ phase, elapsedMs }: { phase: EscapePhase; elapsedMs: number }) {
  if (phase === 'idle' || phase === 'confirming') return null;

  const stages = [
    { ms: 0, label: '0ms 触发', color: elapsedMs >= 0 ? '#00ff66' : '#3a506b' },
    { ms: 200, label: '200ms 一级卸载', color: elapsedMs >= 200 ? '#00ff66' : '#3a506b' },
    { ms: 400, label: '400ms 二级卸载', color: elapsedMs >= 400 ? '#00ff66' : '#3a506b' },
    { ms: 1230, label: '1230ms 数据备份完成', color: elapsedMs >= 1230 ? '#00ff66' : phase === 'complete' ? '#00ff66' : '#ff3333' },
  ];

  const remaining = Math.max(0, 1230 - elapsedMs);

  return (
    <div style={{
      padding: '6px 16px', backgroundColor: '#0f0f12',
      borderBottom: '1px solid #1a1a2e', fontFamily: 'Consolas,monospace',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
        <span style={{ color: '#ff3333', fontSize: '9px', fontWeight: 700 }}>ESCAPE PROGRESS</span>
        {phase !== 'complete' && (
          <span style={{ color: '#ffcc00', fontSize: '10px', fontWeight: 700 }}>
            {remaining.toFixed(0)}ms
          </span>
        )}
        {phase === 'complete' && (
          <span style={{ color: '#00ff66', fontSize: '10px', fontWeight: 700 }}>
            COMPLETE
          </span>
        )}
        {/* Progress bar */}
        <div style={{ flex: 1, height: '4px', backgroundColor: '#1a1a2e', position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            width: `${Math.min(100, (elapsedMs / 1230) * 100)}%`,
            backgroundColor: phase === 'complete' ? '#00ff66' : '#ff3333',
            transition: 'width 0.05s linear',
          }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        {stages.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{
              width: '6px', height: '6px', display: 'inline-block',
              backgroundColor: s.color,
            }} />
            <span style={{ color: s.color, fontSize: '8px' }}>{s.label}</span>
            {i < stages.length - 1 && <span style={{ color: '#3a506b', fontSize: '8px' }}>&rarr;</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function BottomBar({ phase }: { phase: EscapePhase }) {
  const items = [
    { label: 'CONTROL MODE', value: 'AUTO', color: '#00ff66' },
    { label: 'FREQ. CONTROL', value: 'AGC ENABLED', color: '#00ff66' },
    { label: 'DISPATCH STATUS', value: phase === 'phase1' || phase === 'phase2' || phase === 'phase3' ? 'LOAD_SHEDDING' : 'NORMAL', color: phase === 'phase1' || phase === 'phase2' || phase === 'phase3' ? '#ffcc00' : '#00ff66' },
    { label: 'SYS STATE', value: phase === 'phase1' || phase === 'phase2' || phase === 'phase3' ? 'ESCAPE_IN_PROGRESS' : phase === 'complete' ? 'STEADY' : 'STEADY', color: phase === 'phase1' || phase === 'phase2' || phase === 'phase3' ? '#ff3333' : '#00ff66' },
    { label: 'ALARM', value: '0', color: '#00ff66' },
    { label: 'WARNING', value: phase !== 'idle' && phase !== 'complete' ? '1' : '0', color: phase !== 'idle' && phase !== 'complete' ? '#ffcc00' : '#00ff66' },
    { label: 'DATA LOG', value: phase !== 'idle' ? 'RECORDING' : 'RECORDING', color: '#00aaff' },
    { label: 'SAMPLING RATE', value: '10 kS/s', color: '#00aaff' },
  ];

  return (
    <div style={{
      height: '36px', backgroundColor: '#0a0a0a', borderTop: '1px solid #1a1a2e',
      display: 'flex', alignItems: 'center', fontFamily: 'Consolas,monospace', fontSize: '9px',
      flexShrink: 0, overflowX: 'auto',
    }}>
      {items.map((item, i) => (
        <div key={i} style={{
          flex: 1, textAlign: 'center', padding: '0 8px',
          borderRight: i < items.length - 1 ? '1px solid #1a1a2e' : 'none',
          whiteSpace: 'nowrap',
        }}>
          <div style={{ color: '#5a5a6a', marginBottom: '2px' }}>{item.label}</div>
          <div style={{ color: item.color, fontWeight: 600 }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}

export function MicrogridControlPage() {
  const engine = useEscapeEngine();
  const [clock, setClock] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClock(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`);
    };
    update();
    const interval = setInterval(update, 100);
    return () => clearInterval(interval);
  }, []);

  const isEscaping = engine.phase === 'phase1' || engine.phase === 'phase2' || engine.phase === 'phase3';

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0a0a0a', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{
        height: '48px', backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a2e',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', fontFamily: 'Consolas,monospace', fontSize: '11px', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em' }}>
            HPC-MICROGRID CONTROL SYSTEM
          </span>
          {isEscaping ? (
            <span style={{ color: '#ff3333', fontSize: '10px', fontWeight: 700, animation: 'blink 0.5s infinite' }}>
              &#9888; ESCAPE ACTIVE
            </span>
          ) : (
            <span style={{ color: '#00ff66', fontSize: '10px', fontWeight: 600 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00ff66', display: 'inline-block', marginRight: '4px' }} />
              RUNNING
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          {[
            { l: 'GRID FREQUENCY', v: '49.997 Hz' },
            { l: 'SYSTEM LOAD', v: `${engine.singleLine.tr1Load.toFixed(1)} %` },
            { l: 'TOTAL ACTIVE POWER', v: `${(engine.singleLine.tr1Power / 1000).toFixed(3)} MW` },
            { l: 'REACTIVE POWER', v: '-0.342 MVAr' },
            { l: 'DC BUS VOLTAGE', v: '750.2 V' },
            { l: 'ENVIRONMENT', v: '24.3 C / 45.2 %' },
          ].map(m => (
            <div key={m.l} style={{ textAlign: 'center' }}>
              <div style={{ color: '#5a5a6a', fontSize: '8px' }}>{m.l}</div>
              <div style={{ color: '#ffffff', fontSize: '10px', fontWeight: 600 }}>{m.v}</div>
            </div>
          ))}
          <span style={{ color: '#00aaff', fontSize: '10px' }}>{clock}</span>
        </div>
      </div>

      {/* Escape progress bar */}
      <EscapeProgress phase={engine.phase} elapsedMs={engine.elapsedMs} />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', gap: '1px' }}>
        {/* Left: Single line diagram */}
        <div style={{ width: '48%', height: '100%', overflow: 'auto', borderRight: '1px solid #1a1a2e' }}>
          <SingleLineDiagram state={engine.singleLine} isEscaping={isEscaping} />
        </div>

        {/* Right: Waveform panel */}
        <div style={{ width: '52%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1 }}>
            <WaveformPanel
              ch1Data={engine.waveform.ch1Data}
              ch2Data={engine.waveform.ch2Data}
              ch3Data={engine.waveform.ch3Data}
              phase={engine.phase}
              elapsedMs={engine.elapsedMs}
              isFrozen={engine.waveform.isFrozen}
              escapeMarkerMs={engine.waveform.escapeMarkerMs}
            />
          </div>

          {/* Control buttons */}
          <div style={{
            display: 'flex', gap: '8px', padding: '8px 12px',
            borderTop: '1px solid #1a1a2e', backgroundColor: '#0a0a0a',
          }}>
            {engine.phase === 'idle' && (
              <button
                onClick={engine.startEscape}
                style={{
                  backgroundColor: 'rgba(255,51,51,0.15)', border: '1px solid #ff3333',
                  color: '#ff3333', padding: '8px 24px', fontSize: '11px',
                  fontFamily: 'Consolas,monospace', cursor: 'pointer',
                  fontWeight: 700, letterSpacing: '0.06em',
                  boxShadow: '0 0 10px rgba(255,51,51,0.2)',
                }}
              >
                &#9888; 手动触发算电逃生
              </button>
            )}
            {engine.phase === 'complete' && (
              <>
                <button
                  onClick={engine.resetEscape}
                  style={{
                    backgroundColor: 'rgba(0,170,255,0.1)', border: '1px solid #00aaff',
                    color: '#00aaff', padding: '8px 16px', fontSize: '10px',
                    fontFamily: 'Consolas,monospace', cursor: 'pointer',
                  }}
                >
                  RESET
                </button>
                <button
                  onClick={engine.togglePlayback}
                  style={{
                    backgroundColor: engine.playback ? 'rgba(0,170,255,0.2)' : 'transparent',
                    border: '1px solid #00aaff', color: '#00aaff',
                    padding: '8px 16px', fontSize: '10px',
                    fontFamily: 'Consolas,monospace', cursor: 'pointer',
                  }}
                >
                  {engine.playback ? 'PAUSE' : 'PLAYBACK'}
                </button>
                <button
                  style={{
                    backgroundColor: 'transparent', border: '1px solid #3a506b',
                    color: '#5a5a6a', padding: '8px 16px', fontSize: '10px',
                    fontFamily: 'Consolas,monospace', cursor: 'pointer',
                  }}
                >
                  EXPORT PNG
                </button>
              </>
            )}
            {(engine.phase === 'phase1' || engine.phase === 'phase2' || engine.phase === 'phase3') && (
              <div style={{ color: '#ffcc00', fontSize: '10px', fontFamily: 'Consolas,monospace', padding: '8px' }}>
                ESCAPE IN PROGRESS... {engine.elapsedMs.toFixed(0)}ms / 1230ms
              </div>
            )}
            <div style={{ flex: 1 }} />
            <button style={{
              backgroundColor: 'transparent', border: '1px solid #00aaff',
              color: '#00aaff', padding: '6px 14px', fontSize: '10px',
              fontFamily: 'Consolas,monospace', cursor: 'pointer',
            }}>
              SYSTEM SETTINGS
            </button>
          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <BottomBar phase={engine.phase} />

      {/* Confirm dialog */}
      <ConfirmDialog
        visible={engine.phase === 'confirming'}
        onConfirm={engine.confirmEscape}
        onCancel={engine.cancelEscape}
      />

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
