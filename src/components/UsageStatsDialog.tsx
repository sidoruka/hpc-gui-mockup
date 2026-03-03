import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, TrendingDown } from 'lucide-react';

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const dialogStyle: React.CSSProperties = {
  background: 'var(--bg-sidebar)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  width: 'min(871px, 92vw)',
  maxHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const MOCK_COMPUTE_ROWS = [
  { name: 'relion', type: 'App', usageHours: 2.5, runsCount: 48, cost: 0.96 },
  { name: 'cellranger', type: 'App', usageHours: 2.07, runsCount: 48, cost: 0.96 },
  { name: 'chimera', type: 'App', usageHours: 192, runsCount: 4, cost: 68.3 },
];

const MOCK_STORAGE_ROWS: { name: string; type: string; usageHours: number; runsCount: number; cost: number }[] = [];

interface UsageStatsDialogProps {
  onClose: () => void;
}

export function UsageStatsDialog({ onClose }: UsageStatsDialogProps) {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(2); // 0-indexed: March = 2
  const [activeTab, setActiveTab] = useState<'compute' | 'storages'>('compute');

  const titleMonth = MONTHS[month];

  const goPrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };
  const goNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const handleExportCsv = () => {
    // Mock: could build CSV from current data and trigger download
  };

  const rows = activeTab === 'compute' ? MOCK_COMPUTE_ROWS : MOCK_STORAGE_ROWS;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="usage-stats-dialog-title"
      style={overlayStyle}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header: title + month nav + Export */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flex: 1,
              minWidth: 0,
            }}
          >
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous month"
              style={{
                background: 'var(--bg-active)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <h2
              id="usage-stats-dialog-title"
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                flex: 1,
                textAlign: 'center',
                minWidth: 0,
              }}
            >
              User statistics for {titleMonth} {year}
            </h2>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next month"
              style={{
                background: 'var(--bg-active)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <button
            type="button"
            onClick={handleExportCsv}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'var(--accent-launch)',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <Download size={16} />
            Export to CSV
          </button>
        </div>

        <div style={{ padding: '20px', overflow: 'auto', flex: 1 }}>
          {/* Summary cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                background: 'var(--bg-active)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '14px',
              }}
            >
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Most used apps (top 3)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {['chimera', 'cellranger', 'relion'].map((app) => (
                  <button
                    key={app}
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: 'var(--accent-launch)',
                      fontSize: '14px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      textDecoration: 'underline',
                    }}
                  >
                    {app}
                  </button>
                ))}
              </div>
            </div>
            <div
              style={{
                background: 'var(--bg-active)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '14px',
              }}
            >
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Most used pipelines (top 3)
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>—</div>
            </div>
            <div
              style={{
                background: 'var(--bg-active)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '14px',
              }}
            >
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Last connection date
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Mar 3, 2026, 15:46</div>
            </div>
            <div
              style={{
                background: 'var(--bg-active)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '14px',
              }}
            >
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Usage costs
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                <div>March: $1418.57</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--run-status-success)', marginTop: '4px' }}>
                  <TrendingDown size={14} />
                  <span>(-6.86%)</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  February: $1523
                </div>
              </div>
            </div>
          </div>

          {/* Detailed usage data */}
          <div style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Detailed usage data
          </div>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('compute')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                cursor: 'pointer',
                background: activeTab === 'compute' ? 'var(--accent-launch)' : 'var(--bg-active)',
                color: activeTab === 'compute' ? '#fff' : 'var(--text-primary)',
              }}
            >
              Compute instances
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('storages')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                cursor: 'pointer',
                background: activeTab === 'storages' ? 'var(--accent-launch)' : 'var(--bg-active)',
                color: activeTab === 'storages' ? '#fff' : 'var(--text-primary)',
              }}
            >
              Storages
            </button>
          </div>

          <div
            style={{
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              overflow: 'hidden',
              background: 'var(--bg-main)',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-active)' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                    Name
                  </th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                    Type
                  </th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                    Usage (hours)
                  </th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                    Runs count
                  </th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      No data for this period
                    </td>
                  </tr>
                ) : (
                  rows.map((row, i) => (
                    <tr
                      key={`${row.name}-${i}`}
                      style={{
                        borderBottom: i < rows.length - 1 ? '1px solid var(--border-subtle)' : undefined,
                      }}
                    >
                      <td style={{ padding: '10px 12px', color: 'var(--text-primary)' }}>{row.name}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-primary)' }}>{row.type}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-primary)' }}>{row.usageHours}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-primary)' }}>{row.runsCount}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-primary)' }}>${row.cost}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              background: 'var(--bg-active)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
