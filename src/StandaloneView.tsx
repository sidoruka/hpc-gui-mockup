import { useEffect } from 'react';
import { TabContent } from './views';
import type { TabType, Tab, LaunchedApp } from './state/appState';
import './styles/theme.css';

const THEME_STORAGE_KEY = 'hpc-mockups-theme';

const VALID_TAB_TYPES: TabType[] = [
  'chat', 'shell', 'desktop', 'jupyter', 'rstudio', 'vscode',
  'launched', 'all-pipelines', 'runs', 'my-files', 'shared-with-me', 'common-data',
];

function parseStandaloneParams(): { tab: Tab; launchedApps: LaunchedApp[] } | null {
  const params = new URLSearchParams(window.location.search);
  const type = params.get('standalone') as TabType | null;
  if (!type || !VALID_TAB_TYPES.includes(type)) return null;

  const title = params.get('title') ?? type;
  const launchedId = params.get('launchedId');
  const appType = params.get('appType') as 'shell' | 'interactive' | null;
  const appName = params.get('appName') ?? 'App';

  const tab: Tab = {
    id: 'standalone',
    type,
    title,
    launchedAppId: type === 'launched' && launchedId ? launchedId : undefined,
  };

  let launchedApps: LaunchedApp[] = [];
  if (type === 'launched' && launchedId && (appType === 'shell' || appType === 'interactive')) {
    launchedApps = [{
      id: launchedId,
      catalogAppId: '',
      name: decodeURIComponent(appName),
      appType,
      iconKey: 'shell',
      status: 'ready',
    }];
  }

  return { tab, launchedApps };
}

export function StandaloneView() {
  const parsed = parseStandaloneParams();

  useEffect(() => {
    try {
      const t = localStorage.getItem(THEME_STORAGE_KEY);
      document.documentElement.setAttribute('data-theme', (t === 'light' || t === 'dark' || t === 'christmas') ? t : 'dark');
    } catch {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  useEffect(() => {
    if (parsed) {
      document.title = `${parsed.tab.title} — Cloud HPC`;
    }
  }, [parsed?.tab.title]);

  if (!parsed) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-main)',
        color: 'var(--text-secondary)',
        fontSize: '14px',
      }}>
        Invalid standalone view. Close this window.
      </div>
    );
  }

  const { tab, launchedApps } = parsed;

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg-main)' }}>
      <TabContent tabType={tab.type} tab={tab} launchedApps={launchedApps} />
    </div>
  );
}
