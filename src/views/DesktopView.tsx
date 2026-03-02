import { Folder, Terminal, Globe, FileText } from 'lucide-react';

const SCHRODINGER_ICON =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNkvvOFYYJRnCpXrRMcydHfuKEEcXsnXnrBQ&s';
const MONOLIX_ICON =
  'https://www.simulations-plus.com/wp-content/uploads/prod_icon_monolix.png';
const MATLAB_ICON =
  'https://upload.wikimedia.org/wikipedia/commons/4/4b/Matlab_icon.png';

const icons: Array<
  | { Icon: typeof Folder; label: string; color: string; iconSrc?: undefined }
  | { Icon?: undefined; label: string; iconSrc: string; color?: undefined }
> = [
  { Icon: Folder, label: 'Home', color: '#0078d4' },
  { Icon: Terminal, label: 'Terminal', color: '#107c10' },
  { Icon: Globe, label: 'Browser', color: '#5c2d91' },
  { Icon: FileText, label: 'Documents', color: '#d83b01' },
  { label: 'Schrodinger', iconSrc: SCHRODINGER_ICON },
  { label: 'Monolix', iconSrc: MONOLIX_ICON },
  { label: 'Matlab', iconSrc: MATLAB_ICON },
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
        {icons.map((item) => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
            }}
            title={item.label}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '8px',
                background: 'iconSrc' in item ? 'var(--bg-active)' : item.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                overflow: 'hidden',
              }}
            >
              {'iconSrc' in item ? (
                <img
                  src={item.iconSrc}
                  alt=""
                  style={{ width: 40, height: 40, objectFit: 'contain' }}
                />
              ) : (
                <item.Icon size={28} />
              )}
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.label}</span>
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
