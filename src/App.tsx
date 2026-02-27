import { useReducer, useCallback } from 'react';
import { LeftPanel } from './components/LeftPanel';
import { RightPane } from './components/RightPane';
import {
  appReducer,
  initialState,
  getTitleForType,
  type TabType,
} from './state/appState';
import './styles/theme.css';

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const openApp = useCallback((type: TabType) => {
    dispatch({ type: 'OPEN_APP', tabType: type, title: getTitleForType(type) });
  }, []);

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
        onToggleSidebar={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        onOpenApp={openApp}
      />
      <RightPane
        openTabs={state.openTabs}
        activeTabId={state.activeTabId}
        splitView={state.splitView}
        splitTabs={state.splitTabs}
        splitRatio={state.splitRatio}
        activeSplitPane={state.activeSplitPane}
        onSelectTab={(id) => dispatch({ type: 'SET_ACTIVE_TAB', tabId: id })}
        onCloseTab={(id) => dispatch({ type: 'CLOSE_TAB', tabId: id })}
        onCloseAllTabs={() => dispatch({ type: 'CLOSE_ALL_TABS' })}
        onCloseOtherTabs={(keepTabId) => dispatch({ type: 'CLOSE_OTHER_TABS', keepTabId })}
        onReorderTabs={(from, to) => dispatch({ type: 'REORDER_TABS', fromIndex: from, toIndex: to })}
        onToggleSplit={() => dispatch({ type: 'TOGGLE_SPLIT_VIEW' })}
        onSetSplitPane={(pane) => dispatch({ type: 'SET_SPLIT_PANE', pane })}
        onSetSplitRatio={(ratio) => dispatch({ type: 'SET_SPLIT_RATIO', ratio })}
        onOpenChat={() => openApp('chat')}
      />
    </div>
  );
}

export default App;
