import { useState, useEffect, useCallback } from 'react';
import type { SystemStatus, SensorData, ValveState, Equipment } from '@/types/pnid';

const INITIAL_SENSORS: SensorData[] = [
  { id: 'PI-001', label: 'PI', value: 350, unit: 'kPa', type: 'P', x: 280, y: 55 },
  { id: 'TI-001', label: 'TI', value: 7.1, unit: '°C', type: 'T', x: 400, y: 55 },
  { id: 'FIC-101', label: 'FIC', value: 85, unit: 'L/min', type: 'FIC', x: 520, y: 55 },
  { id: 'PI-002', label: 'PI', value: 320, unit: 'kPa', type: 'P', x: 650, y: 55 },
  { id: 'TI-201', label: 'TI', value: 12.3, unit: '°C', type: 'T', x: 720, y: 95 },
  { id: 'TI-202', label: 'TI', value: 12.1, unit: '°C', type: 'T', x: 720, y: 150 },
  { id: 'TI-203', label: 'TI', value: 12.4, unit: '°C', type: 'T', x: 720, y: 205 },
  { id: 'TI-002', label: 'TI', value: 45.2, unit: '°C', type: 'T', x: 380, y: 200 },
  { id: 'PI-003', label: 'PI', value: 380, unit: 'kPa', type: 'P', x: 420, y: 200 },
  { id: 'TI-003', label: 'TI', value: 9.0, unit: '°C', type: 'T', x: 560, y: 200 },
  { id: 'PI-004', label: 'PI', value: 340, unit: 'kPa', type: 'P', x: 600, y: 200 },
  { id: 'TI-004', label: 'TI', value: 52.1, unit: '°C', type: 'T', x: 380, y: 310 },
  { id: 'PI-005', label: 'PI', value: 420, unit: 'kPa', type: 'P', x: 420, y: 310 },
  { id: 'TI-005', label: 'TI', value: 51.0, unit: '°C', type: 'T', x: 560, y: 310 },
  { id: 'PI-006', label: 'PI', value: 360, unit: 'kPa', type: 'P', x: 600, y: 310 },
  { id: 'PI-007', label: 'PI', value: 220, unit: 'kPa', type: 'P', x: 180, y: 340 },
  { id: 'PI-008', label: 'PI', value: 538, unit: 'kPa', type: 'P', x: 280, y: 340 },
  { id: 'PI-009', label: 'PI', value: 390, unit: 'kPa', type: 'P', x: 380, y: 340 },
  { id: 'LI-101', label: 'LI', value: 65, unit: '%', type: 'LI', x: 130, y: 440 },
  { id: 'TI-006', label: 'TI', value: 55, unit: '°C', type: 'T', x: 120, y: 265 },
  { id: 'PI-010', label: 'PI', value: 420, unit: 'kPa', type: 'P', x: 420, y: 400 },
  { id: 'TI-007', label: 'TI', value: 52.1, unit: '°C', type: 'T', x: 420, y: 440 },
];

const INITIAL_VALVES: ValveState[] = [
  { id: 'CV-101', name: 'CV-101', openPercent: 72, x: 620, y: 70, autoControlled: true },
  { id: 'CV-201', name: 'CV-201', openPercent: 45, x: 200, y: 260, autoControlled: true },
];

