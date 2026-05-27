import { useState, useCallback } from 'react';
import type { Equipment, ValveState, DeviceDetail } from '@/types/pnid';

export function usePnIDInteraction() {
  const [hoveredPipe, setHoveredPipe] = useState<string | null>(null);
  const [deviceDetail, setDeviceDetail] = useState<DeviceDetail>({
    equipment: {
      id: '', name: '', code: '', description: '', x: 0, y: 0,
      width: 0, height: 0, status: 'normal', params: {},
    },
    visible: false,
  });
  const [activeValve, setActiveValve] = useState<ValveState | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

  const showDeviceDetail = useCallback((equipment: Equipment) => {
    setDeviceDetail({ equipment, visible: true });
    setSelectedEquipment(equipment.id);
  }, []);

  const hideDeviceDetail = useCallback(() => {
    setDeviceDetail(prev => ({ ...prev, visible: false }));
    setSelectedEquipment(null);
  }, []);

  const openValveControl = useCallback((valve: ValveState) => {
    setActiveValve(valve);
  }, []);

  const closeValveControl = useCallback(() => {
    setActiveValve(null);
  }, []);

  return {
    hoveredPipe,
    setHoveredPipe,
    deviceDetail,
    showDeviceDetail,
    hideDeviceDetail,
    activeValve,
    openValveControl,
    closeValveControl,
    selectedEquipment,
  };
}
