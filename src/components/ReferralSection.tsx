import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift, Copy, Share2, Check, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface Props {
  userId: string;
}

export default function ReferralSection({ userId }: Props) {
  const { t } = useLanguage();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadOrCreate = async () => {
      // Try to fetch existing code
      const { data } = await supabase
        .from("referral_codes")
        .select("code, referral_count")
        .eq("user_id", userId)
        .maybeSingle();

      if (data) {
        setReferralCode(data.code);
        setReferralCount(data.referral_count);
        return;
      }

      // Create one
      const code = "CAMEL" + Math.random().toString(36).substring(2, 8).toUpperCase();
      const { data: newData, error } = await supabase
        .from("referral_codes")
        .insert({ user_id: userId, code })
        .select("code, referral_count")
        .single();

      if (!error && newData) {
        setReferralCode(newData.code);
        setReferralCount(newData.referral_count);
      }
    };

    loadOrCreate();
  }, [userId]);

  const handleCopy = async () => {
    if (!referralCode) return;
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success(t.referralCopied);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!referralCode || !navigator.share) {
      handleCopy();
      return;
    }
    try {
      await navigator.share({
        title: "CamelSim",
        text: `Use my referral code ${referralCode} to get 10% off your first eSIM!`,
        url: window.location.origin,
      });
    } catch {
      // User cancelled share
    }
  };

  if (!referralCode) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <Gift className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-xs uppercase tracking-wider font-medium text-muted-foreground">{t.yourReferralCode}</h2>
      </div>

      <div className="p-4 rounded-lg bg-card shadow-card space-y-3">
        <p className="text-xs text-muted-foreground">{t.referralDesc}</p>

        {/* Code display */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-11 flex items-center justify-center rounded-lg bg-secondary font-mono-data text-sm font-bold tracking-widest">
            {referralCode}
          </div>
          <button
            onClick={handleCopy}
            className="h-11 w-11 flex items-center justify-center rounded-lg bg-foreground text-primary-foreground btn-press transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleShare}
            className="h-11 w-11 flex items-center justify-center rounded-lg bg-secondary text-secondary-foreground btn-press transition-all"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium">{t.referralCount(referralCount)}</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">{t.referralReward}</span>
        </div>
      </div>
    </motion.div>
  );
}
