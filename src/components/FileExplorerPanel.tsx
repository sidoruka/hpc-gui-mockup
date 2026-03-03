import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  File,
  FileText,
  ChevronRight,
  ChevronDown,
  Share2,
  Database,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import type { TabType } from '../state/appState';

export type FileTreeNode = {
  name: string;
  children?: FileTreeNode[];
  isFile?: boolean;
};

const SECTION_CONFIG: {
  id: DataSectionId;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: 'my-files', label: 'My files', icon: Folder },
  { id: 'shared-with-me', label: 'Shared with me', icon: Share2 },
  { id: 'common-data', label: 'Common data', icon: Database },
];

const MOCK_TREE: Record<DataSectionId, FileTreeNode[]> = {
  'my-files': [
    { name: 'projects', children: [
      { name: 'hpc-job', children: [
        { name: 'script.sh', isFile: true },
        { name: 'config.yaml', isFile: true },
      ]},
      { name: 'notebooks', children: [
        { name: 'analysis.ipynb', isFile: true },
      ]},
    ]},
    { name: 'documents', children: [
      { name: 'report.pdf', isFile: true },
      { name: 'notes.txt', isFile: true },
      { name: 'page.html', isFile: true },
      { name: 'diagram.png', isFile: true },
    ]},
    { name: 'scratch', children: [
      { name: 'data.csv', isFile: true },
      { name: 'temp.log', isFile: true },
    ]},
  ],
  'shared-with-me': [
    { name: 'Team Alpha', children: [
      { name: 'shared_report.pdf', isFile: true },
      { name: 'dataset_v2.csv', isFile: true },
    ]},
    { name: 'Reports 2024', children: [
      { name: 'Q1_summary.pptx', isFile: true },
      { name: 'Q2_summary.pptx', isFile: true },
    ]},
  ],
  'common-data': [
    { name: 'datasets', children: [
      { name: 'public', children: [
        { name: 'sample.csv', isFile: true },
        { name: 'README.txt', isFile: true },
      ]},
    ]},
    { name: 'software', children: [
      { name: 'bin', children: [] },
      { name: 'lib', children: [] },
    ]},
    { name: 'reference', children: [
      { name: 'docs', children: [
        { name: 'guide.pdf', isFile: true },
      ]},
    ]},
  ],
};

export type DataSectionId = 'my-files' | 'shared-with-me' | 'common-data';

/** MIME type for drag from file explorer; data: JSON { sectionId, relativePath } */
export const FILE_EXPLORER_DRAG_TYPE = 'application/x-hpc-explorer-path';

interface FileExplorerPanelProps {
  collapsed: boolean;
  width: number;
  isResizing?: boolean;
  onToggleSidebar: () => void;
  onOpenApp: (type: TabType) => void;
  /** Open a file from the tree in the main pane (path e.g. my-files/documents/report.pdf) */
  onOpenFile?: (filePath: string) => void;
}

const DEFAULT_WIDTH = 260;
const MIN_WIDTH = 200;
const MAX_WIDTH = 420;
const COLLAPSED_WIDTH = 48;

