import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Snowflake, Play, XCircle, Clock, ChevronDown, ChevronUp, History, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { mockOrders } from "@/data/admin-mock-data";
import { exportToCSV, exportToPDF } from "@/utils/export";
import { toast } from "sonner";
import { mockOrders } from "@/data/admin-mock-data";

interface Order {
  id: string;
  user_id: string;
  country: string;
  country_code: string;
  plan_data: string;
  plan_validity: string;
  plan_speed: string;
  plan_price: number;
  phone_number: string | null;
  status: string;
  data_used: number;
  data_total: number;
  expires_at: string | null;
  created_at: string;
}

interface ActionLog {
  id: string;
  order_id: string;
  action: string;
  performed_by: string;
  notes: string | null;
  previous_status: string | null;
  new_status: string | null;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-foreground text-primary-foreground",
  frozen: "bg-blue-600 text-white",
  suspended: "bg-amber-600 text-white",
  expired: "bg-secondary text-secondary-foreground",
};

const ACTIONS = [
  { action: "freeze", label: "Freeze", icon: Snowflake, toStatus: "frozen", fromStatuses: ["active"], color: "text-blue-600 hover:bg-blue-50" },
  { action: "unfreeze", label: "Unfreeze", icon: Play, toStatus: "active", fromStatuses: ["frozen", "suspended"], color: "text-emerald-600 hover:bg-emerald-50" },
  { action: "suspend", label: "Suspend", icon: XCircle, toStatus: "suspended", fromStatuses: ["active", "frozen"], color: "text-amber-600 hover:bg-amber-50" },
  { action: "expire", label: "Expire", icon: XCircle, toStatus: "expired", fromStatuses: ["active", "frozen", "suspended"], color: "text-destructive hover:bg-destructive/10" },
  { action: "extend", label: "Extend", icon: Clock, toStatus: "active", fromStatuses: ["expired"], color: "text-emerald-600 hover:bg-emerald-50" },
];

