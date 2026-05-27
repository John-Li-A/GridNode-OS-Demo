import { useState } from 'react';
import PnIDPage from './AppPnID';
import { SiteIsometricPage } from './pages/SiteIsometric';
import { MicrogridControlPage } from './pages/MicrogridControl';
import { GPUClusterPage } from './pages/GPUCluster';

type Page = 'pnid' | 'site' | 'microgrid' | 'gpucluster';

function App() {
  const [page, setPage] = useState<Page>('site');

  return (
    <>
      {page === 'pnid' && <PnIDPage />}
      {page === 'site' && <SiteIsometricPage />}
      {page === 'microgrid' && <MicrogridControlPage />}
      {page === 'gpucluster' && <GPUClusterPage />}

      {/* Page switcher */}
      <div style={{
        position: 'fixed',
        top: '4px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        gap: '2px',
        fontFamily: '"Consolas",monospace',
        fontSize: '10px',
      }}>
        {([
          ['pnid', 'P&amp;ID'],
          ['site', 'SITE 3D'],
          ['microgrid', 'MICROGRID'],
          ['gpucluster', 'GPU'],
        ] as [Page, string][]).map(([p, label]) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{
              backgroundColor: page === p ? 'rgba(0,170,255,0.3)' : 'rgba(10,10,12,0.8)',
              border: `1px solid ${page === p ? '#00aaff' : '#3a506b'}`,
              color: page === p ? '#00aaff' : '#5a5a6a',
              padding: '3px 12px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 'inherit',
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}

export default App;
