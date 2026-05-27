import type { SingleLineState } from './useEscapeEngine';

interface Props {
  state: SingleLineState;
  isEscaping: boolean;
}

function BreakerBox({ x, y, label, currents, power, pf, closed }: {
  x: number; y: number; label: string;
  currents: [number, number, number]; power?: number; pf?: number; closed: boolean;
}) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Breaker symbol */}
      <rect x={-15} y={-20} width={30} height={40} fill="none" stroke="#00aaff" strokeWidth={1} />
      <line x1={-15} y1={0} x2={-5} y2={0} stroke="#00aaff" strokeWidth={1.5} />
      <line x1={5} y1={0} x2={15} y2={0} stroke="#00aaff" strokeWidth={1.5} />
      <line x1={-5} y1={-8} x2={5} y2={8} stroke="#00aaff" strokeWidth={1.5} />
      <text x={0} y={-24} textAnchor="middle" fill="#00aaff" fontSize={9} fontFamily="Consolas,monospace">{label}</text>
      {/* Status */}
      <rect x={20} y={-20} width={50} height={55} fill="none" stroke="#3a506b" strokeWidth={1} />
      <text x={22} y={-10} fill={closed ? '#00ff66' : '#ff3333'} fontSize={8} fontFamily="Consolas,monospace" fontWeight={600}>
        {closed ? 'CLOSE' : 'TRIP'}
      </text>
      <text x={22} y={2} fill="#00aaff" fontSize={8} fontFamily="Consolas,monospace">Ia {currents[0].toFixed(1)} A</text>
      <text x={22} y={12} fill="#00aaff" fontSize={8} fontFamily="Consolas,monospace">Ib {currents[1].toFixed(1)} A</text>
      <text x={22} y={22} fill="#00aaff" fontSize={8} fontFamily="Consolas,monospace">Ic {currents[2].toFixed(1)} A</text>
      {power !== undefined && (
        <text x={22} y={32} fill="#00aaff" fontSize={8} fontFamily="Consolas,monospace">P {power.toFixed(3)} MW</text>
      )}
      {pf !== undefined && (
        <text x={22} y={42} fill="#00aaff" fontSize={8} fontFamily="Consolas,monospace">PF {pf.toFixed(3)}</text>
      )}
    </g>
  );
}

function CT_Symbol({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx={0} cy={0} r={10} fill="none" stroke="#00aaff" strokeWidth={1} />
      <text x={0} y={3} textAnchor="middle" fill="#00aaff" fontSize={8} fontFamily="Consolas,monospace">CT</text>
    </g>
  );
}

function PT_Symbol({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx={0} cy={0} r={10} fill="none" stroke="#00aaff" strokeWidth={1} />
      <text x={0} y={3} textAnchor="middle" fill="#00aaff" fontSize={7} fontFamily="Consolas,monospace">PT1</text>
      <text x={0} y={22} textAnchor="middle" fill="#5a5a6a" fontSize={7} fontFamily="Consolas,monospace">10kV/100V</text>
    </g>
  );
}

