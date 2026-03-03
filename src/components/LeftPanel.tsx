import React, { useState } from 'react';
import {
  Search,
  MessageCircle,
  Terminal,
  Monitor,
  Folder,
  Share2,
  Database,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Square,
  Loader2,
  Workflow,
  List,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import type { TabType, LaunchedApp } from '../state/appState';
import { getTitleForType } from '../state/appState';
import { JupyterIcon } from './icons/JupyterIcon';
import { RStudioIcon } from './icons/RStudioIcon';
import { VSCodeIcon } from './icons/VSCodeIcon';
import { LaunchDialog } from './LaunchDialog';
import { launchableAppIconMap } from './launchableAppIcons';

interface NavItem {
  type: TabType;
  icon: React.ElementType;
  color: string;
}

const chatItem: NavItem = { type: 'chat', icon: MessageCircle, color: 'var(--accent-chat)' };

const appsGroup: NavItem[] = [
  { type: 'shell', icon: Terminal, color: 'var(--accent-shell)' },
  { type: 'desktop', icon: Monitor, color: 'var(--accent-desktop)' },
  { type: 'jupyter', icon: JupyterIcon, color: 'var(--accent-jupyter)' },
  { type: 'rstudio', icon: RStudioIcon, color: 'var(--accent-rstudio)' },
  { type: 'vscode', icon: VSCodeIcon, color: 'var(--accent-vscode)' },
];

const dataGroup: NavItem[] = [
  { type: 'my-files', icon: Folder, color: 'var(--accent-files)' },
  { type: 'shared-with-me', icon: Share2, color: 'var(--accent-shared)' },
  { type: 'common-data', icon: Database, color: 'var(--accent-common)' },
];

interface LeftPanelProps {
  collapsed: boolean;
  width?: number;
  isResizing?: boolean;
  onToggleSidebar: () => void;
  onOpenApp: (type: TabType, launchedAppId?: string) => void;
  launchedApps: LaunchedApp[];
  onLaunchApp: (catalogAppId: string) => void;
  onStopLaunchedApp: (launchedAppId: string) => void;
}

const EXPANDED_DEFAULT_WIDTH = 240;
const COLLAPSED_WIDTH = 56;

const navButtonStyle = {
  width: '100%' as const,
  display: 'flex' as const,
  alignItems: 'center' as const,
  gap: '12px',
  padding: '6px 12px',
  background: 'transparent',
  border: 'none',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  fontSize: '14px',
  textAlign: 'left' as const,
};

export function LeftPanel({
  collapsed,
  width = EXPANDED_DEFAULT_WIDTH,
  isResizing = false,
  onToggleSidebar,
  onOpenApp,
  launchedApps,
  onLaunchApp,
  onStopLaunchedApp,
}: LeftPanelProps) {
  const [launchDialogOpen, setLaunchDialogOpen] = useState(false);
  const [stopConfirmApp, setStopConfirmApp] = useState<LaunchedApp | null>(null);
  const [sectionsExpanded, setSectionsExpanded] = useState({
    apps: false,
    pipelines: false,
    data: false,
  });

  const toggleSection = (key: keyof typeof sectionsExpanded) =>
    setSectionsExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <aside
      style={{
        width: collapsed ? COLLAPSED_WIDTH : width,
        minWidth: collapsed ? COLLAPSED_WIDTH : undefined,
        flexShrink: 0,
        background: 'var(--bg-sidebar)',
        borderRight: collapsed ? '1px solid var(--border-subtle)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: isResizing ? 'none' : 'width 0.2s ease',
      }}
    >
      {launchDialogOpen && (
        <LaunchDialog
          onClose={() => setLaunchDialogOpen(false)}
          onLaunch={(catalogAppId) => {
            onLaunchApp(catalogAppId);
            setLaunchDialogOpen(false);
          }}
        />
      )}
      {stopConfirmApp && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="stop-confirm-title"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setStopConfirmApp(null)}
        >
          <div
            style={{
              background: 'var(--bg-sidebar)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              width: 'min(360px, 90vw)',
              padding: '20px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="stop-confirm-title"
              style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}
            >
              Stop application?
            </h2>
            <p style={{ margin: '0 0 20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              Are you sure you want to stop <strong style={{ color: 'var(--text-primary)' }}>{stopConfirmApp.name}</strong>? Any
              unsaved work may be lost.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setStopConfirmApp(null)}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onStopLaunchedApp(stopConfirmApp.id);
                  setStopConfirmApp(null);
                }}
                style={{
                  padding: '8px 16px',
                  background: 'var(--accent-shell)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                Stop
              </button>
            </div>
          </div>
        </div>
      )}
      {!collapsed && (
        <>
          <div
            style={{
              padding: '6px 12px',
              margin: '4px 12px 0',
              background: 'var(--bg-search)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Search size={12} color="var(--text-secondary)" />
            <input
              type="text"
              placeholder="Search"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '14px',
              }}
            />
          </div>
          <nav style={{ flex: 1, overflow: 'auto', padding: '4px 0' }}>
            <button
              type="button"
              onClick={() => onOpenApp(chatItem.type)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '6px 12px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '14px',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '6px',
                  background: chatItem.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <MessageCircle size={12} color="#fff" />
              </div>
              {getTitleForType(chatItem.type)}
            </button>
            <div
              style={{
                padding: '4px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <button
                type="button"
                onClick={() => toggleSection('apps')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: 0,
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  minWidth: 0,
                }}
              >
                <span style={{ flex: 1, fontWeight: 600, fontSize: '13px', minWidth: 0, textAlign: 'left' }}>
                  Apps ({appsGroup.length + launchedApps.length})
                </span>
              </button>
              <button
                type="button"
                onClick={() => setLaunchDialogOpen(true)}
                title="Launch app"
                style={{
                  padding: '4px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-hover)';
                  e.currentTarget.style.color = 'var(--accent-launch)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <Plus size={14} />
              </button>
              <button
                type="button"
                onClick={() => toggleSection('apps')}
                title={sectionsExpanded.apps ? 'Collapse' : 'Expand'}
                style={{
                  padding: '4px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {sectionsExpanded.apps ? (
                  <ChevronDown size={12} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
                ) : (
                  <ChevronRight size={12} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
                )}
              </button>
            </div>
            {sectionsExpanded.apps && (
              <>
            {appsGroup.map(({ type, icon: Icon, color }) => (
              <button
                key={type}
                type="button"
                onClick={() => onOpenApp(type)}
                style={navButtonStyle}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '6px',
                    background: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {type === 'rstudio' ? (
                    <RStudioIcon size={12} color="#fff" circleColor={color} />
                  ) : type === 'vscode' ? (
                    <VSCodeIcon size={15} />
                  ) : (
                    <Icon size={12} color="#fff" />
                  )}
                </div>
                {getTitleForType(type)}
              </button>
            ))}
            {launchedApps.length > 0 && (
              <>
                <div
                  style={{
                    margin: '4px 12px 2px',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '4px',
                  }}
                />
                {launchedApps.map((app) => {
                  const Icon = launchableAppIconMap[app.iconKey];
                  const IconComponent = Icon ?? Terminal;
                  const isLaunching = app.status === 'launching';
                  return (
                    <div
                      key={app.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        gap: '4px',
                      }}
                    >
                      <button
                        type="button"
                        onClick={isLaunching ? undefined : () => onOpenApp('launched', app.id)}
                        disabled={isLaunching}
                        style={{
                          ...navButtonStyle,
                          flex: 1,
                          minWidth: 0,
                          opacity: isLaunching ? 0.7 : 1,
                          cursor: isLaunching ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '6px',
                            background: 'var(--accent-launch)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {isLaunching ? (
                            <Loader2 size={12} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
                          ) : (
                            <IconComponent size={12} color="#fff" />
                          )}
                        </div>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {app.name}
                        </span>
                      </button>
                      {!isLaunching && (
                        <button
                          type="button"
                          onClick={() => setStopConfirmApp(app)}
                          title="Stop app"
                          style={{
                            flexShrink: 0,
                            padding: '6px',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--bg-hover)';
                            e.currentTarget.style.color = 'var(--text-primary)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                          }}
                        >
                          <Square size={11} fill="currentColor" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </>
            )}
              </>
            )}
            <button
              type="button"
              onClick={() => toggleSection('pipelines')}
              style={{
                width: '100%',
                padding: '10px 12px 4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ flex: 1, fontWeight: 600, fontSize: '13px', minWidth: 0, textAlign: 'left' }}>Pipelines</span>
              {sectionsExpanded.pipelines ? (
                <ChevronDown size={12} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
              ) : (
                <ChevronRight size={12} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
              )}
            </button>
            {sectionsExpanded.pipelines && (
            <>
            {[
              { label: 'All pipelines', icon: Workflow, tabType: 'all-pipelines' as const },
              { label: 'Runs', icon: List, tabType: null },
            ].map(({ label, icon: Icon, tabType }) => (
              <button
                key={label}
                type="button"
                onClick={() => { if (tabType) onOpenApp(tabType); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '6px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '6px',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={15} color="var(--text-secondary)" />
                </div>
                {label}
              </button>
            ))}
            </>
            )}
            <button
              type="button"
              onClick={() => toggleSection('data')}
              style={{
                width: '100%',
                padding: '10px 12px 4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ flex: 1, fontWeight: 600, fontSize: '13px', minWidth: 0, textAlign: 'left' }}>Data</span>
              {sectionsExpanded.data ? (
                <ChevronDown size={12} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
              ) : (
                <ChevronRight size={12} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
              )}
            </button>
            {sectionsExpanded.data && (
            <>
            {dataGroup.map(({ type, icon: Icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => onOpenApp(type)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '6px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '6px',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={15} color="var(--text-secondary)" />
                </div>
                {getTitleForType(type)}
              </button>
            ))}
            </>
            )}
          </nav>
          <div
            style={{
              padding: '8px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--bg-active)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <User size={14} color="var(--text-secondary)" />
            </div>
            <span style={{ flex: 1, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              User
            </span>
            <button
              type="button"
              onClick={onToggleSidebar}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '4px',
              }}
              title="Collapse panel"
            >
              <PanelLeftClose size={14} />
            </button>
          </div>
        </>
      )}
      {collapsed && (
        <>
          <nav style={{ flex: 1, overflow: 'auto', padding: '4px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <button
              type="button"
              onClick={() => onOpenApp(chatItem.type)}
              title={getTitleForType(chatItem.type)}
              style={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '6px',
                  background: chatItem.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MessageCircle size={12} color="#fff" />
              </div>
            </button>
            <button
              type="button"
              onClick={() => setLaunchDialogOpen(true)}
              title="Launch app"
              style={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                flexShrink: 0,
                color: 'var(--text-secondary)',
              }}
            >
              <Plus size={15} />
            </button>
            {appsGroup.map(({ type, icon: Icon, color }) => (
              <button
                key={type}
                type="button"
                onClick={() => onOpenApp(type)}
                title={getTitleForType(type)}
                style={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '6px',
                    background: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {type === 'rstudio' ? (
                    <RStudioIcon size={12} color="#fff" circleColor={color} />
                  ) : type === 'vscode' ? (
                    <VSCodeIcon size={15} />
                  ) : (
                    <Icon size={12} color="#fff" />
                  )}
                </div>
              </button>
            ))}
            {launchedApps.length > 0 && (
              <>
                <div
                  style={{
                    width: 24,
                    height: 1,
                    background: 'var(--border-subtle)',
                    margin: '4px 0',
                    flexShrink: 0,
                  }}
                />
                {launchedApps.map((app) => {
                  const Icon = launchableAppIconMap[app.iconKey];
                  const IconComponent = Icon ?? Terminal;
                  const isLaunching = app.status === 'launching';
                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={isLaunching ? undefined : () => onOpenApp('launched', app.id)}
                      disabled={isLaunching}
                      title={app.name}
                      style={{
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: isLaunching ? 'not-allowed' : 'pointer',
                        flexShrink: 0,
                        opacity: isLaunching ? 0.7 : 1,
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '6px',
                          background: 'var(--accent-launch)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isLaunching ? (
                          <Loader2 size={12} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <IconComponent size={12} color="#fff" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </>
            )}
            {dataGroup.map(({ type, icon: Icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => onOpenApp(type)}
                title={getTitleForType(type)}
                style={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '6px',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={15} color="var(--text-secondary)" />
                </div>
              </button>
            ))}
          </nav>
          <div
            style={{
              padding: '8px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--bg-active)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={14} color="var(--text-secondary)" />
            </div>
            <button
              type="button"
              onClick={onToggleSidebar}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '4px',
              }}
              title="Expand panel"
            >
              <PanelLeftOpen size={14} />
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
