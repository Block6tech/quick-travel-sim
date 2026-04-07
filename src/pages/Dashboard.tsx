import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import travelerImg from "@/assets/traveler-connected.png";
import { useNavigate } from "react-router-dom";
import { Plus, Clock, Zap, ChevronRight, Infinity } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useLanguage, getCountryName } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Order {
  id: string;
  country: string;
  country_code: string;
  plan_data: string;
  plan_validity: string;
  plan_speed: string;
  plan_price: number;
  status: string;
  data_used: number;
  data_total: number;
  expires_at: string | null;
  created_at: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: "mock-1", country: "United Kingdom", country_code: "GB",
    plan_data: "Unlimited", plan_validity: "30 days", plan_speed: "5G",
    plan_price: 48, status: "active", data_used: 0, data_total: 0,
    expires_at: new Date(Date.now() + 18 * 864e5).toISOString(), created_at: "2026-03-01",
  },
  {
    id: "mock-2", country: "Turkey", country_code: "TR",
    plan_data: "Unlimited", plan_validity: "7 days", plan_speed: "4G/LTE",
    plan_price: 22.5, status: "active", data_used: 0, data_total: 0,
    expires_at: new Date(Date.now() + 3 * 864e5).toISOString(), created_at: "2026-03-20",
  },
  {
    id: "mock-3", country: "United Arab Emirates", country_code: "AE",
    plan_data: "Unlimited", plan_validity: "3 days", plan_speed: "5G",
    plan_price: 10.8, status: "expired", data_used: 0, data_total: 0,
    expires_at: new Date(Date.now() - 5 * 864e5).toISOString(), created_at: "2025-12-20",
  },
];

function countryFlag(code: string): string {
  if (code.length !== 2) return "";
  const offset = 0x1f1e6 - 65;
  return String.fromCodePoint(code.charCodeAt(0) + offset, code.charCodeAt(1) + offset);
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { t, locale } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setOrders(MOCK_ORDERS);
      setLoading(false);
      return;
    }
    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      const fetched = (data ?? []) as Order[];
      setOrders(fetched.length > 0 ? fetched : MOCK_ORDERS);
      setLoading(false);
    };
    fetchOrders();
  }, [user, authLoading]);

  const activeOrders = orders.filter((o) => o.status === "active");
  const expiredOrders = orders.filter((o) => o.status === "expired");

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4 space-y-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-display">{t.myEsims}</h1>
          <button onClick={() => navigate("/add-esim")} className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center btn-press">
            <Plus className="w-4 h-4 text-primary-foreground" />
          </button>
        </motion.div>

        {loading || authLoading ? (
          <div className="text-center py-16">
            <div className="w-6 h-6 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin mx-auto" />
          </div>
        ) : activeOrders.length === 0 && expiredOrders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }} className="text-center py-16 space-y-4">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto">
              <span className="text-2xl">📡</span>
            </div>
            <div>
              <p className="text-sm font-medium">{t.noEsimsYet}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.buyFirstEsim}</p>
            </div>
            <button onClick={() => navigate("/")} className="h-10 px-6 bg-foreground text-primary-foreground font-medium rounded-lg btn-press text-sm touch-target">
              {t.browsePlans}
            </button>
          </motion.div>
        ) : (
          <>
            {/* Active Plans */}
            {activeOrders.length > 0 && (
              <div className="space-y-3">
                {activeOrders.map((order, i) => (
                  <EsimCard key={order.id} order={order} index={i} locale={locale} t={t} onExtend={() => navigate(`/plans/${order.country_code}`)} onDetails={() => setSelectedOrder(order)} />
                ))}
              </div>
            )}

            {/* Expired Plans */}
            {expiredOrders.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Expired</h2>
                <div className="space-y-2">
                  {expiredOrders.map((order, i) => (
                    <ExpiredCard key={order.id} order={order} index={i} locale={locale} onRebuy={() => navigate(`/plans/${order.country_code}`)} />
                  ))}
                </div>
              </div>
            )}

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 }} className="flex justify-center pt-2 pb-4">
              <img src={travelerImg} alt="Traveler connected" className="w-36 h-36 object-contain opacity-60" />
            </motion.div>
          </>
        )}

        {/* Details Bottom Sheet */}
        {selectedOrder && (
          <DetailsSheet order={selectedOrder} locale={locale} t={t} onClose={() => setSelectedOrder(null)} onExtend={() => { setSelectedOrder(null); navigate(`/plans/${selectedOrder.country_code}`); }} />
        )}
      </div>
    </AppLayout>
  );
};

