export function VSCodeView() {
  return (
    <div
      style={{
        height: '100%',
        padding: '16px',
        background: '#1e1e1e',
        fontFamily: 'ui-monospace, monospace',
        fontSize: '14px',
        color: '#d4d4d4',
        overflow: 'auto',
      }}
    >
      <div style={{ marginBottom: '8px', color: '#808080' }}>
        Explorer · Open Editors
      </div>
      <div style={{ marginBottom: '8px', color: '#6a9955' }}>
        // VSCode session on HPC login node
      </div>
      <div style={{ marginBottom: '8px' }}>
        <span style={{ color: '#569cd6' }}>No folder opened</span>
      </div>
      <div style={{ marginBottom: '8px', color: '#808080' }}>
        Open a folder to get started
      </div>
    </div>
  );
}
