import React, { useState, useCallback, useEffect } from 'react';
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
  Copy,
  Download,
  Pencil,
  Trash2,
  Upload,
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

type ContextMenuState = {
  x: number;
  y: number;
  fullPath: string;
  sectionId: DataSectionId;
  nodeName: string;
  isFile: boolean;
  /** True when opened from "My files" / "Shared with me" / "Common data" header; only Create submenu is shown */
  isSectionHeader?: boolean;
} | null;

/** Path within section e.g. "documents/report.pdf" -> ["documents", "report.pdf"] */
function pathPartsWithinSection(fullPath: string, sectionId: DataSectionId): string[] {
  const prefix = sectionId + '/';
  const within = fullPath.startsWith(prefix) ? fullPath.slice(prefix.length) : fullPath;
  return within ? within.split('/') : [];
}

function cloneTree(nodes: FileTreeNode[]): FileTreeNode[] {
  return nodes.map((n) => ({
    ...n,
    children: n.children ? cloneTree(n.children) : undefined,
  }));
}

function renameNodeInTree(nodes: FileTreeNode[], pathParts: string[], newName: string): FileTreeNode[] {
  if (pathParts.length === 0) return nodes;
  const [head, ...rest] = pathParts;
  return nodes.map((node) => {
    if (node.name !== head) return node;
    if (rest.length === 0) return { ...node, name: newName };
    return {
      ...node,
      children: node.children ? renameNodeInTree(node.children, rest, newName) : undefined,
    };
  });
}

function deleteNodeInTree(nodes: FileTreeNode[], pathParts: string[]): FileTreeNode[] {
  if (pathParts.length === 0) return nodes;
  const [head, ...rest] = pathParts;
  if (rest.length === 0) return nodes.filter((n) => n.name !== head);
  return nodes.map((node) => {
    if (node.name !== head) return node;
    return {
      ...node,
      children: node.children ? deleteNodeInTree(node.children, rest) : undefined,
    };
  });
}

function addChildToTree(nodes: FileTreeNode[], pathParts: string[], child: FileTreeNode): FileTreeNode[] {
  if (pathParts.length === 0) return [...nodes, child];
  const [head, ...rest] = pathParts;
  return nodes.map((node) => {
    if (node.name !== head) return node;
    const children = node.children ?? [];
    return { ...node, children: rest.length === 0 ? [...children, child] : addChildToTree(children, rest, child) };
  });
}

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

const menuItemStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 12px',
  background: 'transparent',
  border: 'none',
  color: 'var(--text-primary, #e0e0e0)',
  cursor: 'pointer',
  fontSize: '13px',
  textAlign: 'left',
};

const submenuItemStyle: React.CSSProperties = {
  ...menuItemStyle,
  padding: '4px 12px',
  minHeight: 'unset',
};

