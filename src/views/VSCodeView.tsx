import { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';

const DEFAULT_CODE = `// VSCode session on HPC login node
// Edit this file — syntax highlighting, line numbers, full editor

function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

const message = greet("HPC");
console.log(message);
`;

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
      }}
    >
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
  );
}
