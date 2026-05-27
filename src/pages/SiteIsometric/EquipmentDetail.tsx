import { useState, useEffect } from 'react';

interface EquipmentDetailData {
  id: number;
  name: string;
  dims: string;
  status: 'normal' | 'warning' | 'alarm';
  params: Record<string, { value: string; unit?: string }>;
}

interface Props {
  deviceId: number | null;
  onClose: () => void;
}

const DEVICE_DATA: Record<number, EquipmentDetailData> = {
  1: {
    id: 1, name: '20FT COMPUTE CONTAINER', dims: 'L6058 x W2438 x H2896mm',
    status: 'normal',
    params: {
      'CPU Temperature': { value: '42.3', unit: '°C' },
      'GPU Load': { value: '78', unit: '%' },
      'Memory Usage': { value: '64', unit: '%' },
      'Network In': { value: '12.5', unit: 'Gbps' },
      'Network Out': { value: '8.3', unit: 'Gbps' },
      'Power Draw': { value: '32.5', unit: 'kW' },
      'Fan Speed': { value: '65', unit: '%' },
      'Uptime': { value: '720', unit: 'hours' },
    },
  },
  2: {
    id: 2, name: '1600kVA TRANSFORMER', dims: 'L2600 x W1800 x H2180mm',
    status: 'normal',
    params: {
      'Load': { value: '68.5', unit: '%' },
      'Temperature': { value: '55.2', unit: '°C' },
      'Primary Voltage': { value: '10', unit: 'kV' },
      'Secondary Voltage': { value: '0.4', unit: 'kV' },
      'Current': { value: '92.3', unit: 'A' },
      'Power Factor': { value: '0.96' },
      'Oil Level': { value: '85', unit: '%' },
      'Insulation': { value: 'GOOD' },
    },
  },
  3: {
    id: 3, name: 'CLOSED COOLING TOWER', dims: 'L2300 x W4600 x H6140mm',
    status: 'normal',
    params: {
      'Fan 1 Speed': { value: '75', unit: '%' },
      'Fan 2 Speed': { value: '72', unit: '%' },
      'Water In Temp': { value: '45.2', unit: '°C' },
      'Water Out Temp': { value: '32.1', unit: '°C' },
      'Flow Rate': { value: '85', unit: 'L/min' },
      'Basin Level': { value: '78', unit: '%' },
      'Vibration': { value: '1.8', unit: 'mm/s' },
      'Status': { value: 'RUNNING' },
    },
  },
  4: {
    id: 4, name: 'LIQUID COOLED CHARGER', dims: 'L800 x W600 x H2000mm',
    status: 'normal',
    params: {
      'Unit 1': { value: 'IDLE' },
      'Unit 2': { value: 'CHARGING' },
      'Unit 3': { value: 'IDLE' },
      'Unit 4': { value: 'IDLE' },
      'Output Power': { value: '120', unit: 'kW' },
      'Output Current': { value: '250', unit: 'A' },
      'Output Voltage': { value: '480', unit: 'V' },
      'Session Count': { value: '42' },
    },
  },
  5: {
    id: 5, name: 'POWER DISTRIBUTION CABINET', dims: 'L1200 x W1000 x H2000mm',
    status: 'normal',
    params: {
      'Voltage': { value: '380', unit: 'V' },
      'Current': { value: '125.3', unit: 'A' },
      'Frequency': { value: '50.0', unit: 'Hz' },
      'Power Factor': { value: '0.95' },
      'Active Power': { value: '82.5', unit: 'kW' },
      'Breaker Status': { value: 'CLOSED' },
      'Ground Fault': { value: 'NONE' },
      'Temp': { value: '38.5', unit: '°C' },
    },
  },
  6: {
    id: 6, name: 'CONTROL CABINET', dims: 'L800 x W800 x H2000mm',
    status: 'normal',
    params: {
      'PLC Status': { value: 'RUNNING' },
      'Comm Status': { value: 'OK' },
      'CPU Load': { value: '32', unit: '%' },
      'Memory': { value: '45', unit: '%' },
      'I/O Status': { value: 'NORMAL' },
      'Temp': { value: '35.2', unit: '°C' },
      'Humidity': { value: '42', unit: '%' },
      'Uptime': { value: '2160', unit: 'hours' },
    },
  },
};

