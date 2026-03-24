import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DollarSign, ShoppingBag, Users, Wifi, Gift } from "lucide-react";
import { mockStats, mockOrders } from "@/data/admin-mock-data";

interface Stats {
  total_orders: number;
  total_revenue: number;
  total_users: number;
  active_orders: number;
  total_referrals: number;
}

interface Order {
  country: string;
  country_code: string;
  plan_price: number;
  discount_amount: number | null;
  created_at: string;
  status: string;
}

const COLORS = ["hsl(0,0%,0%)", "hsl(0,0%,25%)", "hsl(0,0%,45%)", "hsl(0,0%,65%)", "hsl(0,0%,80%)"];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    supabase.rpc("admin_get_stats").then(({ data }) => {
      if (data && data.length > 0) {
        const d = data[0] as unknown as Stats;
        // Use mock if DB is empty
        if (d.total_orders === 0 && d.total_users <= 1) {
          setStats(mockStats);
          setOrders(mockOrders as Order[]);
        } else {
          setStats(d);
        }
      } else {
        setStats(mockStats);
        setOrders(mockOrders as Order[]);
      }
    });

    supabase
      .from("orders")
      .select("country, country_code, plan_price, discount_amount, created_at, status")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setOrders(data as Order[]);
        }
        // If empty, mockOrders were already set above
      });
  }, []);

  // Revenue by country
  const countryRevenue = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.country] = (acc[o.country] || 0) + (o.plan_price - (o.discount_amount || 0));
    return acc;
  }, {});
  const countryData = Object.entries(countryRevenue)
    .map(([name, revenue]) => ({ name, revenue: +revenue.toFixed(2) }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  // Orders by status
  const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  const statCards = stats
    ? [
        { label: "Total Revenue", value: `$${Number(stats.total_revenue).toFixed(2)}`, icon: DollarSign },
        { label: "Total Orders", value: stats.total_orders, icon: ShoppingBag },
        { label: "Active eSIMs", value: stats.active_orders, icon: Wifi },
        { label: "Total Users", value: stats.total_users, icon: Users },
        { label: "Referrals", value: stats.total_referrals, icon: Gift },
      ]
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-bold tracking-display">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {statCards.map((s) => (
          <div key={s.label} className="p-4 rounded-lg bg-card border border-border space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <s.icon className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium uppercase tracking-wider">{s.label}</span>
            </div>
            <p className="text-xl font-bold font-mono-data">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-card border border-border space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Revenue by Country</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="revenue" fill="hsl(0,0%,15%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-card border border-border space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Orders by Status</h2>
          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="p-4 rounded-lg bg-card border border-border space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-start py-2 font-medium">Country</th>
                <th className="text-start py-2 font-medium">Price</th>
                <th className="text-start py-2 font-medium">Discount</th>
                <th className="text-start py-2 font-medium">Status</th>
                <th className="text-start py-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((o, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-2 font-medium">{o.country}</td>
                  <td className="py-2 font-mono-data">${o.plan_price}</td>
                  <td className="py-2 font-mono-data">{o.discount_amount ? `-$${o.discount_amount}` : "—"}</td>
                  <td className="py-2">
                    <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-sm ${o.status === "active" ? "bg-foreground text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-2 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
