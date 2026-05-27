import type { SensorData, ValveState, Equipment } from '@/types/pnid';

interface PnIDDiagramProps {
  sensors: SensorData[];
  valves: ValveState[];
  equipment: Equipment[];
  hoveredPipe: string | null;
  onPipeHover: (pipeId: string | null) => void;
  onEquipmentClick: (eq: Equipment) => void;
  onValveClick: (valve: ValveState) => void;
  selectedEquipment: string | null;
}

function SensorSymbol({ s, onHover }: { s: SensorData; onHover?: (id: string | null) => void }) {
  const r = s.type === 'FIC' ? 14 : s.type === 'LI' ? 10 : 10;
  const labelLines = s.label.length > 2 ? [s.label.slice(0, 2), s.label.slice(2)] : [s.label];

  return (
    <g
      transform={`translate(${s.x},${s.y})`}
      onMouseEnter={() => onHover?.(s.id)}
      onMouseLeave={() => onHover?.(null)}
      style={{ cursor: 'default' }}
    >
      <circle cx={0} cy={0} r={r} fill="none" stroke="#00aaff" strokeWidth={1} />
      <text
        x={0} y={labelLines.length > 1 ? -2 : 1}
        textAnchor="middle"
        fill="#00aaff"
        fontSize={s.type === 'FIC' ? 7 : 8}
        fontFamily="Consolas,monospace"
      >
        {labelLines[0]}
      </text>
      {labelLines[1] && (
        <text x={0} y={7} textAnchor="middle" fill="#00aaff" fontSize={7} fontFamily="Consolas,monospace">
          {labelLines[1]}
        </text>
      )}
      {/* Value label below */}
      <text x={0} y={r + 12} textAnchor="middle" fill="#ffffff" fontSize={9} fontFamily="Consolas,monospace">
        {s.value} {s.unit}
      </text>
    </g>
  );
}

function ValveSymbol({
  v,
  onClick,
}: {
  v: ValveState;
  onClick: () => void;
}) {
  return (
    <g
      transform={`translate(${v.x},${v.y})`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Motor actuator */}
      <circle cx={0} cy={-22} r={8} fill="none" stroke="#00aaff" strokeWidth={1} />
      <text x={0} y={-19} textAnchor="middle" fill="#00aaff" fontSize={8} fontFamily="Consolas,monospace">
        M
      </text>
      {/* Stem */}
      <line x1={0} y1={-14} x2={0} y2={-12} stroke="#00aaff" strokeWidth={1} />
      {/* Actuator body */}
      <rect x={-8} y={-12} width={16} height={8} fill="none" stroke="#00aaff" strokeWidth={1} />
      {/* Valve body - diamond */}
      <polygon points="0,-10 -10,0 0,10 10,0" fill="none" stroke="#00aaff" strokeWidth={1} />
      {/* Flow path through valve */}
      <line x1={-10} y1={0} x2={10} y2={0} stroke="#00aaff" strokeWidth={1} />
      {/* Label */}
      <text x={0} y={24} textAnchor="middle" fill="#00aaff" fontSize={9} fontFamily="Consolas,monospace" fontWeight={600}>
        {v.name}
      </text>
    </g>
  );
}

