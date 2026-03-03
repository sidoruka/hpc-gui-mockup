import { useState, useCallback, useRef, useEffect } from 'react';
import type { DataSectionId } from '../components/FileExplorerPanel';
import { FILE_EXPLORER_DRAG_TYPE } from '../components/FileExplorerPanel';

const PATH_PREFIX: Record<DataSectionId, string> = {
  'my-files': '/home/user/',
  'shared-with-me': '/shared/',
  'common-data': '/common/',
};

function pathFromDrag(sectionId: DataSectionId, relativePath: string): string {
  const prefix = PATH_PREFIX[sectionId] ?? '/home/user/';
  return prefix + relativePath;
}

function PromptLine({ input, showCursor = false }: { input: string; showCursor?: boolean }) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <span style={{ color: '#4ec9b0' }}>user@login</span>
      <span style={{ color: '#808080' }}>:</span>
      <span style={{ color: '#ce9178' }}>~</span>
      <span style={{ color: '#d4d4d4' }}> $ </span>
      <span style={{ color: '#dcdcaa' }}>{input}</span>
      {showCursor && <span style={{ color: '#6a9955' }}>█</span>}
    </div>
  );
}

export function ShellView() {
  const [commandLine, setCommandLine] = useState('');
  const [history, setHistory] = useState<Array<{ input: string; interrupted?: boolean }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.focus();
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.types.includes(FILE_EXPLORER_DRAG_TYPE)) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    const raw = e.dataTransfer.getData(FILE_EXPLORER_DRAG_TYPE);
    if (!raw) return;
    e.preventDefault();
    try {
      const { sectionId, relativePath } = JSON.parse(raw) as { sectionId: DataSectionId; relativePath: string };
      const path = pathFromDrag(sectionId, relativePath);
      setCommandLine((prev) => (prev ? `${prev} ${path}` : path));
    } catch {
      // ignore invalid drag data
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      e.preventDefault();
      setHistory((prev) => [...prev, { input: commandLine, interrupted: true }]);
      setCommandLine('');
    }
  }, [commandLine]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="textbox"
      aria-label="Shell terminal"
      style={{
        height: '100%',
        padding: '16px',
        background: '#0c0c0c',
        fontFamily: 'ui-monospace, monospace',
        fontSize: '14px',
        color: '#d4d4d4',
        overflow: 'auto',
        outline: 'none',
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onKeyDown={handleKeyDown}
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
      {history.map((entry, i) => (
        <div key={i}>
          <PromptLine input={entry.input} />
          {entry.interrupted && (
            <div style={{ marginBottom: '8px', color: '#808080' }}>^C</div>
          )}
        </div>
      ))}
      <PromptLine input={commandLine} showCursor />
    </div>
  );
}
