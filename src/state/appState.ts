export type TabType =
  | 'chat'
  | 'shell'
  | 'desktop'
  | 'jupyter'
  | 'rstudio'
  | 'vscode'
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
  sidebarCollapsed: boolean;
}

export type AppAction =
  | { type: 'OPEN_APP'; tabType: TabType; title: string }
  | { type: 'CLOSE_TAB'; tabId: string }
  | { type: 'CLOSE_ALL_TABS' }
  | { type: 'CLOSE_OTHER_TABS'; keepTabId: string }
  | { type: 'SET_ACTIVE_TAB'; tabId: string | null }
  | { type: 'REORDER_TABS'; fromIndex: number; toIndex: number }
  | { type: 'TOGGLE_SIDEBAR' };

const tabTypeTitles: Record<TabType, string> = {
  chat: 'Chat',
  shell: 'Shell',
  desktop: 'Desktop',
  jupyter: 'Jupyter',
  rstudio: 'RStudio',
  vscode: 'VSCode',
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
      if (state.activeTabId === action.tabId) {
        const idx = state.openTabs.findIndex((t) => t.id === action.tabId);
        const next = openTabs[idx] ?? openTabs[idx - 1] ?? null;
        activeTabId = next?.id ?? null;
      }
      return { ...state, openTabs, activeTabId };
    }
    case 'CLOSE_ALL_TABS':
      return {
        ...state,
        openTabs: [],
        activeTabId: null,
      };
    case 'CLOSE_OTHER_TABS': {
      const keep = state.openTabs.find((t) => t.id === action.keepTabId);
      if (!keep || state.openTabs.length <= 1) return state;
      return {
        ...state,
        openTabs: [keep],
        activeTabId: keep.id,
      };
    }
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTabId: action.tabId };
    case 'REORDER_TABS': {
      const tabs = [...state.openTabs];
      const [removed] = tabs.splice(action.fromIndex, 1);
      tabs.splice(action.toIndex, 0, removed);
      return { ...state, openTabs: tabs };
    }
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    default:
      return state;
  }
}

export const initialState: AppState = {
  openTabs: [],
  activeTabId: null,
  sidebarCollapsed: false,
};
