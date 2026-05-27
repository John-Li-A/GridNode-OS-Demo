import { useState, useCallback, useRef, useEffect } from 'react';

export type EscapePhase = 'idle' | 'confirming' | 'phase1' | 'phase2' | 'phase3' | 'complete';

interface WaveformState {
  ch1Data: number[];  // Grid load current (A)
  ch2Data: number[];  // NVMe write speed (GB/s)
  ch3Data: number[];  // PCIe throughput (Gbps)
  timeLabels: string[];
  isRecording: boolean;
  isFrozen: boolean;
  escapeMarkerMs: number | null;
}

export interface SingleLineState {
  qf1Current: [number, number, number];  // Ia, Ib, Ic
  qf2Current: [number, number, number];
  qf3Current: [number, number, number];
  tr1Temp: number;
  tr1Load: number;
  tr1Power: number;
  podPowers: number[];  // 4 pods
  podPFs: number[];
}

export interface EscapeEngine {
  phase: EscapePhase;
  progress: number;  // 0-1230
  elapsedMs: number;
  waveform: WaveformState;
  singleLine: SingleLineState;
  startEscape: () => void;
  confirmEscape: () => void;
  cancelEscape: () => void;
  resetEscape: () => void;
  playback: boolean;
  togglePlayback: () => void;
}

const TOTAL_POINTS = 500;
const ESCAPE_DURATION = 1230; // ms
const NOMINAL_CURRENT = 124.6;
const OVERLOAD_CURRENT = 187;

function generateSine(amp: number, freq: number, phase: number, count: number): number[] {
  return Array.from({ length: count }, (_, i) => {
    return amp * Math.sin((i / count) * Math.PI * 2 * freq + phase) + (Math.random() - 0.5) * amp * 0.05;
  });
}

function generateNoise(amp: number, count: number): number[] {
  return Array.from({ length: count }, () => (Math.random() - 0.5) * amp * 2);
}

