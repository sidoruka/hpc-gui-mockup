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

function PromptLine({
  input,
  cursorAt,
  showCursor = false,
}: {
  input: string;
  cursorAt?: number;
  showCursor?: boolean;
}) {
  const pos = showCursor ? Math.min(cursorAt ?? input.length, input.length) : input.length;
  return (
    <div style={{ marginBottom: '8px' }}>
      <span style={{ color: '#4ec9b0' }}>user@login</span>
      <span style={{ color: '#808080' }}>:</span>
      <span style={{ color: '#ce9178' }}>~</span>
      <span style={{ color: '#d4d4d4' }}> $ </span>
      <span style={{ color: '#dcdcaa' }}>{input.slice(0, pos)}</span>
      {showCursor && <span style={{ color: '#6a9955' }}>█</span>}
      <span style={{ color: '#dcdcaa' }}>{input.slice(pos)}</span>
    </div>
  );
}

export function ShellView() {
  const [commandLine, setCommandLine] = useState('');
  const [cursor, setCursor] = useState(0);
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
      const insert = commandLine ? ` ${path}` : path;
      setCommandLine((prev) => prev.slice(0, cursor) + insert + prev.slice(cursor));
      setCursor((prev) => prev + insert.length);
    } catch {
      // ignore invalid drag data
    }
  }, [commandLine, cursor]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      e.preventDefault();
      setHistory((prev) => [...prev, { input: commandLine, interrupted: true }]);
      setCommandLine('');
      setCursor(0);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (commandLine.trim() === 'clear') {
        setHistory([]);
        setCommandLine('');
        setCursor(0);
      } else {
        setHistory((prev) => [...prev, { input: commandLine }]);
        setCommandLine('');
        setCursor(0);
      }
      return;
    }
    if (e.ctrlKey || e.metaKey) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (cursor > 0) {
        setCommandLine((prev) => prev.slice(0, cursor - 1) + prev.slice(cursor));
        setCursor((prev) => prev - 1);
      }
      return;
    }
    if (e.key === 'Delete') {
      e.preventDefault();
      if (cursor < commandLine.length) {
        setCommandLine((prev) => prev.slice(0, cursor) + prev.slice(cursor + 1));
      }
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setCursor((prev) => Math.max(0, prev - 1));
      return;
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setCursor((prev) => Math.min(commandLine.length, prev + 1));
      return;
    }
    if (e.key === 'Home') {
      e.preventDefault();
      setCursor(0);
      return;
    }
    if (e.key === 'End') {
      e.preventDefault();
      setCursor(commandLine.length);
      return;
    }
    if (e.key.length === 1 && !e.altKey) {
      e.preventDefault();
      setCommandLine((prev) => prev.slice(0, cursor) + e.key + prev.slice(cursor));
      setCursor((prev) => prev + 1);
    }
  }, [commandLine, cursor]);

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
        <span style={{ color: '#569cd6' }}>Welcome to HPC login node.</span>
      </div>
      {history.map((entry, i) => (
        <div key={i}>
          <PromptLine input={entry.input} />
          {entry.interrupted && (
            <div style={{ marginBottom: '8px', color: '#808080' }}>^C</div>
          )}
        </div>
      ))}
      <PromptLine input={commandLine} cursorAt={cursor} showCursor />
    </div>
  );
}
