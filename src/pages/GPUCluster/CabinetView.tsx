import { useState } from 'react';
import type { GPUUnit, GPUStatus } from './useGPUData';

interface Props {
  gpus: GPUUnit[];
  onGPUClick: (gpu: GPUUnit) => void;
}

const NODE_POSITIONS = [
  { id: 1, uStart: 36, label: 'NODE 01 (U39-U36)' },
  { id: 2, uStart: 29, label: 'NODE 02 (U32-U29)' },
  { id: 3, uStart: 22, label: 'NODE 03 (U25-U22)' },
  { id: 4, uStart: 15, label: 'NODE 04 (U18-U15)' },
  { id: 5, uStart: 8,  label: 'NODE 05 (U11-U8)'  },
];

const GPU_WIDTH = 48;
const GPU_HEIGHT = 72;
const GPU_GAP = 8;
const CABINET_LEFT = 60;

function getStatusColor(status: GPUStatus): string {
  switch (status) {
    case 'OK': return '#00aaff';
    case 'HIGH': return '#ffcc00';
    case 'FAULT': return '#ff3333';
    case 'PAUSED': return '#ffcc00';
    default: return '#00aaff';
  }
}

function getStatusBg(status: GPUStatus): string {
  switch (status) {
    case 'OK': return 'transparent';
    case 'HIGH': return '#ffcc0030';
    case 'FAULT': return '#ff333330';
    case 'PAUSED': return '#ffcc0020';
    default: return 'transparent';
  }
}

function getPriorityBorder(priority?: string): string {
  switch (priority) {
    case 'high': return '#ffffff';
    case 'medium': return '#8ac8e8';
    case 'low': return '#005588';
    default: return '#3a506b';
  }
}