export default function AdminEsimManagement() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [actionLogs, setActionLogs] = useState<Record<string, ActionLog[]>>({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [actionNotes, setActionNotes] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  const loadOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    const real = (data || []) as Order[];
    setOrders(real.length > 0 ? real : mockOrders as Order[]);
  };

  const loadActionLogs = async (orderId: string) => {
    const { data } = await supabase
      .from("esim_actions_log")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });
    setActionLogs((prev) => ({ ...prev, [orderId]: (data || []) as ActionLog[] }));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleAction = async (order: Order, action: string, toStatus: string) => {
    if (!user) return;
    setProcessing(`${order.id}-${action}`);

    try {
      // Update order status
      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: toStatus })
        .eq("id", order.id);

      if (updateError) throw updateError;

      // Log the action
      const { error: logError } = await supabase
        .from("esim_actions_log")
        .insert({
          order_id: order.id,
          action,
          performed_by: user.id,
          notes: actionNotes || null,
          previous_status: order.status,
          new_status: toStatus,
        });

      if (logError) throw logError;

      toast.success(`eSIM ${action}d successfully`);
      setActionNotes("");
      loadOrders();
      if (expandedOrder === order.id) loadActionLogs(order.id);
    } catch (err: any) {
      toast.error(err.message || "Action failed");
    } finally {
      setProcessing(null);
    }
  };

  const toggleExpand = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
      if (!actionLogs[orderId]) loadActionLogs(orderId);
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.country.toLowerCase().includes(search.toLowerCase()) ||
      o.id.includes(search) ||
      (o.phone_number || "").includes(search);
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold tracking-display">eSIM Management</h1>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {["active", "frozen", "suspended", "expired"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
            className={`p-3 rounded-lg border transition-colors text-left ${
              statusFilter === status ? "border-foreground bg-secondary" : "border-border bg-card hover:bg-secondary/50"
            }`}
          >
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{status}</p>
            <p className="text-xl font-bold font-mono-data">{statusCounts[status] || 0}</p>
          </button>
        ))}
        <button
          onClick={() => setStatusFilter("all")}
          className={`p-3 rounded-lg border transition-colors text-left ${
            statusFilter === "all" ? "border-foreground bg-secondary" : "border-border bg-card hover:bg-secondary/50"
          }`}
        >
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Total</p>
          <p className="text-xl font-bold font-mono-data">{orders.length}</p>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by country, order ID, or phone number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-9 ps-9 pe-3 rounded-md border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Orders list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">No eSIMs found</div>
        ) : (
          filtered.map((o) => {
            const isExpanded = expandedOrder === o.id;
            const availableActions = ACTIONS.filter((a) => a.fromStatuses.includes(o.status));
            const logs = actionLogs[o.id] || [];
            const isMock = !o.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) === false && orders === (mockOrders as any);

            return (
              <div key={o.id} className="rounded-lg border border-border bg-card overflow-hidden">
                {/* Order row */}
                <button
                  onClick={() => toggleExpand(o.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex-1 grid grid-cols-6 gap-3 items-center text-xs">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Country</p>
                      <p className="font-medium">{o.country}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Plan</p>
                      <p className="font-mono-data">{o.plan_data} · {o.plan_speed}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Data Usage</p>
                      <p className="font-mono-data">{o.data_used}/{o.data_total}GB</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Phone / ICCID</p>
                      <p className="font-mono-data">{o.phone_number || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Expires</p>
                      <p className="font-mono-data">{o.expires_at ? new Date(o.expires_at).toLocaleDateString() : "—"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-sm ${STATUS_COLORS[o.status] || STATUS_COLORS.expired}`}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-border px-4 py-4 space-y-4">
                    {/* Actions */}
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Actions</h3>
                      <div className="flex flex-wrap gap-2 items-end">
                        <input
                          type="text"
                          placeholder="Optional notes..."
                          value={actionNotes}
                          onChange={(e) => setActionNotes(e.target.value)}
                          className="h-8 px-3 rounded-md border border-input bg-background text-xs flex-1 min-w-[200px] focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                        {availableActions.map((a) => (
                          <button
                            key={a.action}
                            onClick={() => handleAction(o, a.action, a.toStatus)}
                            disabled={processing === `${o.id}-${a.action}`}
                            className={`h-8 px-3 flex items-center gap-1.5 rounded-md text-xs font-medium border border-border transition-colors ${a.color} disabled:opacity-50`}
                          >
                            <a.icon className="w-3.5 h-3.5" />
                            {processing === `${o.id}-${a.action}` ? "..." : a.label}
                          </button>
                        ))}
                        {availableActions.length === 0 && (
                          <span className="text-xs text-muted-foreground">No actions available for this status</span>
                        )}
                      </div>
                    </div>

                    {/* Order details */}
                    <div className="grid grid-cols-4 gap-3 text-xs">
                      <div>
                        <p className="text-[10px] text-muted-foreground">Order ID</p>
                        <p className="font-mono-data">{o.id.slice(0, 8)}…</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">User ID</p>
                        <p className="font-mono-data">{o.user_id.slice(0, 8)}…</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Price</p>
                        <p className="font-mono-data">${o.plan_price}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Created</p>
                        <p className="font-mono-data">{new Date(o.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Action history */}
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <History className="w-3 h-3" />
                        Action History
                      </h3>
                      {logs.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-2">No actions recorded yet</p>
                      ) : (
                        <div className="space-y-1">
                          {logs.map((log) => (
                            <div key={log.id} className="flex items-start gap-3 py-1.5 text-xs border-b border-border/30 last:border-0">
                              <span className="font-mono-data text-muted-foreground whitespace-nowrap">
                                {new Date(log.created_at).toLocaleString()}
                              </span>
                              <span className="font-medium capitalize">{log.action}</span>
                              <span className="text-muted-foreground">
                                {log.previous_status} → {log.new_status}
                              </span>
                              {log.notes && <span className="text-muted-foreground italic">"{log.notes}"</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <p className="text-[10px] text-muted-foreground">{filtered.length} eSIM{filtered.length !== 1 ? "s" : ""}</p>
    </div>
  );
}
