import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import travelerImg from "@/assets/traveler-connected.png";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
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
    id: "mock-1", country: "United Kingdom", country_code: "GB", plan_data: "10GB", plan_validity: "30 days",
    plan_speed: "5G", plan_price: 19, status: "active", data_used: 3.2, data_total: 10,
    expires_at: new Date(Date.now() + 18 * 864e5).toISOString(), created_at: "2026-03-01",
  },
  {
    id: "mock-2", country: "Turkey", country_code: "TR", plan_data: "5GB", plan_validity: "30 days",
    plan_speed: "4G/LTE", plan_price: 13, status: "active", data_used: 1.1, data_total: 5,
    expires_at: new Date(Date.now() + 25 * 864e5).toISOString(), created_at: "2026-02-20",
  },
  {
    id: "mock-3", country: "United Arab Emirates", country_code: "AE", plan_data: "3GB", plan_validity: "15 days",
    plan_speed: "5G", plan_price: 9, status: "expired", data_used: 3, data_total: 3,
    expires_at: new Date(Date.now() - 5 * 864e5).toISOString(), created_at: "2025-12-20",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { t, locale } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      // Show mock data for demo
      setOrders(MOCK_ORDERS);
      setLoading(false);
      return;
    }
    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      // Fall back to mock if no real orders yet
      setOrders((data && data.length > 0 ? data : MOCK_ORDERS) as Order[]);
      setLoading(false);
    };
    fetchOrders();
  }, [user, authLoading]);

  const activeOrders = orders.filter((o) => o.status === "active");

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4 space-y-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }} className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-display">{t.myEsims}</h1>
          <button onClick={() => navigate("/add-esim")} className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center btn-press">
            <Plus className="w-4 h-4 text-primary-foreground" />
          </button>
        </motion.div>

        {loading || authLoading ? (
          <div className="text-center py-16">
            <div className="w-6 h-6 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin mx-auto" />
          </div>
        ) : activeOrders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05, ease: [0.2, 0.8, 0.2, 1] }} className="text-center py-16 space-y-4">
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
            <div className="space-y-3">
              {activeOrders.map((order, i) => {
                const dataTotal = order.data_total || 0;
                const dataUsed = order.data_used || 0;
                const percentage = dataTotal > 0 ? (dataUsed / dataTotal) * 100 : 0;
                const remaining = dataTotal - dataUsed;
                const daysLeft = order.expires_at
                  ? Math.max(0, Math.ceil((new Date(order.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                  : 0;

                return (
                  <motion.div key={order.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 + i * 0.04, ease: [0.2, 0.8, 0.2, 1] }} className="bg-card rounded-lg shadow-card p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-foreground flex items-center justify-center">
                          <span className="text-primary-foreground text-xs font-bold font-mono-data">{order.country_code}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{getCountryName(order.country_code, order.country, locale)}</p>
                          <p className="text-xs text-muted-foreground font-mono-data">{order.plan_data} · {order.plan_validity}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm tracking-wider bg-foreground text-primary-foreground">
                        {t.active}
                      </span>
                    </div>

                    {dataTotal > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-end justify-between">
                          <div>
                            <span className="text-2xl font-bold font-mono-data tracking-display">{remaining.toFixed(1)}</span>
                            <span className="text-sm text-muted-foreground ms-1">{t.gbLeft}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{t.daysRemaining(daysLeft)}</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }} className="h-full bg-foreground rounded-full" />
                        </div>
                        <p className="text-[10px] text-muted-foreground font-mono-data">{t.gbUsed(dataUsed.toFixed(1), dataTotal)}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button onClick={() => navigate("/")} className="flex-1 h-10 bg-foreground text-primary-foreground font-medium rounded-lg btn-press text-sm touch-target">
                        {t.topUp}
                      </button>
                      <button className="h-10 px-4 bg-secondary text-secondary-foreground font-medium rounded-lg btn-press text-sm touch-target">
                        {t.detailsBtn}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }} className="flex justify-center pt-2 pb-4">
              <img src={travelerImg} alt="Traveler connected with eSIM" className="w-36 h-36 object-contain opacity-60" />
            </motion.div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
