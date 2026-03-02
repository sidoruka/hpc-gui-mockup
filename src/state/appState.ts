export type TabType =
  | 'chat'
  | 'shell'
  | 'desktop'
  | 'jupyter'
  | 'rstudio'
  | 'vscode'
  | 'launched'
  | 'my-files'
  | 'shared-with-me'
  | 'common-data';

export interface Tab {
  id: string;
  type: TabType;
  title: string;
  /** Set when type is 'launched' */
  launchedAppId?: string;
}

export type LaunchedAppStatus = 'launching' | 'ready';

export interface LaunchedApp {
  id: string;
  catalogAppId: string;
  name: string;
  appType: 'shell' | 'interactive';
  /** Icon key from catalog for rendering */
  iconKey: string;
  status: LaunchedAppStatus;
}

export interface AppState {
  openTabs: Tab[];
  activeTabId: string | null;
  sidebarCollapsed: boolean;
  launchedApps: LaunchedApp[];
}

export type AppAction =
  | { type: 'OPEN_APP'; tabType: TabType; title: string; launchedAppId?: string }
  | { type: 'LAUNCH_APP'; catalogAppId: string; launchedAppId?: string }
  | { type: 'LAUNCHED_APP_READY'; launchedAppId: string }
  | { type: 'STOP_LAUNCHED_APP'; launchedAppId: string }
  | { type: 'CLOSE_TAB'; tabId: string }
  | { type: 'CLOSE_ALL_TABS' }
  | { type: 'CLOSE_OTHER_TABS'; keepTabId: string }
  | { type: 'SET_ACTIVE_TAB'; tabId: string | null }
  | { type: 'REORDER_TABS'; fromIndex: number; toIndex: number }
  | { type: 'TOGGLE_SIDEBAR' };

const tabTypeTitles: Record<Exclude<TabType, 'launched'>, string> = {
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

export function generateLaunchedAppId(): string {
  return `launched-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getTitleForType(type: TabType, launchedApp?: LaunchedApp | null): string {
  if (type === 'launched' && launchedApp) return launchedApp.name;
  return tabTypeTitles[type as Exclude<TabType, 'launched'>] ?? type;
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'OPEN_APP': {
      const match = (t: Tab) =>
        t.type === action.tabType &&
        (action.tabType !== 'launched' || t.launchedAppId === action.launchedAppId);
      const existing = state.openTabs.find(match);
      if (existing) {
        return { ...state, activeTabId: existing.id };
      }
      const title =
        action.tabType === 'launched' && action.launchedAppId
          ? state.launchedApps.find((a) => a.id === action.launchedAppId)?.name ?? action.title
          : action.title;
      const newTab: Tab = {
        id: generateTabId(action.tabType),
        type: action.tabType,
        title,
        ...(action.tabType === 'launched' && action.launchedAppId
          ? { launchedAppId: action.launchedAppId }
          : {}),
      };
      return {
        ...state,
        openTabs: [...state.openTabs, newTab],
        activeTabId: newTab.id,
      };
    }
    case 'LAUNCH_APP': {
      const catalog = getLaunchableAppsCatalog();
      const catalogApp = catalog.find((a) => a.id === action.catalogAppId);
      if (!catalogApp) return state;
      const launchedId = action.launchedAppId ?? generateLaunchedAppId();
      const launched: LaunchedApp = {
        id: launchedId,
        catalogAppId: catalogApp.id,
        name: catalogApp.name,
        appType: catalogApp.appType,
        iconKey: catalogApp.iconKey,
        status: 'launching',
      };
      return {
        ...state,
        launchedApps: [...state.launchedApps, launched],
      };
    }
    case 'LAUNCHED_APP_READY': {
      return {
        ...state,
        launchedApps: state.launchedApps.map((a) =>
          a.id === action.launchedAppId ? { ...a, status: 'ready' as const } : a
        ),
      };
    }
    case 'STOP_LAUNCHED_APP': {
      const openTabs = state.openTabs.filter(
        (t) => t.type !== 'launched' || t.launchedAppId !== action.launchedAppId
      );
      let activeTabId = state.activeTabId;
      const closedTab = state.openTabs.find(
        (t) => t.type === 'launched' && t.launchedAppId === action.launchedAppId
      );
      if (closedTab && state.activeTabId === closedTab.id) {
        const idx = state.openTabs.findIndex((t) => t.id === closedTab.id);
        const next = openTabs[idx] ?? openTabs[idx - 1] ?? null;
        activeTabId = next?.id ?? null;
      }
      return {
        ...state,
        launchedApps: state.launchedApps.filter((a) => a.id !== action.launchedAppId),
        openTabs,
        activeTabId,
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
  launchedApps: [],
};

// --- Launchable apps catalog (used by reducer and LaunchDialog) ---
export type LaunchableAppType = 'shell' | 'interactive';

export interface LaunchableApp {
  id: string;
  name: string;
  description: string;
  iconKey: string;
  appType: LaunchableAppType;
}

export function getLaunchableAppsCatalog(): LaunchableApp[] {
  return [
    { id: 'chimera', name: 'Chimera', description: 'Molecular modeling and visualization', iconKey: 'flask', appType: 'interactive' },
    { id: 'relion', name: 'Relion', description: 'Cryo-EM structure determination', iconKey: 'microscope', appType: 'shell' },
    { id: 'cryoem', name: 'Cryoem', description: 'Cryo-electron microscopy workflows', iconKey: 'atom', appType: 'interactive' },
    { id: 'rna-seq', name: 'rna-seq', description: 'RNA sequencing analysis pipeline', iconKey: 'dna', appType: 'shell' },
    { id: 'cellranger', name: 'Cellranger', description: 'Single-cell gene expression analysis', iconKey: 'cells', appType: 'shell' },
  ];
}
