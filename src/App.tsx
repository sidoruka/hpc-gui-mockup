import { useReducer, useCallback, useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { LeftPanel } from './components/LeftPanel';
import { RightPane } from './components/RightPane';
import {
  FileExplorerPanel,
  FILE_EXPLORER_DEFAULT_WIDTH,
  FILE_EXPLORER_MIN_WIDTH,
  FILE_EXPLORER_MAX_WIDTH,
} from './components/FileExplorerPanel';
import { ChatView } from './views/ChatView';
import {
  appReducer,
  initialState,
  getTitleForType,
  generateLaunchedAppId,
  type TabType,
  type Tab,
  type VSCodeInitialLanguage,
} from './state/appState';
import './styles/theme.css';

const CHAT_PANEL_DEFAULT_RATIO = 0.25; // 25% chat, 75% other tabs
const CHAT_PANEL_MIN_RATIO = 0.15;
const CHAT_PANEL_MAX_RATIO = 0.5;
const CHAT_PANEL_MIN_WIDTH = 320;

const MIN_SIDEBAR_WIDTH = 180;
const MAX_SIDEBAR_WIDTH = 480;
const DEFAULT_SIDEBAR_WIDTH = 240;

export type Theme = 'dark' | 'light' | 'christmas';

const THEME_STORAGE_KEY = 'hpc-mockups-theme';

const VALID_THEMES: Theme[] = ['dark', 'light', 'christmas'];

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (VALID_THEMES.includes(stored as Theme)) return stored as Theme;
  } catch {
    /* ignore */
  }
  return 'dark';
}

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [rightPanelWidth, setRightPanelWidth] = useState(FILE_EXPLORER_DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const [chatPanelRatio, setChatPanelRatio] = useState(CHAT_PANEL_DEFAULT_RATIO);
  const [isResizingChat, setIsResizingChat] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const resizeStartX = useRef(0);
  const resizeStartWidth = useRef(0);
  const launchReadyTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    return () => {
      launchReadyTimeouts.current.forEach(clearTimeout);
    };
  }, []);

  const openApp = useCallback(
    (type: TabType, launchedAppId?: string, options?: { vscodeInitialLanguage?: VSCodeInitialLanguage }) => {
      if (type === 'launched' && launchedAppId) {
        const title = ''; // reducer will resolve from launchedApps
        dispatch({ type: 'OPEN_APP', tabType: 'launched', title, launchedAppId });
      } else {
        dispatch({
          type: 'OPEN_APP',
          tabType: type,
          title: getTitleForType(type),
          ...(type === 'vscode' && options?.vscodeInitialLanguage
            ? { vscodeInitialLanguage: options.vscodeInitialLanguage }
            : {}),
        });
      }
    },
    []
  );

  const openFile = useCallback((filePath: string) => {
    const fileName = filePath.split('/').pop() ?? filePath;
    dispatch({ type: 'OPEN_APP', tabType: 'file', title: fileName, filePath });
  }, []);

  const launchApp = useCallback((catalogAppId: string) => {
    const launchedAppId = generateLaunchedAppId();
    dispatch({ type: 'LAUNCH_APP', catalogAppId, launchedAppId });
    const t = setTimeout(() => {
      dispatch({ type: 'LAUNCHED_APP_READY', launchedAppId });
      launchReadyTimeouts.current = launchReadyTimeouts.current.filter((id) => id !== t);
    }, 5000);
    launchReadyTimeouts.current.push(t);
  }, []);

  const stopLaunchedApp = useCallback((launchedAppId: string) => {
    dispatch({ type: 'STOP_LAUNCHED_APP', launchedAppId });
  }, []);

  const handleOpenInNewWindow = useCallback((tab: Tab) => {
    const params = new URLSearchParams();
    params.set('standalone', tab.type);
    params.set('title', tab.title);
    if (tab.type === 'launched' && tab.launchedAppId) {
      const app = state.launchedApps.find((a) => a.id === tab.launchedAppId);
      if (app) {
        params.set('launchedId', tab.launchedAppId);
        params.set('appType', app.appType);
        params.set('appName', app.name);
      }
    }
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    dispatch({ type: 'CLOSE_TAB', tabId: tab.id });
  }, [state.launchedApps]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    resizeStartX.current = e.clientX;
    resizeStartWidth.current = sidebarWidth;
  }, [sidebarWidth]);

  useEffect(() => {
    if (!isResizing) return;
    const handleMove = (e: MouseEvent) => {
      const delta = e.clientX - resizeStartX.current;
      const next = Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, resizeStartWidth.current + delta));
      setSidebarWidth(next);
    };
    const handleUp = () => setIsResizing(false);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [isResizing]);

  const handleRightResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingRight(true);
    resizeStartX.current = e.clientX;
    resizeStartWidth.current = rightPanelWidth;
  }, [rightPanelWidth]);

  useEffect(() => {
    if (!isResizingRight) return;
    const handleMove = (e: MouseEvent) => {
      const delta = resizeStartX.current - e.clientX;
      const next = Math.min(
        FILE_EXPLORER_MAX_WIDTH,
        Math.max(FILE_EXPLORER_MIN_WIDTH, resizeStartWidth.current + delta)
      );
      setRightPanelWidth(next);
    };
    const handleUp = () => setIsResizingRight(false);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [isResizingRight]);

  const handleChatResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const el = mainContentRef.current;
    if (el) resizeStartWidth.current = el.clientWidth * chatPanelRatio;
    setIsResizingChat(true);
    resizeStartX.current = e.clientX;
  }, [chatPanelRatio]);

  useEffect(() => {
    if (!isResizingChat) return;
    const handleMove = (e: MouseEvent) => {
      const el = mainContentRef.current;
      if (!el) return;
      const delta = e.clientX - resizeStartX.current;
      const containerWidth = el.clientWidth;
      const newPixelWidth = resizeStartWidth.current + delta;
      const newRatio = Math.min(
        CHAT_PANEL_MAX_RATIO,
        Math.max(CHAT_PANEL_MIN_RATIO, containerWidth ? newPixelWidth / containerWidth : chatPanelRatio)
      );
      setChatPanelRatio(newRatio);
    };
    const handleUp = () => setIsResizingChat(false);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [isResizingChat, chatPanelRatio]);

  const chatTab = state.openTabs.find((t) => t.type === 'chat');
  const otherTabs = state.openTabs.filter((t) => t.type !== 'chat');
  const isChatWithOthers = Boolean(chatTab && otherTabs.length > 0);
  const rightPaneActiveId =
    isChatWithOthers && state.activeTabId && otherTabs.some((t) => t.id === state.activeTabId)
      ? state.activeTabId
      : otherTabs[0]?.id ?? null;

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <LeftPanel
        collapsed={state.sidebarCollapsed}
        width={sidebarWidth}
        isResizing={isResizing}
        onToggleSidebar={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        onOpenApp={openApp}
        launchedApps={state.launchedApps}
        onLaunchApp={launchApp}
        onStopLaunchedApp={stopLaunchedApp}
        theme={theme}
        onThemeChange={setTheme}
      />
      {!state.sidebarCollapsed && (
        <div
          role="separator"
          onMouseDown={handleResizeStart}
          style={{
            width: 6,
            minWidth: 6,
            flexShrink: 0,
            background: isResizing ? 'var(--accent-shell)' : 'transparent',
            cursor: 'col-resize',
            borderLeft: '1px solid var(--border-subtle)',
            borderRight: '1px solid var(--border-subtle)',
          }}
          title="Drag to resize"
        />
      )}
      {isChatWithOthers ? (
        <div
          ref={mainContentRef}
          style={{
            flex: 1,
            display: 'flex',
            minWidth: 0,
            height: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: `${chatPanelRatio * 100}%`,
              minWidth: CHAT_PANEL_MIN_WIDTH,
              flexShrink: 0,
              height: '100%',
              borderRight: '1px solid var(--border-subtle)',
              background: 'var(--bg-main)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderBottom: '1px solid var(--border-subtle)',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Chat
              </span>
              <button
                type="button"
                onClick={() => chatTab && dispatch({ type: 'CLOSE_TAB', tabId: chatTab.id })}
                style={{
                  padding: 4,
                  border: 'none',
                  background: 'transparent',
                  borderRadius: 4,
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Close chat"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>
            <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <ChatView />
            </div>
          </div>
          <div
            role="separator"
            onMouseDown={handleChatResizeStart}
            style={{
              width: 6,
              minWidth: 6,
              flexShrink: 0,
              background: isResizingChat ? 'var(--accent-shell)' : 'transparent',
              cursor: 'col-resize',
              borderLeft: '1px solid var(--border-subtle)',
              borderRight: '1px solid var(--border-subtle)',
            }}
            title="Drag to resize"
          />
          <RightPane
            openTabs={otherTabs}
            activeTabId={rightPaneActiveId}
            launchedApps={state.launchedApps}
            onSelectTab={(id) => dispatch({ type: 'SET_ACTIVE_TAB', tabId: id })}
            onCloseTab={(id) => dispatch({ type: 'CLOSE_TAB', tabId: id })}
            onOpenInNewWindow={handleOpenInNewWindow}
            onCloseAllTabs={() => dispatch({ type: 'CLOSE_ALL_TABS' })}
            onCloseOtherTabs={(keepTabId) => dispatch({ type: 'CLOSE_OTHER_TABS', keepTabId })}
            onReorderTabs={(from, to) => dispatch({ type: 'REORDER_TABS', fromIndex: from, toIndex: to })}
            onOpenChat={() => openApp('chat')}
          />
        </div>
      ) : (
        <RightPane
          openTabs={state.openTabs}
          activeTabId={state.activeTabId}
          launchedApps={state.launchedApps}
          onSelectTab={(id) => dispatch({ type: 'SET_ACTIVE_TAB', tabId: id })}
          onCloseTab={(id) => dispatch({ type: 'CLOSE_TAB', tabId: id })}
          onOpenInNewWindow={handleOpenInNewWindow}
          onCloseAllTabs={() => dispatch({ type: 'CLOSE_ALL_TABS' })}
          onCloseOtherTabs={(keepTabId) => dispatch({ type: 'CLOSE_OTHER_TABS', keepTabId })}
          onReorderTabs={(from, to) => dispatch({ type: 'REORDER_TABS', fromIndex: from, toIndex: to })}
          onOpenChat={() => openApp('chat')}
        />
      )}
      {!state.rightSidebarCollapsed && (
        <div
          role="separator"
          onMouseDown={handleRightResizeStart}
          style={{
            width: 6,
            minWidth: 6,
            flexShrink: 0,
            background: isResizingRight ? 'var(--accent-shell)' : 'transparent',
            cursor: 'col-resize',
            borderLeft: '1px solid var(--border-subtle)',
            borderRight: '1px solid var(--border-subtle)',
          }}
          title="Drag to resize"
        />
      )}
      <FileExplorerPanel
        collapsed={state.rightSidebarCollapsed}
        width={rightPanelWidth}
        isResizing={isResizingRight}
        onToggleSidebar={() => dispatch({ type: 'TOGGLE_RIGHT_SIDEBAR' })}
        onOpenApp={openApp}
        onOpenFile={openFile}
      />
    </div>
  );
}

export default App;
