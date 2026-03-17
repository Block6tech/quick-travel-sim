import { useNavigate } from "react-router-dom";
import { EsimPlan } from "@/data/esim-data";
import { ChevronRight, ChevronLeft, Wifi } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface PlanCardProps {
  plan: EsimPlan;
  delay?: number;
}

const PlanCard = ({ plan, delay = 0 }: PlanCardProps) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { t, isRTL } = useLanguage();
  const Chevron = isRTL ? ChevronLeft : ChevronRight;

  return (
    <button
      onClick={() => navigate(`/plan/${plan.id}`, { state: { plan } })}
      className="group relative flex items-center justify-between p-4 bg-card rounded-lg shadow-card hover:shadow-card-hover transition-all duration-200 btn-press text-start w-full touch-target"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-mono-data uppercase tracking-wider text-muted-foreground">
            {plan.speed}
          </span>
          <h3 className="text-2xl font-bold tracking-display">{plan.data}</h3>
          <p className="text-xs text-muted-foreground">
            {plan.validity} · <Wifi className="w-3 h-3 inline" /> {plan.hotspot ? t.hotspot : t.noHotspot}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end gap-1.5">
          {plan.isBestValue && (
            <span className="px-2 py-0.5 bg-foreground text-primary-foreground text-[10px] font-bold uppercase rounded-sm tracking-wider">
              {t.bestValue}
            </span>
          )}
          {plan.isMostPopular && !plan.isBestValue && (
            <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-[10px] font-bold uppercase rounded-sm tracking-wider">
              {t.popular}
            </span>
          )}
          <span className="text-lg font-mono-data font-semibold">
            {formatPrice(plan.price)}
          </span>
        </div>
        <Chevron className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
    </button>
  );
};

export default PlanCard;
