import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";

interface Order {
  id: string;
  user_id: string;
  country: string;
  country_code: string;
  plan_data: string;
  plan_validity: string;
  plan_speed: string;
  plan_price: number;
  discount_code: string | null;
  discount_amount: number | null;
  status: string;
  data_used: number;
  data_total: number;
  expires_at: string | null;
  created_at: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data || []) as Order[]));
  }, []);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.country.toLowerCase().includes(search.toLowerCase()) ||
      o.id.includes(search) ||
      o.user_id.includes(search);
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold tracking-display">Orders</h1>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by country, order ID, or user ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 ps-9 pe-3 rounded-md border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 px-3 rounded-md border border-input bg-background text-xs"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-secondary">
              <tr className="text-muted-foreground">
                <th className="text-start px-3 py-2 font-medium">Order ID</th>
                <th className="text-start px-3 py-2 font-medium">Country</th>
                <th className="text-start px-3 py-2 font-medium">Plan</th>
                <th className="text-start px-3 py-2 font-medium">Price</th>
                <th className="text-start px-3 py-2 font-medium">Discount</th>
                <th className="text-start px-3 py-2 font-medium">Data</th>
                <th className="text-start px-3 py-2 font-medium">Status</th>
                <th className="text-start px-3 py-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-muted-foreground">No orders found</td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="border-t border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="px-3 py-2 font-mono-data text-muted-foreground">{o.id.slice(0, 8)}…</td>
                    <td className="px-3 py-2 font-medium">{o.country}</td>
                    <td className="px-3 py-2 font-mono-data">{o.plan_data} · {o.plan_speed}</td>
                    <td className="px-3 py-2 font-mono-data">${o.plan_price}</td>
                    <td className="px-3 py-2 font-mono-data">
                      {o.discount_code ? (
                        <span>{o.discount_code} (-${o.discount_amount})</span>
                      ) : "—"}
                    </td>
                    <td className="px-3 py-2 font-mono-data">{o.data_used}/{o.data_total}GB</td>
                    <td className="px-3 py-2">
                      <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-sm ${o.status === "active" ? "bg-foreground text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground">{filtered.length} order{filtered.length !== 1 ? "s" : ""}</p>
    </div>
  );
}
