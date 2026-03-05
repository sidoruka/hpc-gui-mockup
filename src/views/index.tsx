import type { TabType, Tab, LaunchedApp } from '../state/appState';
import { ChatView } from './ChatView';
import { ShellView } from './ShellView';
import { DesktopView } from './DesktopView';
import { JupyterView } from './JupyterView';
import { RStudioView } from './RStudioView';
import { VSCodeView } from './VSCodeView';
import { FileBrowserView } from './FileBrowserView';
import { FileViewerView } from './FileViewerView';
import { AllPipelinesView } from './AllPipelinesView';
import { RunsView } from './RunsView';

interface TabContentProps {
  tabType: TabType;
  tab?: Tab;
  launchedApps?: LaunchedApp[];
  vscodeInjectedContent?: string | null;
  onVscodeInjectedContentConsumed?: () => void;
}

export function TabContent({
  tabType,
  tab,
  launchedApps = [],
  vscodeInjectedContent,
  onVscodeInjectedContentConsumed,
}: TabContentProps) {
  if (tabType === 'launched' && tab?.launchedAppId) {
    const launched = launchedApps.find((a) => a.id === tab.launchedAppId);
    if (launched) {
      return launched.appType === 'shell' ? <ShellView /> : <DesktopView />;
    }
    return null;
  }
  switch (tabType) {
    case 'chat':
      return <ChatView startEmpty={tab?.type === 'chat' ? tab.chatStartEmpty : undefined} />;
    case 'shell':
      return <ShellView />;
    case 'desktop':
      return <DesktopView />;
    case 'jupyter':
      return <JupyterView />;
    case 'rstudio':
      return <RStudioView />;
    case 'vscode':
      return (
        <VSCodeView
          initialLanguage={tab?.type === 'vscode' ? tab.vscodeInitialLanguage : undefined}
          injectedContent={vscodeInjectedContent ?? undefined}
          onInjectedContentConsumed={onVscodeInjectedContentConsumed}
        />
      );
    case 'all-pipelines':
      return <AllPipelinesView />;
    case 'runs':
      return <RunsView />;
    case 'my-files':
    case 'shared-with-me':
    case 'common-data':
      return <FileBrowserView tabType={tabType} />;
    case 'file':
      return tab?.filePath ? <FileViewerView tab={tab} /> : null;
    default:
      return null;
  }
}
