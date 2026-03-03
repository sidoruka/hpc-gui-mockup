import { useReducer, useCallback, useRef, useEffect, useState } from 'react';
import { LeftPanel } from './components/LeftPanel';
import { RightPane } from './components/RightPane';
import {
  FileExplorerPanel,
  FILE_EXPLORER_DEFAULT_WIDTH,
  FILE_EXPLORER_MIN_WIDTH,
  FILE_EXPLORER_MAX_WIDTH,
} from './components/FileExplorerPanel';
import {
  appReducer,
  initialState,
  getTitleForType,
  generateLaunchedAppId,
  type TabType,
  type Tab,
} from './state/appState';
import './styles/theme.css';

const MIN_SIDEBAR_WIDTH = 180;
const MAX_SIDEBAR_WIDTH = 480;
const DEFAULT_SIDEBAR_WIDTH = 240;

export type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'hpc-mockups-theme';

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
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

  const openApp = useCallback((type: TabType, launchedAppId?: string) => {
    if (type === 'launched' && launchedAppId) {
      const title = ''; // reducer will resolve from launchedApps
      dispatch({ type: 'OPEN_APP', tabType: 'launched', title, launchedAppId });
    } else {
      dispatch({ type: 'OPEN_APP', tabType: type, title: getTitleForType(type) });
    }
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
      />
    </div>
  );
}

export default App;
