import React from 'react';

const BOX_SIZE = 28;
const DEFAULT_ICON_SIZE = 15;
const DEFAULT_ICON_COLOR = 'var(--text-secondary)';

export interface LeftPaneNavIconProps {
  /** Lucide or custom icon component (used when children not provided) */
  icon?: React.ElementType;
  /** Background of the icon box. Default: transparent (Pipelines/Data style) */
  backgroundColor?: string;
  /** Icon color. Default: var(--text-secondary) */
  iconColor?: string;
  /** Icon size in px. Default: 15 */
  iconSize?: number;
  /** Custom content instead of rendering icon prop (e.g. RStudioIcon, VSCodeIcon, Loader2) */
  children?: React.ReactNode;
}

/**
 * Shared icon wrapper for left pane nav items.
 * Styled like "All pipelines", "Runs", and Data section items by default
 * (transparent background, secondary text color). Pass backgroundColor/iconColor for accent items (Chat, Apps).
 */
export function LeftPaneNavIcon({
  icon: Icon,
  backgroundColor = 'transparent',
  iconColor = DEFAULT_ICON_COLOR,
  iconSize = DEFAULT_ICON_SIZE,
  children,
}: LeftPaneNavIconProps) {
  return (
    <div
      style={{
        width: BOX_SIZE,
        height: BOX_SIZE,
        borderRadius: '6px',
        background: backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {children != null ? (
        children
      ) : Icon != null ? (
        <Icon size={iconSize} color={iconColor} />
      ) : null}
    </div>
  );
}