export function useEscapeEngine(): EscapeEngine {
  const [phase, setPhase] = useState<EscapePhase>('idle');
  const [progress, setProgress] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [playback, setPlayback] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const recordedDataRef = useRef<{ ch1: number[][]; ch2: number[][]; ch3: number[][] }>({ ch1: [], ch2: [], ch3: [] });

  const [waveform, setWaveform] = useState<WaveformState>({
    ch1Data: generateSine(NOMINAL_CURRENT * 0.7, 8, 0, TOTAL_POINTS),
    ch2Data: generateNoise(0.5, TOTAL_POINTS),
    ch3Data: generateNoise(2, TOTAL_POINTS),
    timeLabels: Array.from({ length: 26 }, (_, i) => `T+${i * 50}ms`),
    isRecording: false,
    isFrozen: false,
    escapeMarkerMs: null,
  });

  const [singleLine, setSingleLine] = useState<SingleLineState>({
    qf1Current: [125.3, 123.7, 121.9],
    qf2Current: [124.8, 123.1, 122.0],
    qf3Current: [3182, 3087, 3095],
    tr1Temp: 68.2,
    tr1Load: 72.4,
    tr1Power: 1152,
    podPowers: [73.2, 73.1, 73.0, 72.7],
    podPFs: [0.996, 0.995, 0.996, 0.995],
  });

  // Normal operation waveform update
  useEffect(() => {
    if (phase !== 'idle') return;
    const interval = setInterval(() => {
      setWaveform(prev => ({
        ...prev,
        ch1Data: generateSine(NOMINAL_CURRENT * 0.7, 8, performance.now() * 0.001, TOTAL_POINTS),
        ch2Data: generateNoise(0.5, TOTAL_POINTS),
        ch3Data: generateNoise(2, TOTAL_POINTS),
      }));
    }, 100);
    return () => clearInterval(interval);
  }, [phase]);

  // Single-line parameter fluctuation in normal mode
  useEffect(() => {
    if (phase !== 'idle' && phase !== 'complete') return;
    const interval = setInterval(() => {
      setSingleLine((prev: SingleLineState): SingleLineState => ({
        ...prev,
        qf1Current: prev.qf1Current.map(v => Math.round((v + (Math.random() - 0.5) * 0.4) * 10) / 10) as [number, number, number],
        qf3Current: prev.qf3Current.map(v => Math.round(v + (Math.random() - 0.5) * 3)) as [number, number, number],
        tr1Load: Math.round((prev.tr1Load + (Math.random() - 0.5) * 0.3) * 10) / 10,
        podPowers: prev.podPowers.map(v => Math.round((v + (Math.random() - 0.5) * 0.2) * 10) / 10),
      }));
    }, 800);
    return () => clearInterval(interval);
  }, [phase]);

  const startEscape = useCallback(() => {
    setPhase('confirming');
  }, []);

  const confirmEscape = useCallback(() => {
    setPhase('phase1');
    setProgress(0);
    setElapsedMs(0);
    startTimeRef.current = performance.now();
    recordedDataRef.current = { ch1: [], ch2: [], ch3: [] };

    // Initial overload jump
    setWaveform(prev => ({
      ...prev,
      ch1Data: generateSine(OVERLOAD_CURRENT * 0.7, 8, 0, TOTAL_POINTS),
      ch2Data: new Array(TOTAL_POINTS).fill(0),
      ch3Data: new Array(TOTAL_POINTS).fill(0),
      isRecording: true,
      isFrozen: false,
      escapeMarkerMs: null,
    }));

    setSingleLine(prev => ({
      ...prev,
      qf1Current: [187.2, 186.8, 186.5],
      qf2Current: [186.9, 186.3, 185.8],
      qf3Current: [3463, 3458, 3451],
      tr1Load: 95.8,
      tr1Power: 1533,
    }));

    intervalRef.current = setInterval(() => {
      const now = performance.now();
      const elapsed = Math.min(now - startTimeRef.current, ESCAPE_DURATION);
      setElapsedMs(elapsed);
      setProgress(elapsed);

      // Phase transitions
      if (elapsed < 200) {
        setPhase('phase1');
      } else if (elapsed < 400) {
        setPhase('phase2');
      } else if (elapsed < ESCAPE_DURATION) {
        setPhase('phase3');
      } else {
        setPhase('complete');
        if (intervalRef.current) clearInterval(intervalRef.current);

        // Final state
        setWaveform(prev => ({
          ...prev,
          ch1Data: generateSine(NOMINAL_CURRENT * 0.7, 8, 0, TOTAL_POINTS),
          ch2Data: new Array(TOTAL_POINTS).fill(0),
          ch3Data: new Array(TOTAL_POINTS).fill(0),
          isRecording: false,
          isFrozen: true,
          escapeMarkerMs: ESCAPE_DURATION,
        }));

        setSingleLine(prev => ({
          ...prev,
          qf1Current: [124.6, 124.2, 123.8],
          qf2Current: [124.3, 123.9, 123.5],
          qf3Current: [945, 938, 932],
          tr1Load: 21.5,
          tr1Power: 344,
          podPowers: [0, 0, 0, 0],
        }));
        return;
      }

      // Waveform evolution during escape
      setWaveform(prev => {
        let ch1Amp: number;
        let ch2Val: number;
        let ch3Val: number;

        if (elapsed < 200) {
          // Phase 1: overload, no data transfer
          ch1Amp = OVERLOAD_CURRENT * 0.7;
          ch2Val = 0;
          ch3Val = 0;
        } else if (elapsed < 400) {
          // Phase 2: overload, data transfer ramping
          const ramp = (elapsed - 200) / 200;
          ch1Amp = OVERLOAD_CURRENT * 0.7;
          ch2Val = ramp * 32.8;
          ch3Val = ramp * 142.7;
        } else {
          // Phase 3: current declining, data transfer stable
          const declineRatio = Math.max(0, (ESCAPE_DURATION - elapsed) / (ESCAPE_DURATION - 400));
          const currentAmp = (NOMINAL_CURRENT + (OVERLOAD_CURRENT - NOMINAL_CURRENT) * declineRatio) * 0.7;
          ch1Amp = currentAmp;
          ch2Val = 32.8;
          ch3Val = 142.7;
        }

        return {
          ...prev,
          ch1Data: generateSine(ch1Amp, 8, elapsed * 0.005, TOTAL_POINTS),
          ch2Data: elapsed < 200
            ? new Array(TOTAL_POINTS).fill(0)
            : generateNoise(1, TOTAL_POINTS).map(v => v + ch2Val),
          ch3Data: elapsed < 200
            ? new Array(TOTAL_POINTS).fill(0)
            : generateNoise(5, TOTAL_POINTS).map(v => v + ch3Val),
        };
      });

      // Single-line parameter evolution
      if (elapsed >= 200 && elapsed < ESCAPE_DURATION) {
        const shedRatio = (elapsed - 200) / (ESCAPE_DURATION - 200);
        const qf3Decline = 3463 - (3463 - 945) * shedRatio;
        const loadDecline = 95.8 - (95.8 - 21.5) * shedRatio;
        const powerDecline = 1533 - (1533 - 344) * shedRatio;

        setSingleLine(prev => ({
          ...prev,
          qf3Current: [Math.round(qf3Decline), Math.round(qf3Decline * 0.998), Math.round(qf3Decline * 0.997)] as [number, number, number],
          tr1Load: Math.round(loadDecline * 10) / 10,
          tr1Power: Math.round(powerDecline),
          podPowers: elapsed > 300
            ? prev.podPowers.map((_, i) => Math.max(0, 73 * (1 - (elapsed - 300 - i * 30) / 600)))
            : prev.podPowers,
        }));
      }
    }, 16); // ~60fps
  }, []);

  const cancelEscape = useCallback(() => {
    setPhase('idle');
  }, []);

  const resetEscape = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase('idle');
    setProgress(0);
    setElapsedMs(0);
    setPlayback(false);
    setWaveform(prev => ({
      ...prev,
      ch1Data: generateSine(NOMINAL_CURRENT * 0.7, 8, 0, TOTAL_POINTS),
      ch2Data: generateNoise(0.5, TOTAL_POINTS),
      ch3Data: generateNoise(2, TOTAL_POINTS),
      isRecording: false,
      isFrozen: false,
      escapeMarkerMs: null,
    }));
    setSingleLine({
      qf1Current: [125.3, 123.7, 121.9],
      qf2Current: [124.8, 123.1, 122.0],
      qf3Current: [3182, 3087, 3095],
      tr1Temp: 68.2,
      tr1Load: 72.4,
      tr1Power: 1152,
      podPowers: [73.2, 73.1, 73.0, 72.7],
      podPFs: [0.996, 0.995, 0.996, 0.995],
    });
  }, []);

  const togglePlayback = useCallback(() => {
    if (phase === 'complete') {
      setPlayback(prev => !prev);
    }
  }, [phase]);

  // Playback effect
  useEffect(() => {
    if (!playback || phase !== 'complete') return;
    let playProgress = 0;
    const interval = setInterval(() => {
      playProgress += 20;
      if (playProgress >= ESCAPE_DURATION) {
        setPlayback(false);
        clearInterval(interval);
        return;
      }
      setElapsedMs(playProgress);
      setProgress(playProgress);
    }, 20);
    return () => clearInterval(interval);
  }, [playback, phase]);

  return {
    phase,
    progress,
    elapsedMs,
    waveform,
    singleLine,
    startEscape,
    confirmEscape,
    cancelEscape,
    resetEscape,
    playback,
    togglePlayback,
  };
}
