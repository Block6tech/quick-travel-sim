import { useNavigate } from "react-router-dom";
import { EsimCountry } from "@/data/esim-data";
import { useCurrency } from "@/contexts/CurrencyContext";

function countryFlag(code: string): string {
  if (code.length !== 2) return "";
  const offset = 0x1f1e6 - 65;
  return String.fromCodePoint(
    code.charCodeAt(0) + offset,
    code.charCodeAt(1) + offset
  );
}

import { ContinentIcon } from "@/components/ContinentIcons";

interface CountryCardProps {
  country: EsimCountry;
  delay?: number;
}

const CountryCard = ({ country, delay = 0 }: CountryCardProps) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const isRegion = ["EU", "AS", "ME", "GL", "GP"].includes(country.code);
  const icon = isRegion ? null : countryFlag(country.code);

  return (
    <button
      onClick={() => navigate(`/plans/${country.code}`)}
      className="flex items-center gap-3 p-3 rounded-lg bg-card shadow-card hover:shadow-card-hover transition-all duration-200 btn-press text-left w-full touch-target"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-10 h-10 rounded-md bg-secondary text-foreground flex items-center justify-center flex-shrink-0">
        {isRegion ? <ContinentIcon code={country.code} className="w-4 h-4" /> : (
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
          {formatPrice(country.startingPrice)}
        </p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">from</p>
      </div>
    </button>
  );
};

export default CountryCard;
