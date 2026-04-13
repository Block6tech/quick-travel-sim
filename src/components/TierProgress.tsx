import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Lock, Check, ChevronDown, Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import type { TierInfo, TierLevel } from "@/data/esim-data";
import { tiers as fallbackTiers, getUserTier as fallbackGetUserTier, getNextTier as fallbackGetNextTier } from "@/data/esim-data";

interface TierProgressProps {
  orderCount: number;
}

const tierColors: Record<number, { bg: string; accent: string; text: string }> = {
  1: { bg: "bg-amber-900/20", accent: "bg-amber-700", text: "text-amber-700 dark:text-amber-400" },
  2: { bg: "bg-yellow-500/20", accent: "bg-yellow-500", text: "text-yellow-600 dark:text-yellow-400" },
  3: { bg: "bg-red-500/20", accent: "bg-red-500", text: "text-red-600 dark:text-red-400" },
};

function CamelIcon({ tier }: { tier: number }) {
  const fills: Record<number, string> = { 1: "#92400e", 2: "#d4a017", 3: "#dc2626" };
  const fill = fills[tier] || fills[1];
  return (
    <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="38" rx="18" ry="12" fill={fill} />
      <ellipse cx="28" cy="27" rx="7" ry="6" fill={fill} />
      {tier === 2 && <ellipse cx="38" cy="28" rx="6" ry="5" fill={fill} />}
      <rect x="14" y="24" width="6" height="16" rx="3" fill={fill} />
      <ellipse cx="16" cy="22" rx="6" ry="4.5" fill={fill} />
      <circle cx="13.5" cy="21" r="1.2" fill="white" />
      <circle cx="13.5" cy="21" r="0.6" fill="#1a1a1a" />
      <rect x="20" y="47" width="3.5" height="10" rx="1.5" fill={fill} />
      <rect x="28" y="47" width="3.5" height="10" rx="1.5" fill={fill} />
      <rect x="36" y="47" width="3.5" height="10" rx="1.5" fill={fill} />
      <rect x="44" y="47" width="3.5" height="10" rx="1.5" fill={fill} />
      <path d={`M50 36 Q56 32 54 28`} stroke={fill} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {tier === 3 && (
        <polygon points="10,18 12,14 14,17 16,13 18,17 20,14 22,18" fill="#facc15" stroke="#eab308" strokeWidth="0.5" />
      )}
    </svg>
  );
}

interface DbTier {
  level: number;
  name: string;
  emoji: string;
  min_orders: number;
  discount: number;
  perks: string[];
  perks_ar: string[];
}

function dbToTierInfo(db: DbTier): TierInfo {
  return {
    level: db.level as TierLevel,
    name: db.name,
    emoji: db.emoji,
    minOrders: db.min_orders,
    discount: db.discount,
    perks: db.perks,
  };
}

