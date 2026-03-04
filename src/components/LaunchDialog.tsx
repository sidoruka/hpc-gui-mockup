import React, { useState, useMemo } from 'react';
import { Search, X, Terminal, Monitor, Layers, Plus } from 'lucide-react';
import { getLaunchableAppsCatalog } from '../state/appState';
import { launchableAppIconMap } from './launchableAppIcons';

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
  width: 'min(480px, 90vw)',
  maxHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

interface LaunchDialogProps {
  onClose: () => void;
  onLaunch: (catalogAppId: string) => void;
  onBuildNewApp?: () => void;
}

export function LaunchDialog({ onClose, onLaunch, onBuildNewApp }: LaunchDialogProps) {
  const [query, setQuery] = useState('');
  const catalog = useMemo(() => getLaunchableAppsCatalog(), []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.id.toLowerCase().includes(q)
    );
  }, [catalog, query]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="launch-dialog-title"
      style={overlayStyle}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <h2
            id="launch-dialog-title"
            style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}
          >
            Launch app
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              background: 'var(--bg-search)',
              borderRadius: '8px',
            }}
          >
            <Search size={18} color="var(--text-secondary)" />
            <input
              type="text"
              placeholder="Search apps..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '14px',
              }}
            />
          </div>
        </div>
        {onBuildNewApp && (
          <div style={{ padding: '0 20px 12px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => {
                onBuildNewApp();
                onClose();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: 'transparent',
                border: '1px dashed var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-hover)';
                e.currentTarget.style.borderColor = 'var(--text-secondary)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <Plus size={18} />
              Build a new app
            </button>
          </div>
        )}
        <div style={{ flex: 1, overflow: 'auto', padding: '8px 12px 16px' }}>
          {filtered.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', padding: '24px 0', margin: 0 }}>
              No apps match your search.
            </p>
          ) : (
            filtered.map((app) => {
              const Icon = launchableAppIconMap[app.iconKey] ?? Layers;
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => {
                    onLaunch(app.id);
                    onClose();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 14px',
                    marginBottom: '4px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      background: 'var(--accent-launch)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={22} color="#fff" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '2px' }}>
                      {app.name}
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        marginBottom: '4px',
                      }}
                    >
                      {app.description}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {app.appType === 'shell' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          <Terminal size={12} />
                          Shell
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          <Monitor size={12} />
                          Interactive
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
