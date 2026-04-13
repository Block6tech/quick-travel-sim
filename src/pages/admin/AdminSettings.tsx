import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Settings, Save, Gift, Trophy } from "lucide-react";

interface ReferralSettings {
  id: string;
  default_reward_type: string;
  default_reward_value: number;
  default_friend_discount_type: string;
  default_friend_discount_value: number;
}

interface CamelTier {
  id: string;
  level: number;
  name: string;
  emoji: string;
  min_orders: number;
  discount: number;
  perks: string[];
  perks_ar: string[];
}

export default function AdminSettings() {
  const [referral, setReferral] = useState<ReferralSettings | null>(null);
  const [tiers, setTiers] = useState<CamelTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingReferral, setSavingReferral] = useState(false);
  const [savingTiers, setSavingTiers] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from("referral_settings").select("*").limit(1).single(),
      supabase.from("camel_tiers").select("*").order("level", { ascending: true }),
    ]).then(([refRes, tierRes]) => {
      if (refRes.data) setReferral(refRes.data as ReferralSettings);
      if (tierRes.data) setTiers(tierRes.data as CamelTier[]);
      setLoading(false);
    });
  }, []);

  const saveReferral = async () => {
    if (!referral) return;
    setSavingReferral(true);
    const { error } = await supabase
      .from("referral_settings")
      .update({
        default_reward_type: referral.default_reward_type,
        default_reward_value: referral.default_reward_value,
        default_friend_discount_type: referral.default_friend_discount_type,
        default_friend_discount_value: referral.default_friend_discount_value,
      })
      .eq("id", referral.id);
    if (error) toast.error(error.message);
    else toast.success("Referral settings saved");
    setSavingReferral(false);
  };

  const saveTiers = async () => {
    setSavingTiers(true);
    for (const tier of tiers) {
      const { error } = await supabase
        .from("camel_tiers")
        .update({
          name: tier.name,
          emoji: tier.emoji,
          min_orders: tier.min_orders,
          discount: tier.discount,
          perks: tier.perks,
          perks_ar: tier.perks_ar,
        })
        .eq("id", tier.id);
      if (error) {
        toast.error(`Error saving tier ${tier.name}: ${error.message}`);
        setSavingTiers(false);
        return;
      }
    }
    toast.success("Camel Tiers saved");
    setSavingTiers(false);
  };

  const updateTier = (index: number, field: keyof CamelTier, value: any) => {
    setTiers((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5" />
        <h1 className="text-xl font-bold">Program Settings</h1>
      </div>

      {/* Referral Program Settings */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-bold">Referral Program Defaults</h2>
          </div>
          <button
            onClick={saveReferral}
            disabled={savingReferral}
            className="flex items-center gap-2 px-3 py-1.5 bg-foreground text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 disabled:opacity-50"
          >
            {savingReferral ? <div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Save className="w-3 h-3" />}
            Save
          </button>
        </div>
        <p className="text-xs text-muted-foreground">These defaults apply to new referral codes created for users.</p>

        {referral && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-card border border-border space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Referrer Reward</p>
              <div className="flex gap-2">
                <select
                  value={referral.default_reward_type}
                  onChange={(e) => setReferral({ ...referral, default_reward_type: e.target.value })}
                  className="h-9 px-2 rounded-md bg-secondary text-foreground text-xs"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed ($)</option>
                </select>
                <input
                  type="number"
                  value={referral.default_reward_value}
                  onChange={(e) => setReferral({ ...referral, default_reward_value: Number(e.target.value) })}
                  className="h-9 w-20 px-2 rounded-md bg-secondary text-foreground text-xs font-mono-data"
                />
              </div>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Friend Discount</p>
              <div className="flex gap-2">
                <select
                  value={referral.default_friend_discount_type}
                  onChange={(e) => setReferral({ ...referral, default_friend_discount_type: e.target.value })}
                  className="h-9 px-2 rounded-md bg-secondary text-foreground text-xs"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed ($)</option>
                </select>
                <input
                  type="number"
                  value={referral.default_friend_discount_value}
                  onChange={(e) => setReferral({ ...referral, default_friend_discount_value: Number(e.target.value) })}
                  className="h-9 w-20 px-2 rounded-md bg-secondary text-foreground text-xs font-mono-data"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Camel Tiers */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-bold">Camel Tiers</h2>
          </div>
          <button
            onClick={saveTiers}
            disabled={savingTiers}
            className="flex items-center gap-2 px-3 py-1.5 bg-foreground text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 disabled:opacity-50"
          >
            {savingTiers ? <div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Save className="w-3 h-3" />}
            Save
          </button>
        </div>
        <p className="text-xs text-muted-foreground">Configure tier thresholds, discounts, and perks that users see based on their purchase history.</p>

        <div className="space-y-4">
          {tiers.map((tier, idx) => (
            <div key={tier.id} className="p-4 rounded-lg bg-card border border-border space-y-3">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl">{tier.emoji}</span>
                <p className="text-xs font-bold">{tier.name}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Name</label>
                    <input
                      value={tier.name}
                      onChange={(e) => updateTier(idx, "name", e.target.value)}
                      className="w-full h-8 px-2 rounded-md bg-secondary text-foreground text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Min Orders</label>
                    <input
                      type="number"
                      value={tier.min_orders}
                      onChange={(e) => updateTier(idx, "min_orders", Number(e.target.value))}
                      className="w-full h-8 px-2 rounded-md bg-secondary text-foreground text-xs font-mono-data mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Discount %</label>
                    <input
                      type="number"
                      value={tier.discount}
                      onChange={(e) => updateTier(idx, "discount", Number(e.target.value))}
                      className="w-full h-8 px-2 rounded-md bg-secondary text-foreground text-xs font-mono-data mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Emoji</label>
                    <input
                      value={tier.emoji}
                      onChange={(e) => updateTier(idx, "emoji", e.target.value)}
                      className="w-full h-8 px-2 rounded-md bg-secondary text-foreground text-xs mt-1"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Perks (English, one per line)</label>
                  <textarea
                    value={tier.perks.join("\n")}
                    onChange={(e) => updateTier(idx, "perks", e.target.value.split("\n"))}
                    rows={3}
                    className="w-full p-2 rounded-md bg-secondary text-foreground text-xs mt-1 resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Perks (Arabic, one per line)</label>
                  <textarea
                    value={tier.perks_ar.join("\n")}
                    onChange={(e) => updateTier(idx, "perks_ar", e.target.value.split("\n"))}
                    rows={3}
                    dir="rtl"
                    className="w-full p-2 rounded-md bg-secondary text-foreground text-xs mt-1 resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
