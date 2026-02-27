import { useState } from 'react';
import { Folder, File, FileText, ChevronRight, ChevronDown } from 'lucide-react';
import type { TabType } from '../state/appState';

const mockTree: Record<string, { folders: string[]; files: string[] }> = {
  'my-files': {
    folders: ['projects', 'documents', 'scratch'],
    files: ['notes.txt', 'data.csv', 'report.pdf'],
  },
  'shared-with-me': {
    folders: ['Team Alpha', 'Reports 2024'],
    files: ['shared_report.pdf', 'dataset_v2.csv', 'presentation.pptx'],
  },
  'common-data': {
    folders: ['datasets', 'software', 'reference'],
    files: ['README.txt'],
  },
};

export function FileBrowserView({ tabType }: { tabType: TabType }) {
  const data = mockTree[tabType] ?? mockTree['my-files'];
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (name: string) => setExpanded((e) => ({ ...e, [name]: !e[name] }));

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        background: 'var(--bg-main)',
      }}
    >
      <div
        style={{
          width: 240,
          borderRight: '1px solid var(--border-subtle)',
          padding: '12px',
          overflow: 'auto',
        }}
      >
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Folders
        </div>
        {data.folders.map((name) => (
          <div
            key={name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 8px',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '13px',
            }}
            onClick={() => toggle(name)}
          >
            {expanded[name] ? (
              <ChevronDown size={16} color="var(--text-secondary)" />
            ) : (
              <ChevronRight size={16} color="var(--text-secondary)" />
            )}
            <Folder size={16} color="#0078d4" />
            {name}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: '12px', overflow: 'auto' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Files
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {data.files.map((name) => (
            <div
              key={name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              {name.endsWith('.pdf') || name.endsWith('.pptx') ? (
                <FileText size={18} color="#d83b01" />
              ) : (
                <File size={18} color="var(--text-secondary)" />
              )}
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
