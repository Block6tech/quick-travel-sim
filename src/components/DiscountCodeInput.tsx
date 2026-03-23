import { useState } from "react";
import { Tag, X, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface DiscountResult {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  source: "promo" | "referral";
}

interface Props {
  planPrice: number;
  onApply: (discount: DiscountResult | null) => void;
  userId?: string;
}

export default function DiscountCodeInput({ planPrice, onApply, userId }: Props) {
  const { t } = useLanguage();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState<DiscountResult | null>(null);

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");

    const upperCode = code.trim().toUpperCase();

    // Check promo codes first
    const { data: promo } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("code", upperCode)
      .eq("active", true)
      .maybeSingle();

    if (promo) {
      const expired = promo.expires_at && new Date(promo.expires_at) < new Date();
      const maxedOut = promo.max_uses && promo.times_used >= promo.max_uses;
      const belowMin = planPrice < (promo.min_order_amount || 0);

      if (expired || maxedOut || belowMin) {
        setError(t.discountInvalid);
        setLoading(false);
        return;
      }

      const result: DiscountResult = {
        code: upperCode,
        discount_type: promo.discount_type as "percentage" | "fixed",
        discount_value: promo.discount_value,
        source: "promo",
      };
      setApplied(result);
      onApply(result);
      setLoading(false);
      return;
    }

    // Check referral codes
    const { data: referral } = await supabase
      .from("referral_codes")
      .select("*")
      .eq("code", upperCode)
      .maybeSingle();

    if (referral) {
      // Can't use own referral code
      if (userId && referral.user_id === userId) {
        setError(t.discountInvalid);
        setLoading(false);
        return;
      }

      const result: DiscountResult = {
        code: upperCode,
        discount_type: referral.friend_discount_type as "percentage" | "fixed",
        discount_value: referral.friend_discount_value,
        source: "referral",
      };
      setApplied(result);
      onApply(result);
      setLoading(false);
      return;
    }

    setError(t.discountInvalid);
    setLoading(false);
  };

  const handleRemove = () => {
    setApplied(null);
    setCode("");
    setError("");
    onApply(null);
  };

  const discountAmount = applied
    ? applied.discount_type === "percentage"
      ? (planPrice * applied.discount_value) / 100
      : Math.min(applied.discount_value, planPrice)
    : 0;

  return (
    <div className="space-y-2">
      <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t.discountCode}</h2>

      <AnimatePresence mode="wait">
        {applied ? (
          <motion.div
            key="applied"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs font-bold font-mono-data">{applied.code}</p>
                <p className="text-[10px] text-muted-foreground">
                  {applied.discount_type === "percentage"
                    ? `${applied.discount_value}% ${t.discountApplied}`
                    : `$${applied.discount_value} ${t.discountApplied}`}
                  {" · -$"}{discountAmount.toFixed(2)}
                </p>
              </div>
            </div>
            <button onClick={handleRemove} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t.discountPlaceholder}
                  value={code}
                  onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
                  className="w-full h-10 ps-10 pe-4 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all font-mono-data uppercase"
                />
              </div>
              <button
                onClick={handleApply}
                disabled={!code.trim() || loading}
                className="h-10 px-4 bg-foreground text-primary-foreground font-medium rounded-lg text-xs disabled:opacity-40 disabled:pointer-events-none btn-press transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t.discountApply}
              </button>
            </div>
            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-destructive mt-1.5">
                {error}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export type { DiscountResult };
