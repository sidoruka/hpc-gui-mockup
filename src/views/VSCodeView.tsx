import { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Bug } from 'lucide-react';

const DEFAULT_CODE = `// VSCode session on HPC login node
// Edit this file — syntax highlighting, line numbers, full editor

function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

const message = greet("HPC");
console.log(message);
`;

const toolbarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '6px 12px',
  background: 'var(--bg-sidebar, #252526)',
  borderBottom: '1px solid var(--border-subtle, #3c3c3c)',
  flexShrink: 0,
};

const toolbarBtn: React.CSSProperties = {
  padding: '6px 10px',
  border: '1px solid transparent',
  borderRadius: '4px',
  background: 'transparent',
  color: 'var(--text-secondary, #e0e0e0)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  fontSize: '13px',
};

export function VSCodeView() {
  const [value, setValue] = useState(DEFAULT_CODE);

  const handleEditorChange = useCallback((newValue: string | undefined) => {
    setValue(newValue ?? '');
  }, []);

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        background: 'var(--bg-main, #1e1e1e)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={toolbarStyle}>
        <button type="button" style={toolbarBtn} title="Run">
          <Play size={16} />
          Run
        </button>
        <button type="button" style={toolbarBtn} title="Debug">
          <Bug size={16} />
          Debug
        </button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Editor
          height="100%"
        defaultLanguage="typescript"
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          lineNumbers: 'on',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
          padding: { top: 16 },
          renderLineHighlight: 'all',
          folding: true,
          bracketPairColorization: { enabled: true },
          wordWrap: 'off',
        }}
        />
      </div>
    </div>
  );
}
