/**
 * RStudio app icon (product image).
 * Source: https://images.icon-icons.com/1381/PNG/512/rstudio_94807.png
 */
const RSTUDIO_ICON_URL =
  'https://images.icon-icons.com/1381/PNG/512/rstudio_94807.png';

interface RStudioIconProps {
  size?: number;
  color?: string;
  circleColor?: string;
  className?: string;
}

export function RStudioIcon({
  size = 24,
  className,
}: RStudioIconProps) {
  return (
    <img
      src={RSTUDIO_ICON_URL}
      alt="RStudio"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}
