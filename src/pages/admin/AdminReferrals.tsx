import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ReferralCode {
  id: string;
  user_id: string;
  code: string;
  referral_count: number;
  reward_value: number;
  reward_type: string;
  friend_discount_value: number;
  friend_discount_type: string;
  created_at: string;
}

export default function AdminReferrals() {
  const [codes, setCodes] = useState<ReferralCode[]>([]);

  useEffect(() => {
    supabase
      .from("referral_codes")
      .select("*")
      .order("referral_count", { ascending: false })
      .then(({ data }) => setCodes((data || []) as ReferralCode[]));
  }, []);

  const totalReferrals = codes.reduce((sum, c) => sum + c.referral_count, 0);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold tracking-display">Referral Codes</h1>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Total Codes</p>
          <p className="text-xl font-bold font-mono-data">{codes.length}</p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Total Referrals</p>
          <p className="text-xl font-bold font-mono-data">{totalReferrals}</p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Active Sharers</p>
          <p className="text-xl font-bold font-mono-data">{codes.filter((c) => c.referral_count > 0).length}</p>
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-secondary">
              <tr className="text-muted-foreground">
                <th className="text-start px-3 py-2 font-medium">Code</th>
                <th className="text-start px-3 py-2 font-medium">User ID</th>
                <th className="text-start px-3 py-2 font-medium">Referrals</th>
                <th className="text-start px-3 py-2 font-medium">Reward</th>
                <th className="text-start px-3 py-2 font-medium">Friend Discount</th>
                <th className="text-start px-3 py-2 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {codes.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No referral codes yet</td></tr>
              ) : (
                codes.map((c) => (
                  <tr key={c.id} className="border-t border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="px-3 py-2 font-mono-data font-bold">{c.code}</td>
                    <td className="px-3 py-2 font-mono-data text-muted-foreground">{c.user_id.slice(0, 8)}…</td>
                    <td className="px-3 py-2 font-mono-data">{c.referral_count}</td>
                    <td className="px-3 py-2 font-mono-data">
                      {c.reward_type === "percentage" ? `${c.reward_value}%` : `$${c.reward_value}`}
                    </td>
                    <td className="px-3 py-2 font-mono-data">
                      {c.friend_discount_type === "percentage" ? `${c.friend_discount_value}%` : `$${c.friend_discount_value}`}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
