/** Monochrome SVG icons for regional / global bundles */

function EuropeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2c-2 3-3 6-3 10s1 7 3 10" />
      <path d="M12 2c2 3 3 6 3 10s-1 7-3 10" />
      <path d="M2 12h20" />
      <path d="M4 7h16" />
      <path d="M4 17h16" />
      <path d="M8 4v2M16 4v2" />
      <circle cx="9" cy="9" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="7" cy="12" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="11" cy="14" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function AsiaIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2c2 3 3 6 3 10s-1 7-3 10" />
      <path d="M12 2c-2 3-3 6-3 10s1 7 3 10" />
      <path d="M2 12h20" />
      <path d="M3.5 7h17M3.5 17h17" />
      <path d="M15 8l2 2-1 3-3 1" />
    </svg>
  );
}

function MiddleEastIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2c-2 3-3 6-3 10s1 7 3 10" />
      <path d="M12 2c2 3 3 6 3 10s-1 7-3 10" />
      <path d="M12 6v3l2 1v2l-2 1-2-1v-2l2-1" />
      <path d="M10 16c0-1 1-2 2-2s2 1 2 2" />
    </svg>
  );
}

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
