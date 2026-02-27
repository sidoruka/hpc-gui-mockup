export type TabType =
  | 'chat'
  | 'shell'
  | 'desktop'
  | 'jupyter'
  | 'rstudio'
  | 'my-files'
  | 'shared-with-me'
  | 'common-data';

export interface Tab {
  id: string;
  type: TabType;
  title: string;
}

export interface AppState {
  openTabs: Tab[];
  activeTabId: string | null;
  splitView: boolean;
  splitTabs: [string | null, string | null];
  splitRatio: number;
  sidebarCollapsed: boolean;
  /** When in split view, which pane (0 or 1) gets the next tab when user clicks a tab */
  activeSplitPane: 0 | 1;
}

export type AppAction =
  | { type: 'OPEN_APP'; tabType: TabType; title: string }
  | { type: 'CLOSE_TAB'; tabId: string }
  | { type: 'CLOSE_ALL_TABS' }
  | { type: 'CLOSE_OTHER_TABS'; keepTabId: string }
  | { type: 'SET_ACTIVE_TAB'; tabId: string | null }
  | { type: 'REORDER_TABS'; fromIndex: number; toIndex: number }
  | { type: 'TOGGLE_SPLIT_VIEW' }
  | { type: 'SET_SPLIT_TABS'; left: string | null; right: string | null }
  | { type: 'SET_SPLIT_PANE'; pane: 0 | 1 }
  | { type: 'SET_SPLIT_RATIO'; ratio: number }
  | { type: 'TOGGLE_SIDEBAR' };

const tabTypeTitles: Record<TabType, string> = {
  chat: 'Chat',
  shell: 'Shell',
  desktop: 'Desktop',
  jupyter: 'Jupyter',
  rstudio: 'RStudio',
  'my-files': 'My files',
  'shared-with-me': 'Shared with me',
  'common-data': 'Common data',
};

function generateTabId(type: TabType): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getTitleForType(type: TabType): string {
  return tabTypeTitles[type];
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'OPEN_APP': {
      const existing = state.openTabs.find((t) => t.type === action.tabType);
      if (existing) {
        return { ...state, activeTabId: existing.id };
      }
      const newTab: Tab = {
        id: generateTabId(action.tabType),
        type: action.tabType,
        title: action.title,
      };
      return {
        ...state,
        openTabs: [...state.openTabs, newTab],
        activeTabId: newTab.id,
      };
    }
    case 'CLOSE_TAB': {
      const openTabs = state.openTabs.filter((t) => t.id !== action.tabId);
      let activeTabId = state.activeTabId;
      let splitTabs = state.splitTabs;
      if (state.activeTabId === action.tabId) {
        const idx = state.openTabs.findIndex((t) => t.id === action.tabId);
        const next = openTabs[idx] ?? openTabs[idx - 1] ?? null;
        activeTabId = next?.id ?? null;
      }
      if (splitTabs[0] === action.tabId || splitTabs[1] === action.tabId) {
        splitTabs = [
          splitTabs[0] === action.tabId ? null : splitTabs[0],
          splitTabs[1] === action.tabId ? null : splitTabs[1],
        ];
      }
      return { ...state, openTabs, activeTabId, splitTabs };
    }
    case 'CLOSE_ALL_TABS':
      return {
        ...state,
        openTabs: [],
        activeTabId: null,
        splitView: false,
        splitTabs: [null, null],
      };
    case 'CLOSE_OTHER_TABS': {
      const keep = state.openTabs.find((t) => t.id === action.keepTabId);
      if (!keep || state.openTabs.length <= 1) return state;
      return {
        ...state,
        openTabs: [keep],
        activeTabId: keep.id,
        splitView: false,
        splitTabs: [keep.id, null],
      };
    }
    case 'SET_ACTIVE_TAB': {
      if (state.splitView && action.tabId && state.activeSplitPane !== undefined) {
        const next = [...state.splitTabs];
        next[state.activeSplitPane] = action.tabId;
        return { ...state, activeTabId: action.tabId, splitTabs: [next[0], next[1]] };
      }
      return { ...state, activeTabId: action.tabId };
    }
    case 'REORDER_TABS': {
      const tabs = [...state.openTabs];
      const [removed] = tabs.splice(action.fromIndex, 1);
      tabs.splice(action.toIndex, 0, removed);
      return { ...state, openTabs: tabs };
    }
    case 'TOGGLE_SPLIT_VIEW':
      return {
        ...state,
        splitView: !state.splitView,
        splitTabs: state.splitView
          ? [null, null]
          : state.openTabs.length >= 2
            ? [state.openTabs[0].id, state.openTabs[1].id]
            : state.openTabs.length === 1
              ? [state.openTabs[0].id, null]
              : [null, null],
      };
    case 'SET_SPLIT_TABS':
      return { ...state, splitTabs: [action.left, action.right] };
    case 'SET_SPLIT_PANE':
      return { ...state, activeSplitPane: action.pane };
    case 'SET_SPLIT_RATIO':
      return { ...state, splitRatio: Math.max(0.2, Math.min(0.8, action.ratio)) };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    default:
      return state;
  }
}

export const initialState: AppState = {
  openTabs: [],
  activeTabId: null,
  splitView: false,
  splitTabs: [null, null],
  splitRatio: 0.5,
  sidebarCollapsed: false,
  activeSplitPane: 0,
};
