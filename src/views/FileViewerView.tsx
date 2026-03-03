import { useCallback } from 'react';
import type { Tab } from '../state/appState';
import { FileText, Download } from 'lucide-react';

const TEXT_EXT = new Set([
  'txt', 'log', 'sh', 'bash', 'yaml', 'yml', 'json', 'csv', 'tsv', 'md', 'xml', 'html', 'htm',
  'py', 'r', 'ipynb', 'js', 'ts', 'css', 'sql', 'conf', 'cfg', 'ini', 'toml', 'env',
]);
const IMAGE_EXT = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico']);
const PDF_EXT = new Set(['pdf']);
const HTML_EXT = new Set(['html', 'htm']);

function getExt(path: string): string {
  const base = path.split('/').pop() ?? '';
  const i = base.lastIndexOf('.');
  return i >= 0 ? base.slice(i + 1).toLowerCase() : '';
}

function getMockTextContent(filePath: string, ext: string): string {
  const name = filePath.split('/').pop() ?? 'file';
  switch (ext) {
    case 'sh':
    case 'bash':
      return `#!/bin/bash
# ${name}
set -e
echo "Running job..."
srun --nodes=1 --ntasks=1 --cpus-per-task=4 my_script.py
`;
    case 'yaml':
    case 'yml':
      return `# Configuration
cluster: "hpc-cluster"
nodes: 2
walltime: "02:00:00"
memory: "16G"
`;
    case 'csv':
      return `id,name,value
1,alpha,0.42
2,beta,1.73
3,gamma,2.99
`;
    case 'tsv':
      return `id\tname\tvalue
1\talpha\t0.42
2\tbeta\t1.73
`;
    case 'json':
      return `{
  "version": "1.0",
  "params": { "threshold": 0.05 }
}
`;
    case 'log':
      return `[2024-01-15 10:23:01] Job started
[2024-01-15 10:23:02] Loading data...
[2024-01-15 10:25:33] Step 1 completed
[2024-01-15 10:28:00] Step 2 completed
`;
    case 'txt':
      return `Notes - ${name}\n\nAdd your notes here.`;
    default:
      return `# ${name}\n\n(Preview for text file.)`;
  }
}

function getMockHtmlContent(): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Document</title></head>
<body style="font-family: sans-serif; padding: 20px;">
  <h1>Sample HTML document</h1>
  <p>This is a preview of the HTML file content.</p>
</body></html>`;
}

function getMimeType(ext: string): string {
  const mime: Record<string, string> = {
    txt: 'text/plain',
    log: 'text/plain',
    csv: 'text/csv',
    tsv: 'text/tab-separated-values',
    json: 'application/json',
    html: 'text/html',
    htm: 'text/html',
    pdf: 'application/pdf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
  };
  return mime[ext] ?? 'application/octet-stream';
}

function triggerDownload(fileName: string, blob: Blob) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

interface FileViewerViewProps {
  tab: Tab;
}

const toolbarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 8,
  padding: '8px 12px',
  borderBottom: '1px solid var(--border-subtle)',
  background: 'var(--bg-sidebar)',
  flexShrink: 0,
};

function DownloadButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Download"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        color: 'var(--text-primary)',
        background: 'var(--bg-hover)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 6,
        cursor: 'pointer',
      }}
    >
      <Download size={16} />
    </button>
  );
}

export function FileViewerView({ tab }: FileViewerViewProps) {
  const filePath = tab.filePath ?? '';
  const ext = getExt(filePath);
  const fileName = filePath.split('/').pop() ?? 'file';

  const isText = TEXT_EXT.has(ext);
  const isImage = IMAGE_EXT.has(ext);
  const isPdf = PDF_EXT.has(ext);
  const isHtml = HTML_EXT.has(ext);

  const viewable = isText || isImage || isPdf || isHtml;

  const handleDownload = useCallback(() => {
    if (isText) {
      const content = getMockTextContent(filePath, ext);
      const blob = new Blob([content], { type: getMimeType(ext) });
      triggerDownload(fileName, blob);
      return;
    }
    if (isHtml) {
      const blob = new Blob([getMockHtmlContent()], { type: 'text/html' });
      triggerDownload(fileName, blob);
      return;
    }
    if (isPdf) {
      const content = '%PDF-1.4 (mock placeholder)\n';
      const blob = new Blob([content], { type: 'application/pdf' });
      triggerDownload(fileName, blob);
      return;
    }
    if (isImage) {
      fetch('/favicon.png')
        .then((r) => r.blob())
        .then((blob) => triggerDownload(fileName, blob));
      return;
    }
    // Unsupported type
    const blob = new Blob(['Preview not available. Mock file.'], { type: 'text/plain' });
    triggerDownload(fileName, blob);
  }, [filePath, fileName, ext, isText, isHtml, isPdf, isImage]);

  if (!viewable) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-main)',
        }}
      >
        <div style={toolbarStyle}>
          <DownloadButton onClick={handleDownload} />
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            color: 'var(--text-secondary)',
          }}
        >
          <FileText size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
          <p style={{ margin: 0, fontSize: 15 }}>Preview not available for this file type.</p>
          <p style={{ margin: '8px 0 0', fontSize: 13 }}>{fileName}</p>
        </div>
      </div>
    );
  }

  if (isPdf) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-main)',
        }}
      >
        <div style={toolbarStyle}>
          <DownloadButton onClick={handleDownload} />
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 640,
              aspectRatio: '1/1.414',
              background: 'var(--bg-sidebar)',
              borderRadius: 8,
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <FileText size={64} style={{ marginBottom: 16, opacity: 0.7 }} />
            <span style={{ fontSize: 14 }}>PDF document</span>
            <span style={{ fontSize: 12, marginTop: 4 }}>{fileName}</span>
          </div>
        </div>
      </div>
    );
  }

  if (isImage) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-main)',
        }}
      >
        <div style={toolbarStyle}>
          <DownloadButton onClick={handleDownload} />
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-subtle)',
              borderRadius: 8,
              overflow: 'hidden',
              background: 'var(--bg-sidebar)',
            }}
          >
            <img
              src="/favicon.png"
              alt={fileName}
              style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (isHtml) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
        <div style={toolbarStyle}>
          <DownloadButton onClick={handleDownload} />
        </div>
        <iframe
          title={fileName}
          srcDoc={getMockHtmlContent()}
          style={{
            flex: 1,
            width: '100%',
            border: 'none',
            background: '#fff',
          }}
          sandbox="allow-same-origin"
        />
      </div>
    );
  }

  // Text (including csv, tsv, etc.)
  const textContent = getMockTextContent(filePath, ext);
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-main)',
        overflow: 'hidden',
      }}
    >
      <div style={toolbarStyle}>
        <DownloadButton onClick={handleDownload} />
      </div>
      <pre
        style={{
          flex: 1,
          margin: 0,
          padding: 16,
          overflow: 'auto',
          fontSize: 13,
          lineHeight: 1.5,
          fontFamily: 'ui-monospace, "Cascadia Code", "SF Mono", Monaco, monospace',
          color: 'var(--text-primary)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}
      >
        <code>{textContent}</code>
      </pre>
    </div>
  );
}
