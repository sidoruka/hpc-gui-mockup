import { Folder, Terminal, Globe, FileText } from 'lucide-react';

const icons = [
  { Icon: Folder, label: 'Home', color: '#0078d4' },
  { Icon: Terminal, label: 'Terminal', color: '#107c10' },
  { Icon: Globe, label: 'Browser', color: '#5c2d91' },
  { Icon: FileText, label: 'Documents', color: '#d83b01' },
];

export function DesktopView() {
  return (
    <div
      style={{
        height: '100%',
        background: 'linear-gradient(180deg, #2d2d30 0%, #1e1e1e 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
          gap: '24px',
          padding: '24px',
          alignContent: 'start',
          alignItems: 'start',
        }}
      >
        {icons.map(({ Icon, label, color }) => (
          <div
            key={label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
            }}
            title={label}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '8px',
                background: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <Icon size={28} />
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</span>
          </div>
        ))}
      </div>
      <div
        style={{
          height: 40,
          background: 'var(--bg-active)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '12px',
          gap: '8px',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '4px',
            background: 'var(--accent-shell)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Terminal size={18} color="#fff" />
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Taskbar</span>
      </div>
    </div>
  );
}
