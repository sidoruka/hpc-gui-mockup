import React from 'react';
import {
  LayoutGrid,
  Search,
  MessageCircle,
  Terminal,
  Monitor,
  BookOpen,
  Box,
  Folder,
  Share2,
  Database,
  User,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import type { TabType } from '../state/appState';
import { getTitleForType } from '../state/appState';

interface NavItem {
  type: TabType;
  icon: React.ElementType;
  color: string;
}

const chatItem: NavItem = { type: 'chat', icon: MessageCircle, color: 'var(--accent-chat)' };

const appsGroup: NavItem[] = [
  { type: 'shell', icon: Terminal, color: 'var(--accent-shell)' },
  { type: 'desktop', icon: Monitor, color: 'var(--accent-desktop)' },
  { type: 'jupyter', icon: BookOpen, color: 'var(--accent-jupyter)' },
  { type: 'rstudio', icon: Box, color: 'var(--accent-rstudio)' },
];

const dataGroup: NavItem[] = [
  { type: 'my-files', icon: Folder, color: 'var(--accent-files)' },
  { type: 'shared-with-me', icon: Share2, color: 'var(--accent-shared)' },
  { type: 'common-data', icon: Database, color: 'var(--accent-common)' },
];

interface LeftPanelProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onOpenApp: (type: TabType) => void;
}

export function LeftPanel({ collapsed, onToggleSidebar, onOpenApp }: LeftPanelProps) {
  return (
    <aside
      style={{
        width: collapsed ? 56 : 240,
        minWidth: collapsed ? 56 : 240,
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'width 0.2s ease',
      }}
    >
      {!collapsed && (
        <>
          <div
            style={{
              padding: '8px 12px',
              margin: '8px 12px 0',
              background: 'var(--bg-search)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Search size={16} color="var(--text-secondary)" />
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
          <nav style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
            <button
              type="button"
              onClick={() => onOpenApp(chatItem.type)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
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
                <MessageCircle size={16} color="#fff" />
              </div>
              {getTitleForType(chatItem.type)}
            </button>
            <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LayoutGrid size={18} color="var(--text-secondary)" />
              <span style={{ fontWeight: 600, fontSize: '13px' }}>Apps</span>
            </div>
            {appsGroup.map(({ type, icon: Icon, color }) => (
              <button
                key={type}
                type="button"
                onClick={() => onOpenApp(type)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
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
                    background: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} color="#fff" />
                </div>
                {getTitleForType(type)}
              </button>
            ))}
            <div
              style={{
                padding: '16px 12px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Folder size={18} color="var(--text-secondary)" />
              <span style={{ fontWeight: 600, fontSize: '13px' }}>Data</span>
            </div>
            {dataGroup.map(({ type, icon: Icon, color }) => (
              <button
                key={type}
                type="button"
                onClick={() => onOpenApp(type)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
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
                    background: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} color="#fff" />
                </div>
                {getTitleForType(type)}
              </button>
            ))}
          </nav>
          <div
            style={{
              padding: '12px',
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
              <User size={18} color="var(--text-secondary)" />
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
              <PanelLeftClose size={18} />
            </button>
          </div>
        </>
      )}
      {collapsed && (
        <>
          <nav style={{ flex: 1, overflow: 'auto', padding: '8px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
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
                <MessageCircle size={16} color="#fff" />
              </div>
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
                  <Icon size={16} color="#fff" />
                </div>
              </button>
            ))}
            {dataGroup.map(({ type, icon: Icon, color }) => (
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
                  <Icon size={16} color="#fff" />
                </div>
              </button>
            ))}
          </nav>
          <div
            style={{
              padding: '12px',
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
              <User size={18} color="var(--text-secondary)" />
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
              <PanelLeftOpen size={18} />
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
