import { useCallback, useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { TabBar } from './TabBar';
import { TabContent } from '../views';
import type { Tab } from '../state/appState';

function EmptyState({ onOpenChat }: { onOpenChat: () => void }) {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-main)',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '16px',
          background: 'var(--accent-chat)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
        }}
      >
        <MessageCircle size={40} color="#fff" />
      </div>
      <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 8px', color: 'var(--text-primary)' }}>
        Start with Chat
      </h2>
      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: '0 0 24px', maxWidth: 400 }}>
        Use the chat to search and analyze your data on the HPC. Open Chat from the left panel or click below.
      </p>
      <button
        type="button"
        onClick={onOpenChat}
        style={{
          padding: '12px 24px',
          background: 'var(--accent-chat)',
          border: 'none',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '15px',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <MessageCircle size={20} />
        Start Chat
      </button>
    </div>
  );
}

interface RightPaneProps {
  openTabs: Tab[];
  activeTabId: string | null;
  splitView: boolean;
  splitTabs: [string | null, string | null];
  splitRatio: number;
  activeSplitPane: 0 | 1;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onReorderTabs: (fromIndex: number, toIndex: number) => void;
  onToggleSplit: () => void;
  onSetSplitPane: (pane: 0 | 1) => void;
  onSetSplitRatio: (ratio: number) => void;
  onOpenChat: () => void;
}

function getTabById(tabs: Tab[], id: string | null): Tab | null {
  if (!id) return null;
  return tabs.find((t) => t.id === id) ?? null;
}

function SingleContent({ tab }: { tab: Tab }) {
  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <TabContent tabType={tab.type} />
    </div>
  );
}

function SplitContent({
  leftTab,
  rightTab,
  ratio,
  activeSplitPane,
  onResize,
  onSelectPane,
}: {
  leftTab: Tab | null;
  rightTab: Tab | null;
  ratio: number;
  activeSplitPane: 0 | 1;
  onResize: (ratio: number) => void;
  onSelectPane: (pane: 0 | 1) => void;
}) {
  const [dragging, setDragging] = useState(false);

  const handleMouseDown = useCallback(() => setDragging(true), []);
  const handleMouseUp = useCallback(() => setDragging(false), []);
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging) return;
      const container = document.getElementById('split-container');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const newRatio = (e.clientX - rect.left) / rect.width;
      onResize(newRatio);
    },
    [dragging, onResize]
  );

  useEffect(() => {
    if (!dragging) return;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

  const leftWidth = `${ratio * 100}%`;
  const rightWidth = `${(1 - ratio) * 100}%`;

  return (
    <div
      id="split-container"
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: leftWidth,
          minWidth: 0,
          overflow: 'hidden',
          outline: activeSplitPane === 0 ? '2px solid var(--accent-shell)' : 'none',
          outlineOffset: -2,
        }}
        onClick={() => onSelectPane(0)}
      >
        {leftTab ? (
          <div style={{ height: '100%', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <TabContent tabType={leftTab.type} />
          </div>
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              background: 'var(--bg-main)',
            }}
          >
            Click to focus, then select a tab
          </div>
        )}
      </div>
      <div
        role="separator"
        onMouseDown={handleMouseDown}
        style={{
          width: 6,
          minWidth: 6,
          background: dragging ? 'var(--accent-shell)' : 'var(--border-subtle)',
          cursor: 'col-resize',
          flexShrink: 0,
        }}
      />
      <div
        style={{
          width: rightWidth,
          minWidth: 0,
          overflow: 'hidden',
          outline: activeSplitPane === 1 ? '2px solid var(--accent-shell)' : 'none',
          outlineOffset: -2,
        }}
        onClick={() => onSelectPane(1)}
      >
        {rightTab ? (
          <div style={{ height: '100%', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <TabContent tabType={rightTab.type} />
          </div>
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              background: 'var(--bg-main)',
            }}
          >
            Click to focus, then select a tab
          </div>
        )}
      </div>
    </div>
  );
}

export function RightPane({
  openTabs,
  activeTabId,
  splitView,
  splitTabs,
  splitRatio,
  activeSplitPane,
  onSelectTab,
  onCloseTab,
  onReorderTabs,
  onToggleSplit,
  onSetSplitPane,
  onSetSplitRatio,
  onOpenChat,
}: RightPaneProps) {
  const activeTab = getTabById(openTabs, activeTabId);
  const leftTab = getTabById(openTabs, splitTabs[0]);
  const rightTab = getTabById(openTabs, splitTabs[1]);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        height: '100%',
      }}
    >
      <TabBar
        tabs={openTabs}
        activeTabId={activeTabId}
        splitView={splitView}
        onSelectTab={onSelectTab}
        onCloseTab={onCloseTab}
        onReorder={onReorderTabs}
        onToggleSplit={onToggleSplit}
      />
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {splitView ? (
          <SplitContent
            leftTab={leftTab}
            rightTab={rightTab}
            ratio={splitRatio}
            activeSplitPane={activeSplitPane}
            onResize={onSetSplitRatio}
            onSelectPane={onSetSplitPane}
          />
        ) : activeTab ? (
          <SingleContent tab={activeTab} />
        ) : (
          <EmptyState onOpenChat={onOpenChat} />
        )}
      </div>
    </div>
  );
}