export function EquipmentDetail({ deviceId, onClose }: Props) {
  const data = deviceId ? DEVICE_DATA[deviceId] : null;
  const [liveParams, setLiveParams] = useState<Record<string, { value: string; unit?: string }>>({});

  useEffect(() => {
    if (!data) return;
    setLiveParams(data.params);
    const interval = setInterval(() => {
      setLiveParams(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(k => {
          if (next[k].unit === '°C') {
            const v = parseFloat(next[k].value);
            next[k] = { ...next[k], value: (v + (Math.random() - 0.5) * 0.4).toFixed(1) };
          } else if (next[k].unit === '%' && k !== 'Oil Level' && k !== 'Basin Level') {
            const v = parseFloat(next[k].value);
            next[k] = { ...next[k], value: Math.round(v + (Math.random() - 0.5) * 2).toString() };
          }
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [data]);

  if (!data) return null;

  const statusColor = data.status === 'normal' ? '#00aaff' : data.status === 'warning' ? '#ffcc00' : '#ff3333';

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#0f0f12', border: '1px solid #00aaff',
          padding: '24px', minWidth: '380px', maxWidth: '500px',
          fontFamily: '"Consolas", "Monaco", "Courier New", monospace',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={{
          position: 'absolute', top: '8px', right: '12px',
          background: 'none', border: 'none', color: '#5a5a6a',
          fontSize: '18px', cursor: 'pointer', fontFamily: 'inherit',
        }}>x</button>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{
              width: '22px', height: '22px', border: '1px solid #00aaff',
              color: '#00aaff', fontSize: '12px', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{data.id}</span>
            <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 700, letterSpacing: '0.06em' }}>
              {data.name}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            <span style={{ color: '#5a5a6a', fontSize: '10px' }}>{data.dims}</span>
            <span style={{ color: statusColor, fontSize: '10px', fontWeight: 600 }}>● {data.status.toUpperCase()}</span>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: 'rgba(0,170,255,0.2)', marginBottom: '16px' }} />

        <div style={{ color: '#ffffff', fontSize: '11px' }}>
          <div style={{ display: 'flex', color: '#5a5a6a', fontSize: '10px', marginBottom: '8px', letterSpacing: '0.06em' }}>
            <span style={{ flex: 1 }}>PARAMETER</span>
            <span style={{ textAlign: 'right', minWidth: '100px' }}>VALUE</span>
          </div>
          {Object.entries(liveParams).map(([key, val]) => (
            <div key={key} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '5px 0', borderBottom: '1px solid rgba(58,80,107,0.2)',
            }}>
              <span style={{ color: '#8a8a9a' }}>{key}</span>
              <span style={{ color: '#00aaff' }}>
                {val.value} <span style={{ color: '#5a5a6a' }}>{val.unit}</span>
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button style={{
            flex: 1, backgroundColor: 'rgba(0,170,255,0.1)', border: '1px solid #00aaff',
            color: '#00aaff', padding: '6px', fontSize: '10px', fontFamily: 'inherit',
            cursor: 'pointer', letterSpacing: '0.06em',
          }}>VIEW TRENDS</button>
          <button style={{
            flex: 1, backgroundColor: 'rgba(255,51,51,0.1)', border: '1px solid #ff3333',
            color: '#ff3333', padding: '6px', fontSize: '10px', fontFamily: 'inherit',
            cursor: 'pointer', letterSpacing: '0.06em',
          }}>SIMULATE FAULT</button>
        </div>
      </div>
    </div>
  );
}