export function CabinetView({ gpus, onGPUClick }: Props) {
  const [hoveredGPU, setHoveredGPU] = useState<string | null>(null);

  // Build SVG view
  const cabinetWidth = 520;
  const cabinetHeight = 880;
  const topMargin = 30;
  const uHeight = (cabinetHeight - topMargin - 40) / 42;

  return (
    <div style={{
      flex: 1, height: '100%', backgroundColor: '#0a0a0a',
      overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
      padding: '10px',
    }}>
      <svg
        viewBox={`0 0 ${cabinetWidth} ${cabinetHeight}`}
        style={{ width: '100%', maxWidth: '600px', height: 'auto', maxHeight: '100%' }}
        fontFamily="Consolas, monospace"
      >
        {/* Cabinet outer frame */}
        <rect x={CABINET_LEFT} y={topMargin} width={400} height={cabinetHeight - topMargin - 10}
          fill="none" stroke="#3a506b" strokeWidth={2} />
        {/* Inner frame */}
        <rect x={CABINET_LEFT + 4} y={topMargin + 4} width={392} height={cabinetHeight - topMargin - 18}
          fill="none" stroke="#2a2a3e" strokeWidth={1} />

        {/* U刻度（从下往上，U1在底部） */}
        {Array.from({ length: 42 }, (_, i) => {
          const uNum = i + 1;
          const y = cabinetHeight - 20 - (i + 1) * uHeight;
          const isMajor = uNum % 5 === 0 || uNum === 1 || uNum === 42;
          return (
            <g key={uNum}>
              <line x1={CABINET_LEFT - (isMajor ? 18 : 10)} y1={y} x2={CABINET_LEFT} y2={y}
                stroke="#3a506b" strokeWidth={isMajor ? 1 : 0.5} />
              {isMajor && (
                <text x={CABINET_LEFT - 22} y={y + 3} textAnchor="end"
                  fill="#5a5a6a" fontSize={isMajor ? 8 : 6} fontFamily="Consolas,monospace">
                  U{uNum}
                </text>
              )}
            </g>
          );
        })}

        {/* 5 Nodes */}
        {NODE_POSITIONS.map((node) => {
          const nodeGPUs = gpus.filter(g => g.nodeId === node.id);
          const nodeBottomY = cabinetHeight - 20 - node.uStart * uHeight;
          const nodeTopY = nodeBottomY - 4 * uHeight;
          const nodeHeight = nodeTopY - nodeBottomY;
          const nodeCenterY = (nodeTopY + nodeBottomY) / 2;

          return (
            <g key={node.id}>
              {/* Node label on the right */}
              <text x={CABINET_LEFT + 410} y={nodeCenterY + 4}
                fill="#5a5a6a" fontSize={10} fontFamily="Consolas,monospace">
                {node.label}
              </text>
              <line x1={CABINET_LEFT + 400} y1={nodeCenterY} x2={CABINET_LEFT + 408} y2={nodeCenterY}
                stroke="#3a506b" strokeWidth={0.5} />

              {/* Node frame */}
              <rect x={CABINET_LEFT + 12} y={nodeTopY} width={376} height={-nodeHeight}
                fill="none" stroke="#2a2a3e" strokeWidth={1} rx={0} />

              {/* Supply manifold (left side) */}
              <rect x={CABINET_LEFT + 16} y={nodeTopY + 4} width={6} height={-nodeHeight - 8}
                fill="none" stroke="#00aaff" strokeWidth={1} opacity={0.6} />
              {/* Return manifold (right side) */}
              <rect x={CABINET_LEFT + 378} y={nodeTopY + 4} width={6} height={-nodeHeight - 8}
                fill="none" stroke="#00aaff" strokeWidth={1} opacity={0.6} />

              {/* 8 GPUs per node */}
              {nodeGPUs.map((gpu, gi) => {
                const gx = CABINET_LEFT + 30 + gi * (GPU_WIDTH + GPU_GAP);
                const gy = nodeTopY - 10;
                const color = getStatusColor(gpu.status);
                const bg = getStatusBg(gpu.status);
                const borderColor = getPriorityBorder(gpu.task?.priority);
                const isHovered = hoveredGPU === gpu.id;
                const isPaused = gpu.status === 'PAUSED';

                return (
                  <g key={gpu.id}
                    onMouseEnter={() => setHoveredGPU(gpu.id)}
                    onMouseLeave={() => setHoveredGPU(null)}
                    onClick={() => onGPUClick(gpu)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* GPU box */}
                    <rect x={gx} y={gy} width={GPU_WIDTH} height={GPU_HEIGHT}
                      fill={isHovered ? `${color}40` : bg}
                      stroke={isHovered ? color : borderColor}
                      strokeWidth={isHovered ? 2 : 1} />

                    {/* Coolant inlet line from supply manifold */}
                    <line x1={CABINET_LEFT + 22} y1={gy + GPU_HEIGHT / 2}
                      x2={gx} y2={gy + GPU_HEIGHT / 2}
                      stroke="#00aaff" strokeWidth={1} opacity={0.5} />
                    {/* Coolant outlet line to return manifold */}
                    <line x1={gx + GPU_WIDTH} y1={gy + GPU_HEIGHT / 2}
                      x2={CABINET_LEFT + 378} y2={gy + GPU_HEIGHT / 2}
                      stroke="#00aaff" strokeWidth={1} opacity={0.5} />

                    {/* Center cross */}
                    <g opacity={isPaused ? 0.5 : 1}>
                      <line x1={gx + GPU_WIDTH / 2 - 8} y1={gy + GPU_HEIGHT / 2}
                        x2={gx + GPU_WIDTH / 2 + 8} y2={gy + GPU_HEIGHT / 2}
                        stroke={color} strokeWidth={1.5} />
                      <line x1={gx + GPU_WIDTH / 2} y1={gy + GPU_HEIGHT / 2 - 8}
                        x2={gx + GPU_WIDTH / 2} y2={gy + GPU_HEIGHT / 2 + 8}
                        stroke={color} strokeWidth={1.5} />
                    </g>

                    {/* GPU label */}
                    <text x={gx + GPU_WIDTH / 2} y={gy + GPU_HEIGHT + 14}
                      textAnchor="middle" fill="#5a5a6a" fontSize={8} fontFamily="Consolas,monospace">
                      GPU0{gpu.gpuIndex}
                    </text>

                    {/* Temperature on top */}
                    <text x={gx + GPU_WIDTH / 2} y={gy - 4}
                      textAnchor="middle" fill={color} fontSize={8} fontFamily="Consolas,monospace" fontWeight={600}>
                      {gpu.temperature.toFixed(0)}&deg;
                    </text>

                    {/* Status overlay for PAUSED */}
                    {isPaused && (
                      <text x={gx + GPU_WIDTH / 2} y={gy + GPU_HEIGHT / 2 + 4}
                        textAnchor="middle" fill="#ffcc00" fontSize={7} fontFamily="Consolas,monospace" fontWeight={700}>
                        PAUSED
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Bottom CDU area (U1-U6) */}
        <g>
          <rect x={CABINET_LEFT + 12} y={cabinetHeight - 20 - 6 * uHeight} width={376} height={6 * uHeight - 10}
            fill="none" stroke="#2a2a3e" strokeWidth={1} strokeDasharray="4,2" />
          <text x={CABINET_LEFT + 200} y={cabinetHeight - 30}
            textAnchor="middle" fill="#3a506b" fontSize={9} fontFamily="Consolas,monospace">
            CDU / PUMP / POWER (U1-U6)
          </text>
          {/* Mini CDU icons */}
          {[0, 1, 2, 3, 4].map(i => (
            <circle key={i} cx={CABINET_LEFT + 60 + i * 50} cy={cabinetHeight - 55} r={12}
              fill="none" stroke="#3a506b" strokeWidth={1} />
          ))}
        </g>
      </svg>
    </div>
  );
}
