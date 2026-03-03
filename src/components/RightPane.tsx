import { MessageCircle } from 'lucide-react';
import { TabBar } from './TabBar';
import { TabContent } from '../views';
import type { Tab, LaunchedApp } from '../state/appState';

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
  launchedApps: LaunchedApp[];
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onOpenInNewWindow?: (tab: Tab) => void;
  onCloseAllTabs: () => void;
  onCloseOtherTabs: (keepTabId: string) => void;
  onReorderTabs: (fromIndex: number, toIndex: number) => void;
  onOpenChat: () => void;
}

function getTabById(tabs: Tab[], id: string | null): Tab | null {
  if (!id) return null;
  return tabs.find((t) => t.id === id) ?? null;
}

function SingleContent({ tab, launchedApps }: { tab: Tab; launchedApps: LaunchedApp[] }) {
  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <TabContent tabType={tab.type} tab={tab} launchedApps={launchedApps} />
    </div>
  );
}

export function RightPane({
  openTabs,
  activeTabId,
  launchedApps,
  onSelectTab,
  onCloseTab,
  onOpenInNewWindow,
  onCloseAllTabs,
  onCloseOtherTabs,
  onReorderTabs,
  onOpenChat,
}: RightPaneProps) {
  const activeTab = getTabById(openTabs, activeTabId);

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
        onSelectTab={onSelectTab}
        onCloseTab={onCloseTab}
        onOpenInNewWindow={onOpenInNewWindow}
        onCloseAllTabs={onCloseAllTabs}
        onCloseOtherTabs={onCloseOtherTabs}
        onReorder={onReorderTabs}
      />
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {activeTab ? (
          <SingleContent tab={activeTab} launchedApps={launchedApps} />
        ) : (
          <EmptyState onOpenChat={onOpenChat} />
        )}
      </div>
    </div>
  );
}
