import { useNavigate } from "react-router-dom";
import { EsimCountry } from "@/data/esim-data";

function countryFlag(code: string): string {
  if (code.length !== 2) return "";
  const offset = 0x1f1e6 - 65;
  return String.fromCodePoint(
    code.charCodeAt(0) + offset,
    code.charCodeAt(1) + offset
  );
}

const regionIconMap: Record<string, React.ReactNode> = {
  EU: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 6l.45 1.4h1.47l-1.19.86.46 1.4L12 8.8l-1.19.86.46-1.4-1.19-.86h1.47zM7.5 8.5l.45 1.4h1.47l-1.19.86.46 1.4-1.19-.86-1.19.86.46-1.4-1.19-.86h1.47zM16.5 8.5l.45 1.4h1.47l-1.19.86.46 1.4-1.19-.86-1.19.86.46-1.4-1.19-.86h1.47zM5.5 13l.45 1.4h1.47l-1.19.86.46 1.4L5.5 15.8l-1.19.86.46-1.4-1.19-.86h1.47zM18.5 13l.45 1.4h1.47l-1.19.86.46 1.4-1.19-.86-1.19.86.46-1.4-1.19-.86h1.47zM7.5 17l.45 1.4h1.47l-1.19.86.46 1.4-1.19-.86-1.19.86.46-1.4-1.19-.86h1.47zM16.5 17l.45 1.4h1.47l-1.19.86.46 1.4-1.19-.86-1.19.86.46-1.4-1.19-.86h1.47z" opacity=".4"/>
    </svg>
  ),
  AS: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 2v1M12 3C10 5 8 6 8 8h8c0-2-2-3-4-5z"/>
      <path d="M7 8c-1 1-2 2-2 3h14c0-1-1-2-2-3"/>
      <path d="M5 11c-1 1-1.5 2-1.5 3H20.5c0-1-.5-2-1.5-3"/>
      <path d="M3.5 14v1h17v-1"/><rect x="9" y="15" width="6" height="7" rx="0.5"/>
      <line x1="6" y1="22" x2="18" y2="22"/>
    </svg>
  ),
  ME: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M15 4a8 8 0 1 0 0 16 6 6 0 0 1 0-16z"/>
      <path d="M17.5 8l.6 1.9h2l-1.6 1.2.6 1.9-1.6-1.2-1.6 1.2.6-1.9-1.6-1.2h2z" fill="currentColor" stroke="none"/>
    </svg>
  ),
  GL: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/><path d="M4.63 5h14.74M4.63 19h14.74"/>
    </svg>
  ),
  GP: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/><path d="M4.63 5h14.74M4.63 19h14.74"/>
    </svg>
  ),
};

interface CountryCardProps {
  country: EsimCountry;
  delay?: number;
}

const CountryCard = ({ country, delay = 0 }: CountryCardProps) => {
  const navigate = useNavigate();
  const isRegion = ["EU", "AS", "ME", "GL", "GP"].includes(country.code);
  const icon = isRegion ? null : countryFlag(country.code);

  return (
    <button
      onClick={() => navigate(`/plans/${country.code}`)}
      className="flex items-center gap-3 p-3 rounded-lg bg-card shadow-card hover:shadow-card-hover transition-all duration-200 btn-press text-left w-full touch-target"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-10 h-10 rounded-md bg-secondary text-foreground flex items-center justify-center flex-shrink-0">
        {isRegion ? (regionIconMap[country.code] || regionIconMap.GL) : (
          <span className="text-lg leading-none">{icon}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{country.name}</p>
        <p className="text-xs text-muted-foreground">
          {country.planCount} plans
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-mono-data font-medium">
          ${country.startingPrice.toFixed(2)}
        </p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">from</p>
      </div>
    </button>
  );
};

export default CountryCard;
