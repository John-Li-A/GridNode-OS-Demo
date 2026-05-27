export interface SensorData {
  id: string;
  label: string;
  value: number;
  unit: string;
  type: 'P' | 'T' | 'F' | 'PC' | 'TC' | 'PI' | 'TI' | 'LI' | 'FIC';
  x: number;
  y: number;
}

export interface PipelineSegment {
  id: string;
  name: string;
  path: string;
  type: 'LTWS' | 'HTWR';
  sensors: SensorData[];
  flowRate: number;
  temperature: number;
  pressure: number;
}

export interface Equipment {
  id: string;
  name: string;
  code: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  status: 'normal' | 'warning' | 'alarm';
  params: Record<string, { value: number; unit: string }>;
}

export interface ValveState {
  id: string;
  name: string;
  openPercent: number;
  x: number;
  y: number;
  autoControlled: boolean;
}

export interface SystemStatus {
  coolingLoad: number;
  totalFlow: number;
  deltaT: number;
  pumpSpeed: number;
  systemPressure: number;
  alarmStatus: 'NORMAL' | 'WARNING' | 'ALARM';
}

export interface TopBarMetric {
  label: string;
  value: string;
  unit?: string;
}

export interface DeviceDetail {
  equipment: Equipment;
  visible: boolean;
}
