interface Props {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ visible, onConfirm, onCancel }: Props) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
      }}
      onClick={onCancel}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#0f0f12', border: '2px solid #ff3333',
          padding: '28px', maxWidth: '420px', width: '90%',
          fontFamily: '"Consolas", "Monaco", "Courier New", monospace',
          boxShadow: '0 0 20px rgba(255,51,51,0.3)',
        }}
      >
        {/* Warning header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <span style={{ fontSize: '24px' }}>&#9888;</span>
          <span style={{ color: '#ff3333', fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em' }}>
            算电逃生演练确认
          </span>
        </div>

        <div style={{ height: '1px', backgroundColor: 'rgba(255,51,51,0.3)', marginBottom: '16px' }} />

        <p style={{ color: '#8a8a9a', fontSize: '11px', lineHeight: '1.6', marginBottom: '8px' }}>
          此操作将模拟变压器 150% 过载，触发三级任务卸载流程。
        </p>
        <p style={{ color: '#8a8a9a', fontSize: '11px', lineHeight: '1.6', marginBottom: '8px' }}>
          所有低优先级和中优先级任务将被暂停，核心数据将自动备份到 NVMe 阵列。
        </p>
        <p style={{ color: '#8a8a9a', fontSize: '11px', lineHeight: '1.6', marginBottom: '20px' }}>
          演练过程不会影响硬件安全，预计耗时 <span style={{ color: '#ff3333', fontWeight: 700 }}>1.23 秒</span>。
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, backgroundColor: 'transparent', border: '1px solid #3a506b',
              color: '#5a5a6a', padding: '10px', fontSize: '11px', fontFamily: 'inherit',
              cursor: 'pointer', letterSpacing: '0.06em',
            }}
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, backgroundColor: 'rgba(255,51,51,0.2)', border: '1px solid #ff3333',
              color: '#ff3333', padding: '10px', fontSize: '11px', fontFamily: 'inherit',
              cursor: 'pointer', letterSpacing: '0.06em', fontWeight: 700,
            }}
          >
            确认触发
          </button>
        </div>
      </div>
    </div>
  );
}