export default function TierProgress({ orderCount }: TierProgressProps) {
  const [expanded, setExpanded] = useState(false);
  const { t, locale, isRTL } = useLanguage();
  const [tiers, setTiers] = useState<TierInfo[]>(fallbackTiers);
  const [perksAr, setPerksAr] = useState<Record<number, string[]>>({});

  useEffect(() => {
    supabase
      .from("camel_tiers")
      .select("*")
      .order("level", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const dbTiers = data as DbTier[];
          setTiers(dbTiers.map(dbToTierInfo));
          const arMap: Record<number, string[]> = {};
          dbTiers.forEach((t) => { arMap[t.level] = t.perks_ar; });
          setPerksAr(arMap);
        }
      });
  }, []);

  const getUserTier = (count: number): TierInfo => {
    for (let i = tiers.length - 1; i >= 0; i--) {
      if (count >= tiers[i].minOrders) return tiers[i];
    }
    return tiers[0];
  };

  const getNextTier = (count: number) => {
    const current = getUserTier(count);
    const idx = tiers.findIndex((t) => t.level === current.level);
    if (idx === tiers.length - 1) return { next: null, ordersNeeded: 0, progress: 100 };
    const next = tiers[idx + 1];
    const ordersNeeded = next.minOrders - count;
    const prevMin = current.minOrders;
    const progress = ((count - prevMin) / (next.minOrders - prevMin)) * 100;
    return { next, ordersNeeded, progress: Math.min(100, Math.max(0, progress)) };
  };

  const current = getUserTier(orderCount);
  const { next, ordersNeeded, progress } = getNextTier(orderCount);
  const colors = tierColors[current.level] || tierColors[1];

  const getPerks = (tierItem: TierInfo) => {
    if (locale === "ar" && perksAr[tierItem.level]?.length) return perksAr[tierItem.level];
    return tierItem.perks;
  };

  return (
    <div className="space-y-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 rounded-xl bg-card shadow-card flex items-center gap-3 btn-press touch-target"
      >
        <CamelIcon tier={current.level} />
        <div className="flex-1 min-w-0 text-start">
          <p className={`text-xs font-bold ${colors.text}`}>{t.tierName(current.name)}</p>
          {next ? (
            <div className="mt-1 space-y-1">
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${(tierColors[next.level] || tierColors[1]).accent}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {t.ordersTo(ordersNeeded, next.name)}
              </p>
            </div>
          ) : (
            <p className="text-[10px] text-muted-foreground mt-0.5">{t.maxTier}</p>
          )}
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </motion.div>
      </button>

      <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground mt-2 px-1 my-[12px]">
        <span className={current.level >= 1 ? "text-amber-700 dark:text-amber-400 font-bold" : ""}>🐪 {locale === "ar" ? "الجمل البرونزي" : "Bronze Camel"}</span>
        <span>{isRTL ? "←" : "→"}</span>
        <span className={current.level >= 2 ? "text-yellow-600 dark:text-yellow-400 font-bold" : ""}>✨ {locale === "ar" ? "الجمل الذهبي" : "Golden Camel"}</span>
        <span>{isRTL ? "←" : "→"}</span>
        <span className={current.level >= 3 ? "text-red-600 dark:text-red-400 font-bold" : ""}>👑 {locale === "ar" ? "الجمل الأحمر" : "Red Camel"}</span>
      </div>

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
              <div className="flex gap-2">
                {tiers.map((tierItem) => {
                  const isActive = current.level >= tierItem.level;
                  const isCurrent = current.level === tierItem.level;
                  const c = tierColors[tierItem.level] || tierColors[1];
                  return (
                    <div
                      key={tierItem.level}
                      className={`flex-1 p-3 rounded-lg border transition-all ${
                        isCurrent ? `${c.bg} border-current shadow-card-md` : isActive ? "bg-secondary/50 border-border" : "bg-card border-border opacity-60"
                      }`}
                    >
                      <div className="text-center space-y-1.5">
                        <div className="flex justify-center"><CamelIcon tier={tierItem.level} /></div>
                        <p className={`text-[9px] font-bold uppercase tracking-wider ${isCurrent ? c.text : "text-muted-foreground"}`}>{tierItem.name}</p>
                        {tierItem.discount > 0 && (
                          <p className={`text-[10px] font-bold ${isActive ? c.text : "text-muted-foreground"}`}>{t.off(tierItem.discount)}</p>
                        )}
                        {isActive && !isCurrent && <Check className="w-3 h-3 mx-auto text-muted-foreground" />}
                        {!isActive && <p className="text-[9px] text-muted-foreground font-mono-data">{t.orders(tierItem.minOrders)}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {next && (
                <div className="p-3 rounded-lg bg-secondary/30 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Gift className={`w-3.5 h-3.5 ${(tierColors[next.level] || tierColors[1]).text}`} />
                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{t.unlockAt(next.name)}</p>
                  </div>
                  {getPerks(next).map((perk) => (
                    <div key={perk} className="flex items-center gap-2">
                      <Lock className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                      <span className="text-[11px] text-muted-foreground">{perk}</span>
                    </div>
                  ))}
                </div>
              )}

              {getPerks(current).length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">{t.yourPerks}</p>
                  {getPerks(current).map((perk) => (
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
