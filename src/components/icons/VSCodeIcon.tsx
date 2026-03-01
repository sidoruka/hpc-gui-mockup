/**
 * Visual Studio Code icon from IconScout.
 * https://cdn.iconscout.com/icon/free/png-256/free-vscode-icon-svg-download-png-10918879.png
 */
const VSCODE_ICON_URL =
  'https://cdn.iconscout.com/icon/free/png-256/free-vscode-icon-svg-download-png-10918879.png';

interface VSCodeIconProps {
  size?: number;
  color?: string;
  className?: string;
}

export function VSCodeIcon({ size = 24, className }: VSCodeIconProps) {
  return (
    <img
      src={VSCODE_ICON_URL}
      alt="VSCode"
      width={size}
      height={size}
      className={className}
      style={{ display: 'block', objectFit: 'contain' }}
    />
  );
}
