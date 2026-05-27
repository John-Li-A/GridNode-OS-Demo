import { useState, useEffect, useCallback } from 'react';

export type TaskType = '合成数据生成' | '感知数据清洗' | '离线向量化';
export type Priority = 'high' | 'medium' | 'low';
export type GPUStatus = 'OK' | 'HIGH' | 'FAULT' | 'PAUSED';

export interface GPUTask {
  type: TaskType;
  customer: string;
  priority: Priority;
}

export interface GPUUnit {
  id: string;
  nodeId: number;
  gpuIndex: number;
  temperature: number;
  vramUsage: number;
  pumpPWM: number;
  status: GPUStatus;
  task: GPUTask | null;
}

export interface CoolingLoop {
  supplyTemp: number;
  returnTemp: number;
  flowRate: number;
  deltaT: number;
  pressure: number;
  pumpPWM: number;
  fanPWM: number;
}

// 40 GPUs: 5 Nodes × 8 GPUs
// Priority distribution: high=12, medium=16, low=12
const TASK_ASSIGNMENTS: (GPUTask | null)[] = [
  // Node01 (U39-U36)
  { type: '合成数据生成', customer: '阶跃星辰', priority: 'high' as Priority },
  { type: '合成数据生成', customer: '阶跃星辰', priority: 'high' as Priority },
  { type: '合成数据生成', customer: '华为ADS', priority: 'high' as Priority },
  { type: '合成数据生成', customer: '华为ADS', priority: 'high' as Priority },
  { type: '感知数据清洗', customer: '华为ADS', priority: 'medium' as Priority },
  { type: '感知数据清洗', customer: '华为ADS', priority: 'medium' as Priority },
  { type: '感知数据清洗', customer: '招商银行', priority: 'medium' as Priority },
  { type: '感知数据清洗', customer: '招商银行', priority: 'medium' as Priority },
  // Node02 (U35-U32)
  { type: '感知数据清洗', customer: '招商银行', priority: 'medium' as Priority },
  { type: '感知数据清洗', customer: '招商银行', priority: 'medium' as Priority },
  { type: '离线向量化', customer: '招商银行', priority: 'low' as Priority },
  { type: '离线向量化', customer: '其他客户', priority: 'low' as Priority },
  { type: '离线向量化', customer: '其他客户', priority: 'low' as Priority },
  { type: '离线向量化', customer: '其他客户', priority: 'low' as Priority },
  { type: '合成数据生成', customer: '阶跃星辰', priority: 'high' as Priority },
  { type: '合成数据生成', customer: '阶跃星辰', priority: 'high' as Priority },
  // Node03 (U25-U22)
  { type: '合成数据生成', customer: '华为ADS', priority: 'high' as Priority },
  { type: '合成数据生成', customer: '华为ADS', priority: 'high' as Priority },
  { type: '合成数据生成', customer: '阶跃星辰', priority: 'high' as Priority },
  { type: '合成数据生成', customer: '阶跃星辰', priority: 'high' as Priority },
  { type: '离线向量化', customer: '其他客户', priority: 'low' as Priority },
  { type: '离线向量化', customer: '其他客户', priority: 'low' as Priority },
  { type: '离线向量化', customer: '招商银行', priority: 'low' as Priority },
  { type: '离线向量化', customer: '招商银行', priority: 'low' as Priority },
  // Node04 (U18-U15)
  { type: '感知数据清洗', customer: '华为ADS', priority: 'medium' as Priority },
  { type: '感知数据清洗', customer: '华为ADS', priority: 'medium' as Priority },
  { type: '感知数据清洗', customer: '招商银行', priority: 'medium' as Priority },
  { type: '感知数据清洗', customer: '招商银行', priority: 'medium' as Priority },
  { type: '合成数据生成', customer: '阶跃星辰', priority: 'high' as Priority },
  { type: '合成数据生成', customer: '阶跃星辰', priority: 'high' as Priority },
  { type: '离线向量化', customer: '其他客户', priority: 'low' as Priority },
  { type: '离线向量化', customer: '其他客户', priority: 'low' as Priority },
  // Node05 (U11-U8)
  { type: '离线向量化', customer: '招商银行', priority: 'low' as Priority },
  { type: '离线向量化', customer: '其他客户', priority: 'low' as Priority },
  { type: '感知数据清洗', customer: '华为ADS', priority: 'medium' as Priority },
  { type: '感知数据清洗', customer: '华为ADS', priority: 'medium' as Priority },
  { type: '感知数据清洗', customer: '招商银行', priority: 'medium' as Priority },
  { type: '感知数据清洗', customer: '招商银行', priority: 'medium' as Priority },
  { type: '离线向量化', customer: '其他客户', priority: 'low' as Priority },
  { type: '离线向量化', customer: '其他客户', priority: 'low' as Priority },
];

