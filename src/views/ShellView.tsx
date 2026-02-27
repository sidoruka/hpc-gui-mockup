
export function ShellView() {
  return (
    <div
      style={{
        height: '100%',
        padding: '16px',
        background: '#0c0c0c',
        fontFamily: 'ui-monospace, monospace',
        fontSize: '14px',
        color: '#d4d4d4',
        overflow: 'auto',
      }}
    >
      <div style={{ marginBottom: '8px' }}>
        <span style={{ color: '#4ec9b0' }}>user@login</span>
        <span style={{ color: '#808080' }}>:</span>
        <span style={{ color: '#ce9178' }}>~</span>
        <span style={{ color: '#d4d4d4' }}> $ </span>
      </div>
      <div style={{ marginBottom: '8px' }}>
        <span style={{ color: '#569cd6' }}>Welcome to HPC login node.</span>
      </div>
      <div style={{ marginBottom: '8px' }}>
        <span style={{ color: '#4ec9b0' }}>user@login</span>
        <span style={{ color: '#808080' }}>:</span>
        <span style={{ color: '#ce9178' }}>~</span>
        <span style={{ color: '#d4d4d4' }}> $ </span>
        <span style={{ color: '#dcdcaa' }}>ls -la</span>
      </div>
      <div style={{ marginBottom: '8px', color: '#808080' }}>
        total 24<br />
        drwxr-xr-x 4 user group 4096 Feb 27 10:00 .
        <br />
        drwxr-xr-x 6 user group 4096 Feb 20 09:00 ..
        <br />
        drwxr-xr-x 2 user group 4096 Feb 27 09:00 projects
        <br />
        -rw-r--r-- 1 user group 1024 Feb 26 14:00 data.csv
      </div>
      <div>
        <span style={{ color: '#4ec9b0' }}>user@login</span>
        <span style={{ color: '#808080' }}>:</span>
        <span style={{ color: '#ce9178' }}>~</span>
        <span style={{ color: '#d4d4d4' }}> $ </span>
        <span style={{ color: '#6a9955' }}>█</span>
      </div>
    </div>
  );
}
