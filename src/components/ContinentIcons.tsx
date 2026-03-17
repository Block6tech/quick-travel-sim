import React from "react";

/**
 * Simplified continent map silhouettes as B&W filled SVG paths.
 * Each is a recognizable outline of the actual landmass.
 */

const Europe = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className}>
    <path d="M38 4l-2 3-4 1-3 3 1 4-2 2h-4l-2 3 1 3-3 4-1 4 2 3 4 1 2 3-1 4 3 2 5-1 3 2 1 4h4l3-2 4 1 2-3-1-4 3-3 1-5-2-3 1-4-3-3-2-5 2-3-1-4-3-1-4 2z" />
  </svg>
);

const Asia = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className}>
    <path d="M20 4l-4 5-2 6 3 5 6 2 4 5 1 7-3 6 2 5 5 3 7-1 5 4 3 6h5l4-4 6-1 3-5-1-7-4-4 1-6 4-5 2-7-3-5-6-2-4-4-6 1-5-3-7 1-4-3-5 1z" />
  </svg>
);

const MiddleEast = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className}>
    <path d="M24 8l-4 6-1 8 3 6 6 3 2 7-2 6 4 5 6-1 4 4 3-2 1-6 4-4 2-7-3-5-1-7 2-5-4-4-6 1-4-3-5-1-3 3z" />
  </svg>
);

const Africa = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className}>
    <path d="M28 2l-6 4-4 7-1 8 2 7 5 6 3 8-1 7-3 5 2 4 5 2 4-1 3 3 4-2 1-6-2-7 3-6 4-8 1-9-3-7-5-5-4-6-3-2z" />
  </svg>
);

const NorthAmerica = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className}>
    <path d="M30 2l-6 3-8 6-4 8-1 7 3 6 1 7-2 5 3 5 6 2 5 4 4-1 3 3 5-2 2-5 4-3 3-6-1-7-4-5-1-7 2-6-3-5-5-3-3-4z" />
  </svg>
);

const SouthAmerica = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className}>
    <path d="M30 4l-5 4-4 6-3 8 1 7 4 6 2 8-2 7-4 5 1 4 4 1 3-2 4 1 3-3 1-6-1-7 3-6 3-8-1-8-3-6-2-5z" />
  </svg>
);

const Globe = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
    <path d="M4.63 5h14.74M4.63 19h14.74" />
  </svg>
);

const continentComponents: Record<string, React.FC<{ className?: string }>> = {
  EU: Europe,
  AS: Asia,
  ME: MiddleEast,
  AF: Africa,
  NA: NorthAmerica,
  SA: SouthAmerica,
  GL: Globe,
  GP: Globe,
};

export function ContinentIcon({
  code,
  className = "w-5 h-5",
}: {
  code: string;
  className?: string;
}) {
  const Component = continentComponents[code] || Globe;
  return <Component className={className} />;
}

export default ContinentIcon;