export function SingleLineDiagram({ state, isEscaping }: Props) {
  return (
    <svg
      viewBox="0 0 520 600"
      style={{ width: '100%', height: '100%', backgroundColor: '#0a0a0a', fontFamily: 'Consolas,monospace' }}
    >
      <defs>
        <marker id="arr-blue" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0,0 6,2 0,4" fill="#00aaff" />
        </marker>
      </defs>

      {/* Title */}
      <text x={10} y={18} fill="#ffffff" fontSize={11} fontWeight={700} fontFamily="inherit" letterSpacing="0.06em">
        POWER GRID SINGLE-LINE DIAGRAM
      </text>

      {/* Legend */}
      <g transform="translate(300, 6)">
        <line x1={0} y1={5} x2={20} y2={5} stroke="#00aaff" strokeWidth={2} />
        <text x={26} y={9} fill="#5a5a6a" fontSize={8} fontFamily="inherit">10kV AC BUS</text>
        <line x1={100} y1={5} x2={120} y2={5} stroke="#00aaff" strokeWidth={1.5} strokeDasharray="4,2" />
        <text x={126} y={9} fill="#5a5a6a" fontSize={8} fontFamily="inherit">0.4kV AC BUS</text>
        <line x1={200} y1={5} x2={220} y2={5} stroke="#5a5a6a" strokeWidth={1} strokeDasharray="2,2" />
        <text x={226} y={9} fill="#5a5a6a" fontSize={8} fontFamily="inherit">CONTROL/COMMS</text>
      </g>

      {/* === 10kV INCOMING === */}
      <text x={10} y={60} fill="#00aaff" fontSize={9} fontFamily="inherit">10kV</text>
      <text x={10} y={72} fill="#00aaff" fontSize={9} fontFamily="inherit">INCOMING</text>

      {/* Utility Grid */}
      <g transform="translate(180, 50)">
        <circle cx={0} cy={0} r={15} fill="none" stroke="#00aaff" strokeWidth={1} />
        <path d="M -8,0 Q 0,-12 8,0 Q 0,12 -8,0" fill="none" stroke="#00aaff" strokeWidth={1} />
        <text x={0} y={-20} textAnchor="middle" fill="#00aaff" fontSize={8} fontFamily="inherit">UTILITY GRID</text>
        <text x={0} y={26} textAnchor="middle" fill="#5a5a6a" fontSize={7} fontFamily="inherit">10kV / 50Hz</text>
      </g>

      {/* 10kV bus */}
      <line x1={180} y1={100} x2={180} y2={120} stroke="#00aaff" strokeWidth={2} />
      <line x1={60} y1={120} x2={350} y2={120} stroke="#00aaff" strokeWidth={2} />

      {/* QF1 */}
      <BreakerBox x={180} y={150} label="QF1" currents={state.qf1Current} power={2.179} pf={0.995} closed={true} />

      {/* === 10kV SWITCHGEAR === */}
      <text x={10} y={145} fill="#00aaff" fontSize={9} fontFamily="inherit">10kV</text>
      <text x={10} y={157} fill="#00aaff" fontSize={9} fontFamily="inherit">SWITCHGEAR</text>

      <line x1={180} y1={195} x2={180} y2={220} stroke="#00aaff" strokeWidth={2} />

      {/* CT1, CT2, PT1 */}
      <g transform="translate(60, 210)">
        <CT_Symbol x={0} y={0} />
        <text x={14} y={3} fill="#5a5a6a" fontSize={7} fontFamily="inherit">1250/5A</text>
        <text x={0} y={-14} textAnchor="middle" fill="#00aaff" fontSize={8} fontFamily="inherit">CT1</text>
      </g>
      <g transform="translate(220, 210)">
        <CT_Symbol x={0} y={0} />
        <text x={14} y={3} fill="#5a5a6a" fontSize={7} fontFamily="inherit">1250/5A</text>
        <text x={0} y={-14} textAnchor="middle" fill="#00aaff" fontSize={8} fontFamily="inherit">CT2</text>
      </g>
      <g transform="translate(320, 210)">
        <PT_Symbol x={0} y={0} />
      </g>

      {/* M1 meter */}
      <g transform="translate(120, 200)">
        <rect x={0} y={0} width={60} height={50} fill="none" stroke="#3a506b" strokeWidth={1} />
        <text x={4} y={12} fill="#00aaff" fontSize={8} fontFamily="inherit">M1</text>
        <text x={4} y={23} fill="#00aaff" fontSize={8} fontFamily="inherit">P 2.179 MW</text>
        <text x={4} y={33} fill="#00aaff" fontSize={8} fontFamily="inherit">Q -0.213 MVAr</text>
        <text x={4} y={43} fill="#00aaff" fontSize={8} fontFamily="inherit">PF 0.995</text>
      </g>

      <line x1={180} y1={230} x2={180} y2={280} stroke="#00aaff" strokeWidth={2} />

      {/* QF2 */}
      <BreakerBox x={180} y={310} label="QF2" currents={state.qf2Current} closed={true} />

      {/* === TRANSFORMER === */}
      <text x={10} y={285} fill="#00aaff" fontSize={9} fontFamily="inherit">10kV / 0.4kV</text>
      <text x={10} y={297} fill="#00aaff" fontSize={9} fontFamily="inherit">TRANSFORMER</text>

      <g transform="translate(180, 370)">
        {/* Transformer symbol - two overlapping circles */}
        <circle cx={-12} cy={0} r={22} fill="none" stroke="#00aaff" strokeWidth={1.5} />
        <circle cx={12} cy={0} r={22} fill="none" stroke="#00aaff" strokeWidth={1.5} />
        {/* Winding lines */}
        <path d="M -18,-10 Q -12,-5 -6,-10 M -18,0 Q -12,5 -6,0 M -18,10 Q -12,15 -6,10" fill="none" stroke="#00aaff" strokeWidth={0.8} />
        <path d="M 6,-10 Q 12,-5 18,-10 M 6,0 Q 12,5 18,0 M 6,10 Q 12,15 18,10" fill="none" stroke="#00aaff" strokeWidth={0.8} />
        {/* Labels */}
        <text x={-12} y={-28} textAnchor="middle" fill="#00aaff" fontSize={8} fontFamily="inherit">TR1</text>
        <text x={-12} y={32} textAnchor="middle" fill="#5a5a6a" fontSize={7} fontFamily="inherit">10kV</text>
        <text x={12} y={32} textAnchor="middle" fill="#5a5a6a" fontSize={7} fontFamily="inherit">0.4kV</text>
        <text x={0} y={42} textAnchor="middle" fill="#00aaff" fontSize={8} fontFamily="inherit" fontWeight={600}>1600kVA</text>
        <text x={0} y={52} textAnchor="middle" fill="#5a5a6a" fontSize={7} fontFamily="inherit">Dyn11</text>
      </g>

      {/* Transformer data box */}
      <g transform="translate(260, 350)">
        <rect x={0} y={0} width={70} height={55} fill="none" stroke="#3a506b" strokeWidth={1} />
        <text x={4} y={12} fill="#00aaff" fontSize={8} fontFamily="inherit">TEMP {state.tr1Temp.toFixed(1)} °C</text>
        <text x={4} y={23} fill="#00aaff" fontSize={8} fontFamily="inherit">LOAD {state.tr1Load.toFixed(1)} %</text>
        <text x={4} y={34} fill="#00aaff" fontSize={8} fontFamily="inherit">P {state.tr1Power.toFixed(3)} MW</text>
        <text x={4} y={45} fill="#00aaff" fontSize={8} fontFamily="inherit">Q -0.198 MVAr</text>
      </g>

      <line x1={180} y1={425} x2={180} y2={450} stroke="#00aaff" strokeWidth={1.5} strokeDasharray="4,2" />

      {/* QF3 */}
      <BreakerBox x={180} y={480} label="QF3" currents={state.qf3Current.map((v: number) => v / 10) as [number, number, number]} closed={true} />

      {/* === 0.4kV DISTRIBUTION === */}
      <text x={10} y={470} fill="#00aaff" fontSize={9} fontFamily="inherit">0.4kV</text>
      <text x={10} y={482} fill="#00aaff" fontSize={9} fontFamily="inherit">DISTRIBUTION</text>

      {/* 0.4kV bus */}
      <line x1={180} y1={520} x2={180} y2={540} stroke="#00aaff" strokeWidth={1.5} strokeDasharray="4,2" />
      <line x1={60} y1={540} x2={420} y2={540} stroke="#00aaff" strokeWidth={1.5} strokeDasharray="4,2" />

      {/* === HPC PODS === */}
      <text x={10} y={555} fill="#00aaff" fontSize={9} fontFamily="inherit">COMPUTE LOAD</text>
      <text x={10} y={567} fill="#5a5a6a" fontSize={8} fontFamily="inherit">(HPC PODS)</text>

      {state.podPowers.map((power: number, i: number) => {
        const x = 80 + i * 95;
        const isActive = power > 1;
        return (
          <g key={i} transform={`translate(${x}, 560)`}>
            {/* Drop line */}
            <line x1={0} y1={-20} x2={0} y2={0} stroke="#00aaff" strokeWidth={1} />
            {/* Breaker */}
            <rect x={-8} y={0} width={16} height={20} fill="none" stroke={isActive ? '#00aaff' : '#ffcc00'} strokeWidth={1} />
            <line x1={-8} y1={10} x2={-2} y2={10} stroke={isActive ? '#00aaff' : '#ffcc00'} strokeWidth={1} />
            <line x1={2} y1={10} x2={8} y2={10} stroke={isActive ? '#00aaff' : '#ffcc00'} strokeWidth={1} />
            {/* Data box */}
            <rect x={-30} y={28} width={60} height={45} fill="none" stroke="#3a506b" strokeWidth={1} />
            <text x={-26} y={40} fill={isActive ? '#00ff66' : '#ffcc00'} fontSize={7} fontFamily="inherit" fontWeight={600}>
              {isActive ? 'CLOSE' : 'PAUSED'}
            </text>
            <text x={-26} y={50} fill="#00aaff" fontSize={7} fontFamily="inherit">P {power.toFixed(1)} kW</text>
            <text x={-26} y={60} fill="#00aaff" fontSize={7} fontFamily="inherit">PF {state.podPFs[i].toFixed(3)}</text>
            {/* POD label */}
            <text x={0} y={85} textAnchor="middle" fill="#5a5a6a" fontSize={8} fontFamily="inherit">HPC POD 0{i + 1}</text>
          </g>
        );
      })}

      {/* ... indicator for more pods */}
      {state.podPowers.length >= 4 && (
        <text x={465} y={565} fill="#5a5a6a" fontSize={10} fontFamily="inherit">...</text>
      )}

      {/* Escape overlay - flash effect */}
      {isEscaping && (
        <rect x={0} y={0} width={520} height={600} fill="rgba(255,51,51,0.03)" style={{ pointerEvents: 'none' }}>
          <animate attributeName="opacity" values="0.03;0.06;0.03" dur="0.5s" repeatCount="indefinite" />
        </rect>
      )}
    </svg>
  );
}