function EsimCard({ order, index, locale, t, onExtend, onDetails }: {
  order: Order; index: number; locale: string; t: any;
  onExtend: () => void; onDetails: () => void;
}) {
  const flag = countryFlag(order.country_code);
  const name = getCountryName(order.country_code, order.country, locale);
  const daysLeft = order.expires_at
    ? Math.max(0, Math.ceil((new Date(order.expires_at).getTime() - Date.now()) / 864e5))
    : 0;
  const totalDays = parseInt(order.plan_validity) || 30;
  const daysUsed = totalDays - daysLeft;
  const progress = Math.min(100, (daysUsed / totalDays) * 100);
  const isLow = daysLeft <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 + index * 0.04 }}
      className="bg-card rounded-xl shadow-card overflow-hidden"
    >
      <div className="p-4 space-y-3">
        {/* Header: Flag + Country + Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-2xl leading-none">{flag}</span>
            </div>
            <div>
              <p className="text-sm font-semibold">{name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Infinity className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Unlimited</span>
                <span className="text-xs text-muted-foreground">·</span>
                <Zap className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{order.plan_speed}</span>
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full tracking-wider bg-foreground text-primary-foreground">
            {t.active}
          </span>
        </div>

        {/* Days remaining — prominent */}
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-bold font-mono-data tracking-tight ${isLow ? "text-destructive" : "text-foreground"}`}>
                {daysLeft}
              </span>
              <span className="text-sm text-muted-foreground">days left</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span className="text-[10px] font-mono-data">{order.plan_validity}</span>
            </div>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`h-full rounded-full ${isLow ? "bg-destructive" : "bg-foreground"}`}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={onExtend} className="flex-1 h-10 bg-foreground text-primary-foreground font-medium rounded-lg btn-press text-sm touch-target">
            Extend Plan
          </button>
          <button onClick={onDetails} className="h-10 px-4 bg-secondary text-secondary-foreground font-medium rounded-lg btn-press text-sm touch-target flex items-center gap-1">
            Details <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ExpiredCard({ order, index, locale, onRebuy }: {
  order: Order; index: number; locale: string; onRebuy: () => void;
}) {
  const flag = countryFlag(order.country_code);
  const name = getCountryName(order.country_code, order.country, locale);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.04 }}
      className="bg-card rounded-xl shadow-card p-3 flex items-center gap-3 opacity-60"
    >
      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
        <span className="text-lg leading-none">{flag}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        <p className="text-[10px] text-muted-foreground">Unlimited · {order.plan_validity} · Expired</p>
      </div>
      <button onClick={onRebuy} className="px-3 py-1.5 text-xs font-medium bg-secondary rounded-lg hover:bg-accent transition-colors">
        Rebuy
      </button>
    </motion.div>
  );
}

function DetailsSheet({ order, locale, t, onClose, onExtend }: {
  order: Order; locale: string; t: any; onClose: () => void; onExtend: () => void;
}) {
  const flag = countryFlag(order.country_code);
  const name = getCountryName(order.country_code, order.country, locale);
  const daysLeft = order.expires_at
    ? Math.max(0, Math.ceil((new Date(order.expires_at).getTime() - Date.now()) / 864e5))
    : 0;
  const expiresDate = order.expires_at ? new Date(order.expires_at).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" }) : "—";
  const activatedDate = new Date(order.created_at).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/40" />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-card rounded-t-2xl p-5 pb-8 space-y-4"
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-muted-foreground/20 rounded-full mx-auto" />

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-2xl leading-none">{flag}</span>
          </div>
          <div>
            <p className="text-base font-bold">{name}</p>
            <p className="text-xs text-muted-foreground">Unlimited · {order.plan_speed}</p>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3">
          <InfoItem label="Status" value={order.status === "active" ? "Active" : "Expired"} />
          <InfoItem label="Days Left" value={`${daysLeft} days`} />
          <InfoItem label="Plan Duration" value={order.plan_validity} />
          <InfoItem label="Speed" value={order.plan_speed} />
          <InfoItem label="Activated" value={activatedDate} />
          <InfoItem label="Expires" value={expiresDate} />
        </div>

        {/* Extend button */}
        <button onClick={onExtend} className="w-full h-11 bg-foreground text-primary-foreground font-medium rounded-lg btn-press text-sm touch-target">
          Extend Plan
        </button>
      </motion.div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-secondary rounded-lg px-3 py-2">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium mt-0.5">{value}</p>
    </div>
  );
}

export default Dashboard;
