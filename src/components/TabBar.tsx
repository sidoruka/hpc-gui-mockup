import { useRef, useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, Maximize2 } from 'lucide-react';
import type { Tab } from '../state/appState';

const contextMenuStyle: React.CSSProperties = {
  position: 'fixed',
  background: 'var(--bg-sidebar)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '6px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  minWidth: 180,
  zIndex: 1000,
  overflow: 'hidden',
};

const contextMenuItemStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '8px 12px',
  textAlign: 'left',
  border: 'none',
  background: 'transparent',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  fontSize: '13px',
};

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string | null;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onOpenInNewWindow?: (tab: Tab) => void;
  onCloseAllTabs: () => void;
  onCloseOtherTabs: (keepTabId: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

function SortableTab({
  tab,
  isActive,
  onSelect,
  onClose,
  onOpenInNewWindow,
  onContextMenu,
}: {
  tab: Tab;
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
  onOpenInNewWindow?: (tab: Tab) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tab.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 12px',
        background: isActive ? 'var(--bg-active)' : 'transparent',
        borderBottom: isActive ? '2px solid var(--accent-shell)' : '2px solid transparent',
        cursor: 'pointer',
        minWidth: 0,
        maxWidth: 180,
        opacity: isDragging ? 0.5 : 1,
        borderTopLeftRadius: '6px',
        borderTopRightRadius: '6px',
      }}
      onClick={onSelect}
      onContextMenu={onContextMenu}
      {...attributes}
      {...listeners}
    >
      <span
        style={{
          fontSize: '13px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
        }}
      >
        {tab.title}
      </span>
      {onOpenInNewWindow && tab.type !== 'all-pipelines' && tab.type !== 'runs' && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenInNewWindow(tab);
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            borderRadius: '4px',
          }}
          title="Full size (open in new window)"
        >
          <Maximize2 size={14} />
        </button>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          borderRadius: '4px',
        }}
        title="Close"
      >
        <X size={14} />
      </button>
    </div>
  );
}

type ContextMenuState = { x: number; y: number; tabId: string } | null;

export function TabBar({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onOpenInNewWindow,
  onCloseAllTabs,
  onCloseOtherTabs,
  onReorder,
}: TabBarProps) {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (!contextMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [contextMenu]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const fromIndex = tabs.findIndex((t) => t.id === active.id);
      const toIndex = tabs.findIndex((t) => t.id === over.id);
      if (fromIndex !== -1 && toIndex !== -1) {
        onReorder(fromIndex, toIndex);
      }
    }
  };

  const handleTabContextMenu = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, tabId });
  };

  const showCloseOther = tabs.length > 1;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        background: 'var(--bg-sidebar)',
        borderBottom: '1px solid var(--border-subtle)',
        minHeight: 42,
      }}
    >
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tabs.map((t) => t.id)} strategy={horizontalListSortingStrategy}>
          {tabs.map((tab) => (
            <SortableTab
              key={tab.id}
              tab={tab}
              isActive={activeTabId === tab.id}
              onSelect={() => onSelectTab(tab.id)}
              onClose={() => onCloseTab(tab.id)}
              onOpenInNewWindow={onOpenInNewWindow}
              onContextMenu={(e) => handleTabContextMenu(e, tab.id)}
            />
          ))}
        </SortableContext>
      </DndContext>
      {contextMenu && (
        <div
          ref={menuRef}
          style={{
            ...contextMenuStyle,
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          <button
            type="button"
            style={contextMenuItemStyle}
            onClick={() => {
              onCloseTab(contextMenu.tabId);
              setContextMenu(null);
            }}
          >
            Close
          </button>
          {showCloseOther && (
            <button
              type="button"
              style={contextMenuItemStyle}
              onClick={() => {
                onCloseOtherTabs(contextMenu.tabId);
                setContextMenu(null);
              }}
            >
              Close other tabs
            </button>
          )}
          <button
            type="button"
            style={contextMenuItemStyle}
            onClick={() => {
              onCloseAllTabs();
              setContextMenu(null);
            }}
          >
            Close all
          </button>
        </div>
      )}
    </div>
  );
}
