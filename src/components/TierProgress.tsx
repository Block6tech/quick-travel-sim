import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Lock, Check, ChevronDown, Trophy } from "lucide-react";
import { tiers, getUserTier, getNextTier } from "@/data/esim-data";

interface TierProgressProps {
  orderCount: number;
}

const tierColors: Record<number, { bg: string; accent: string; text: string; camel: string }> = {
  1: { bg: "bg-amber-900/20", accent: "bg-amber-700", text: "text-amber-700 dark:text-amber-400", camel: "🐪" },
  2: { bg: "bg-yellow-500/20", accent: "bg-yellow-500", text: "text-yellow-600 dark:text-yellow-400", camel: "🐫" },
  3: { bg: "bg-red-500/20", accent: "bg-red-500", text: "text-red-600 dark:text-red-400", camel: "🐫" },
};

/** Colored camel SVG for each tier */
function CamelIcon({ tier }: { tier: number }) {
  const fills: Record<number, string> = {
    1: "#92400e", // brown
    2: "#d4a017", // gold
    3: "#dc2626", // red
  };
  const fill = fills[tier] || fills[1];
  return (
    <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
      {/* Body */}
      <ellipse cx="32" cy="38" rx="18" ry="12" fill={fill} />
      {/* Hump */}
      <ellipse cx="28" cy="27" rx="7" ry="6" fill={fill} />
      {tier === 2 && <ellipse cx="38" cy="28" rx="6" ry="5" fill={fill} />}
      {/* Neck */}
      <rect x="14" y="24" width="6" height="16" rx="3" fill={fill} />
      {/* Head */}
      <ellipse cx="16" cy="22" rx="6" ry="4.5" fill={fill} />
      {/* Eye */}
      <circle cx="13.5" cy="21" r="1.2" fill="white" />
      <circle cx="13.5" cy="21" r="0.6" fill="#1a1a1a" />
      {/* Legs */}
      <rect x="20" y="47" width="3.5" height="10" rx="1.5" fill={fill} />
      <rect x="28" y="47" width="3.5" height="10" rx="1.5" fill={fill} />
      <rect x="36" y="47" width="3.5" height="10" rx="1.5" fill={fill} />
      <rect x="44" y="47" width="3.5" height="10" rx="1.5" fill={fill} />
      {/* Tail */}
      <path d={`M50 36 Q56 32 54 28`} stroke={fill} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {tier === 3 && (
        <g>
          {/* Crown for Red Camel */}
          <polygon points="10,18 12,14 14,17 16,13 18,17 20,14 22,18" fill="#facc15" stroke="#eab308" strokeWidth="0.5" />
        </g>
      )}
    </svg>
  );
}

export default function TierProgress({ orderCount }: TierProgressProps) {
  const [expanded, setExpanded] = useState(false);
  const current = getUserTier(orderCount);
  const { next, ordersNeeded, progress } = getNextTier(orderCount);
  const colors = tierColors[current.level];

  return (
    <div className="space-y-0">
      {/* Collapsible header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 rounded-xl bg-card shadow-card flex items-center gap-3 btn-press touch-target"
      >
        <CamelIcon tier={current.level} />
        <div className="flex-1 min-w-0 text-left">
          <p className={`text-xs font-bold ${colors.text}`}>{current.name} Tier</p>
          {next ? (
            <div className="mt-1 space-y-1">
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${tierColors[next.level].accent}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {ordersNeeded} order{ordersNeeded !== 1 ? "s" : ""} to <span className={`font-bold ${tierColors[next.level].text}`}>{next.name}</span>
              </p>
            </div>
          ) : (
            <p className="text-[10px] text-muted-foreground mt-0.5">Max tier reached — enjoy all perks!</p>
          )}
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-4">
              {/* Tier roadmap */}
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
                      <div className="text-center space-y-1.5">
                        <div className="flex justify-center">
                          <CamelIcon tier={t.level} />
                        </div>
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

              {/* Next tier perks */}
              {next && (
                <div className="p-3 rounded-lg bg-secondary/30 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Gift className={`w-3.5 h-3.5 ${tierColors[next.level].text}`} />
                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                      Unlock at {next.name}
                    </p>
                  </div>
                  {next.perks.map((perk) => (
                    <div key={perk} className="flex items-center gap-2">
                      <Lock className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                      <span className="text-[11px] text-muted-foreground">{perk}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Current perks */}
              {current.perks.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
                    Your perks
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
