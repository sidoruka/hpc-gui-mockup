import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  MessageCircle,
  Terminal,
  Monitor,
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
  MoreVertical,
  Info,
  Star,
  Check,
} from 'lucide-react';
import type { TabType, LaunchedApp } from '../state/appState';
import { getTitleForType } from '../state/appState';
import { JupyterIcon } from './icons/JupyterIcon';
import { RStudioIcon } from './icons/RStudioIcon';
import { VSCodeIcon } from './icons/VSCodeIcon';
import { LaunchDialog } from './LaunchDialog';
import { LeftPaneNavIcon } from './LeftPaneNavIcon';
import { launchableAppIconMap } from './launchableAppIcons';
import { runningPipelinesCount } from '../views/RunsView';
import type { Theme } from '../App';

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

interface LeftPanelProps {
  collapsed: boolean;
  width?: number;
  isResizing?: boolean;
  onToggleSidebar: () => void;
  onOpenApp: (type: TabType, launchedAppId?: string) => void;
  launchedApps: LaunchedApp[];
  onLaunchApp: (catalogAppId: string) => void;
  onStopLaunchedApp: (launchedAppId: string) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const EXPANDED_DEFAULT_WIDTH = 240;
const COLLAPSED_WIDTH = 56;

const navButtonStyle = {
  width: '100%' as const,
  display: 'flex' as const,
  alignItems: 'center' as const,
  gap: '12px',
  padding: '4px 12px',
  margin: '0 8px' as const,
  borderRadius: '6px',
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
  theme,
  onThemeChange,
}: LeftPanelProps) {
  const [launchDialogOpen, setLaunchDialogOpen] = useState(false);
  const [stopConfirmApp, setStopConfirmApp] = useState<LaunchedApp | null>(null);
  const [openMenuAppId, setOpenMenuAppId] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [appearanceSubmenuOpen, setAppearanceSubmenuOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (openMenuAppId === null && !userMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (openMenuAppId !== null && menuContainerRef.current && !menuContainerRef.current.contains(target)) {
        setOpenMenuAppId(null);
      }
      if (userMenuOpen && userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
        setAppearanceSubmenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuAppId, userMenuOpen]);

  const [sectionsExpanded, setSectionsExpanded] = useState({
    apps: true,
    pipelines: true,
  });
  const [hoveredNavKey, setHoveredNavKey] = useState<string | null>(null);

  const toggleSection = (key: keyof typeof sectionsExpanded) =>
    setSectionsExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const getNavItemHover = (navKey: string) => ({
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.background = 'var(--bg-hover)';
      setHoveredNavKey(navKey);
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.background = 'transparent';
      setHoveredNavKey(null);
    },
  });

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
          <nav style={{ flex: 1, overflow: 'auto', padding: '2px 0' }}>
            <button
              type="button"
              onClick={() => onOpenApp(chatItem.type)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '4px 12px',
                margin: '0 8px',
                borderRadius: '6px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '14px',
                textAlign: 'left',
              }}
              {...getNavItemHover('chat')}
            >
              <LeftPaneNavIcon
                icon={MessageCircle}
                iconColor={hoveredNavKey === 'chat' ? 'var(--accent-pipelines)' : 'var(--text-secondary)'}
                iconSize={15}
              />
              {getTitleForType(chatItem.type)}
            </button>
            <div
              style={{
                padding: '2px 12px',
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
            {appsGroup.map(({ type, icon: Icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => onOpenApp(type)}
                style={navButtonStyle}
                {...getNavItemHover(type)}
              >
                <LeftPaneNavIcon
                  iconColor={hoveredNavKey === type ? 'var(--accent-pipelines)' : 'var(--text-secondary)'}
                  iconSize={15}
                  icon={type === 'rstudio' || type === 'vscode' ? undefined : Icon}
                >
                  {type === 'rstudio' ? (
                    <span style={{ filter: hoveredNavKey === type ? 'none' : 'grayscale(1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <RStudioIcon size={15} />
                    </span>
                  ) : type === 'vscode' ? (
                    <span style={{ filter: hoveredNavKey === type ? 'none' : 'grayscale(1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <VSCodeIcon size={15} />
                    </span>
                  ) : undefined}
                </LeftPaneNavIcon>
                {getTitleForType(type)}
              </button>
            ))}
            {launchedApps.length > 0 && (
              <>
                <div
                style={{
                  margin: '2px 12px 2px',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '2px',
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
                        {...getNavItemHover(`launched-${app.id}`)}
                      >
                        <LeftPaneNavIcon
                          iconColor={hoveredNavKey === `launched-${app.id}` ? 'var(--accent-pipelines)' : 'var(--text-secondary)'}
                          iconSize={15}
                        >
                          {isLaunching ? (
                            <Loader2 size={15} color={hoveredNavKey === `launched-${app.id}` ? 'var(--accent-pipelines)' : 'var(--text-secondary)'} style={{ animation: 'spin 1s linear infinite' }} />
                          ) : (
                            <IconComponent size={15} color={hoveredNavKey === `launched-${app.id}` ? 'var(--accent-pipelines)' : 'var(--text-secondary)'} />
                          )}
                        </LeftPaneNavIcon>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {app.name}
                        </span>
                      </button>
                      {!isLaunching && (
                        <div
                          ref={openMenuAppId === app.id ? menuContainerRef : undefined}
                          style={{ position: 'relative', flexShrink: 0 }}
                        >
                          <button
                            type="button"
                            onClick={() => setOpenMenuAppId((id) => (id === app.id ? null : app.id))}
                            title="Actions"
                            style={{
                              padding: '6px',
                              background: openMenuAppId === app.id ? 'var(--bg-hover)' : 'transparent',
                              border: 'none',
                              color: openMenuAppId === app.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                              cursor: 'pointer',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            onMouseEnter={(e) => {
                              if (openMenuAppId !== app.id) {
                                e.currentTarget.style.background = 'var(--bg-hover)';
                                e.currentTarget.style.color = 'var(--text-primary)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (openMenuAppId !== app.id) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--text-secondary)';
                              }
                            }}
                          >
                            <MoreVertical size={14} />
                          </button>
                          {openMenuAppId === app.id && (
                            <div
                              style={{
                                position: 'absolute',
                                right: 0,
                                top: '100%',
                                marginTop: '2px',
                                minWidth: '140px',
                                background: 'var(--bg-sidebar)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '6px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                padding: '4px 0',
                                zIndex: 100,
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => setOpenMenuAppId(null)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  background: 'transparent',
                                  border: 'none',
                                  color: 'var(--text-primary)',
                                  cursor: 'pointer',
                                  fontSize: '13px',
                                  textAlign: 'left',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'var(--bg-hover)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'transparent';
                                }}
                              >
                                <Info size={12} />
                                View details
                              </button>
                              <button
                                type="button"
                                onClick={() => setOpenMenuAppId(null)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  background: 'transparent',
                                  border: 'none',
                                  color: 'var(--text-primary)',
                                  cursor: 'pointer',
                                  fontSize: '13px',
                                  textAlign: 'left',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'var(--bg-hover)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'transparent';
                                }}
                              >
                                <Star size={12} />
                                Add to favorite
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setStopConfirmApp(app);
                                  setOpenMenuAppId(null);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  background: 'transparent',
                                  border: 'none',
                                  color: 'var(--text-primary)',
                                  cursor: 'pointer',
                                  fontSize: '13px',
                                  textAlign: 'left',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'var(--bg-hover)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'transparent';
                                }}
                              >
                                <Square size={11} fill="currentColor" />
                                Stop
                              </button>
                            </div>
                          )}
                        </div>
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
                padding: '6px 12px 2px',
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
              { label: 'All pipelines', icon: Workflow, tabType: 'all-pipelines' as const, navKey: 'all-pipelines' as const, badge: null as number | null },
              { label: 'Runs', icon: List, tabType: 'runs' as const, navKey: 'runs' as const, badge: runningPipelinesCount > 0 ? runningPipelinesCount : null },
            ].map(({ label, icon: Icon, tabType, navKey, badge }) => (
              <button
                key={label}
                type="button"
                onClick={() => { if (tabType) onOpenApp(tabType); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '4px 12px',
                  margin: '0 8px',
                  borderRadius: '6px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textAlign: 'left',
                }}
                {...getNavItemHover(navKey)}
              >
                <LeftPaneNavIcon
                  icon={Icon}
                  iconColor={hoveredNavKey === navKey ? 'var(--accent-pipelines)' : 'var(--text-secondary)'}
                />
                <span style={{ flex: 1, minWidth: 0 }}>{label}</span>
                {badge != null && (
                  <span
                    style={{
                      flexShrink: 0,
                      minWidth: '18px',
                      height: '18px',
                      padding: '0 5px',
                      borderRadius: '9px',
                      background: 'var(--accent-pipelines)',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {badge}
                  </span>
                )}
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
            <div ref={userMenuOpen ? userMenuRef : undefined} style={{ position: 'relative', flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((open) => !open)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '4px 0',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textAlign: 'left',
                  borderRadius: '6px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
                title="User menu"
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: userMenuOpen ? 'var(--bg-hover)' : 'var(--bg-active)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <User size={14} color="var(--text-secondary)" />
                </div>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  User
                </span>
              </button>
              {userMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: '100%',
                    marginBottom: '4px',
                    minWidth: '160px',
                    background: 'var(--bg-sidebar)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    padding: '4px 0',
                    zIndex: 100,
                  }}
                >
                  {appearanceSubmenuOpen ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setAppearanceSubmenuOpen(false)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          fontSize: '13px',
                          textAlign: 'left',
                          borderBottom: '1px solid var(--border-subtle)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--bg-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />
                        Appearance
                      </button>
                      {(['dark', 'light'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            onThemeChange(t);
                            setAppearanceSubmenuOpen(false);
                            setUserMenuOpen(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            fontSize: '13px',
                            textAlign: 'left',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--bg-hover)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          {theme === t ? <Check size={14} style={{ flexShrink: 0 }} /> : <span style={{ width: 14, flexShrink: 0 }} />}
                          {t === 'dark' ? 'Dark' : 'Light'}
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          fontSize: '13px',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--bg-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => setAppearanceSubmenuOpen(true)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          fontSize: '13px',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--bg-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        Appearance
                        <ChevronRight size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          fontSize: '13px',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--bg-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        Usage statistics
                      </button>
                    </>
                  )}
                </div>
              )}
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
              title="Collapse panel"
            >
              <PanelLeftClose size={14} />
            </button>
          </div>
        </>
      )}
      {collapsed && (
        <>
          <nav style={{ flex: 1, overflow: 'auto', padding: '2px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
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
              {...getNavItemHover('chat')}
            >
              <LeftPaneNavIcon
                icon={MessageCircle}
                iconColor={hoveredNavKey === 'chat' ? 'var(--accent-pipelines)' : 'var(--text-secondary)'}
                iconSize={15}
              />
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
                color: hoveredNavKey === 'launch' ? 'var(--accent-pipelines)' : 'var(--text-secondary)',
              }}
              {...getNavItemHover('launch')}
            >
              <Plus size={15} />
            </button>
            {appsGroup.map(({ type, icon: Icon }) => (
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
                {...getNavItemHover(type)}
              >
                <LeftPaneNavIcon
                  iconColor={hoveredNavKey === type ? 'var(--accent-pipelines)' : 'var(--text-secondary)'}
                  iconSize={15}
                  icon={type === 'rstudio' || type === 'vscode' ? undefined : Icon}
                >
                  {type === 'rstudio' ? (
                    <span style={{ filter: hoveredNavKey === type ? 'none' : 'grayscale(1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <RStudioIcon size={15} />
                    </span>
                  ) : type === 'vscode' ? (
                    <span style={{ filter: hoveredNavKey === type ? 'none' : 'grayscale(1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <VSCodeIcon size={15} />
                    </span>
                  ) : undefined}
                </LeftPaneNavIcon>
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
                      {...getNavItemHover(`launched-${app.id}`)}
                    >
                      <LeftPaneNavIcon
                        iconColor={hoveredNavKey === `launched-${app.id}` ? 'var(--accent-pipelines)' : 'var(--text-secondary)'}
                        iconSize={15}
                      >
                        {isLaunching ? (
                          <Loader2 size={15} color={hoveredNavKey === `launched-${app.id}` ? 'var(--accent-pipelines)' : 'var(--text-secondary)'} style={{ animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <IconComponent size={15} color={hoveredNavKey === `launched-${app.id}` ? 'var(--accent-pipelines)' : 'var(--text-secondary)'} />
                        )}
                      </LeftPaneNavIcon>
                    </button>
                  );
                })}
              </>
            )}
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
            <div ref={userMenuOpen ? userMenuRef : undefined} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((open) => !open)}
                title="User menu"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: userMenuOpen ? 'var(--bg-hover)' : 'var(--bg-active)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                }}
              >
                <User size={14} color="var(--text-secondary)" />
              </button>
              {userMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    left: '100%',
                    bottom: 0,
                    marginLeft: '4px',
                    minWidth: '160px',
                    background: 'var(--bg-sidebar)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    padding: '4px 0',
                    zIndex: 100,
                  }}
                >
                  {appearanceSubmenuOpen ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setAppearanceSubmenuOpen(false)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          fontSize: '13px',
                          textAlign: 'left',
                          borderBottom: '1px solid var(--border-subtle)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--bg-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />
                        Appearance
                      </button>
                      {(['dark', 'light'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            onThemeChange(t);
                            setAppearanceSubmenuOpen(false);
                            setUserMenuOpen(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            fontSize: '13px',
                            textAlign: 'left',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--bg-hover)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          {theme === t ? <Check size={14} style={{ flexShrink: 0 }} /> : <span style={{ width: 14, flexShrink: 0 }} />}
                          {t === 'dark' ? 'Dark' : 'Light'}
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          fontSize: '13px',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--bg-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => setAppearanceSubmenuOpen(true)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          fontSize: '13px',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--bg-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        Appearance
                        <ChevronRight size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          fontSize: '13px',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--bg-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        Usage statistics
                      </button>
                    </>
                  )}
                </div>
              )}
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
