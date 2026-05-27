import { useRef, useEffect, useCallback } from 'react';
import * as echarts from 'echarts';
import type { EscapePhase } from './useEscapeEngine';

interface Props {
  ch1Data: number[];
  ch2Data: number[];
  ch3Data: number[];
  phase: EscapePhase;
  elapsedMs: number;
  isFrozen?: boolean;
  escapeMarkerMs: number | null;
}

export function WaveformPanel({ ch1Data, ch2Data, ch3Data, phase, elapsedMs, escapeMarkerMs }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  const buildOption = useCallback((): echarts.EChartsOption => {
    const markLineData: echarts.MarkLineComponentOption['data'] = [];
    if (escapeMarkerMs !== null) {
      markLineData.push({
        xAxis: (escapeMarkerMs / 1230) * 100 + '%',
        label: { formatter: 'ESCAPE\nCOMPLETE', color: '#ff3333', fontSize: 9, fontFamily: 'Consolas' },
        lineStyle: { color: '#ff3333', type: 'solid', width: 2 },
      });
    }
    if (phase === 'phase1' || phase === 'phase2' || phase === 'phase3') {
      markLineData.push({
        xAxis: (elapsedMs / 1230) * 100 + '%',
        label: { show: false },
        lineStyle: { color: '#ffcc00', type: 'dashed', width: 1 },
      });
    }

    return {
      backgroundColor: 'transparent',
      animation: false,
      grid: [
        { left: '60', right: '20', top: '40', height: '28%' },
        { left: '60', right: '20', top: '41%', height: '28%' },
        { left: '60', right: '20', top: '73%', height: '22%' },
      ],
      xAxis: [
        {
          type: 'category', gridIndex: 0, show: true,
          data: Array.from({ length: ch1Data.length }, (_, i) => i),
          axisLine: { lineStyle: { color: '#3a506b', width: 1 } },
          axisTick: { show: false },
          axisLabel: { show: false },
          splitLine: { show: true, lineStyle: { color: '#1a1a2e', width: 1 } },
        },
        {
          type: 'category', gridIndex: 1, show: true,
          data: Array.from({ length: ch2Data.length }, (_, i) => i),
          axisLine: { lineStyle: { color: '#3a506b', width: 1 } },
          axisTick: { show: false },
          axisLabel: { show: false },
          splitLine: { show: true, lineStyle: { color: '#1a1a2e', width: 1 } },
        },
        {
          type: 'category', gridIndex: 2, show: true,
          data: Array.from({ length: ch3Data.length }, (_, i) => i),
          axisLine: { lineStyle: { color: '#3a506b', width: 1 } },
          axisTick: { show: false },
          axisLabel: {
            show: true, color: '#5a5a6a', fontSize: 8, fontFamily: 'Consolas',
            interval: 19,
            formatter: (v: string) => `T+${(Number(v) / 500 * 1230).toFixed(0)}ms`,
          },
          splitLine: { show: true, lineStyle: { color: '#1a1a2e', width: 1 } },
        },
      ],
      yAxis: [
        {
          gridIndex: 0, type: 'value', min: -600, max: 600,
          axisLine: { show: false }, axisTick: { show: false },
          axisLabel: { color: '#5a5a6a', fontSize: 8, fontFamily: 'Consolas' },
          splitLine: { show: true, lineStyle: { color: '#1a1a2e', width: 1 } },
        },
        {
          gridIndex: 1, type: 'value', min: -40, max: 40,
          axisLine: { show: false }, axisTick: { show: false },
          axisLabel: { color: '#5a5a6a', fontSize: 8, fontFamily: 'Consolas' },
          splitLine: { show: true, lineStyle: { color: '#1a1a2e', width: 1 } },
        },
        {
          gridIndex: 2, type: 'value', min: -80, max: 80,
          axisLine: { show: false }, axisTick: { show: false },
          axisLabel: { color: '#5a5a6a', fontSize: 8, fontFamily: 'Consolas' },
          splitLine: { show: true, lineStyle: { color: '#1a1a2e', width: 1 } },
        },
      ],
      series: [
        {
          name: 'CH1', type: 'line', xAxisIndex: 0, yAxisIndex: 0,
          data: ch1Data, showSymbol: false, lineStyle: { color: '#ff3333', width: 1 },
          markLine: { data: markLineData, symbol: 'none', animation: false },
        },
        {
          name: 'CH2', type: 'line', xAxisIndex: 1, yAxisIndex: 1,
          data: ch2Data, showSymbol: false, lineStyle: { color: '#00ff66', width: 1 },
        },
        {
          name: 'CH3', type: 'line', xAxisIndex: 2, yAxisIndex: 2,
          data: ch3Data, showSymbol: false, lineStyle: { color: '#ffffff', width: 1 },
        },
      ],
    };
  }, [ch1Data, ch2Data, ch3Data, phase, elapsedMs, escapeMarkerMs]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current, undefined, { renderer: 'canvas' });
    }
    chartRef.current.setOption(buildOption(), true);
  }, [buildOption]);

  useEffect(() => {
    const handleResize = () => chartRef.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 12px', borderBottom: '1px solid #1a1a2e',
      }}>
        <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: 700, fontFamily: 'Consolas,monospace', letterSpacing: '0.06em' }}>
          MULTI-CHANNEL REAL-TIME WAVEFORM
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#5a5a6a', fontSize: '9px', fontFamily: 'Consolas,monospace' }}>TIME SCALE</span>
          <span style={{
            color: '#00aaff', fontSize: '9px', fontFamily: 'Consolas,monospace',
            border: '1px solid #3a506b', padding: '2px 8px',
          }}>50ms/div</span>
        </div>
      </div>

      {/* Channel labels */}
      <div style={{ position: 'relative', flex: 1 }}>
        <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

        {/* CH1 Label */}
        <div style={{ position: 'absolute', left: '8px', top: '8px', zIndex: 2 }}>
          <div style={{ color: '#ff3333', fontSize: '9px', fontFamily: 'Consolas,monospace', fontWeight: 600 }}>
            CH1: GRID LOAD CURRENT (A)
          </div>
          <div style={{ color: '#5a5a6a', fontSize: '8px', fontFamily: 'Consolas,monospace' }}>
            Scale: 200A/div Offset: 0A
          </div>
        </div>
        <div style={{ position: 'absolute', right: '12px', top: '8px', zIndex: 2 }}>
          <span style={{ color: '#ff3333', fontSize: '10px', fontFamily: 'Consolas,monospace', fontWeight: 600 }}>
            RMS 124.6 A
          </span>
        </div>

        {/* CH2 Label */}
        <div style={{ position: 'absolute', left: '8px', top: '39%', zIndex: 2 }}>
          <div style={{ color: '#00ff66', fontSize: '9px', fontFamily: 'Consolas,monospace', fontWeight: 600 }}>
            CH2: NVME STORAGE WRITE SPEED (GB/s)
          </div>
          <div style={{ color: '#5a5a6a', fontSize: '8px', fontFamily: 'Consolas,monospace' }}>
            Scale: 10GB/s/div Offset: 0GB/s
          </div>
        </div>
        <div style={{ position: 'absolute', right: '12px', top: '39%', zIndex: 2 }}>
          <span style={{ color: '#00ff66', fontSize: '10px', fontFamily: 'Consolas,monospace', fontWeight: 600 }}>
            INST 32.8 GB/s
          </span>
        </div>

        {/* CH3 Label */}
        <div style={{ position: 'absolute', left: '8px', top: '71%', zIndex: 2 }}>
          <div style={{ color: '#ffffff', fontSize: '9px', fontFamily: 'Consolas,monospace', fontWeight: 600 }}>
            CH3: PCIE 5.0 DATA THROUGHPUT (Gbps)
          </div>
          <div style={{ color: '#5a5a6a', fontSize: '8px', fontFamily: 'Consolas,monospace' }}>
            Scale: 20Gbps/div Offset: 0Gbps
          </div>
        </div>
        <div style={{ position: 'absolute', right: '12px', top: '71%', zIndex: 2 }}>
          <span style={{ color: '#ffffff', fontSize: '10px', fontFamily: 'Consolas,monospace', fontWeight: 600 }}>
            INST 142.7 Gbps
          </span>
        </div>
      </div>
    </div>
  );
}