function TreeItem({
  node,
  depth,
  pathPrefix,
  sectionId,
  expanded,
  onToggle,
  onOpenFile,
  onContextMenu,
}: {
  node: FileTreeNode;
  depth: number;
  /** Parent path e.g. "my-files/documents" for building full file path */
  pathPrefix: string;
  sectionId: DataSectionId;
  expanded: Record<string, boolean>;
  onToggle: (path: string) => void;
  onOpenFile?: (filePath: string) => void;
  onContextMenu?: (e: React.MouseEvent, payload: { fullPath: string; sectionId: DataSectionId; nodeName: string; isFile: boolean }) => void;
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
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onContextMenu?.(e, { fullPath, sectionId, nodeName: node.name, isFile: !!isFile });
        }}
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
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const initialTree = (): Record<DataSectionId, FileTreeNode[]> =>
  Object.fromEntries(
    (Object.keys(MOCK_TREE) as DataSectionId[]).map((id) => [id, cloneTree(MOCK_TREE[id])])
  ) as Record<DataSectionId, FileTreeNode[]>;

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
  const [treeData, setTreeData] = useState<Record<DataSectionId, FileTreeNode[]>>(initialTree);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);
  const [createSubmenuOpen, setCreateSubmenuOpen] = useState(false);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
    setCreateSubmenuOpen(false);
  }, []);

  useEffect(() => {
    if (!contextMenu) return;
    const onGlobalClick = () => closeContextMenu();
    window.addEventListener('click', onGlobalClick);
    return () => window.removeEventListener('click', onGlobalClick);
  }, [contextMenu, closeContextMenu]);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, payload: { fullPath: string; sectionId: DataSectionId; nodeName: string; isFile: boolean; isSectionHeader?: boolean }) => {
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        fullPath: payload.fullPath,
        sectionId: payload.sectionId,
        nodeName: payload.nodeName,
        isFile: payload.isFile,
        isSectionHeader: payload.isSectionHeader,
      });
      setCreateSubmenuOpen(false);
    },
    []
  );

  const copyPath = useCallback(() => {
    if (!contextMenu) return;
    navigator.clipboard.writeText(contextMenu.fullPath);
    closeContextMenu();
  }, [contextMenu, closeContextMenu]);

  const copyLinuxPath = useCallback(() => {
    if (!contextMenu) return;
    const linuxPath = `/home/user/${contextMenu.fullPath}`;
    navigator.clipboard.writeText(linuxPath);
    closeContextMenu();
  }, [contextMenu, closeContextMenu]);

  const download = useCallback(() => {
    if (!contextMenu) return;
    const blob = new Blob([`Mock content for ${contextMenu.fullPath}`], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = contextMenu.nodeName;
    a.click();
    URL.revokeObjectURL(url);
    closeContextMenu();
  }, [contextMenu, closeContextMenu]);

  const rename = useCallback(() => {
    if (!contextMenu) return;
    const newName = window.prompt('Rename', contextMenu.nodeName);
    if (newName == null || newName.trim() === '' || newName === contextMenu.nodeName) {
      closeContextMenu();
      return;
    }
    const pathParts = pathPartsWithinSection(contextMenu.fullPath, contextMenu.sectionId);
    setTreeData((prev) => ({
      ...prev,
      [contextMenu.sectionId]: renameNodeInTree(prev[contextMenu.sectionId], pathParts, newName.trim()),
    }));
    closeContextMenu();
  }, [contextMenu, closeContextMenu]);

  const deleteItem = useCallback(() => {
    if (!contextMenu) return;
    if (!window.confirm(`Delete "${contextMenu.nodeName}"?`)) {
      closeContextMenu();
      return;
    }
    const pathParts = pathPartsWithinSection(contextMenu.fullPath, contextMenu.sectionId);
    setTreeData((prev) => ({
      ...prev,
      [contextMenu.sectionId]: deleteNodeInTree(prev[contextMenu.sectionId], pathParts),
    }));
    closeContextMenu();
  }, [contextMenu, closeContextMenu]);

  const uploadFiles = useCallback(() => {
    if (!contextMenu) return;
    // Mock: in a real app would open file picker and upload to contextMenu.fullPath
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = () => {
      const names = input.files ? Array.from(input.files).map((f) => f.name) : [];
      if (names.length) console.log('Upload (mock) to', contextMenu?.fullPath, names);
    };
    input.click();
    closeContextMenu();
  }, [contextMenu, closeContextMenu]);

  const createFolder = useCallback(() => {
    if (!contextMenu) return;
    const name = window.prompt('New folder name');
    if (name == null || name.trim() === '') {
      setCreateSubmenuOpen(false);
      return;
    }
    const pathParts = contextMenu.isSectionHeader ? [] : pathPartsWithinSection(contextMenu.fullPath, contextMenu.sectionId);
    setTreeData((prev) => ({
      ...prev,
      [contextMenu.sectionId]: addChildToTree(prev[contextMenu.sectionId], pathParts, { name: name.trim(), children: [] }),
    }));
    if (contextMenu.isSectionHeader) {
      setSectionsExpanded((prev) => ({ ...prev, [contextMenu.sectionId]: true }));
    } else {
      const parentDepth = Math.max(0, pathParts.length - 1);
      const parentName = pathParts[pathParts.length - 1] ?? contextMenu.nodeName;
      setTreeExpanded((prev) => ({ ...prev, [`${parentDepth}-${parentName}`]: true }));
    }
    closeContextMenu();
  }, [contextMenu, closeContextMenu]);

  const createFile = useCallback(() => {
    if (!contextMenu) return;
    const name = window.prompt('New file name');
    if (name == null || name.trim() === '') {
      setCreateSubmenuOpen(false);
      return;
    }
    const pathParts = contextMenu.isSectionHeader ? [] : pathPartsWithinSection(contextMenu.fullPath, contextMenu.sectionId);
    setTreeData((prev) => ({
      ...prev,
      [contextMenu.sectionId]: addChildToTree(prev[contextMenu.sectionId], pathParts, { name: name.trim(), isFile: true }),
    }));
    if (contextMenu.isSectionHeader) {
      setSectionsExpanded((prev) => ({ ...prev, [contextMenu.sectionId]: true }));
    } else {
      const parentDepth = Math.max(0, pathParts.length - 1);
      const parentName = pathParts[pathParts.length - 1] ?? contextMenu.nodeName;
      setTreeExpanded((prev) => ({ ...prev, [`${parentDepth}-${parentName}`]: true }));
    }
    closeContextMenu();
  }, [contextMenu, closeContextMenu]);

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
          const nodes = treeData[id];
          return (
            <div key={id} style={{ marginBottom: '4px' }}>
              <button
                type="button"
                onClick={() => toggleSection(id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleContextMenu(e, { fullPath: id, sectionId: id, nodeName: label, isFile: false, isSectionHeader: true });
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
                      onContextMenu={handleContextMenu}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {contextMenu && (
        <div
          style={{
            position: 'fixed',
            left: createSubmenuOpen && !contextMenu.isFile ? contextMenu.x - 122 : contextMenu.x,
            top: contextMenu.y,
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'row',
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseLeave={() => setCreateSubmenuOpen(false)}
        >
          {createSubmenuOpen && !contextMenu.isFile && (
            <div
              role="menu"
              style={{
                minWidth: 120,
                padding: 0,
                marginRight: 2,
                alignSelf: 'flex-start',
                background: 'var(--bg-dropdown, #2d2d2d)',
                border: '1px solid var(--border-subtle, #444)',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                fontSize: '13px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <button
                type="button"
                role="menuitem"
                onClick={createFolder}
                style={submenuItemStyle}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <Folder size={14} style={{ flexShrink: 0 }} />
                Folder
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={createFile}
                style={submenuItemStyle}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <File size={14} style={{ flexShrink: 0 }} />
                File
              </button>
            </div>
          )}
          <div
            role="menu"
            style={{
              minWidth: contextMenu.isSectionHeader ? 120 : 180,
              padding: '4px 0',
              background: 'var(--bg-dropdown, #2d2d2d)',
              border: '1px solid var(--border-subtle, #444)',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              fontSize: '13px',
            }}
          >
            {!contextMenu.isSectionHeader && !contextMenu.isFile && (
              <button
                type="button"
                role="menuitem"
                onClick={uploadFiles}
                style={menuItemStyle}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <Upload size={14} style={{ flexShrink: 0 }} />
                Upload file(s)
              </button>
            )}
            {(!contextMenu.isFile || contextMenu.isSectionHeader) && (
              <button
                type="button"
                role="menuitem"
                style={{ ...menuItemStyle, justifyContent: contextMenu.isSectionHeader ? 'space-between' : undefined }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-hover)';
                  setCreateSubmenuOpen(true);
                }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Folder size={14} style={{ flexShrink: 0 }} />
                  Create
                </span>
                <ChevronRight size={14} style={{ flexShrink: 0 }} />
              </button>
            )}
            {!contextMenu.isSectionHeader && !contextMenu.isFile && (
              <div style={{ height: 1, background: 'var(--border-subtle, #444)', margin: '4px 8px' }} />
            )}
            {!contextMenu.isSectionHeader && (
              <>
          <button
            type="button"
            role="menuitem"
            onClick={copyPath}
            style={menuItemStyle}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Copy size={14} style={{ flexShrink: 0 }} />
            Copy path
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={copyLinuxPath}
            style={menuItemStyle}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Copy size={14} style={{ flexShrink: 0 }} />
            Copy linux path
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={download}
            style={menuItemStyle}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Download size={14} style={{ flexShrink: 0 }} />
            Download
          </button>
          <div style={{ height: 1, background: 'var(--border-subtle, #444)', margin: '4px 8px' }} />
          <button
            type="button"
            role="menuitem"
            onClick={rename}
            style={menuItemStyle}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Pencil size={14} style={{ flexShrink: 0 }} />
            Rename
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={deleteItem}
            style={menuItemStyle}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Trash2 size={14} style={{ flexShrink: 0 }} />
            Delete
          </button>
              </>
            )}
          </div>
        </div>
      )}
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
