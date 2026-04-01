/** Monochrome SVG icons for regional / global bundles */

/** Eiffel Tower silhouette — Europe */
function EuropeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 1.5l-1.2 6h2.4L12 1.5zM10.5 9l-1.5 5h1.5l.5-2h2l.5 2H15l-1.5-5h-3zm1.2 1.5h.6l.4 1.5h-1.4l.4-1.5zM8.5 15.5L7 22h2l.5-2h5l.5 2h2l-1.5-6.5H8.5zm2.3 1.5h2.4l.5 2h-3.4l.5-2z" />
    </svg>
  );
}

/** Torii gate silhouette — Asia */
function AsiaIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4 6h16v2H4V6z" />
      <path d="M3 5c0-.5.5-1.5 9-1.5S21 4.5 21 5v1H3V5z" />
      <path d="M6 8h2v13H6V8zM16 8h2v13h-2V8z" />
      <path d="M5 12h14v1.5H5V12z" />
    </svg>
  );
}

/** Mosque dome & minaret — Middle East */
function MiddleEastIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 3c-3 0-6 3-6 6v2h12v-6c0 0-3-2-6-2z" />
      <path d="M12 2l.5 1h-1L12 2z" />
      <rect x="6" y="11" width="12" height="2" />
      <rect x="7" y="13" width="2" height="8" />
      <rect x="15" y="13" width="2" height="8" />
      <rect x="10" y="13" width="4" height="8" rx="2" />
      <rect x="19" y="6" width="1.5" height="15" />
      <circle cx="19.75" cy="5" r="1" />
    </svg>
  );
}

/** Simple globe — Global */
function GlobeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
      <path d="M4.63 5.5h14.74M4.63 18.5h14.74" />
    </svg>
  );
}

/** Globe with plus badge — Global Plus */
function GlobePlusIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
        <path d="M4.63 5.5h14.74M4.63 18.5h14.74" />
      </svg>
      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-foreground flex items-center justify-center">
        <svg viewBox="0 0 12 12" className="w-2 h-2 text-background" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M6 2v8M2 6h8" />
        </svg>
      </div>
    </div>
  );
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  EU: EuropeIcon,
  AS: AsiaIcon,
  ME: MiddleEastIcon,
  GL: GlobeIcon,
  GP: GlobePlusIcon,
};

export function ContinentIcon({
  code,
  className = "w-5 h-5",
}: {
  code: string;
  className?: string;
}) {
  const Icon = iconMap[code] ?? GlobeIcon;
  return <Icon className={className} />;
}

export default ContinentIcon;
