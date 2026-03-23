import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";

interface UserRow {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
}

interface OrderSummary {
  user_id: string;
  count: number;
  total: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [orderSummaries, setOrderSummaries] = useState<Record<string, OrderSummary>>({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase.rpc("admin_get_users").then(({ data }) => {
      setUsers((data || []) as UserRow[]);
    });

    supabase
      .from("orders")
      .select("user_id, plan_price")
      .then(({ data }) => {
        const summaries: Record<string, OrderSummary> = {};
        (data || []).forEach((o: any) => {
          if (!summaries[o.user_id]) summaries[o.user_id] = { user_id: o.user_id, count: 0, total: 0 };
          summaries[o.user_id].count++;
          summaries[o.user_id].total += Number(o.plan_price);
        });
        setOrderSummaries(summaries);
      });
  }, []);

  const filtered = users.filter(
    (u) => u.email?.toLowerCase().includes(search.toLowerCase()) || u.id.includes(search)
  );

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold tracking-display">Users</h1>

      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by email or user ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-9 ps-9 pe-3 rounded-md border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-secondary">
              <tr className="text-muted-foreground">
                <th className="text-start px-3 py-2 font-medium">Email</th>
                <th className="text-start px-3 py-2 font-medium">User ID</th>
                <th className="text-start px-3 py-2 font-medium">Orders</th>
                <th className="text-start px-3 py-2 font-medium">Total Spent</th>
                <th className="text-start px-3 py-2 font-medium">Joined</th>
                <th className="text-start px-3 py-2 font-medium">Last Sign In</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">No users found</td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const summary = orderSummaries[u.id];
                  return (
                    <tr key={u.id} className="border-t border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="px-3 py-2 font-medium">{u.email}</td>
                      <td className="px-3 py-2 font-mono-data text-muted-foreground">{u.id.slice(0, 8)}…</td>
                      <td className="px-3 py-2 font-mono-data">{summary?.count || 0}</td>
                      <td className="px-3 py-2 font-mono-data">${(summary?.total || 0).toFixed(2)}</td>
                      <td className="px-3 py-2 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground">{filtered.length} user{filtered.length !== 1 ? "s" : ""}</p>
    </div>
  );
}