const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'HEX-101',
    name: 'HEX-101',
    code: 'PLATE HEAT EXCHANGER',
    description: '板式换热器，用于冷却液与热液的热量交换',
    x: 440,
    y: 220,
    width: 80,
    height: 100,
    status: 'normal',
    params: {
      'Cold In Temp': { value: 45.2, unit: '°C' },
      'Cold Out Temp': { value: 9.0, unit: '°C' },
      'Hot In Temp': { value: 52.1, unit: '°C' },
      'Hot Out Temp': { value: 51.0, unit: '°C' },
      'Cold In Pressure': { value: 380, unit: 'kPa' },
      'Cold Out Pressure': { value: 340, unit: 'kPa' },
      'Hot In Pressure': { value: 420, unit: 'kPa' },
      'Hot Out Pressure': { value: 360, unit: 'kPa' },
      'Efficiency': { value: 94.5, unit: '%' },
    },
  },
  {
    id: 'P-101',
    name: 'P-101',
    code: 'CENTRIFUGAL PUMP',
    description: '离心泵，提供冷却液循环动力',
    x: 440,
    y: 380,
    width: 50,
    height: 50,
    status: 'normal',
    params: {
      'Speed': { value: 62.5, unit: 'Hz' },
      'Inlet Pressure': { value: 420, unit: 'kPa' },
      'Outlet Pressure': { value: 390, unit: 'kPa' },
      'Flow Rate': { value: 85, unit: 'L/min' },
      'Power': { value: 4.2, unit: 'kW' },
      'Vibration': { value: 2.1, unit: 'mm/s' },
    },
  },
  {
    id: 'EXP-101',
    name: 'EXP-101',
    code: 'EXPANSION TANK',
    description: '膨胀罐，用于容纳冷却液热膨胀容积',
    x: 100,
    y: 400,
    width: 40,
    height: 60,
    status: 'normal',
    params: {
      'Level': { value: 65, unit: '%' },
      'Pressure': { value: 220, unit: 'kPa' },
      'Temperature': { value: 55, unit: '°C' },
      'Capacity': { value: 500, unit: 'L' },
    },
  },
  {
    id: 'VFD-101',
    name: 'VFD',
    code: 'VFD CONTROLLER',
    description: '变频驱动器，控制离心泵转速',
    x: 440,
    y: 460,
    width: 40,
    height: 30,
    status: 'normal',
    params: {
      'Output Freq': { value: 62.5, unit: 'Hz' },
      'Output Voltage': { value: 380, unit: 'V' },
      'Output Current': { value: 8.5, unit: 'A' },
      'Power': { value: 4.2, unit: 'kW' },
    },
  },
  {
    id: 'Y-101',
    name: 'Y-101',
    code: 'STRAINER',
    description: 'Y型过滤器，过滤冷却液中的杂质',
    x: 320,
    y: 340,
    width: 25,
    height: 25,
    status: 'normal',
    params: {
      'Differential Pressure': { value: 15, unit: 'kPa' },
      'Cleanliness': { value: 92, unit: '%' },
    },
  },
  {
    id: 'NRV-101',
    name: 'NRV-101',
    code: 'CHECK VALVE',
    description: '止回阀，防止冷却液倒流',
    x: 600,
    y: 340,
    width: 20,
    height: 20,
    status: 'normal',
    params: {
      'Status': { value: 1, unit: 'Open' },
      'Cracking Pressure': { value: 5, unit: 'kPa' },
    },
  },
  {
    id: 'BDV-101',
    name: 'BDV-101',
    code: 'BLOWDOWN VALVE',
    description: '排污阀，用于系统排污维护',
    x: 100,
    y: 500,
    width: 20,
    height: 20,
    status: 'normal',
    params: {
      'Status': { value: 0, unit: 'Closed' },
      'Last Blowdown': { value: 72, unit: 'hours ago' },
    },
  },
];

export function useMockData() {
  const [sensors, setSensors] = useState<SensorData[]>(INITIAL_SENSORS);
  const [valves, setValves] = useState<ValveState[]>(INITIAL_VALVES);
  const [equipment] = useState<Equipment[]>(INITIAL_EQUIPMENT);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    coolingLoad: 100,
    totalFlow: 85,
    deltaT: 44.9,
    pumpSpeed: 62.5,
    systemPressure: 350,
    alarmStatus: 'NORMAL',
  });

  const updateValve = useCallback((valveId: string, newOpenPercent: number) => {
    setValves(prev =>
      prev.map(v =>
        v.id === valveId ? { ...v, openPercent: newOpenPercent } : v
      )
    );
    // Adjust downstream flow and pressure based on valve opening
    const flowFactor = newOpenPercent / 100;
    setSystemStatus(prev => ({
      ...prev,
      totalFlow: Math.round(85 * flowFactor),
      systemPressure: Math.round(350 * (0.5 + flowFactor * 0.5)),
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev =>
        prev.map(s => {
          let delta = 0;
          if (s.unit === '°C') delta = (Math.random() - 0.5) * 0.6;
          else if (s.unit === 'kPa') delta = (Math.random() - 0.5) * 10;
          else if (s.unit === 'L/min') delta = (Math.random() - 0.5) * 4;
          else if (s.unit === '%') delta = (Math.random() - 0.5) * 2;
          return { ...s, value: Math.round((s.value + delta) * 10) / 10 };
        })
      );

      setSystemStatus(prev => {
        const loadVariation = Math.round((Math.random() - 0.5) * 2);
        const flowVariation = Math.round((Math.random() - 0.5) * 4);
        const newLoad = Math.max(60, Math.min(100, prev.coolingLoad + loadVariation));
        const newFlow = Math.max(40, Math.min(120, prev.totalFlow + flowVariation));
        const alarm = newLoad > 95 ? 'WARNING' : newLoad > 98 ? 'ALARM' : 'NORMAL';
        return {
          ...prev,
          coolingLoad: newLoad,
          totalFlow: newFlow,
          pumpSpeed: Math.round((62.5 + (Math.random() - 0.5)) * 10) / 10,
          alarmStatus: alarm,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    sensors,
    valves,
    equipment,
    systemStatus,
    updateValve,
  };
}
