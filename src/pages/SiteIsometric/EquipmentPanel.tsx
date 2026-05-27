const EQUIPMENT_LIST = [
  { id: 1, name: '20FT COMPUTE CONTAINER', qty: 1 },
  { id: 2, name: '1600kVA TRANSFORMER', qty: 1 },
  { id: 3, name: 'CLOSED COOLING TOWER', qty: 1 },
  { id: 4, name: 'LIQUID COOLED CHARGER', qty: 4 },
  { id: 5, name: 'POWER DISTRIBUTION CABINET', qty: 1 },
  { id: 6, name: 'CONTROL CABINET', qty: 1 },
];

const NOTES = [
  '1. ALL DIMENSIONS ARE IN MILLIMETERS.',
  '2. ELEVATION: ±0.000 = FINISHED GROUND.',
  '3. FOUNDATION: CONCRETE PAD, THICKNESS 200mm.',
  '4. STRUCTURAL LOADS SHALL COMPLY WITH GB 50007-2011.',
];

export function EquipmentPanel() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '44px',
        right: 0,
        bottom: 0,
        width: '280px',
        backgroundColor: 'rgba(10,10,12,0.92)',
        borderLeft: '1px solid rgba(0,170,255,0.2)',
        fontFamily: '"Consolas", "Monaco", "Courier New", monospace',
        fontSize: '10px',
        overflowY: 'auto',
        zIndex: 10,
        padding: '16px',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* ── Equipment Table ── */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          color: '#ffffff', fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.08em', marginBottom: '8px',
        }}>
          EQUIPMENT LIST
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: '28px 1fr 30px',
          gap: '1px', backgroundColor: 'rgba(0,170,255,0.15)',
        }}>
          {/* Header */}
          <div style={{ backgroundColor: '#0a0a0a', padding: '4px 6px', color: '#5a5a6a', fontSize: '9px' }}>ID</div>
          <div style={{ backgroundColor: '#0a0a0a', padding: '4px 6px', color: '#5a5a6a', fontSize: '9px' }}>EQUIPMENT</div>
          <div style={{ backgroundColor: '#0a0a0a', padding: '4px 6px', color: '#5a5a6a', fontSize: '9px', textAlign: 'center' }}>QTY</div>
          {/* Rows */}
          {EQUIPMENT_LIST.map(eq => (
            <>
              <div key={`id-${eq.id}`} style={{ backgroundColor: '#0a0a0a', padding: '4px 6px', color: '#00aaff', fontWeight: 600 }}>
                {eq.id}
              </div>
              <div key={`name-${eq.id}`} style={{ backgroundColor: '#0a0a0a', padding: '4px 6px', color: '#ffffff' }}>
                {eq.name}
              </div>
              <div key={`qty-${eq.id}`} style={{ backgroundColor: '#0a0a0a', padding: '4px 6px', color: '#00aaff', textAlign: 'center' }}>
                {eq.qty}
              </div>
            </>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'rgba(0,170,255,0.15)', marginBottom: '16px' }} />

      {/* ── Notes ── */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          color: '#ffffff', fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.08em', marginBottom: '8px',
        }}>
          NOTES:
        </div>
        {NOTES.map((note, i) => (
          <div key={i} style={{ color: '#5a5a6a', fontSize: '9px', marginBottom: '4px', lineHeight: '1.4' }}>
            {note}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'rgba(0,170,255,0.15)', marginBottom: '16px' }} />

      {/* ── Concrete Pad Detail ── */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          color: '#ffffff', fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.08em', marginBottom: '4px',
        }}>
          CONCRETE PAD DETAIL
        </div>
        <div style={{ color: '#5a5a6a', fontSize: '8px', marginBottom: '8px' }}>SCALE 1:20</div>
        {/* Mini diagram */}
        <svg width="220" height="100" viewBox="0 0 220 100" style={{ marginLeft: '-6px' }}>
          {/* Layers */}
          <rect x="20" y="10" width="160" height="15" fill="none" stroke="#00aaff" strokeWidth="0.5" opacity="0.4" />
          <rect x="20" y="25" width="160" height="20" fill="none" stroke="#00aaff" strokeWidth="0.5" opacity="0.3" />
          <rect x="20" y="45" width="160" height="15" fill="none" stroke="#00aaff" strokeWidth="0.5" opacity="0.25" />
          <rect x="20" y="60" width="160" height="25" fill="none" stroke="#00aaff" strokeWidth="0.5" opacity="0.15" />
          {/* Dimension lines */}
          <line x1="185" y1="10" x2="185" y2="25" stroke="#00aaff" strokeWidth="0.5" opacity="0.5" />
          <line x1="185" y1="25" x2="185" y2="45" stroke="#00aaff" strokeWidth="0.5" opacity="0.5" />
          <line x1="185" y1="45" x2="185" y2="60" stroke="#00aaff" strokeWidth="0.5" opacity="0.5" />
          {/* Labels */}
          <text x="195" y="20" fill="#5a5a6a" fontSize="7" fontFamily="Consolas,monospace">±0.000</text>
          <text x="195" y="36" fill="#5a5a6a" fontSize="7" fontFamily="Consolas,monospace">200</text>
          <text x="195" y="54" fill="#5a5a6a" fontSize="7" fontFamily="Consolas,monospace">100</text>
          {/* Layer names */}
          <text x="22" y="20" fill="#5a5a6a" fontSize="6" fontFamily="Consolas,monospace">FINISHED GROUND</text>
          <text x="22" y="37" fill="#5a5a6a" fontSize="6" fontFamily="Consolas,monospace">CONCRETE PAD C30, t=200mm</text>
          <text x="22" y="54" fill="#5a5a6a" fontSize="6" fontFamily="Consolas,monospace">COMPACTED GRAVEL t=100mm</text>
          <text x="22" y="76" fill="#5a5a6a" fontSize="6" fontFamily="Consolas,monospace">COMPACTED SUBGRADE</text>
        </svg>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'rgba(0,170,255,0.15)', marginBottom: '16px' }} />

      {/* ── Drawing Info ── */}
      <div style={{ border: '1px solid rgba(0,170,255,0.2)', padding: '10px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {[
              ['PROJECT', 'HPC-DC BASE STATION'],
              ['DRAWING TITLE', 'SITE OVERALL ISOMETRIC'],
              ['DRAWING NO.', 'HPC-DC-SS-001'],
              ['REV.', 'A'],
              ['DATE', '2024-05-24'],
              ['UNIT', 'mm'],
              ['SCALE', '1:100'],
              ['DRAWN', '1:106'],
            ].map(([k, v]) => (
              <tr key={k} style={{ borderBottom: '1px solid rgba(58,80,107,0.2)' }}>
                <td style={{ color: '#5a5a6a', fontSize: '8px', padding: '3px 0', width: '45%' }}>{k}</td>
                <td style={{ color: '#00aaff', fontSize: '8px', padding: '3px 0' }}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Bottom row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
          marginTop: '8px', paddingTop: '6px',
          borderTop: '1px solid rgba(0,170,255,0.2)',
        }}>
          {['DRAWN', 'ENG', 'CHECKED', 'CHK', 'APPROVED'].map(label => (
            <div key={label} style={{ color: '#5a5a6a', fontSize: '7px', textAlign: 'center' }}>{label}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}>
          {['', '', '', '', 'APP'].map(label => (
            <div key={label} style={{ color: '#5a5a6a', fontSize: '7px', textAlign: 'center' }}>{label}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
