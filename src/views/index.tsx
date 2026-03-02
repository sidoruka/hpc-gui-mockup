import type { TabType, Tab, LaunchedApp } from '../state/appState';
import { ChatView } from './ChatView';
import { ShellView } from './ShellView';
import { DesktopView } from './DesktopView';
import { JupyterView } from './JupyterView';
import { RStudioView } from './RStudioView';
import { VSCodeView } from './VSCodeView';
import { FileBrowserView } from './FileBrowserView';

interface TabContentProps {
  tabType: TabType;
  tab?: Tab;
  launchedApps?: LaunchedApp[];
}

export function TabContent({ tabType, tab, launchedApps = [] }: TabContentProps) {
  if (tabType === 'launched' && tab?.launchedAppId) {
    const launched = launchedApps.find((a) => a.id === tab.launchedAppId);
    if (launched) {
      return launched.appType === 'shell' ? <ShellView /> : <DesktopView />;
    }
    return null;
  }
  switch (tabType) {
    case 'chat':
      return <ChatView />;
    case 'shell':
      return <ShellView />;
    case 'desktop':
      return <DesktopView />;
    case 'jupyter':
      return <JupyterView />;
    case 'rstudio':
      return <RStudioView />;
    case 'vscode':
      return <VSCodeView />;
    case 'my-files':
    case 'shared-with-me':
    case 'common-data':
      return <FileBrowserView tabType={tabType} />;
    default:
      return null;
  }
}
