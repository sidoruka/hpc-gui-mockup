import { useReducer, useCallback, useRef, useEffect, useState } from 'react';
import { LeftPanel } from './components/LeftPanel';
import { RightPane } from './components/RightPane';
import {
  appReducer,
  initialState,
  getTitleForType,
  type TabType,
} from './state/appState';
import './styles/theme.css';

const MIN_SIDEBAR_WIDTH = 180;
const MAX_SIDEBAR_WIDTH = 480;
const DEFAULT_SIDEBAR_WIDTH = 240;

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartX = useRef(0);
  const resizeStartWidth = useRef(0);

  const openApp = useCallback((type: TabType) => {
    dispatch({ type: 'OPEN_APP', tabType: type, title: getTitleForType(type) });
  }, []);

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
        onSelectTab={(id) => dispatch({ type: 'SET_ACTIVE_TAB', tabId: id })}
        onCloseTab={(id) => dispatch({ type: 'CLOSE_TAB', tabId: id })}
        onCloseAllTabs={() => dispatch({ type: 'CLOSE_ALL_TABS' })}
        onCloseOtherTabs={(keepTabId) => dispatch({ type: 'CLOSE_OTHER_TABS', keepTabId })}
        onReorderTabs={(from, to) => dispatch({ type: 'REORDER_TABS', fromIndex: from, toIndex: to })}
        onOpenChat={() => openApp('chat')}
      />
    </div>
  );
}

export default App;
