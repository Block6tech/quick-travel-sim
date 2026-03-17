import { motion } from "framer-motion";
import { Gift, Lock, Check, ChevronRight } from "lucide-react";
import { tiers, getUserTier, getNextTier, type TierInfo } from "@/data/esim-data";

interface TierProgressProps {
  orderCount: number;
}

const tierColors: Record<number, { bg: string; accent: string; text: string }> = {
  1: { bg: "bg-amber-900/20", accent: "bg-amber-700", text: "text-amber-700 dark:text-amber-400" },
  2: { bg: "bg-yellow-500/20", accent: "bg-yellow-500", text: "text-yellow-600 dark:text-yellow-400" },
  3: { bg: "bg-red-500/20", accent: "bg-red-500", text: "text-red-600 dark:text-red-400" },
};

export default function TierProgress({ orderCount }: TierProgressProps) {
  const current = getUserTier(orderCount);
  const { next, ordersNeeded, progress } = getNextTier(orderCount);
  const colors = tierColors[current.level];

  return (
    <div className="space-y-4">
      {/* Progress to next tier */}
      {next ? (
        <div className="p-4 rounded-xl bg-card shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className={`w-4 h-4 ${colors.text}`} />
              <span className="text-xs font-medium">Next: {next.name} Tier</span>
            </div>
            <span className="text-[10px] font-bold font-mono-data text-muted-foreground">
              {ordersNeeded} order{ordersNeeded !== 1 ? "s" : ""} to go
            </span>
          </div>

          {/* Progress bar */}
          <div className="relative">
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${tierColors[next.level].accent}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[9px] text-muted-foreground font-mono-data">
                {orderCount} orders
              </span>
              <span className="text-[9px] text-muted-foreground font-mono-data">
                {next.minOrders} orders
              </span>
            </div>
          </div>

          {/* Next tier perks preview */}
          <div className="pt-1 space-y-1.5">
            <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
              Unlock at {next.name}
            </p>
            {next.perks.map((perk) => (
              <div key={perk} className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                <span className="text-[11px] text-muted-foreground">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-card shadow-card">
          <div className="flex items-center gap-2">
            <span className="text-lg">{current.emoji}</span>
            <div>
              <p className="text-xs font-bold">You've reached the highest tier!</p>
              <p className="text-[10px] text-muted-foreground">Enjoy all your exclusive perks</p>
            </div>
          </div>
        </div>
      )}

      {/* All tiers roadmap */}
      <div className="flex gap-2">
        {tiers.map((t) => {
          const isActive = current.level >= t.level;
          const isCurrent = current.level === t.level;
          const c = tierColors[t.level];
          return (
            <div
              key={t.level}
              className={`flex-1 p-3 rounded-lg border transition-all ${
                isCurrent
                  ? `${c.bg} border-current shadow-card-md`
                  : isActive
                  ? "bg-secondary/50 border-border"
                  : "bg-card border-border opacity-60"
              }`}
            >
              <div className="text-center space-y-1">
                <span className="text-lg block">{t.emoji}</span>
                <p className={`text-[9px] font-bold uppercase tracking-wider ${isCurrent ? c.text : "text-muted-foreground"}`}>
                  {t.name}
                </p>
                {t.discount > 0 && (
                  <p className={`text-[10px] font-bold ${isActive ? c.text : "text-muted-foreground"}`}>
                    {t.discount}% off
                  </p>
                )}
                {isActive && !isCurrent && (
                  <Check className="w-3 h-3 mx-auto text-muted-foreground" />
                )}
                {!isActive && (
                  <p className="text-[9px] text-muted-foreground font-mono-data">{t.minOrders}+ orders</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current perks */}
      {current.perks.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
            Your {current.name} perks
          </p>
          {current.perks.map((perk) => (
            <div key={perk} className="flex items-center gap-2">
              <Check className={`w-3 h-3 flex-shrink-0 ${colors.text}`} />
              <span className="text-[11px]">{perk}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
