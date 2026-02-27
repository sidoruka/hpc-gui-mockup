import { Play, Square, Plus, Scissors, Save } from 'lucide-react';

export function JupyterView() {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        color: '#333',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: '#f7f7f7',
          borderBottom: '1px solid #ddd',
        }}
      >
        <button type="button" style={toolbarBtn} title="Run">
          <Play size={16} />
        </button>
        <button type="button" style={toolbarBtn} title="Stop">
          <Square size={16} />
        </button>
        <button type="button" style={toolbarBtn} title="Add cell">
          <Plus size={16} />
        </button>
        <button type="button" style={toolbarBtn} title="Cut">
          <Scissors size={16} />
        </button>
        <button type="button" style={toolbarBtn} title="Save">
          <Save size={16} />
        </button>
        <span style={{ marginLeft: '16px', fontSize: '13px', color: '#666' }}>notebook.ipynb</span>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginBottom: '12px',
            overflow: 'hidden',
          }}
        >
          <div style={{ background: '#f0f0f0', padding: '4px 12px', fontSize: '12px', color: '#666' }}>
            In [1]:
          </div>
          <pre
            style={{
              margin: 0,
              padding: '12px',
              fontFamily: 'monospace',
              fontSize: '13px',
              background: '#fff',
            }}
          >
            {`import numpy as np
x = np.linspace(0, 10, 100)
print("Hello from Jupyter on HPC")`}
          </pre>
        </div>
        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginBottom: '12px',
            overflow: 'hidden',
          }}
        >
          <div style={{ background: '#f0f0f0', padding: '4px 12px', fontSize: '12px', color: '#666' }}>
            Markdown
          </div>
          <div style={{ padding: '12px', fontSize: '14px' }}>
            <strong>Analysis notebook</strong>
            <br />
            This is a mock Jupyter notebook running on the HPC login node.
          </div>
        </div>
      </div>
    </div>
  );
}

const toolbarBtn = {
  padding: '6px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  background: '#fff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