export function PnIDDiagram({
  sensors,
  valves,
  equipment,
  hoveredPipe,
  onPipeHover,
  onEquipmentClick,
  onValveClick,
  selectedEquipment,
}: PnIDDiagramProps) {
  const pipeStroke = (pipeId: string, color: string) => ({
    stroke: color,
    strokeWidth: hoveredPipe === pipeId ? 3 : 2,
    opacity: hoveredPipe && hoveredPipe !== pipeId ? 0.4 : 1,
    filter: hoveredPipe === pipeId ? 'drop-shadow(0 0 3px ' + color + ')' : 'none',
  });

  return (
    <svg
      viewBox="0 0 900 560"
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0a0a0a',
        fontFamily: '"Consolas", "Monaco", "Courier New", monospace',
      }}
    >
      <defs>
        <marker id="arrow-blue" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0,0 8,3 0,6" fill="#00aaff" />
        </marker>
        <marker id="arrow-orange" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0,0 8,3 0,6" fill="#ff6b35" />
        </marker>
        <marker id="arrow-blue-rev" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
          <polygon points="8,0 0,3 8,6" fill="#00aaff" />
        </marker>
      </defs>

      {/* === TITLE BLOCK (top-left) === */}
      <g transform="translate(12,12)">
        <rect x={0} y={0} width={165} height={110} fill="none" stroke="#00aaff" strokeWidth={1} opacity={0.6} />
        <text x={8} y={16} fill="#ffffff" fontSize={13} fontWeight={700} fontFamily="inherit">LIQUID COOLING SYSTEM</text>
        <text x={8} y={32} fill="#ffffff" fontSize={13} fontWeight={700} fontFamily="inherit">P&amp;ID</text>
        <line x1={8} y1={38} x2={157} y2={38} stroke="#00aaff" strokeWidth={1} opacity={0.3} />
        {/* Project info table */}
        {[
          ['PROJECT', 'HPC-DCC-01'],
          ['SYSTEM', 'LCW CLOSED LOOP'],
          ['P&amp;ID NO.', 'LCW-1001'],
          ['REV', '2.3'],
          ['DATE', '2024-05-24'],
          ['DESIGN', 'ASME B31.3'],
        ].map(([k, v], i) => (
          <g key={k} transform={`translate(8, ${50 + i * 10})`}>
            <text x={0} y={0} fill="#5a5a6a" fontSize={9} fontFamily="inherit">{k}</text>
            <text x={85} y={0} fill="#00aaff" fontSize={9} fontFamily="inherit">: {v}</text>
          </g>
        ))}
      </g>

      {/* === LEGEND BLOCK === */}
      <g transform="translate(12,128)">
        <rect x={0} y={0} width={165} height={195} fill="none" stroke="#00aaff" strokeWidth={1} opacity={0.4} />
        <text x={8} y={14} fill="#ffffff" fontSize={10} fontWeight={700} fontFamily="inherit" letterSpacing="0.06em">LEGEND</text>
        <line x1={8} y1={18} x2={157} y2={18} stroke="#00aaff" strokeWidth={1} opacity={0.3} />

        {/* Pipe types */}
        <g transform="translate(8,30)">
          <line x1={0} y1={0} x2={24} y2={0} stroke="#00aaff" strokeWidth={2} markerEnd="url(#arrow-blue)" />
          <text x={30} y={3} fill="#00aaff" fontSize={8} fontFamily="inherit">LOW TEMP. SUPPLY (LTWS)</text>
        </g>
        <g transform="translate(8,46)">
          <line x1={0} y1={0} x2={24} y2={0} stroke="#ff6b35" strokeWidth={2} markerEnd="url(#arrow-orange)" />
          <text x={30} y={3} fill="#ff6b35" fontSize={8} fontFamily="inherit">HIGH TEMP. RETURN (HTWR)</text>
        </g>

        {/* Instrument symbols */}
        {[
          ['P', 'PRESSURE TRANSMITTER', 0],
          ['T', 'TEMPERATURE TRANSMITTER', 1],
          ['F', 'FLOW TRANSMITTER', 2],
          ['PC', 'PRESSURE CONTROLLER', 3],
          ['TC', 'TEMPERATURE CONTROLLER', 4],
          ['M', 'ELECTRIC MOTOR', 5],
          ['CV', 'CONTROL VALVE', 6],
          ['NRV', 'CHECK VALVE', 7],
          ['Y', 'STRAINER', 8],
          ['EXP', 'EXPANSION TANK', 9],
          ['BDV', 'BLOWDOWN VALVE', 10],
          ['PI', 'PRESSURE INDICATOR', 11],
          ['TI', 'TEMPERATURE INDICATOR', 12],
        ].map(([sym, label], i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = col * 80;
          const y = 64 + row * 16;
          return (
            <g key={sym} transform={`translate(${x},${y})`}>
              <circle cx={6} cy={0} r={7} fill="none" stroke="#00aaff" strokeWidth={1} />
              <text x={6} y={3} textAnchor="middle" fill="#00aaff" fontSize={7} fontFamily="inherit">{sym}</text>
              <text x={18} y={3} fill="#5a5a6a" fontSize={8} fontFamily="inherit">{label}</text>
            </g>
          );
        })}
      </g>

      {/* === MAIN PIPING - LTWS (Blue, Cold) === */}
      <g
        onMouseEnter={() => onPipeHover('ltws-main')}
        onMouseLeave={() => onPipeHover(null)}
        style={{ cursor: 'pointer' }}
      >
        {/* LTWS Header label */}
        <text x={180} y={48} fill="#00aaff" fontSize={10} fontFamily="inherit" fontWeight={600}>LTWS HEADER</text>
        <text x={180} y={60} fill="#00aaff" fontSize={10} fontFamily="inherit">7°C</text>
        <text x={180} y={72} fill="#00aaff" fontSize={9} fontFamily="inherit">DESIGN PRESSURE</text>
        <text x={180} y={84} fill="#00aaff" fontSize={9} fontFamily="inherit">1.0 MPa(g)</text>

        {/* Main horizontal LTWS pipe */}
        <line x1={180} y1={100} x2={780} y2={100} {...pipeStroke('ltws-main', '#00aaff')} markerEnd="url(#arrow-blue)" />
        {/* Branch down to HEX */}
        <line x1={300} y1={100} x2={300} y2={230} {...pipeStroke('ltws-main', '#00aaff')} />
        <line x1={300} y1={230} x2={440} y2={230} {...pipeStroke('ltws-main', '#00aaff')} markerEnd="url(#arrow-blue)" />
        {/* Branch to CPs */}
        <line x1={620} y1={100} x2={620} y2={170} {...pipeStroke('ltws-main', '#00aaff')} />
        {/* CP headers */}
        <line x1={620} y1={120} x2={700} y2={120} {...pipeStroke('ltws-main', '#00aaff')} />
        <line x1={620} y1={145} x2={700} y2={145} {...pipeStroke('ltws-main', '#00aaff')} />
        <line x1={620} y1={170} x2={700} y2={170} {...pipeStroke('ltws-main', '#00aaff')} />
        {/* CP drops */}
        <line x1={700} y1={120} x2={700} y2={135} {...pipeStroke('ltws-main', '#00aaff')} />
        <line x1={700} y1={145} x2={700} y2={160} {...pipeStroke('ltws-main', '#00aaff')} />
        <line x1={700} y1={170} x2={700} y2={185} {...pipeStroke('ltws-main', '#00aaff')} />
        {/* CP return risers to HTWR */}
        <line x1={740} y1={120} x2={740} y2={145} {...pipeStroke('htwr-main', '#ff6b35')} />
        <line x1={740} y1={145} x2={740} y2={170} {...pipeStroke('htwr-main', '#ff6b35')} />
        <line x1={740} y1={170} x2={740} y2={195} {...pipeStroke('htwr-main', '#ff6b35')} />
        {/* CP return headers */}
        <line x1={740} y1={130} x2={780} y2={130} {...pipeStroke('htwr-main', '#ff6b35')} markerEnd="url(#arrow-orange)" />
        <line x1={740} y1={160} x2={780} y2={160} {...pipeStroke('htwr-main', '#ff6b35')} markerEnd="url(#arrow-orange)" />
        <line x1={740} y1={190} x2={780} y2={190} {...pipeStroke('htwr-main', '#ff6b35')} markerEnd="url(#arrow-orange)" />
        {/* HTWR main return */}
        <line x1={780} y1={130} x2={780} y2={310} {...pipeStroke('htwr-main', '#ff6b35')} />
        <line x1={180} y1={310} x2={780} y2={310} {...pipeStroke('htwr-main', '#ff6b35')} markerEnd="url(#arrow-orange)" />
      </g>

      {/* === CP COLD PLATES === */}
      {[
        { x: 700, y: 100, label: 'CP-1', temp: '12.3 °C' },
        { x: 700, y: 130, label: 'CP-2', temp: '12.1 °C' },
        { x: 700, y: 160, label: 'CP-N', temp: '12.4 °C' },
      ].map((cp) => (
        <g key={cp.label} transform={`translate(${cp.x},${cp.y})`}>
          <rect x={0} y={0} width={36} height={22} fill="none" stroke="#00aaff" strokeWidth={1} opacity={0.6} />
          <text x={18} y={10} textAnchor="middle" fill="#00aaff" fontSize={7} fontFamily="inherit">{cp.label}</text>
          <text x={18} y={18} textAnchor="middle" fill="#00aaff" fontSize={6} fontFamily="inherit">{cp.temp}</text>
        </g>
      ))}

      {/* CP label box */}
      <g transform="translate(750,80)">
        <text x={0} y={0} fill="#5a5a6a" fontSize={9} fontFamily="inherit">SERVERS (COLD PLATES)</text>
      </g>

      {/* === HEX-101 PLATE HEAT EXCHANGER === */}
      <g
        transform="translate(440,230)"
        onClick={() => onEquipmentClick(equipment.find(e => e.id === 'HEX-101')!)}
        style={{ cursor: 'pointer' }}
        opacity={selectedEquipment === 'HEX-101' ? 0.8 : 1}
      >
        <rect
          x={0} y={0} width={80} height={90}
          fill={selectedEquipment === 'HEX-101' ? 'rgba(0,170,255,0.1)' : 'none'}
          stroke="#00aaff" strokeWidth={1}
        />
        {/* Diagonal chevron lines */}
        {[0, 1, 2, 3].map(i => (
          <line key={i} x1={10 + i * 18} y1={5} x2={25 + i * 18} y2={85}
            stroke="#00aaff" strokeWidth={1} opacity={0.5}
          />
        ))}
        {/* Label */}
        <text x={40} y={-8} textAnchor="middle" fill="#00aaff" fontSize={9} fontFamily="inherit" fontWeight={600}>HEX-101</text>
        <text x={40} y={-18} textAnchor="middle" fill="#5a5a6a" fontSize={7} fontFamily="inherit">PLATE HEAT EXCHANGER</text>
        {/* Cold side inlet/outlet labels */}
        <text x={-5} y={20} textAnchor="end" fill="#00aaff" fontSize={8} fontFamily="inherit">45.2 °C</text>
        <text x={-5} y={32} textAnchor="end" fill="#00aaff" fontSize={8} fontFamily="inherit">380 kPa</text>
        <text x={85} y={20} textAnchor="start" fill="#00aaff" fontSize={8} fontFamily="inherit">9.0 °C</text>
        <text x={85} y={32} textAnchor="start" fill="#00aaff" fontSize={8} fontFamily="inherit">340 kPa</text>
        {/* Hot side inlet/outlet labels */}
        <text x={-5} y={70} textAnchor="end" fill="#ff6b35" fontSize={8} fontFamily="inherit">52.1 °C</text>
        <text x={-5} y={82} textAnchor="end" fill="#ff6b35" fontSize={8} fontFamily="inherit">420 kPa</text>
        <text x={85} y={70} textAnchor="start" fill="#ff6b35" fontSize={8} fontFamily="inherit">51.0 °C</text>
        <text x={85} y={82} textAnchor="start" fill="#ff6b35" fontSize={8} fontFamily="inherit">360 kPa</text>
      </g>

      {/* HEX cold outlet back to pump */}
      <line x1={520} y1={265} x2={620} y2={265} {...pipeStroke('ltws-return', '#00aaff')} />
      <line x1={620} y1={265} x2={620} y2={380} {...pipeStroke('ltws-return', '#00aaff')} />
      {/* HEX hot inlet from HTWR */}
      <line x1={380} y1={310} x2={380} y2={290} {...pipeStroke('htwr-main', '#ff6b35')} />
      <line x1={380} y1={290} x2={440} y2={290} {...pipeStroke('htwr-main', '#ff6b35')} />
      {/* HEX hot outlet to HTWR */}
      <line x1={520} y1={290} x2={560} y2={290} {...pipeStroke('htwr-main', '#ff6b35')} />
      <line x1={560} y1={290} x2={560} y2={310} {...pipeStroke('htwr-main', '#ff6b35')} />

      {/* === HTWR HEADER (Orange, Hot) === */}
      <g
        onMouseEnter={() => onPipeHover('htwr-main')}
        onMouseLeave={() => onPipeHover(null)}
        style={{ cursor: 'pointer' }}
      >
        <text x={180} y={278} fill="#ff6b35" fontSize={10} fontFamily="inherit" fontWeight={600}>HTWR HEADER</text>
        <text x={180} y={290} fill="#ff6b35" fontSize={10} fontFamily="inherit">55°C</text>
        <text x={180} y={302} fill="#ff6b35" fontSize={9} fontFamily="inherit">DESIGN PRESSURE</text>
        <text x={180} y={314} fill="#ff6b35" fontSize={9} fontFamily="inherit">1.0 MPa(g)</text>
      </g>

      {/* === P-101 CENTRIFUGAL PUMP === */}
      <g
        transform="translate(440,380)"
        onClick={() => onEquipmentClick(equipment.find(e => e.id === 'P-101')!)}
        style={{ cursor: 'pointer' }}
        opacity={selectedEquipment === 'P-101' ? 0.8 : 1}
      >
        <circle
          cx={25} cy={25} r={28}
          fill={selectedEquipment === 'P-101' ? 'rgba(0,170,255,0.08)' : 'none'}
          stroke="#00aaff" strokeWidth={1}
        />
        {/* Internal triangle */}
        <polygon points="15,20 35,25 15,30" fill="none" stroke="#00aaff" strokeWidth={1} />
        {/* Volute line */}
        <path d="M 25,0 A 28,28 0 0,1 53,25" fill="none" stroke="#00aaff" strokeWidth={1} opacity={0.5} />
        {/* Label */}
        <text x={25} y={65} textAnchor="middle" fill="#00aaff" fontSize={9} fontFamily="inherit" fontWeight={600}>P-101</text>
        <text x={25} y={76} textAnchor="middle" fill="#5a5a6a" fontSize={7} fontFamily="inherit">CENTRIFUGAL PUMP</text>
        {/* Inlet label */}
        <text x={-5} y={28} textAnchor="end" fill="#00aaff" fontSize={8} fontFamily="inherit">420 kPa</text>
        {/* Outlet label */}
        <text x={60} y={15} textAnchor="start" fill="#00aaff" fontSize={8} fontFamily="inherit">390 kPa</text>
        <text x={60} y={28} textAnchor="start" fill="#00aaff" fontSize={8} fontFamily="inherit">52.1 °C</text>
      </g>

      {/* Pump outlet to HEX hot inlet via Y-101 and CV-201 */}
      <line x1={495} y1={395} x2={580} y2={395} {...pipeStroke('pump-out', '#00aaff')} />
      <line x1={580} y1={395} x2={580} y2={340} {...pipeStroke('pump-out', '#00aaff')} />
      <line x1={380} y1={340} x2={580} y2={340} {...pipeStroke('pump-out', '#00aaff')} />

      {/* === Y-101 STRAINER === */}
      <g
        transform="translate(320,340)"
        onClick={() => onEquipmentClick(equipment.find(e => e.id === 'Y-101')!)}
        style={{ cursor: 'pointer' }}
      >
        <polygon points="0,-8 -8,8 8,8" fill="none" stroke="#00aaff" strokeWidth={1} />
        <line x1={0} y1={8} x2={0} y2={16} stroke="#00aaff" strokeWidth={1} />
        <text x={0} y={28} textAnchor="middle" fill="#00aaff" fontSize={8} fontFamily="inherit">Y-101</text>
      </g>

      {/* === NRV-101 CHECK VALVE === */}
      <g
        transform="translate(600,340)"
        onClick={() => onEquipmentClick(equipment.find(e => e.id === 'NRV-101')!)}
        style={{ cursor: 'pointer' }}
      >
        <polygon points="-6,-8 6,0 -6,8" fill="none" stroke="#00aaff" strokeWidth={1} />
        <line x1={-8} y1={0} x2={8} y2={0} stroke="#00aaff" strokeWidth={1} />
        <text x={0} y={20} textAnchor="middle" fill="#00aaff" fontSize={8} fontFamily="inherit">NRV-101</text>
      </g>

      {/* === VFD === */}
      <g
        transform="translate(440,460)"
        onClick={() => onEquipmentClick(equipment.find(e => e.id === 'VFD-101')!)}
        style={{ cursor: 'pointer' }}
      >
        <rect x={0} y={0} width={40} height={30} fill="none" stroke="#00aaff" strokeWidth={1} />
        <text x={20} y={19} textAnchor="middle" fill="#00aaff" fontSize={9} fontFamily="inherit">VFD</text>
        <text x={20} y={45} textAnchor="middle" fill="#5a5a6a" fontSize={7} fontFamily="inherit">SPEED</text>
        <text x={20} y={55} textAnchor="middle" fill="#00aaff" fontSize={9} fontFamily="inherit">62.5 Hz</text>
      </g>

      {/* === EXP-101 EXPANSION TANK === */}
      <g
        transform="translate(100,400)"
        onClick={() => onEquipmentClick(equipment.find(e => e.id === 'EXP-101')!)}
        style={{ cursor: 'pointer' }}
        opacity={selectedEquipment === 'EXP-101' ? 0.8 : 1}
      >
        <ellipse
          cx={20} cy={15} rx={18} ry={15}
          fill={selectedEquipment === 'EXP-101' ? 'rgba(0,170,255,0.05)' : 'none'}
          stroke="#00aaff" strokeWidth={1}
        />
        {/* Legs */}
        <line x1={8} y1={30} x2={8} y2={42} stroke="#00aaff" strokeWidth={1} />
        <line x1={32} y1={30} x2={32} y2={42} stroke="#00aaff" strokeWidth={1} />
        {/* Level line */}
        <line x1={5} y1={20} x2={35} y2={20} stroke="#00aaff" strokeWidth={1} opacity={0.5} strokeDasharray="2,2" />
        {/* Label */}
        <text x={20} y={60} textAnchor="middle" fill="#00aaff" fontSize={8} fontFamily="inherit" fontWeight={600}>EXP-101</text>
        <text x={20} y={70} textAnchor="middle" fill="#5a5a6a" fontSize={7} fontFamily="inherit">EXPANSION TANK</text>
        {/* Level indicator */}
        <text x={55} y={15} fill="#00aaff" fontSize={9} fontFamily="inherit">65 %</text>
      </g>

      {/* EXP tank connection to HTWR */}
      <line x1={140} y1={420} x2={180} y2={420} {...pipeStroke('exp-conn', '#ff6b35')} strokeDasharray="3,3" />
      <line x1={180} y1={420} x2={180} y2={310} {...pipeStroke('exp-conn', '#ff6b35')} strokeDasharray="3,3" />

      {/* === BDV-101 BLOWDOWN VALVE === */}
      <g
        transform="translate(100,500)"
        onClick={() => onEquipmentClick(equipment.find(e => e.id === 'BDV-101')!)}
        style={{ cursor: 'pointer' }}
      >
        <polygon points="-6,-6 6,0 -6,6" fill="none" stroke="#00aaff" strokeWidth={1} />
        {/* Down arrow */}
        <line x1={0} y1={6} x2={0} y2={18} stroke="#00aaff" strokeWidth={1} markerEnd="url(#arrow-blue)" />
        <text x={0} y={32} textAnchor="middle" fill="#00aaff" fontSize={8} fontFamily="inherit">BDV-101</text>
      </g>

      {/* EXP to BDV connection */}
      <line x1={100} y1={442} x2={100} y2={494} {...pipeStroke('bdv-conn', '#ff6b35')} />

      {/* === VALVES === */}
      {valves.map(v => (
        <ValveSymbol
          key={v.id}
          v={v}
          onClick={() => onValveClick(v)}
        />
      ))}

      {/* === SENSOR SYMBOLS === */}
      {sensors.map(s => (
        <SensorSymbol key={s.id} s={s} />
      ))}

      {/* === SYSTEM STATUS PANEL (bottom-right) === */}
      <g transform="translate(620,430)">
        <rect x={0} y={0} width={150} height={120} fill="#0f0f12" stroke="#00aaff" strokeWidth={1} opacity={0.6} />
        <text x={75} y={16} textAnchor="middle" fill="#ffffff" fontSize={10} fontWeight={700} fontFamily="inherit" letterSpacing="0.06em">SYSTEM STATUS</text>
        <line x1={8} y1={22} x2={142} y2={22} stroke="#00aaff" strokeWidth={1} opacity={0.3} />
        {[
          ['COOLING LOAD', '100 %'],
          ['TOTAL FLOW', '85 L/min'],
          ['DELTA T', '44.9 °C'],
          ['PUMP SPEED', '62.5 Hz'],
          ['SYSTEM PRESSURE', '350 kPa(g)'],
          ['ALARM STATUS', 'NORMAL'],
        ].map(([k, v], i) => (
          <g key={k} transform={`translate(8, ${36 + i * 14})`}>
            <text x={0} y={0} fill="#5a5a6a" fontSize={8} fontFamily="inherit">{k}</text>
            <text
              x={140} y={0}
              textAnchor="end"
              fill={k === 'ALARM STATUS' ? '#00ff66' : '#ffffff'}
              fontSize={8}
              fontFamily="inherit"
              fontWeight={k === 'ALARM STATUS' ? 600 : 400}
            >
              {v}
            </text>
          </g>
        ))}
      </g>

      {/* === NOTES PANEL === */}
      <g transform="translate(780,430)">
        <rect x={0} y={0} width={110} height={120} fill="none" stroke="#3a506b" strokeWidth={1} opacity={0.4} />
        <text x={8} y={16} fill="#5a5a6a" fontSize={10} fontWeight={700} fontFamily="inherit" letterSpacing="0.06em">NOTES:</text>
        {[
          '1. ALL DIMENSIONS ARE IN',
          '   MILLIMETERS.',
          '2. ALL PRESSURES ARE IN',
          '   kPa(g).',
          '3. ALL TEMPERATURES ARE',
          '   IN °C.',
          '4. PIPING AND INSTRUMENTA-',
          '   TION PER ASME B31.3.',
          '5. DESIGN CODE: ASME',
          '   SECTION VIII DIVISION 1.',
        ].map((line, i) => (
          <text key={i} x={8} y={32 + i * 10} fill="#5a5a6a" fontSize={7} fontFamily="inherit">
            {line}
          </text>
        ))}
      </g>
    </svg>
  );
}
