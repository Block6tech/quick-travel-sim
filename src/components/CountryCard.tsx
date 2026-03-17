import { useNavigate } from "react-router-dom";
import { EsimCountry } from "@/data/esim-data";

interface CountryCardProps {
  country: EsimCountry;
  delay?: number;
}

const CountryCard = ({ country, delay = 0 }: CountryCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/plans/${country.code}`)}
      className="flex items-center gap-3 p-3 rounded-lg bg-card shadow-card hover:shadow-card-hover transition-all duration-200 btn-press text-left w-full touch-target"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-10 h-10 rounded-md bg-foreground flex items-center justify-center flex-shrink-0">
        <span className="text-primary-foreground text-xs font-bold font-mono-data">
          {country.code}
        </span>
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