function TreeItem({
  node,
  depth,
  pathPrefix,
  sectionId,
  expanded,
  onToggle,
  onOpenFile,
}: {
  node: FileTreeNode;
  depth: number;
  /** Parent path e.g. "my-files/documents" for building full file path */
  pathPrefix: string;
  sectionId: DataSectionId;
  expanded: Record<string, boolean>;
  onToggle: (path: string) => void;
  onOpenFile?: (filePath: string) => void;
}) {
  const isFile = node.isFile === true || (node.children?.length === 0 && !node.children);
  const hasChildren = node.children && node.children.length > 0;
  const path = `${depth}-${node.name}`;
  const isExpanded = expanded[path];
  const fullPath = pathPrefix ? `${pathPrefix}/${node.name}` : node.name;
  const relativePath = pathPrefix === sectionId ? node.name : fullPath.slice(sectionId.length + 1);

  const handleClick = () => {
    if (isFile) {
      onOpenFile?.(fullPath);
    } else if (hasChildren) {
      onToggle(path);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(FILE_EXPLORER_DRAG_TYPE, JSON.stringify({ sectionId, relativePath }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        role="button"
        tabIndex={0}
        draggable
        onDragStart={handleDragStart}
        onClick={handleClick}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '2px 8px',
          marginLeft: depth * 12,
          cursor: 'pointer',
          borderRadius: '4px',
          fontSize: '13px',
          color: 'var(--text-primary)',
          minHeight: 22,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--bg-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <span style={{ width: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!isFile && hasChildren ? (
            isExpanded ? (
              <ChevronDown size={14} color="var(--text-secondary)" />
            ) : (
              <ChevronRight size={14} color="var(--text-secondary)" />
            )
          ) : !isFile ? (
            <ChevronRight size={14} color="transparent" />
          ) : null}
        </span>
        {isFile ? (
          node.name.endsWith('.pdf') || node.name.endsWith('.pptx') ? (
            <FileText size={16} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
          ) : (
            <File size={16} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
          )
        ) : isExpanded ? (
          <FolderOpen size={16} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
        ) : (
          <Folder size={16} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
        )}
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {node.name}
        </span>
      </div>
      {!isFile && hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeItem
              key={child.name}
              node={child}
              depth={depth + 1}
              pathPrefix={fullPath}
              sectionId={sectionId}
              expanded={expanded}
              onToggle={onToggle}
              onOpenFile={onOpenFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorerPanel({
  collapsed,
  width = DEFAULT_WIDTH,
  isResizing = false,
  onToggleSidebar,
  onOpenApp,
  onOpenFile,
}: FileExplorerPanelProps) {
  const [sectionsExpanded, setSectionsExpanded] = useState<Record<DataSectionId, boolean>>({
    'my-files': false,
    'shared-with-me': false,
    'common-data': false,
  });
  const [treeExpanded, setTreeExpanded] = useState<Record<string, boolean>>({});

  const toggleSection = (id: DataSectionId) =>
    setSectionsExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleTreePath = (path: string) =>
    setTreeExpanded((prev) => ({ ...prev, [path]: !prev[path] }));

  const effectiveWidth = collapsed ? COLLAPSED_WIDTH : width;

  if (collapsed) {
    return (
      <aside
        style={{
          width: COLLAPSED_WIDTH,
          minWidth: COLLAPSED_WIDTH,
          flexShrink: 0,
          background: 'var(--bg-sidebar)',
          borderLeft: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <div style={{ flex: 1 }} />
        <div
          style={{
            padding: '8px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <button
            type="button"
            onClick={onToggleSidebar}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px',
            }}
            title="Expand Data Explorer"
          >
            <PanelRightOpen size={14} />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside
      style={{
        width: effectiveWidth,
        minWidth: effectiveWidth,
        flexShrink: 0,
        background: 'var(--bg-sidebar)',
        borderLeft: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: isResizing ? 'none' : 'width 0.2s ease',
      }}
    >
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 0' }}>
        {SECTION_CONFIG.map(({ id, label, icon: Icon }) => {
          const isExpanded = sectionsExpanded[id];
          const nodes = MOCK_TREE[id];
          return (
            <div key={id} style={{ marginBottom: '4px' }}>
              <button
                type="button"
                onClick={() => toggleSection(id)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onOpenApp(id);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {isExpanded ? (
                  <ChevronDown size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
                ) : (
                  <ChevronRight size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
                )}
                <Icon size={16} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
              </button>
              {isExpanded && nodes && (
                <div style={{ paddingLeft: 4 }}>
                  {nodes.map((node) => (
                    <TreeItem
                      key={node.name}
                      node={node}
                      depth={0}
                      pathPrefix={id}
                      sectionId={id}
                      expanded={treeExpanded}
                      onToggle={toggleTreePath}
                      onOpenFile={onOpenFile}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div
        style={{
          padding: '8px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <button
          type="button"
          onClick={onToggleSidebar}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px',
          }}
          title="Collapse Data Explorer"
        >
          <PanelRightClose size={14} />
        </button>
        <span
          style={{
            fontSize: '11px',
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title="180 Gb out of 500 Gb available"
        >
          180 Gb out of 500 Gb available
        </span>
      </div>
    </aside>
  );
}

export { DEFAULT_WIDTH as FILE_EXPLORER_DEFAULT_WIDTH, MIN_WIDTH as FILE_EXPLORER_MIN_WIDTH, MAX_WIDTH as FILE_EXPLORER_MAX_WIDTH };
