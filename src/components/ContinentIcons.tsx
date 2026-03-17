import europeMap from "@/assets/continent-europe.png";
import asiaMap from "@/assets/continent-asia.png";
import middleEastMap from "@/assets/continent-middleeast.png";

const continentImages: Record<string, string> = {
  EU: europeMap,
  AS: asiaMap,
  ME: middleEastMap,
};

/** Globe SVG icon */
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

/** Globe + plus icon */
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

export function ContinentIcon({
  code,
  className = "w-5 h-5",
}: {
  code: string;
  className?: string;
}) {
  if (code === "GP") return <GlobePlusIcon className={className} />;
  if (code === "GL") return <GlobeIcon className={className} />;

  const src = continentImages[code];
  if (src) {
    return (
      <img
        src={src}
        alt={code}
        className={`${className} object-contain`}
        draggable={false}
      />
    );
  }

  return <GlobeIcon className={className} />;
}

export default ContinentIcon;
