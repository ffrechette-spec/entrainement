interface PixelIconProps {
  type: "pecs" | "dos" | "jambes" | "epaules" | "cardio" | "bras";
  size?: number;
  className?: string;
}

export default function PixelIcon({ type, size = 24, className = "" }: PixelIconProps) {
  const icons: Record<PixelIconProps["type"], React.ReactNode> = {
    pecs: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        <rect x="0" y="7" width="3" height="2" fill="#FF6B9D"/>
        <rect x="3" y="6" width="2" height="4" fill="#FF6B9D"/>
        <rect x="5" y="5" width="2" height="6" fill="#FF6B9D"/>
        <rect x="7" y="5" width="2" height="6" fill="#FF6B9D"/>
        <rect x="9" y="5" width="2" height="6" fill="#FF6B9D"/>
        <rect x="11" y="6" width="2" height="4" fill="#FF6B9D"/>
        <rect x="13" y="7" width="3" height="2" fill="#FF6B9D"/>
        <rect x="5" y="7" width="6" height="2" fill="#FF6B9D" opacity="0.5"/>
      </svg>
    ),
    dos: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        <rect x="7" y="1" width="2" height="2" fill="#4ECDC4"/>
        <rect x="5" y="3" width="6" height="2" fill="#4ECDC4"/>
        <rect x="3" y="5" width="10" height="2" fill="#4ECDC4"/>
        <rect x="7" y="7" width="2" height="8" fill="#4ECDC4"/>
        <rect x="5" y="9" width="2" height="4" fill="#4ECDC4" opacity="0.6"/>
        <rect x="9" y="9" width="2" height="4" fill="#4ECDC4" opacity="0.6"/>
      </svg>
    ),
    jambes: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        <rect x="4" y="0" width="8" height="2" fill="#C77DFF"/>
        <rect x="3" y="2" width="10" height="2" fill="#C77DFF"/>
        <rect x="2" y="4" width="12" height="3" fill="#C77DFF"/>
        <rect x="3" y="7" width="4" height="5" fill="#C77DFF" opacity="0.8"/>
        <rect x="9" y="7" width="4" height="5" fill="#C77DFF" opacity="0.8"/>
        <rect x="3" y="12" width="4" height="4" fill="#C77DFF" opacity="0.6"/>
        <rect x="9" y="12" width="4" height="4" fill="#C77DFF" opacity="0.6"/>
      </svg>
    ),
    epaules: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        <rect x="6" y="0" width="4" height="4" fill="#00F5FF"/>
        <rect x="1" y="4" width="14" height="3" fill="#00F5FF"/>
        <rect x="0" y="3" width="3" height="5" fill="#00F5FF" opacity="0.7"/>
        <rect x="13" y="3" width="3" height="5" fill="#00F5FF" opacity="0.7"/>
        <rect x="5" y="7" width="6" height="2" fill="#00F5FF" opacity="0.5"/>
        <rect x="6" y="9" width="4" height="7" fill="#00F5FF" opacity="0.4"/>
      </svg>
    ),
    cardio: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        <rect x="1" y="3" width="4" height="4" fill="#FFD93D"/>
        <rect x="0" y="4" width="6" height="4" fill="#FFD93D"/>
        <rect x="11" y="3" width="4" height="4" fill="#FFD93D"/>
        <rect x="10" y="4" width="6" height="4" fill="#FFD93D"/>
        <rect x="2" y="7" width="12" height="3" fill="#FFD93D"/>
        <rect x="4" y="10" width="8" height="3" fill="#FFD93D"/>
        <rect x="6" y="13" width="4" height="2" fill="#FFD93D"/>
        <rect x="7" y="15" width="2" height="1" fill="#FFD93D"/>
      </svg>
    ),
    bras: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        <rect x="5" y="0" width="6" height="2" fill="#FF6B9D"/>
        <rect x="3" y="2" width="10" height="3" fill="#FF6B9D"/>
        <rect x="2" y="5" width="12" height="4" fill="#FF6B9D"/>
        <rect x="4" y="9" width="8" height="3" fill="#00F5FF"/>
        <rect x="5" y="12" width="6" height="2" fill="#00F5FF"/>
        <rect x="6" y="14" width="4" height="2" fill="#00F5FF" opacity="0.7"/>
      </svg>
    ),
  };

  return <>{icons[type]}</>;
}
