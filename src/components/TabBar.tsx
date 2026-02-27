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
import { X, Columns } from 'lucide-react';
import type { Tab } from '../state/appState';

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string | null;
  splitView: boolean;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onToggleSplit: () => void;
}

function SortableTab({
  tab,
  isActive,
  onSelect,
  onClose,
}: {
  tab: Tab;
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
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

export function TabBar({
  tabs,
  activeTabId,
  splitView,
  onSelectTab,
  onCloseTab,
  onReorder,
  onToggleSplit,
}: TabBarProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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
            />
          ))}
        </SortableContext>
      </DndContext>
      {tabs.length > 0 && (
        <button
          type="button"
          onClick={onToggleSplit}
          title={splitView ? 'Single view' : 'Split view'}
          style={{
            marginLeft: '8px',
            marginBottom: '6px',
            padding: '6px 10px',
            background: splitView ? 'var(--bg-active)' : 'transparent',
            border: 'none',
            borderRadius: '4px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
          }}
        >
          <Columns size={16} />
          Split
        </button>
      )}
    </div>
  );
}