const BASE_TEMPS = [
  58,60,57,59,61,60,58,59, // Node01
  61,62,60,61,63,61,60,62, // Node02 (GPU04=82 is anomaly)
  57,58,59,60,58,60,59,58, // Node03
  61,60,62,61,63,62,60,62, // Node04 (GPU06=81 is anomaly)
  58,57,59,60,58,59,60,58, // Node05
];

function calcStatus(temp: number): GPUStatus {
  if (temp > 85) return 'FAULT';
  if (temp > 70) return 'HIGH';
  return 'OK';
}

export function useGPUData() {
  const [gpus, setGpus] = useState<GPUUnit[]>(() => {
    return Array.from({ length: 40 }, (_, i) => {
      const nodeId = Math.floor(i / 8) + 1;
      const gpuIndex = (i % 8) + 1;
      let baseTemp = BASE_TEMPS[i];
      // Anomalies for Node02-GPU04 and Node04-GPU06
      if (nodeId === 2 && gpuIndex === 4) baseTemp = 82;
      if (nodeId === 4 && gpuIndex === 6) baseTemp = 81;
      return {
        id: `Node0${nodeId}-GPU0${gpuIndex}`,
        nodeId,
        gpuIndex,
        temperature: baseTemp,
        vramUsage: [76,81,74,82,78,80,77,79,83,84,82,83,85,83,81,84,75,77,79,80,76,78,74,77,83,82,84,83,85,84,82,84,76,74,78,77,79,78,80,76][i],
        pumpPWM: 75,
        status: calcStatus(baseTemp),
        task: TASK_ASSIGNMENTS[i],
      };
    });
  });

  const [cooling, setCooling] = useState<CoolingLoop>({
    supplyTemp: 32.1, returnTemp: 38.7, flowRate: 198.6,
    deltaT: 6.6, pressure: 2.35, pumpPWM: 75, fanPWM: 35,
  });

  const [pue, setPue] = useState(1.08);
  const [escapePhase, setEscapePhase] = useState<'idle' | 'phase1' | 'phase2' | 'phase3' | 'complete'>('idle');

  // Real-time data fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setGpus(prev => prev.map(g => {
        const tempDelta = (Math.random() - 0.5) * 1.5;
        const newTemp = Math.round((g.temperature + tempDelta) * 10) / 10;
        return {
          ...g,
          temperature: Math.max(35, Math.min(95, newTemp)),
          vramUsage: Math.min(100, Math.max(50, Math.round(g.vramUsage + (Math.random() - 0.5) * 3))),
          status: calcStatus(newTemp),
        };
      }));

      // Cooling loop fluctuation
      setCooling(prev => ({
        ...prev,
        supplyTemp: Math.round((prev.supplyTemp + (Math.random() - 0.5) * 0.2) * 10) / 10,
        returnTemp: Math.round((prev.returnTemp + (Math.random() - 0.5) * 0.3) * 10) / 10,
        flowRate: Math.round((prev.flowRate + (Math.random() - 0.5) * 2) * 10) / 10,
      }));

      // Dynamic PUE
      setPue(prev => {
        const avgTemp = gpus.reduce((s, g) => s + g.temperature, 0) / gpus.length;
        const targetPue = 1.06 + (avgTemp - 50) / 500;
        return Math.round((prev + (targetPue - prev) * 0.1) * 100) / 100;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gpus]);

  // Smart cooling: adjust pump PWM based on GPU temps
  useEffect(() => {
    const maxTemp = Math.max(...gpus.map(g => g.temperature));
    const avgTemp = gpus.reduce((s, g) => s + g.temperature, 0) / gpus.length;

    let targetPumpPWM = 75;
    if (maxTemp > 75) targetPumpPWM = 85;
    else if (avgTemp < 60) targetPumpPWM = 70;

    setCooling(prev => ({ ...prev, pumpPWM: targetPumpPWM }));
  }, [gpus]);

  // Escape phase simulation
  const triggerEscape = useCallback(() => {
    setEscapePhase('phase1');
    // Phase 1: low priority GPUs PAUSED
    setGpus(prev => prev.map(g => {
      if (g.task?.priority === 'low') return { ...g, status: 'PAUSED' as GPUStatus };
      return g;
    }));

    setTimeout(() => {
      setEscapePhase('phase2');
      setGpus(prev => prev.map(g => {
        if (g.task?.priority === 'medium') return { ...g, status: 'PAUSED' as GPUStatus };
        return g;
      }));
    }, 200);

    setTimeout(() => {
      setEscapePhase('phase3');
    }, 400);

    setTimeout(() => {
      setEscapePhase('complete');
      // Resume all GPUs
      setGpus(prev => prev.map(g => ({
        ...g,
        status: calcStatus(g.temperature),
      })));
    }, 1230);
  }, []);

  const resetEscape = useCallback(() => {
    setEscapePhase('idle');
    setGpus(prev => prev.map(g => ({
      ...g,
      status: calcStatus(g.temperature),
    })));
  }, []);

  return {
    gpus,
    cooling,
    pue,
    escapePhase,
    triggerEscape,
    resetEscape,
  };
}
