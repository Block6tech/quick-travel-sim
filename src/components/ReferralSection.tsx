import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift, Copy, Share2, Check, Users, TrendingUp } from "lucide-react";
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
  const [rewardValue, setRewardValue] = useState(10);
  const [rewardType, setRewardType] = useState("percentage");
  const [friendDiscountValue, setFriendDiscountValue] = useState(10);
  const [friendDiscountType, setFriendDiscountType] = useState("percentage");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadOrCreate = async () => {
      const { data } = await supabase
        .from("referral_codes")
        .select("code, referral_count, reward_value, reward_type, friend_discount_value, friend_discount_type")
        .eq("user_id", userId)
        .maybeSingle();

      if (data) {
        setReferralCode(data.code);
        setReferralCount(data.referral_count);
        setRewardValue(data.reward_value);
        setRewardType(data.reward_type);
        setFriendDiscountValue(data.friend_discount_value);
        setFriendDiscountType(data.friend_discount_type);
        return;
      }

      const code = "CAMEL" + Math.random().toString(36).substring(2, 8).toUpperCase();
      const { data: newData, error } = await supabase
        .from("referral_codes")
        .insert({ user_id: userId, code })
        .select("code, referral_count, reward_value, reward_type, friend_discount_value, friend_discount_type")
        .single();

      if (!error && newData) {
        setReferralCode(newData.code);
        setReferralCount(newData.referral_count);
        setRewardValue(newData.reward_value);
        setRewardType(newData.reward_type);
        setFriendDiscountValue(newData.friend_discount_value);
        setFriendDiscountType(newData.friend_discount_type);
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
        text: `Use my referral code ${referralCode} to get ${friendDiscountValue}${friendDiscountType === "percentage" ? "%" : "$"} off your first eSIM!`,
        url: window.location.origin,
      });
    } catch {
      // User cancelled share
    }
  };

  if (!referralCode) return null;

  const totalEarned = referralCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      className="space-y-3"
    >

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

        {/* Earnings card */}
        <div className="mt-1 p-3 rounded-lg bg-secondary/60 space-y-2">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[11px] font-semibold">{t.referralEarnings}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              {t.referralEarningsDesc(String(rewardValue), rewardType)}
            </span>
            <span className="text-xs font-bold font-mono-data">
              {t.referralTotalEarned(totalEarned)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
