import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Wifi, ShoppingBag, CreditCard, HelpCircle, Settings,
  ChevronRight, LogOut, Bell, Globe, DollarSign,
  MessageCircle, BookOpen, Smartphone, Phone, Plus,
  Shield, ExternalLink, Moon, Sun,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  sampleActiveEsims, sampleOrders, getUserTier, type ActiveEsim,
} from "@/data/esim-data";

/** Convert ISO alpha-2 → flag emoji */
function flag(code: string) {
  if (code.length !== 2) return "";
  const o = 0x1f1e6 - 65;
  return String.fromCodePoint(code.charCodeAt(0) + o, code.charCodeAt(1) + o);
}

const anim = (d = 0) => ({
  initial: { opacity: 0, y: 8 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.3, delay: d, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] },
});

/* ─────────────────────── Page ─────────────────────── */
const Account = () => {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState(true);
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Mock user
  const user = { name: "Ali M.", email: "ali@example.com", verified: true, phone: "" };
  const tier = getUserTier(sampleOrders.length);
  const esims = sampleActiveEsims;
  const orders = sampleOrders;

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-8 space-y-6">
        {/* ── Identity ── */}
        <motion.div {...anim(0)} className="flex items-center gap-4">
          {/* Camel avatar */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-3xl">
              {tier.emoji}
            </div>
            {user.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-foreground flex items-center justify-center">
                <Shield className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-display truncate">{user.name}</h1>
              {user.verified && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-foreground text-primary-foreground rounded-sm">
                  Verified
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm bg-secondary text-secondary-foreground">
              {tier.name} Tier
            </span>
          </div>
        </motion.div>

        {/* WhatsApp phone prompt */}
        {!user.phone && (
          <motion.button
            {...anim(0.04)}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary text-left btn-press touch-target"
          >
            <div className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium">Add phone number</p>
              <p className="text-[10px] text-muted-foreground">Receive eSIM notifications via WhatsApp</p>
            </div>
            <Plus className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </motion.button>
        )}

        {/* ── Section 1: My eSIMs ── */}
        <Section title="My eSIMs" icon={<Wifi className="w-4 h-4" />} delay={0.08}>
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="active" className="flex-1 text-xs">Active</TabsTrigger>
              <TabsTrigger value="expired" className="flex-1 text-xs">Expired</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <EsimList esims={esims.filter(e => e.status === "active")} navigate={navigate} />
            </TabsContent>
            <TabsContent value="expired">
              <EsimList esims={esims.filter(e => e.status === "expired")} navigate={navigate} />
            </TabsContent>
          </Tabs>
        </Section>

        {/* ── Section 2: Orders ── */}
        <Section title="Purchase History" icon={<ShoppingBag className="w-4 h-4" />} delay={0.12}>
          <div className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center gap-3 p-3 rounded-lg bg-card shadow-card">
                <span className="text-lg leading-none">{flag(o.countryCode)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{o.country} — {o.planSize}</p>
                  <p className="text-[10px] text-muted-foreground font-mono-data">{o.orderNumber} · {o.date}</p>
                </div>
                <span className="text-xs font-bold font-mono-data">${o.price}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Section 3: Payments ── */}
        <Section title="Payments" icon={<CreditCard className="w-4 h-4" />} delay={0.16}>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card shadow-card">
              <div className="w-9 h-9 rounded-md bg-foreground flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">•••• 4242</p>
                <p className="text-[10px] text-muted-foreground">Expires 12/27</p>
              </div>
              <button className="text-[10px] text-destructive font-medium btn-press">Remove</button>
            </div>
            <button className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-dashed border-border text-xs font-medium text-muted-foreground hover:text-foreground btn-press touch-target">
              <Plus className="w-3.5 h-3.5" /> Add payment method
            </button>
          </div>
        </Section>

        {/* ── Section 4: Support ── */}
        <Section title="Support" icon={<HelpCircle className="w-4 h-4" />} delay={0.2}>
          <div className="space-y-1">
            <SupportRow icon={<HelpCircle className="w-4 h-4" />} label="Help Center" />
            <SupportRow icon={<MessageCircle className="w-4 h-4" />} label="Contact Support (WhatsApp)" />
            <SupportRow icon={<BookOpen className="w-4 h-4" />} label="Installation Guide" onClick={() => navigate("/installation")} />
            <SupportRow icon={<Smartphone className="w-4 h-4" />} label="Device Compatibility" />
          </div>
        </Section>

        {/* ── Section 5: Settings ── */}
        <Section title="Settings" icon={<Settings className="w-4 h-4" />} delay={0.24}>
          <div className="space-y-1">
            <SettingRow icon={<Globe className="w-4 h-4" />} label="Language" value="English" />
            <SettingRow icon={<DollarSign className="w-4 h-4" />} label="Currency" value="USD" />
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium">Notifications</span>
              </div>
              <Switch checked={notifs} onCheckedChange={setNotifs} />
            </div>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors btn-press touch-target">
              <LogOut className="w-4 h-4" />
              <span className="text-xs font-medium">Log out</span>
            </button>
          </div>
        </Section>
      </div>
    </AppLayout>
  );
};

/* ─── Helpers ─── */

function Section({ title, icon, delay, children }: { title: string; icon: React.ReactNode; delay: number; children: React.ReactNode }) {
  return (
    <motion.div {...anim(delay)} className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <h2 className="text-xs uppercase tracking-wider font-medium text-muted-foreground">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

function EsimList({ esims, navigate }: { esims: ActiveEsim[]; navigate: (p: string) => void }) {
  if (esims.length === 0) {
    return (
      <div className="text-center py-8 space-y-2">
        <p className="text-xs text-muted-foreground">No eSIMs here.</p>
        <button onClick={() => navigate("/")} className="text-xs font-medium underline underline-offset-2 btn-press">Browse plans</button>
      </div>
    );
  }
  return (
    <div className="space-y-2 mt-2">
      {esims.map((esim) => {
        const pct = (esim.dataUsed / esim.dataTotal) * 100;
        const remaining = esim.dataTotal - esim.dataUsed;
        const daysLeft = Math.max(0, Math.ceil((new Date(esim.expiresAt).getTime() - Date.now()) / 864e5));
        return (
          <div key={esim.id} className="p-3 rounded-lg bg-card shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg leading-none">{flag(esim.countryCode)}</span>
                <div>
                  <p className="text-xs font-medium">{esim.country}</p>
                  <p className="text-[10px] text-muted-foreground font-mono-data">{esim.plan}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-sm ${
                esim.status === "active" ? "bg-foreground text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}>{esim.status}</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono-data">
                <span>{remaining.toFixed(1)} GB left</span>
                <span>{daysLeft}d remaining</span>
              </div>
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <div className="flex gap-2">
              {esim.status === "active" && (
                <button onClick={() => navigate("/")} className="flex-1 h-8 bg-foreground text-primary-foreground font-medium rounded-md btn-press text-[11px] touch-target">
                  Top Up
                </button>
              )}
              <button className="h-8 px-3 bg-secondary text-secondary-foreground font-medium rounded-md btn-press text-[11px] touch-target">
                Details
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SupportRow({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors btn-press touch-target">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}

function SettingRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors btn-press touch-target">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-muted-foreground">{value}</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </button>
  );
}

export default Account;
